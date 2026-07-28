import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer data-testid="footer" style={{ background: "var(--bg-dark)", color: "var(--text-inverse)" }}>
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20">
      <div className="grid md:grid-cols-3 gap-12">
        <div>
          <div className="font-serif text-3xl mb-3" style={{ color: "var(--text-inverse)" }}>
            Sri Bhavatarini Ashrama
          </div>
          <p className="font-sans text-sm leading-relaxed" style={{ color: "#B5ABA0" }}>
            A sanctuary devoted to the Divine Mother — nurturing spiritual awakening,
            selfless service and inner stillness.
          </p>
        </div>
        <div className="font-sans text-sm space-y-4" style={{ color: "#B5ABA0" }}>
          <div className="flex gap-3"><MapPin size={18} strokeWidth={1.5} className="shrink-0 mt-0.5" style={{ color: "var(--accent-saffron)" }} />
            <span>282, 12th Cross, Saraswatinagar, Vijayanagar, Bengaluru - 560040</span></div>
          <div className="flex gap-3"><Phone size={18} strokeWidth={1.5} style={{ color: "var(--accent-saffron)" }} />
            <a href="tel:+919731197247" className="hover:text-[var(--accent-saffron)] transition-colors">+91 97311 97247</a></div>
          <div className="flex gap-3"><Mail size={18} strokeWidth={1.5} style={{ color: "var(--accent-saffron)" }} />
            <a href="mailto:sri.bhavatarini.ashrama@gmail.com" className="hover:text-[var(--accent-saffron)] transition-colors break-all">sri.bhavatarini.ashrama@gmail.com</a></div>
        </div>
        <div className="font-sans text-sm" style={{ color: "#B5ABA0" }}>
          <div className="label-eyebrow mb-4">Darshan Hours</div>
          <p>Morning · 6:00 AM – 12:00 Noon</p>
          <p>Evening · 5:00 PM – 8:00 PM</p>
          <p className="mt-4">Open all days of the week</p>
        </div>
      </div>
      <div className="mt-16 pt-8 flex flex-col md:flex-row justify-between gap-4" style={{ borderTop: "1px solid var(--border-dark)" }}>
        <p className="font-sans text-xs" style={{ color: "#8A8078" }}>
          © {new Date().getFullYear()} Sri Bhavatarini Ashrama. All rights reserved.
        </p>
        <Link data-testid="footer-admin-link" to="/admin/login" className="font-sans text-xs hover:text-[var(--accent-saffron)] transition-colors" style={{ color: "#8A8078" }}>
          Admin
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
