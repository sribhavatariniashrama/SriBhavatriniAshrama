import { Reveal } from "../motion";
import { Clock, Sunrise, Sunset } from "lucide-react";

const MAP_SRC =
  "https://www.google.com/maps?q=282,+12th+Cross,+Saraswatinagar,+Vijayanagar,+Bengaluru+560040&z=17&output=embed";

const VisitUs = () => (
  <section id="visit" data-testid="visit" className="py-28 md:py-40" style={{ background: "var(--bg-secondary)" }}>
    <div className="max-w-[1400px] mx-auto px-6 md:px-10">
      <Reveal>
        <div className="label-eyebrow mb-6">Visit Us</div>
        <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tighter" style={{ color: "var(--text-primary)" }}>
          Find your way to <span className="italic" style={{ color: "var(--accent-saffron)" }}>the ashrama.</span>
        </h2>
      </Reveal>

      <div className="mt-14 grid lg:grid-cols-3 gap-6 items-stretch">
        <Reveal className="lg:col-span-2">
          <div className="h-full overflow-hidden border" style={{ borderColor: "var(--border-light)", minHeight: 420 }}>
            <iframe title="Sri Bhavatarini Ashrama location" data-testid="visit-map" width="100%" height="100%"
              style={{ border: 0, minHeight: 420, display: "block", filter: "grayscale(0.15)" }}
              loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={MAP_SRC} />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div data-testid="visit-hours" className="h-full p-9 flex flex-col justify-center"
            style={{ background: "var(--bg-maroon)", color: "var(--text-inverse)" }}>
            <div className="flex items-center gap-3 mb-8">
              <Clock strokeWidth={1.5} style={{ color: "var(--accent-saffron)" }} />
              <h3 className="font-serif text-3xl">Darshan Hours</h3>
            </div>
            <p className="label-eyebrow mb-6" style={{ color: "#E8DAD2" }}>Monday — Sunday · Open all week</p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 pb-6" style={{ borderBottom: "1px solid var(--border-dark)" }}>
                <Sunrise strokeWidth={1.5} className="mt-1" style={{ color: "var(--accent-saffron)" }} />
                <div>
                  <div className="label-eyebrow" style={{ color: "#C9BEB2" }}>Morning</div>
                  <div className="font-serif text-2xl md:text-3xl">6:00 AM — 12:00 Noon</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Sunset strokeWidth={1.5} className="mt-1" style={{ color: "var(--accent-saffron)" }} />
                <div>
                  <div className="label-eyebrow" style={{ color: "#C9BEB2" }}>Evening</div>
                  <div className="font-serif text-2xl md:text-3xl">5:00 PM — 8:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default VisitUs;
