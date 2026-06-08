import { motion } from "motion/react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const reasons = [
  {
    title: "Focused, not Generalist",
    description: "We specialize in enterprise integration and the technologies that surround it. Deep expertise, not shallow breadth.",
    stats: "100% of our work is in integration, data, and cloud",
  },
  {
    title: "Senior-Led, No Lock-In",
    description: "Every engagement is led by senior architects and engineers. We transfer knowledge, not create dependency.",
    stats: "Average 12+ years experience per team member",
  },
  {
    title: "Challenger Speed, Enterprise Rigour",
    description: "We move fast without cutting corners. Enterprise quality at startup velocity.",
    stats: "50% faster delivery than traditional consultancies",
  },
];

export function WhyExceptional() {
  return (
    <section className="py-24 px-4 bg-black/[0.02]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-normal text-black mb-4 tracking-tight"
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            Why Enterprises Choose Exceptional Solutions
          </motion.h2>
          <motion.p
            className="text-base text-black/60"
            variants={fadeUpLarge}
            custom={0.1}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            We're built differently. No offshore teams, no junior consultants, no vendor lock-in.
          </motion.p>
        </div>

        <motion.div
          className="grid md:grid-cols-3 gap-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {reasons.map(({ title, description, stats }) => (
            <motion.div
              key={title}
              variants={staggerItem}
              className="text-center space-y-4 group"
            >
              <div>
                <h3 className="text-xl font-medium text-black mb-3 group-hover:text-black/80 transition-colors duration-200">
                  {title}
                </h3>
                <p className="text-sm text-black/60 leading-relaxed">{description}</p>
              </div>
              <div className="pt-4 border-t border-black/10">
                <p className="text-xs text-black/40">{stats}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
