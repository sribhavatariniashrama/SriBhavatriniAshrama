import { useEffect, useState } from "react";
import api, { imageUrl } from "../../lib/api";
import { Reveal } from "../motion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../ui/carousel";

const FALLBACK = [
  { id: "a1", url: "/hero-altar.webp", caption: "The Sanctum" },
  { id: "a2", url: "/gallery-durga.webp", caption: "Sri Ramakrishna Paramahamsa" },
  { id: "a3", url: "/gallery-hibiscus.webp", caption: "Morning Offering" },
  { id: "a4", url: "/gallery-ramakrishna.webp", caption: "Divine Presence" },
];

const AshramaCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [emblaApi, setEmblaApi] = useState(null);

  useEffect(() => {
    api.get("/gallery?category=ashrama").then(({ data }) => {
      if (data && data.length) setSlides(data.map((g) => ({ ...g, url: imageUrl(g.id) })));
      else setSlides(FALLBACK);
    }).catch(() => setSlides(FALLBACK));
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const id = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(id);
  }, [emblaApi]);

  return (
    <section id="ashrama" data-testid="ashrama-carousel" className="py-28 md:py-40 overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <div>
              <div className="label-eyebrow mb-6">Our Ashrama</div>
              <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tighter" style={{ color: "var(--text-primary)" }}>
                A glimpse of our <span className="italic" style={{ color: "var(--accent-saffron)" }}>sacred home.</span>
              </h2>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Carousel setApi={setEmblaApi} opts={{ loop: true, align: "start" }}>
            <CarouselContent className="-ml-4">
              {slides.map((s) => (
                <CarouselItem key={s.id} data-testid={`ashrama-slide-${s.id}`}
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <figure className="relative overflow-hidden group">
                    <img src={s.url} alt={s.caption || "Ashrama"} loading="lazy"
                      className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 flex items-end p-6"
                      style={{ background: "linear-gradient(180deg, transparent 55%, rgba(22,18,17,0.8))" }}>
                      <figcaption className="font-serif text-2xl italic" style={{ color: "var(--text-inverse)" }}>{s.caption}</figcaption>
                    </div>
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex gap-3 mt-8">
              <CarouselPrevious data-testid="ashrama-prev" className="static translate-y-0 rounded-none w-12 h-12" />
              <CarouselNext data-testid="ashrama-next" className="static translate-y-0 rounded-none w-12 h-12" />
            </div>
          </Carousel>
        </Reveal>
      </div>
    </section>
  );
};

export default AshramaCarousel;
