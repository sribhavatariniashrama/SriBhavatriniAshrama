import { Reveal } from "../motion";
import { Flame, HandHeart, GraduationCap, Trees } from "lucide-react";

const IMG_MEDITATION = "/hero-altar.webp";
const IMG_MARIGOLD =
  "https://images.pexels.com/photos/8819252/pexels-photo-8819252.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const Card = ({ children, className = "", testid }) => (
  <div data-testid={testid}
    className={`group relative overflow-hidden border p-8 flex flex-col justify-between transition-colors duration-500 hover:border-[var(--accent-saffron)] ${className}`}
    style={{ background: "var(--bg-secondary)", borderColor: "var(--border-light)" }}>
    {children}
  </div>
);

const Icon = ({ children }) => (
  <div className="mb-6" style={{ color: "var(--accent-saffron)" }}>{children}</div>
);

const Activities = () => (
  <section id="activities" data-testid="activities" className="py-28 md:py-40" style={{ background: "var(--bg-dark)" }}>
    <div className="max-w-[1400px] mx-auto px-6 md:px-10">
      <Reveal>
        <div className="label-eyebrow mb-6">Our Activities</div>
        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tighter max-w-3xl" style={{ color: "var(--text-inverse)" }}>
          Devotion expressed as <span className="italic" style={{ color: "var(--accent-saffron)" }}>daily practice.</span>
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[240px]">
          {/* 1. Spiritual Activities */}
          <Card testid="activity-spiritual" className="md:col-span-2 md:row-span-2 !p-0">
            <img src={IMG_MEDITATION} alt="Spiritual practice" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(22,18,17,0.25) 20%, rgba(22,18,17,0.9))" }} />
            <div className="relative z-10 mt-auto p-8">
              <div className="label-eyebrow mb-3">01</div>
              <Icon><Flame size={26} strokeWidth={1.5} /></Icon>
              <h3 className="font-serif text-3xl md:text-4xl" style={{ color: "var(--text-inverse)" }}>Spiritual Activities</h3>
              <p className="font-sans text-sm mt-2 max-w-md" style={{ color: "#C9BEB2" }}>
                Daily puja and aarti, guided meditation & dhyana, weekly satsang, bhajans and scriptural study — the living heart of the ashrama.
              </p>
            </div>
          </Card>

          {/* 2. Excellence Through Values */}
          <Card testid="activity-values" className="md:col-span-2">
            <div className="flex items-start justify-between">
              <div className="label-eyebrow">02</div>
              <Icon><GraduationCap size={26} strokeWidth={1.5} /></Icon>
            </div>
            <div>
              <h3 className="font-serif text-3xl" style={{ color: "var(--text-inverse)" }}>‘Excellence Through Values’ Programmes</h3>
              <p className="font-sans text-sm mt-2 max-w-lg" style={{ color: "#8A8078" }}>
                Character-building and value-education workshops for students and youth — nurturing integrity, focus and a life guided by higher ideals.
              </p>
            </div>
          </Card>

          {/* 3. Service Projects */}
          <Card testid="activity-service">
            <div className="flex items-start justify-between">
              <div className="label-eyebrow">03</div>
              <Icon><HandHeart size={26} strokeWidth={1.5} /></Icon>
            </div>
            <div>
              <h3 className="font-serif text-2xl" style={{ color: "var(--text-inverse)" }}>Service Projects</h3>
              <p className="font-sans text-sm mt-1" style={{ color: "#8A8078" }}>
                Annadana, medical camps and community care — serving the Divine in all beings.
              </p>
            </div>
          </Card>

          {/* 4. Tribal Welfare Project */}
          <Card testid="activity-tribal" className="!p-0">
            <img src={IMG_MARIGOLD} alt="Tribal welfare" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(89,19,22,0.35), rgba(22,18,17,0.92))" }} />
            <div className="relative z-10 mt-auto p-8">
              <div className="label-eyebrow mb-2">04</div>
              <Icon><Trees size={24} strokeWidth={1.5} /></Icon>
              <h3 className="font-serif text-2xl" style={{ color: "var(--text-inverse)" }}>Tribal Welfare Project</h3>
              <p className="font-sans text-sm mt-1" style={{ color: "#E8DAD2" }}>
                Education, healthcare and livelihood support for tribal communities.
              </p>
            </div>
          </Card>
        </div>
      </Reveal>
    </div>
  </section>
);

export default Activities;
