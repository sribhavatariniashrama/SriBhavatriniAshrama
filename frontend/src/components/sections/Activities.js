import { useEffect, useState } from "react";
import api, { imageUrl } from "../../lib/api";
import { Reveal } from "../motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import { Dot } from "lucide-react";

const Activities = () => {
  const [groups, setGroups] = useState([]);
  const [photos, setPhotos] = useState({}); // category -> [images]

  useEffect(() => {
    api.get("/activities").then(({ data }) => setGroups(data)).catch(() => setGroups([]));
    api.get("/gallery").then(({ data }) => {
      const byCat = {};
      (data || []).forEach((g) => {
        (byCat[g.category] = byCat[g.category] || []).push(g);
      });
      setPhotos(byCat);
    }).catch(() => setPhotos({}));
  }, []);

  return (
    <section id="activities" data-testid="activities" className="py-28 md:py-40" style={{ background: "var(--bg-dark)" }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <Reveal>
          <div className="label-eyebrow mb-6">Our Activities</div>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tighter max-w-3xl" style={{ color: "var(--text-inverse)" }}>
            Devotion expressed as <span className="italic" style={{ color: "var(--accent-saffron)" }}>daily practice.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible defaultValue="spiritual" className="mt-14"
            data-testid="activities-accordion">
            {groups.map((g, i) => {
              const imgs = photos[g.key] || [];
              return (
                <AccordionItem key={g.key} value={g.key} data-testid={`activity-group-${g.key}`}
                  style={{ borderColor: "var(--border-dark)" }}>
                  <AccordionTrigger data-testid={`activity-trigger-${g.key}`}
                    className="hover:no-underline py-7 [&>svg]:text-[var(--accent-saffron)] [&>svg]:w-6 [&>svg]:h-6">
                    <div className="flex items-baseline gap-5 text-left">
                      <span className="font-serif text-2xl" style={{ color: "var(--accent-saffron)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-serif text-2xl md:text-4xl" style={{ color: "var(--text-inverse)" }}>
                        {g.title}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-10">
                    <div className="md:pl-14 grid lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-5">
                        {g.intro && (
                          <p className="font-sans text-base leading-relaxed mb-6" style={{ color: "#C9BEB2" }}>{g.intro}</p>
                        )}
                        <ul className="space-y-2">
                          {(g.subgroups || []).map((s) => (
                            <li key={s} className="flex items-center font-sans text-sm" style={{ color: "#E8DAD2" }}>
                              <Dot style={{ color: "var(--accent-saffron)" }} /> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="lg:col-span-7">
                        {imgs.length === 0 ? (
                          <div className="h-40 flex items-center justify-center border font-sans text-sm"
                            style={{ borderColor: "var(--border-dark)", color: "#8A8078" }}>
                            Photos coming soon
                          </div>
                        ) : (
                          <div className="columns-2 sm:columns-3 gap-3 [&>*]:mb-3">
                            {imgs.slice(0, 9).map((im) => (
                              <figure key={im.id} data-testid={`activity-photo-${im.id}`} className="group overflow-hidden break-inside-avoid">
                                <img src={imageUrl(im.id)} alt={im.caption || g.title} loading="lazy"
                                  className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]" />
                                {im.caption && (
                                  <figcaption className="mt-1 font-sans text-xs" style={{ color: "#8A8078" }}>{im.caption}</figcaption>
                                )}
                              </figure>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
};

export default Activities;
