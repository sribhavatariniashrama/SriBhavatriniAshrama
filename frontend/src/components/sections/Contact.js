import { useState } from "react";
import api, { formatApiErrorDetail } from "../../lib/api";
import { Reveal } from "../motion";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Send } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error("Please fill in name, email and message");
    setLoading(true);
    try {
      await api.post("/contact", form);
      toast.success("Your message has reached us. We will respond soon 🙏");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  const field = "w-full px-4 py-3 font-sans outline-none border bg-transparent focus:border-[var(--accent-saffron)] transition-colors duration-300";

  return (
    <section id="contact" data-testid="contact" className="py-28 md:py-40" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-16">
        <Reveal>
          <div className="label-eyebrow mb-6">Contact Us</div>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tighter" style={{ color: "var(--text-primary)" }}>
            Come, <span className="italic" style={{ color: "var(--accent-saffron)" }}>visit us.</span>
          </h2>
          <div className="mt-10 space-y-6 font-sans" style={{ color: "var(--text-secondary)" }}>
            <div className="flex gap-4"><MapPin strokeWidth={1.5} className="shrink-0" style={{ color: "var(--accent-saffron)" }} />
              <span>282, 12th Cross, Saraswatinagar,<br />Vijayanagar, Bengaluru - 560040</span></div>
            <div className="flex gap-4"><Phone strokeWidth={1.5} style={{ color: "var(--accent-saffron)" }} />
              <a href="tel:+919731197247" className="hover:text-[var(--accent-saffron)] transition-colors">+91 97311 97247</a></div>
            <div className="flex gap-4"><Mail strokeWidth={1.5} style={{ color: "var(--accent-saffron)" }} />
              <a href="mailto:sri.bhavatarini.ashrama@gmail.com" className="hover:text-[var(--accent-saffron)] transition-colors break-all">sri.bhavatarini.ashrama@gmail.com</a></div>
          </div>
          <div className="mt-10 overflow-hidden border" style={{ borderColor: "var(--border-light)" }}>
            <iframe title="map" width="100%" height="240" style={{ border: 0, filter: "grayscale(0.2)" }}
              loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=282,+12th+Cross,+Saraswatinagar,+Vijayanagar,+Bengaluru+560040&z=17&output=embed" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={submit} data-testid="contact-form" className="space-y-4">
            <input data-testid="contact-name" placeholder="Your name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} className={field}
              style={{ borderColor: "var(--border-light)" }} />
            <input data-testid="contact-email" type="email" placeholder="Email address" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} className={field}
              style={{ borderColor: "var(--border-light)" }} />
            <input data-testid="contact-phone" placeholder="Phone (optional)" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} className={field}
              style={{ borderColor: "var(--border-light)" }} />
            <textarea data-testid="contact-message" placeholder="Your message" rows={6} value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })} className={field + " resize-none"}
              style={{ borderColor: "var(--border-light)" }} />
            <button data-testid="contact-submit" type="submit" disabled={loading}
              className="w-full py-4 font-sans flex items-center justify-center gap-2 transition-transform duration-300 hover:scale-[1.02] disabled:opacity-60"
              style={{ background: "var(--bg-maroon)", color: "var(--text-inverse)" }}>
              <Send size={18} strokeWidth={1.5} />
              {loading ? "Sending…" : "Send Message"}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
