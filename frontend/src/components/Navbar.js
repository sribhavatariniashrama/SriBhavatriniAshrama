import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";

const LINKS = [
  { label: "About Us", id: "about" },
  { label: "Our Guiding Ideals", id: "ideals" },
  { label: "Our Activities", id: "activities" },
  { label: "Events", id: "events" },
  { label: "Gallery", id: "gallery" },
  { label: "Contact Us", id: "contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -70 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      data-testid="navbar"
      className="fixed top-0 left-0 right-0 z-40 transition-[background-color,border-color] duration-500"
      style={{
        backgroundColor: scrolled ? "rgba(253,251,247,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-light)" : "1px solid transparent",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        <button data-testid="nav-logo" onClick={() => (lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" }))}
          className="text-left leading-none">
          <div className="font-serif text-lg md:text-xl font-600 tracking-tight leading-tight" style={{ color: "var(--bg-maroon)" }}>
            Sri Bhavatarini Ashrama
          </div>
          <div className="label-eyebrow mt-0.5" style={{ fontSize: "0.6rem" }}>Saraswatinagara, Bengaluru</div>
        </button>

        <nav className="hidden xl:flex items-center gap-7">
          {LINKS.map((l) => (
            <button
              key={l.id}
              data-testid={`nav-${l.id}`}
              onClick={() => go(l.id)}
              className="font-sans text-sm tracking-wide transition-colors duration-300 hover:text-[var(--accent-saffron)]"
              style={{ color: "var(--text-primary)" }}
            >
              {l.label}
            </button>
          ))}
          <button
            data-testid="nav-donate"
            onClick={() => go("donate")}
            className="font-sans text-sm px-6 py-2.5 rounded-full transition-transform duration-300 hover:scale-105"
            style={{ background: "var(--accent-saffron)", color: "var(--text-inverse)" }}
          >
            Donate Now
          </button>
        </nav>

        <button className="xl:hidden" data-testid="nav-mobile-toggle" onClick={() => setOpen(!open)}>
          {open ? <X strokeWidth={1.5} /> : <Menu strokeWidth={1.5} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="xl:hidden overflow-hidden"
            style={{ background: "var(--bg-primary)", borderTop: "1px solid var(--border-light)" }}
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {LINKS.map((l) => (
                <button key={l.id} data-testid={`nav-mobile-${l.id}`} onClick={() => go(l.id)}
                  className="text-left font-serif text-2xl" style={{ color: "var(--text-primary)" }}>
                  {l.label}
                </button>
              ))}
              <button data-testid="nav-mobile-donate" onClick={() => go("donate")}
                className="mt-2 px-6 py-3 rounded-full font-sans"
                style={{ background: "var(--accent-saffron)", color: "var(--text-inverse)" }}>
                Donate Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
