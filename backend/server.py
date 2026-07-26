from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, UploadFile, File, Form, Depends
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import Response as StarletteResponse
from motor.motor_asyncio import AsyncIOMotorClient
import logging
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import uuid
import asyncio
import hmac
import hashlib
import bcrypt
import jwt
import requests
import razorpay
import resend

# ---------------------------------------------------------------------------
# Config & DB
# ---------------------------------------------------------------------------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'dev-secret')
JWT_ALGORITHM = "HS256"
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@example.com')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')

RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', '').strip()
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', '').strip()
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '').strip()
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
CONTACT_RECIPIENT = os.environ.get('CONTACT_RECIPIENT', ADMIN_EMAIL)

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
APP_NAME = "bhavatarini-ashrama"

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()
api_router = APIRouter(prefix="/api")

razor_client = None
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    razor_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

# ---------------------------------------------------------------------------
# Object Storage helpers
# ---------------------------------------------------------------------------
storage_key = None
MIME_TYPES = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png",
              "gif": "image/gif", "webp": "image/webp"}


def init_storage():
    global storage_key
    if storage_key:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_LLM_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(f"{STORAGE_URL}/objects/{path}",
                        headers={"X-Storage-Key": key, "Content-Type": content_type},
                        data=data, timeout=120)
    resp.raise_for_status()
    return resp.json()


