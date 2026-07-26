import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Reveal } from "../motion";
import { ArrowUpRight } from "lucide-react";

const parseDate = (d) => {
  const dt = new Date(d);
  if (isNaN(dt)) return { day: "--", month: "", year: "" };
  return {
    day: String(dt.getDate()).padStart(2, "0"),
    month: dt.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    year: dt.getFullYear(),
  };
};

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/events").then(({ data }) => setEvents(data)).catch(() => setEvents([]));
  }, []);

  return (
    <section id="events" data-testid="events" className="py-28 md:py-40" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <Reveal>
          <div className="label-eyebrow mb-6">Events</div>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tighter" style={{ color: "var(--text-primary)" }}>
            Gatherings & <span className="italic" style={{ color: "var(--accent-saffron)" }}>festivals.</span>
          </h2>
        </Reveal>

        <div className="mt-16">
          {events.length === 0 && (
            <p data-testid="events-empty" className="font-sans text-lg" style={{ color: "var(--text-secondary)" }}>
              New events will be announced soon. Please check back.
            </p>
          )}
          {events.map((e, i) => {
            const d = parseDate(e.date);
            return (
              <Reveal key={e.id} delay={i * 0.04}>
                <div data-testid={`event-${e.id}`}
                  className="group grid grid-cols-12 gap-4 md:gap-8 items-center py-8 border-t transition-colors duration-300 hover:bg-[var(--bg-secondary)]"
                  style={{ borderColor: "var(--border-light)" }}>
                  <div className="col-span-3 md:col-span-2 text-center">
                    <div className="font-serif text-5xl md:text-6xl leading-none" style={{ color: "var(--accent-saffron)" }}>{d.day}</div>
                    <div className="label-eyebrow mt-1" style={{ color: "var(--text-secondary)" }}>{d.month} {d.year}</div>
                  </div>
                  <div className="col-span-7 md:col-span-8">
                    <h3 className="font-serif text-2xl md:text-4xl" style={{ color: "var(--text-primary)" }}>{e.title}</h3>
                    <p className="font-sans text-sm md:text-base mt-1" style={{ color: "var(--text-secondary)" }}>
                      {e.description}
                    </p>
                    <p className="font-sans text-xs mt-2 label-eyebrow" style={{ color: "var(--text-secondary)" }}>
                      {[e.time, e.location].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <ArrowUpRight strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      style={{ color: "var(--accent-saffron)" }} />
                  </div>
                </div>
              </Reveal>
            );
          })}
          {events.length > 0 && <div className="border-t" style={{ borderColor: "var(--border-light)" }} />}
        </div>
      </div>
    </section>
  );
};

export default Events;
