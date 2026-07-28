import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api, { imageUrl, formatApiErrorDetail } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { toast } from "sonner";
import { LogOut, Trash2, Plus, Upload, Pencil, X } from "lucide-react";

const EMPTY_EVENT = { title: "", description: "", date: "", time: "", location: "" };

const PHOTO_CATEGORIES = [
  { value: "gallery", label: "Gallery" },
  { value: "ashrama", label: "Our Ashrama (Home slider)" },
  { value: "spiritual", label: "Activity · Spiritual Activities" },
  { value: "values", label: "Activity · Excellence Through Values" },
  { value: "service", label: "Activity · Service Projects" },
  { value: "tribal", label: "Activity · Tribal Welfare" },
];
const catLabel = (v) => (PHOTO_CATEGORIES.find((c) => c.value === v) || {}).label || v;

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [messages, setMessages] = useState([]);
  const [donations, setDonations] = useState([]);
  const [eventForm, setEventForm] = useState(EMPTY_EVENT);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [uploadCategory, setUploadCategory] = useState("gallery");
  const [galleryFilter, setGalleryFilter] = useState("all");
  const [activities, setActivities] = useState([]);
  const [activityDrafts, setActivityDrafts] = useState({});

  const loadAll = useCallback(async () => {
    try {
      const [e, g, m, d, a] = await Promise.all([
        api.get("/events"), api.get("/gallery"), api.get("/messages"), api.get("/donations"), api.get("/activities"),
      ]);
      setEvents(e.data); setGallery(g.data); setMessages(m.data); setDonations(d.data); setActivities(a.data);
      const drafts = {};
      a.data.forEach((grp) => { drafts[grp.key] = (grp.subgroups || []).join("\n"); });
      setActivityDrafts(drafts);
    } catch (err) {
      if (err.response?.status === 401) { logout(); navigate("/admin/login"); }
    }
  }, [logout, navigate]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const saveEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date) return toast.error("Title and date are required");
    try {
      if (editingId) await api.put(`/events/${editingId}`, eventForm);
      else await api.post("/events", eventForm);
      toast.success(editingId ? "Event updated" : "Event created");
      setEventForm(EMPTY_EVENT); setEditingId(null);
      loadAll();
    } catch (err) { toast.error(formatApiErrorDetail(err.response?.data?.detail)); }
  };

  const editEvent = (ev) => { setEditingId(ev.id); setEventForm({ title: ev.title, description: ev.description, date: ev.date, time: ev.time || "", location: ev.location || "" }); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const deleteEvent = async (id) => {
    try { await api.delete(`/events/${id}`); toast.success("Event deleted"); loadAll(); }
    catch { toast.error("Could not delete"); }
  };

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("caption", caption);
    fd.append("category", uploadCategory);
    try {
      await api.post("/gallery", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Image uploaded");
      setCaption("");
      loadAll();
    } catch (err) { toast.error(formatApiErrorDetail(err.response?.data?.detail)); }
    finally { setUploading(false); e.target.value = ""; }
  };

  const deleteImage = async (id) => {
    try { await api.delete(`/gallery/${id}`); toast.success("Image removed"); loadAll(); }
    catch { toast.error("Could not delete"); }
  };

  const saveActivity = async (key) => {
    const subgroups = (activityDrafts[key] || "").split("\n").map((s) => s.trim()).filter(Boolean);
    try {
      await api.put(`/activities/${key}`, { subgroups });
      toast.success("Activity updated");
      loadAll();
    } catch (err) { toast.error(formatApiErrorDetail(err.response?.data?.detail)); }
  };

  const inputCls = "w-full px-4 py-3 font-sans outline-none border focus:border-[var(--accent-saffron)] transition-colors";
  const inputStyle = { borderColor: "var(--border-light)", background: "var(--bg-primary)" };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      <header className="sticky top-0 z-30 px-6 md:px-10 h-20 flex items-center justify-between"
        style={{ background: "var(--bg-dark)" }}>
        <div>
          <div className="font-serif text-xl" style={{ color: "var(--text-inverse)" }}>Ashrama Admin</div>
          <div className="label-eyebrow" style={{ fontSize: "0.6rem" }}>Content Management</div>
        </div>
        <div className="flex gap-3">
          <button data-testid="admin-view-site" onClick={() => navigate("/")} className="px-4 py-2 font-sans text-sm border" style={{ borderColor: "var(--border-dark)", color: "var(--text-inverse)" }}>View Site</button>
          <button data-testid="admin-logout" onClick={() => { logout(); navigate("/admin/login"); }}
            className="px-4 py-2 font-sans text-sm flex items-center gap-2" style={{ background: "var(--accent-saffron)", color: "var(--text-inverse)" }}>
            <LogOut size={16} strokeWidth={1.5} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-10">
        <Tabs defaultValue="events">
          <TabsList data-testid="admin-tabs" className="mb-8 flex-wrap h-auto">
            <TabsTrigger value="events" data-testid="tab-events">Events</TabsTrigger>
            <TabsTrigger value="activities" data-testid="tab-activities">Activities</TabsTrigger>
            <TabsTrigger value="gallery" data-testid="tab-gallery">Gallery</TabsTrigger>
            <TabsTrigger value="messages" data-testid="tab-messages">Messages ({messages.length})</TabsTrigger>
            <TabsTrigger value="donations" data-testid="tab-donations">Donations ({donations.length})</TabsTrigger>
          </TabsList>

          {/* EVENTS */}
          <TabsContent value="events">
            <form onSubmit={saveEvent} data-testid="event-form" className="p-6 mb-8 space-y-4" style={{ background: "var(--bg-primary)" }}>
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl" style={{ color: "var(--text-primary)" }}>{editingId ? "Edit Event" : "Add Event"}</h3>
                {editingId && <button type="button" data-testid="event-cancel-edit" onClick={() => { setEditingId(null); setEventForm(EMPTY_EVENT); }} className="text-sm flex items-center gap-1" style={{ color: "var(--text-secondary)" }}><X size={14} /> Cancel</button>}
              </div>
              <input data-testid="event-title" placeholder="Event title" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className={inputCls} style={inputStyle} />
              <textarea data-testid="event-description" placeholder="Description" rows={3} value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} className={inputCls + " resize-none"} style={inputStyle} />
              <div className="grid md:grid-cols-3 gap-4">
                <input data-testid="event-date" type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className={inputCls} style={inputStyle} />
                <input data-testid="event-time" placeholder="Time (e.g. 6:00 PM)" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} className={inputCls} style={inputStyle} />
                <input data-testid="event-location" placeholder="Location" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} className={inputCls} style={inputStyle} />
              </div>
              <button data-testid="event-save" type="submit" className="px-6 py-3 font-sans flex items-center gap-2" style={{ background: "var(--accent-saffron)", color: "var(--text-inverse)" }}>
                <Plus size={16} strokeWidth={1.5} /> {editingId ? "Update Event" : "Add Event"}
              </button>
            </form>

            <div className="space-y-3">
              {events.length === 0 && <p className="font-sans" style={{ color: "var(--text-secondary)" }}>No events yet.</p>}
              {events.map((ev) => (
                <div key={ev.id} data-testid={`admin-event-${ev.id}`} className="p-5 flex items-center justify-between" style={{ background: "var(--bg-primary)" }}>
                  <div>
                    <div className="font-serif text-xl" style={{ color: "var(--text-primary)" }}>{ev.title}</div>
                    <div className="label-eyebrow" style={{ color: "var(--text-secondary)" }}>{ev.date} {ev.time && `· ${ev.time}`} {ev.location && `· ${ev.location}`}</div>
                  </div>
                  <div className="flex gap-2">
                    <button data-testid={`event-edit-${ev.id}`} onClick={() => editEvent(ev)} className="p-2" style={{ color: "var(--text-secondary)" }}><Pencil size={18} strokeWidth={1.5} /></button>
                    <button data-testid={`event-delete-${ev.id}`} onClick={() => deleteEvent(ev.id)} className="p-2" style={{ color: "#b3261e" }}><Trash2 size={18} strokeWidth={1.5} /></button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ACTIVITIES */}
          <TabsContent value="activities">
            <p className="font-sans mb-6" style={{ color: "var(--text-secondary)" }}>
              Edit the sub-groups shown under each activity. One item per line. Upload photos for each group from the Gallery tab (choose the matching category).
            </p>
            <div className="space-y-4">
              {activities.map((grp) => (
                <div key={grp.key} data-testid={`admin-activity-${grp.key}`} className="p-6" style={{ background: "var(--bg-primary)" }}>
                  <h3 className="font-serif text-2xl mb-3" style={{ color: "var(--text-primary)" }}>{grp.title}</h3>
                  <textarea data-testid={`activity-subgroups-${grp.key}`} rows={5}
                    value={activityDrafts[grp.key] || ""}
                    onChange={(e) => setActivityDrafts({ ...activityDrafts, [grp.key]: e.target.value })}
                    className={inputCls + " resize-none"} style={inputStyle} />
                  <button data-testid={`activity-save-${grp.key}`} onClick={() => saveActivity(grp.key)}
                    className="mt-3 px-6 py-2.5 font-sans" style={{ background: "var(--accent-saffron)", color: "var(--text-inverse)" }}>
                    Save {grp.title.split(" ")[0]}
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="gallery">
            <div className="p-6 mb-8" style={{ background: "var(--bg-primary)" }}>
              <h3 className="font-serif text-2xl mb-4" style={{ color: "var(--text-primary)" }}>Upload Image</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input data-testid="gallery-caption" placeholder="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} className={inputCls} style={inputStyle} />
                <select data-testid="gallery-category" value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)} className={inputCls} style={inputStyle}>
                  {PHOTO_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <label data-testid="gallery-upload-label" className="inline-flex items-center gap-2 px-6 py-3 font-sans cursor-pointer" style={{ background: "var(--accent-saffron)", color: "var(--text-inverse)" }}>
                <Upload size={16} strokeWidth={1.5} /> {uploading ? "Uploading…" : "Choose Image"}
                <input data-testid="gallery-file-input" type="file" accept="image/*" className="hidden" onChange={uploadImage} disabled={uploading} />
              </label>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              <button data-testid="gallery-filter-all" onClick={() => setGalleryFilter("all")}
                className="px-3 py-1.5 text-sm font-sans border"
                style={{ borderColor: galleryFilter === "all" ? "var(--accent-saffron)" : "var(--border-light)", background: galleryFilter === "all" ? "var(--accent-saffron)" : "transparent", color: galleryFilter === "all" ? "#fff" : "var(--text-secondary)" }}>All</button>
              {PHOTO_CATEGORIES.map((c) => (
                <button key={c.value} data-testid={`gallery-filter-${c.value}`} onClick={() => setGalleryFilter(c.value)}
                  className="px-3 py-1.5 text-sm font-sans border"
                  style={{ borderColor: galleryFilter === c.value ? "var(--accent-saffron)" : "var(--border-light)", background: galleryFilter === c.value ? "var(--accent-saffron)" : "transparent", color: galleryFilter === c.value ? "#fff" : "var(--text-secondary)" }}>{c.label}</button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.filter((g) => galleryFilter === "all" || (g.category || "gallery") === galleryFilter).length === 0 &&
                <p className="font-sans col-span-full" style={{ color: "var(--text-secondary)" }}>No images in this category yet.</p>}
              {gallery.filter((g) => galleryFilter === "all" || (g.category || "gallery") === galleryFilter).map((g) => (
                <div key={g.id} data-testid={`admin-gallery-${g.id}`} className="relative group overflow-hidden" style={{ background: "var(--bg-primary)" }}>
                  <img src={imageUrl(g.id)} alt={g.caption} className="w-full h-40 object-cover" />
                  <button data-testid={`gallery-delete-${g.id}`} onClick={() => deleteImage(g.id)}
                    className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}>
                    <Trash2 size={16} strokeWidth={1.5} />
                  </button>
                  <div className="p-2" style={{ background: "var(--bg-primary)" }}>
                    <span className="label-eyebrow" style={{ fontSize: "0.55rem", color: "var(--accent-saffron)" }}>{catLabel(g.category || "gallery")}</span>
                    {g.caption && <div className="text-sm font-sans" style={{ color: "var(--text-primary)" }}>{g.caption}</div>}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* MESSAGES */}
          <TabsContent value="messages">
            <div className="space-y-3">
              {messages.length === 0 && <p className="font-sans" style={{ color: "var(--text-secondary)" }}>No messages yet.</p>}
              {messages.map((m) => (
                <div key={m.id} data-testid={`admin-message-${m.id}`} className="p-5" style={{ background: "var(--bg-primary)" }}>
                  <div className="flex justify-between flex-wrap gap-2">
                    <div className="font-serif text-lg" style={{ color: "var(--text-primary)" }}>{m.name}</div>
                    <div className="label-eyebrow" style={{ color: "var(--text-secondary)" }}>{new Date(m.created_at).toLocaleString()}</div>
                  </div>
                  <div className="font-sans text-sm mt-1" style={{ color: "var(--accent-saffron)" }}>{m.email} {m.phone && `· ${m.phone}`}</div>
                  <p className="font-sans mt-2" style={{ color: "var(--text-secondary)" }}>{m.message}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* DONATIONS */}
          <TabsContent value="donations">
            <div className="space-y-3">
              {donations.length === 0 && <p className="font-sans" style={{ color: "var(--text-secondary)" }}>No donations recorded yet.</p>}
              {donations.map((d) => (
                <div key={d.id} data-testid={`admin-donation-${d.id}`} className="p-5 flex items-center justify-between" style={{ background: "var(--bg-primary)" }}>
                  <div>
                    <div className="font-serif text-xl" style={{ color: "var(--text-primary)" }}>₹{Number(d.amount).toLocaleString("en-IN")}</div>
                    <div className="font-sans text-sm" style={{ color: "var(--text-secondary)" }}>{d.name || "Anonymous"} {d.email && `· ${d.email}`}</div>
                  </div>
                  <span className="label-eyebrow px-3 py-1" style={{ background: d.status === "paid" ? "#e7f3ea" : "var(--bg-secondary)", color: d.status === "paid" ? "#1e7d34" : "var(--text-secondary)" }}>{d.status}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