def get_object(path: str):
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}",
                        headers={"X-Storage-Key": key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


# ---------------------------------------------------------------------------
# Auth helpers
# ---------------------------------------------------------------------------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email,
               "exp": datetime.now(timezone.utc) + timedelta(hours=12), "type": "access"}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user.pop("password_hash", None)
        user.pop("_id", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class EventIn(BaseModel):
    title: str
    description: str
    date: str            # ISO date string, e.g. 2025-02-15
    time: Optional[str] = ""
    location: Optional[str] = ""


class EventOut(EventIn):
    id: str
    created_at: str


class ContactIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    message: str


class DonationOrderIn(BaseModel):
    amount: int          # in INR (rupees)
    name: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""


class DonationVerifyIn(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


# ---------------------------------------------------------------------------
# Auth routes
# ---------------------------------------------------------------------------
@api_router.post("/auth/login")
async def login(body: LoginRequest, response: Response):
    email = body.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"])
    response.set_cookie(key="access_token", value=token, httponly=True,
                        secure=True, samesite="none", max_age=43200, path="/")
    return {"id": user["id"], "email": user["email"], "name": user.get("name", "Admin"),
            "role": user.get("role", "admin"), "token": token}


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"status": "logged_out"}


@api_router.get("/auth/me")
async def me(admin: dict = Depends(get_current_admin)):
    return admin


# ---------------------------------------------------------------------------
# Events
# ---------------------------------------------------------------------------
@api_router.get("/events", response_model=List[EventOut])
async def list_events():
    events = await db.events.find({}, {"_id": 0}).sort("date", 1).to_list(500)
    return events


@api_router.post("/events", response_model=EventOut)
async def create_event(body: EventIn, admin: dict = Depends(get_current_admin)):
    doc = body.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.events.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.put("/events/{event_id}", response_model=EventOut)
async def update_event(event_id: str, body: EventIn, admin: dict = Depends(get_current_admin)):
    existing = await db.events.find_one({"id": event_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Event not found")
    await db.events.update_one({"id": event_id}, {"$set": body.model_dump()})
    doc = await db.events.find_one({"id": event_id}, {"_id": 0})
    return doc


@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, admin: dict = Depends(get_current_admin)):
    res = await db.events.delete_one({"id": event_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"status": "deleted"}


# ---------------------------------------------------------------------------
# Gallery
# ---------------------------------------------------------------------------
@api_router.get("/gallery")
async def list_gallery():
    items = await db.gallery.find({"is_deleted": False}, {"_id": 0, "storage_path": 0}).sort("created_at", -1).to_list(1000)
    return items


@api_router.post("/gallery")
async def upload_gallery(file: UploadFile = File(...), caption: str = Form(""),
                         admin: dict = Depends(get_current_admin)):
    ext = (file.filename.split(".")[-1].lower() if "." in file.filename else "bin")
    content_type = MIME_TYPES.get(ext, file.content_type or "application/octet-stream")
    img_id = str(uuid.uuid4())
    path = f"{APP_NAME}/gallery/{img_id}.{ext}"
    data = await file.read()
    try:
        result = put_object(path, data, content_type)
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail="Image upload failed")
    doc = {"id": img_id, "storage_path": result["path"], "caption": caption,
           "content_type": content_type, "original_filename": file.filename,
           "is_deleted": False, "created_at": datetime.now(timezone.utc).isoformat()}
    await db.gallery.insert_one(doc)
    return {"id": img_id, "caption": caption, "created_at": doc["created_at"]}


@api_router.get("/gallery/{img_id}/image")
async def get_gallery_image(img_id: str):
    record = await db.gallery.find_one({"id": img_id, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="Image not found")
    try:
        data, ct = get_object(record["storage_path"])
    except Exception as e:
        logger.error(f"Fetch image failed: {e}")
        raise HTTPException(status_code=404, detail="Image not available")
    return StarletteResponse(content=data, media_type=record.get("content_type", ct))


@api_router.delete("/gallery/{img_id}")
async def delete_gallery(img_id: str, admin: dict = Depends(get_current_admin)):
    res = await db.gallery.update_one({"id": img_id}, {"$set": {"is_deleted": True}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"status": "deleted"}


# ---------------------------------------------------------------------------
# Contact
# ---------------------------------------------------------------------------
async def _send_contact_email(body: ContactIn):
    if not RESEND_API_KEY:
        return
    html = f"""
    <div style='font-family:Arial,sans-serif;color:#2C2621'>
      <h2 style='color:#591316'>New message — Sri Bhavatarini Ashrama</h2>
      <p><b>Name:</b> {body.name}</p>
      <p><b>Email:</b> {body.email}</p>
      <p><b>Phone:</b> {body.phone or '-'}</p>
      <p><b>Message:</b></p>
      <p style='background:#F3EFE7;padding:16px;border-left:3px solid #D95A21'>{body.message}</p>
    </div>"""
    params = {"from": SENDER_EMAIL, "to": [CONTACT_RECIPIENT],
              "subject": f"New enquiry from {body.name}", "html": html,
              "reply_to": body.email}
    try:
        await asyncio.to_thread(resend.Emails.send, params)
    except Exception as e:
        logger.error(f"Contact email failed: {e}")


@api_router.post("/contact")
async def submit_contact(body: ContactIn):
    doc = body.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.messages.insert_one(doc)
    await _send_contact_email(body)
    return {"status": "received", "email_sent": bool(RESEND_API_KEY)}


@api_router.get("/messages")
async def list_messages(admin: dict = Depends(get_current_admin)):
    return await db.messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)


# ---------------------------------------------------------------------------
# Donations (Razorpay)
# ---------------------------------------------------------------------------
@api_router.get("/donate/config")
async def donate_config():
    return {"enabled": bool(razor_client), "key_id": RAZORPAY_KEY_ID if razor_client else ""}


@api_router.post("/donate/order")
async def create_donation_order(body: DonationOrderIn):
    if not razor_client:
        raise HTTPException(status_code=503, detail="Online donations are not configured yet. Please contact the ashrama.")
    if body.amount < 1:
        raise HTTPException(status_code=400, detail="Invalid amount")
    order = razor_client.order.create({
        "amount": body.amount * 100,
        "currency": "INR",
        "payment_capture": 1,
        "receipt": f"don_{uuid.uuid4().hex[:20]}",
    })
    await db.donations.insert_one({
        "id": str(uuid.uuid4()), "order_id": order["id"], "amount": body.amount,
        "name": body.name, "email": body.email, "phone": body.phone,
        "status": "created", "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"order_id": order["id"], "amount": order["amount"], "currency": order["currency"],
            "key_id": RAZORPAY_KEY_ID}


@api_router.post("/donate/verify")
async def verify_donation(body: DonationVerifyIn):
    if not razor_client:
        raise HTTPException(status_code=503, detail="Online donations are not configured.")
    generated = hmac.new(RAZORPAY_KEY_SECRET.encode(),
                         f"{body.razorpay_order_id}|{body.razorpay_payment_id}".encode(),
                         hashlib.sha256).hexdigest()
    if not hmac.compare_digest(generated, body.razorpay_signature):
        await db.donations.update_one({"order_id": body.razorpay_order_id},
                                      {"$set": {"status": "failed"}})
        raise HTTPException(status_code=400, detail="Payment verification failed")
    await db.donations.update_one({"order_id": body.razorpay_order_id},
                                  {"$set": {"status": "paid",
                                            "payment_id": body.razorpay_payment_id}})
    return {"status": "success"}


@api_router.get("/donations")
async def list_donations(admin: dict = Depends(get_current_admin)):
    return await db.donations.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)


@api_router.get("/")
async def root():
    return {"message": "Sri Bhavatarini Ashrama API"}


# ---------------------------------------------------------------------------
# Startup
# ---------------------------------------------------------------------------
@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.events.create_index("id", unique=True)
    await db.gallery.create_index("id", unique=True)
    existing = await db.users.find_one({"email": ADMIN_EMAIL.lower()})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()), "email": ADMIN_EMAIL.lower(),
            "password_hash": hash_password(ADMIN_PASSWORD), "name": "Admin",
            "role": "admin", "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Admin seeded")
    elif not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
        await db.users.update_one({"email": ADMIN_EMAIL.lower()},
                                  {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}})
    if await db.events.count_documents({}) == 0:
        samples = [
            {"title": "Guru Purnima Celebration", "description": "A day of gratitude honouring the lineage of teachers with special puja, bhajans and prasad.", "date": "2026-07-10", "time": "6:00 AM", "location": "Main Prayer Hall"},
            {"title": "Navaratri — Nine Nights of the Mother", "description": "Nine days of devotion to the Divine Mother with daily aarti, chanting and cultural offerings.", "date": "2026-10-11", "time": "6:30 PM", "location": "Ashrama Grounds"},
            {"title": "Annadana Seva Day", "description": "Community meal service — volunteer to serve sanctified food to all who visit.", "date": "2026-02-15", "time": "11:00 AM", "location": "Community Kitchen"},
        ]
        for s in samples:
            s["id"] = str(uuid.uuid4())
            s["created_at"] = datetime.now(timezone.utc).isoformat()
        await db.events.insert_many(samples)
        logger.info("Sample events seeded")
    if EMERGENT_LLM_KEY:
        try:
            init_storage()
            logger.info("Storage initialized")
        except Exception as e:
            logger.error(f"Storage init failed: {e}")


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
