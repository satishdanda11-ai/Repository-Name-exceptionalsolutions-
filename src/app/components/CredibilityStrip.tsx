import { motion } from "motion/react";
import { EASE, VIEWPORT, fadeIn } from "../lib/animations";

const items = [
  "IBM Sterling",
  "Cleo",
  "MuleSoft",
  "Boomi",
  "Apigee",
  "Axway B2Bi",
  "ISO 27001",
  "SOC 2-class Certified",
  "54 Specialists",
  "Operating Since 2019",
];

export function CredibilityStrip() {
  // Duplicate for seamless infinite loop
  const doubled = [...items, ...items];

  return (
    <motion.section
      className="py-10 border-y border-black/10 overflow-hidden relative"
      variants={fadeIn}
      custom={0}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {/* Gradient masks — left and right fade */}
      <div
        className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, white, transparent)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, white, transparent)" }}
      />

      {/* Marquee track */}
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 mx-6 text-sm text-black/40 flex-shrink-0"
          >
            <span className="w-1 h-1 rounded-full bg-black/20 flex-shrink-0" />
            {item}
          </div>
        ))}
      </div>
    </motion.section>
  );
}
