import { Reveal } from "../motion";
import { Flame, HandHeart, Users, BookOpen, Sun, Utensils } from "lucide-react";

const IMG_MEDITATION =
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwcGVhY2UlMjBzcGlyaXR1YWxpdHl8ZW58MHx8fHwxNzg1MDcyNjk3fDA&ixlib=rb-4.1.0&q=85";
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
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px]">
          <Card testid="activity-meditation" className="md:col-span-2 md:row-span-2 !p-0">
            <img src={IMG_MEDITATION} alt="Meditation" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, rgba(22,18,17,0.85))" }} />
            <div className="relative z-10 mt-auto p-8">
              <Icon><Sun size={26} strokeWidth={1.5} /></Icon>
              <h3 className="font-serif text-3xl md:text-4xl" style={{ color: "var(--text-inverse)" }}>Daily Meditation & Dhyana</h3>
              <p className="font-sans text-sm mt-2" style={{ color: "#C9BEB2" }}>Guided morning and evening sittings open to all seekers.</p>
            </div>
          </Card>

          <Card testid="activity-satsang">
            <Icon><Users size={26} strokeWidth={1.5} /></Icon>
            <div>
              <h3 className="font-serif text-2xl" style={{ color: "var(--text-inverse)" }}>Satsang</h3>
              <p className="font-sans text-sm mt-1" style={{ color: "#8A8078" }}>Weekly gatherings of chanting & discourse.</p>
            </div>
          </Card>

          <Card testid="activity-annadana">
            <Icon><Utensils size={26} strokeWidth={1.5} /></Icon>
            <div>
              <h3 className="font-serif text-2xl" style={{ color: "var(--text-inverse)" }}>Annadana</h3>
              <p className="font-sans text-sm mt-1" style={{ color: "#8A8078" }}>Serving free sanctified meals to the community.</p>
            </div>
          </Card>

          <Card testid="activity-puja" className="md:col-span-2 !p-0">
            <img src={IMG_MARIGOLD} alt="Puja offerings" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(89,19,22,0.9), transparent)" }} />
            <div className="relative z-10 p-8 max-w-[60%]">
              <Icon><Flame size={26} strokeWidth={1.5} /></Icon>
              <h3 className="font-serif text-3xl" style={{ color: "var(--text-inverse)" }}>Puja & Aarti</h3>
              <p className="font-sans text-sm mt-1" style={{ color: "#E8DAD2" }}>Sacred rituals honouring the Divine Mother.</p>
            </div>
          </Card>

          <Card testid="activity-seva">
            <Icon><HandHeart size={26} strokeWidth={1.5} /></Icon>
            <div>
              <h3 className="font-serif text-2xl" style={{ color: "var(--text-inverse)" }}>Seva Programs</h3>
              <p className="font-sans text-sm mt-1" style={{ color: "#8A8078" }}>Community care & charitable outreach.</p>
            </div>
          </Card>

          <Card testid="activity-education">
            <Icon><BookOpen size={26} strokeWidth={1.5} /></Icon>
            <div>
              <h3 className="font-serif text-2xl" style={{ color: "var(--text-inverse)" }}>Scriptural Study</h3>
              <p className="font-sans text-sm mt-1" style={{ color: "#8A8078" }}>Classes on the wisdom of the tradition.</p>
            </div>
          </Card>
        </div>
      </Reveal>
    </div>
  </section>
);

export default Activities;
