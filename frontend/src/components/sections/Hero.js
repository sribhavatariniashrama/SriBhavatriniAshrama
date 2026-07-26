import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { KineticLines } from "../motion";
import { ArrowDown } from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1566915682737-3e97a7eed93b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjB0ZW1wbGUlMjBhcmNoaXRlY3R1cmV8ZW58MHx8fHwxNzg0OTg1Njk5fDA&ixlib=rb-4.1.0&q=85";

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  return (
    <section ref={ref} data-testid="hero" className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 overflow-hidden"
      style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full grid lg:grid-cols-12 gap-10 items-center">
        <motion.div style={{ y: textY }} className="lg:col-span-7 relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="label-eyebrow mb-6 flex items-center gap-3">
            <span className="inline-block w-10 h-px" style={{ background: "var(--accent-saffron)" }} />
            Divine Mother Tradition · Bengaluru
          </motion.div>
          <h1 className="font-serif font-500 tracking-tighter leading-[0.88] text-[15vw] lg:text-[8.5vw]"
            style={{ color: "var(--text-primary)" }}>
            <KineticLines lines={["Sri", "Bhavatarini"]} delay={0.3} />
            <span className="block italic" style={{ color: "var(--accent-saffron)" }}>
              <KineticLines lines={["Ashrama"]} delay={0.6} />
            </span>
          </h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-8 max-w-md font-sans text-base md:text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            A serene sanctuary where ancient devotion meets stillness — a home for
            seekers walking the path of the Divine Mother.
          </motion.p>
        </motion.div>

        <div className="lg:col-span-5 relative">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden mx-auto"
            style={{ borderTopLeftRadius: "50%", borderTopRightRadius: "50%", height: "68vh", maxHeight: 620 }}>
            <motion.img src={HERO_IMG} alt="Temple architecture" style={{ y: imgY, scale }}
              className="w-full h-[120%] object-cover" />
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        className="max-w-[1400px] mx-auto px-6 md:px-10 w-full mt-10 flex items-center gap-3 label-eyebrow">
        <ArrowDown size={16} strokeWidth={1.5} className="animate-bounce" /> Scroll to explore
      </motion.div>
    </section>
  );
};

export default Hero;
