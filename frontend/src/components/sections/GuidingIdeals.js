import { useEffect, useState } from "react";
import api, { imageUrl } from "../../lib/api";
import { Reveal } from "../motion";
import { User } from "lucide-react";

const GuidingIdeals = () => {
  const [ideals, setIdeals] = useState([]);
  const [photoByKey, setPhotoByKey] = useState({});

  useEffect(() => {
    api.get("/ideals").then(({ data }) => setIdeals(data)).catch(() => setIdeals([]));
    api.get("/gallery").then(({ data }) => {
      const map = {};
      (data || []).forEach((g) => {
        if (g.category && g.category.startsWith("ideal_")) {
          const k = g.category.slice(6);
          if (!map[k]) map[k] = g; // list is desc by created_at → first is latest
        }
      });
      setPhotoByKey(map);
    }).catch(() => setPhotoByKey({}));
  }, []);

  return (
    <section id="ideals" data-testid="ideals" className="py-28 md:py-40" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <Reveal>
          <div className="label-eyebrow mb-6">Our Guiding Ideals</div>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tighter max-w-4xl" style={{ color: "var(--text-primary)" }}>
            The masters who <span className="italic" style={{ color: "var(--accent-saffron)" }}>light our path.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {ideals.map((p, i) => {
            const ph = photoByKey[p.key];
            return (
              <Reveal key={p.key} delay={(i % 3) * 0.05}>
                <article data-testid={`ideal-${p.key}`} className="group">
                  <div className="relative overflow-hidden mb-5" style={{ background: "var(--bg-secondary)", aspectRatio: "3 / 4" }}>
                    {ph ? (
                      <img src={imageUrl(ph.id)} alt={p.name} loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ color: "var(--text-secondary)" }}>
                        <User size={40} strokeWidth={1.2} style={{ color: "var(--accent-saffron)" }} />
                        <span className="label-eyebrow">Photo coming soon</span>
                      </div>
                    )}
                    <span className="absolute top-4 left-4 font-serif text-3xl" style={{ color: ph ? "var(--text-inverse)" : "var(--accent-saffron)", textShadow: ph ? "0 2px 8px rgba(0,0,0,0.6)" : "none" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl" style={{ color: "var(--text-primary)" }}>{p.name}</h3>
                  <p className="mt-3 font-sans text-sm md:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {p.bio}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GuidingIdeals;
