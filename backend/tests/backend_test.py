"""Backend API tests for Sri Bhavatarini Ashrama."""
import os
import io
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://divine-path-20.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@bhavatarini.org"
ADMIN_PASSWORD = "Ashrama@2025"


@pytest.fixture(scope="session")
def s():
    return requests.Session()


@pytest.fixture(scope="session")
def token(s):
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "token" in data
    return data["token"]


@pytest.fixture(scope="session")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ---------- Public ----------
class TestPublic:
    def test_root(self, s):
        r = s.get(f"{API}/")
        assert r.status_code == 200

    def test_events_seeded(self, s):
        r = s.get(f"{API}/events")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 3

    def test_gallery_list(self, s):
        r = s.get(f"{API}/gallery")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_donate_config_disabled(self, s):
        r = s.get(f"{API}/donate/config")
        assert r.status_code == 200
        assert r.json()["enabled"] is False

    def test_donate_order_503(self, s):
        r = s.post(f"{API}/donate/order", json={"amount": 100})
        assert r.status_code == 503

    def test_contact_submit(self, s):
        r = s.post(f"{API}/contact", json={
            "name": "TEST_User", "email": "test@example.com",
            "phone": "1234567890", "message": "TEST message"
        })
        assert r.status_code == 200
        d = r.json()
        assert d["status"] == "received"
        assert d["email_sent"] is False


# ---------- Auth ----------
class TestAuth:
    def test_login_success(self, s):
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        d = r.json()
        assert d["email"] == ADMIN_EMAIL
        assert "token" in d

    def test_login_wrong_password(self, s):
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_me_with_bearer(self, s, auth_headers):
        r = s.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL

    def test_me_without_auth(self, s):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401


# ---------- Events CRUD ----------
class TestEventsCRUD:
    def test_create_requires_auth(self, s):
        r = requests.post(f"{API}/events", json={"title": "x", "description": "y", "date": "2026-01-01"})
        assert r.status_code == 401

    def test_full_crud(self, s, auth_headers):
        payload = {"title": "TEST_Event", "description": "d", "date": "2026-05-01", "time": "10:00", "location": "loc"}
        r = s.post(f"{API}/events", json=payload, headers=auth_headers)
        assert r.status_code == 200, r.text
        eid = r.json()["id"]

        # verify in list
        lst = s.get(f"{API}/events").json()
        assert any(e["id"] == eid for e in lst)

        # update
        payload["title"] = "TEST_Event_upd"
        r = s.put(f"{API}/events/{eid}", json=payload, headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["title"] == "TEST_Event_upd"

        # delete
        r = s.delete(f"{API}/events/{eid}", headers=auth_headers)
        assert r.status_code == 200
        lst = s.get(f"{API}/events").json()
        assert not any(e["id"] == eid for e in lst)


# ---------- Protected lists ----------
class TestProtectedLists:
    def test_messages_requires_auth(self):
        r = requests.get(f"{API}/messages")
        assert r.status_code == 401

    def test_messages_with_auth(self, s, auth_headers):
        r = s.get(f"{API}/messages", headers=auth_headers)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_donations_requires_auth(self):
        r = requests.get(f"{API}/donations")
        assert r.status_code == 401

    def test_donations_with_auth(self, s, auth_headers):
        r = s.get(f"{API}/donations", headers=auth_headers)
        assert r.status_code == 200


# ---------- Gallery ----------
class TestGallery:
    def test_upload_requires_auth(self):
        # 1x1 png
        png = bytes.fromhex(
            "89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4"
            "890000000A49444154789C6300010000000500010D0A2DB40000000049454E44AE426082"
        )
        r = requests.post(f"{API}/gallery",
                          files={"file": ("t.png", io.BytesIO(png), "image/png")},
                          data={"caption": "x"})
        assert r.status_code == 401

    def test_upload_get_delete(self, s, auth_headers):
        png = bytes.fromhex(
            "89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4"
            "890000000A49444154789C6300010000000500010D0A2DB40000000049454E44AE426082"
        )
        r = s.post(f"{API}/gallery",
                   files={"file": ("t.png", io.BytesIO(png), "image/png")},
                   data={"caption": "TEST_caption"},
                   headers=auth_headers)
        assert r.status_code == 200, r.text
        gid = r.json()["id"]

        # fetch image publicly
        r = requests.get(f"{API}/gallery/{gid}/image")
        assert r.status_code == 200
        assert r.headers.get("content-type", "").startswith("image/")

        # appears in listing
        lst = requests.get(f"{API}/gallery").json()
        assert any(g["id"] == gid for g in lst)

        # delete (soft)
        r = s.delete(f"{API}/gallery/{gid}", headers=auth_headers)
        assert r.status_code == 200
        lst = requests.get(f"{API}/gallery").json()
        assert not any(g["id"] == gid for g in lst)
