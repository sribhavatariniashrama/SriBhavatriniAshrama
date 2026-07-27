import { useEffect, useState } from "react";
import api, { imageUrl } from "../../lib/api";
import { Reveal } from "../motion";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const FALLBACK = [
  { id: "f1", url: "/gallery-durga.webp", caption: "Sri Ramakrishna Paramahamsa" },
  { id: "f2", url: "/gallery-ramakrishna.webp", caption: "Sri Ramakrishna Paramahamsa" },
  { id: "f3", url: "/gallery-sarada-aarti.webp", caption: "Aarti to Holy Mother Sri Sarada Devi" },
  { id: "f4", url: "/gallery-hibiscus.webp", caption: "Sacred Offering" },
];

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    api.get("/gallery").then(({ data }) => {
      if (data && data.length) setItems(data.map((g) => ({ ...g, url: imageUrl(g.id) })));
      else setItems(FALLBACK);
    }).catch(() => setItems(FALLBACK));
  }, []);

  return (
    <section id="gallery" data-testid="gallery" className="py-28 md:py-40" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <Reveal>
          <div className="label-eyebrow mb-6">Gallery</div>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tighter" style={{ color: "var(--text-primary)" }}>
            Moments of <span className="italic" style={{ color: "var(--accent-saffron)" }}>grace.</span>
          </h2>
        </Reveal>

        <div className="mt-16 columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
          {items.map((g, i) => (
            <Reveal key={g.id} delay={(i % 3) * 0.06}>
              <button data-testid={`gallery-item-${g.id}`} onClick={() => setActive(g)}
                className="group block w-full overflow-hidden relative">
                <img src={g.url} alt={g.caption || "Ashrama"} loading="lazy"
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5"
                  style={{ background: "linear-gradient(180deg, transparent, rgba(22,18,17,0.75))" }}>
                  <span className="font-serif text-xl italic" style={{ color: "var(--text-inverse)" }}>{g.caption}</span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div data-testid="gallery-lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6" style={{ background: "rgba(22,18,17,0.94)" }}>
            <button data-testid="lightbox-close" className="absolute top-6 right-6" style={{ color: "var(--text-inverse)" }}>
              <X size={30} strokeWidth={1.5} />
            </button>
            <motion.img initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
              src={active.url} alt={active.caption} className="max-h-[85vh] max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
