import { useEffect, useState } from "react";
import api, { imageUrl } from "../../lib/api";
import { Reveal } from "../motion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../ui/carousel";
import { MapPin } from "lucide-react";

const FALLBACK = [
  { id: "p1", url: "/hero-altar.webp", caption: "The Sanctum" },
  { id: "p2", url: "/gallery-durga.webp", caption: "Divine Grace" },
  { id: "p3", url: "/gallery-hibiscus.webp", caption: "Morning Offering" },
];

const PolohalliBranch = () => {
  const [slides, setSlides] = useState([]);
  const [emblaApi, setEmblaApi] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        let { data } = await api.get("/gallery?category=polohalli");
        if (!data || data.length === 0) {
          const { data: tribal } = await api.get("/gallery?category=tribal");
          data = tribal;
        }
        if (data && data.length) setSlides(data.map((g) => ({ ...g, url: imageUrl(g.id) })));
        else setSlides(FALLBACK);
      } catch { setSlides(FALLBACK); }
    };
    load();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(() => emblaApi.scrollNext(), 4500);
    return () => clearInterval(id);
  }, [emblaApi]);

  return (
    <section id="polohalli" data-testid="polohalli-section" className="py-28 md:py-40 overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <Reveal>
          <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
            <div className="lg:col-span-7">
              <div className="label-eyebrow mb-6">Our Branch</div>
              <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-[0.95]" style={{ color: "var(--text-primary)" }}>
                Polohalli, <span className="italic" style={{ color: "var(--accent-saffron)" }}>Magadi.</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="font-sans text-base md:text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Nestled in the rural setting of Polohalli in Magadi Taluk, our branch ashrama carries the Mother's grace into villages and tribal settlements — offering spiritual solace and compassionate service where it is needed most.
              </p>
              <div className="mt-5 flex items-center gap-2 label-eyebrow" style={{ color: "var(--accent-saffron)" }}>
                <MapPin size={14} strokeWidth={1.5} /> Polohalli · Magadi Taluk · Karnataka
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Carousel setApi={setEmblaApi} opts={{ loop: true, align: "start" }}>
            <CarouselContent className="-ml-4">
              {slides.map((s) => (
                <CarouselItem key={s.id} data-testid={`polohalli-slide-${s.id}`}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <figure className="relative overflow-hidden group">
                    <img src={s.url} alt={s.caption || "Polohalli branch"} loading="lazy"
                      className="w-full h-[460px] object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 flex items-end p-6"
                      style={{ background: "linear-gradient(180deg, transparent 55%, rgba(22,18,17,0.8))" }}>
                      {s.caption && <figcaption className="font-serif text-xl italic" style={{ color: "var(--text-inverse)" }}>{s.caption}</figcaption>}
                    </div>
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex gap-3 mt-8">
              <CarouselPrevious data-testid="polohalli-prev" className="static translate-y-0 rounded-none w-12 h-12" />
              <CarouselNext data-testid="polohalli-next" className="static translate-y-0 rounded-none w-12 h-12" />
            </div>
          </Carousel>
        </Reveal>
      </div>
    </section>
  );
};

export default PolohalliBranch;
