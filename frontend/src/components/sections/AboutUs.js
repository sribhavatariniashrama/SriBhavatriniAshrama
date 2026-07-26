import { Reveal } from "../motion";

const CHAPTERS = [
  {
    n: "01",
    title: "The Tradition",
    body: "Sri Bhavatarini Ashrama is rooted in the timeless worship of the Divine Mother — Bhavatarini, 'she who ferries us across the ocean of existence.' Our practice weaves together devotion, meditation and selfless service into a single living path.",
  },
  {
    n: "02",
    title: "Our Purpose",
    body: "We exist to create a refuge of stillness in a restless world. Here, seekers of every background gather to still the mind, open the heart, and rediscover the sacred that already dwells within them.",
  },
  {
    n: "03",
    title: "The Path of Seva",
    body: "Spirituality without compassion is incomplete. Through annadana, community care and education, we let devotion overflow into action — serving the Mother by serving all her children.",
  },
];

const AboutUs = () => (
  <section id="about" data-testid="about" className="py-28 md:py-40" style={{ background: "var(--bg-primary)" }}>
    <div className="max-w-[1400px] mx-auto px-6 md:px-10">
      <Reveal>
        <div className="label-eyebrow mb-6">About Us</div>
        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-[0.95] max-w-4xl"
          style={{ color: "var(--text-primary)" }}>
          A home for the heart that <span className="italic" style={{ color: "var(--accent-saffron)" }}>seeks the sacred.</span>
        </h2>
      </Reveal>

      <div className="mt-20 md:mt-28 space-y-16">
        {CHAPTERS.map((c, i) => (
          <Reveal key={c.n} delay={i * 0.05}>
            <div className="grid md:grid-cols-12 gap-6 md:gap-10 pb-16 border-b" style={{ borderColor: "var(--border-light)" }}>
              <div className="md:col-span-4">
                <div className="font-serif text-6xl md:text-7xl" style={{ color: "var(--border-light)" }}>{c.n}</div>
                <h3 className="font-serif text-3xl md:text-4xl mt-2" style={{ color: "var(--text-primary)" }}>{c.title}</h3>
              </div>
              <div className="md:col-span-8 md:pt-4">
                <p className="font-sans text-lg md:text-xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>{c.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default AboutUs;
