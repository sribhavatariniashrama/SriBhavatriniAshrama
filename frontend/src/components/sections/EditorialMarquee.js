import Marquee from "react-fast-marquee";

const WORDS = ["Divine Mother", "Spiritual Awakening", "Seva", "Satsang", "Dhyana", "Bhakti"];

const EditorialMarquee = () => (
  <div data-testid="marquee" className="py-8 border-y" style={{ background: "var(--bg-maroon)", borderColor: "var(--border-dark)" }}>
    <Marquee speed={38} gradient={false} autoFill>
      {WORDS.map((w, i) => (
        <span key={i} className="mx-8 font-serif italic text-4xl md:text-6xl" style={{ color: "var(--text-inverse)" }}>
          {w}
          <span className="mx-8" style={{ color: "var(--accent-saffron)" }}>✦</span>
        </span>
      ))}
    </Marquee>
  </div>
);

export default EditorialMarquee;
