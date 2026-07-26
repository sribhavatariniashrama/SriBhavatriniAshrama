import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, y = 30, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

// Masked line-by-line reveal for headings. `lines` = array of strings.
export const KineticLines = ({ lines, className = "", delay = 0 }) => (
  <span className={className}>
    {lines.map((line, i) => (
      <span className="line-mask" key={i}>
        <motion.span
          style={{ display: "block" }}
          initial={{ y: "110%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 1, delay: delay + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          {line}
        </motion.span>
      </span>
    ))}
  </span>
);
