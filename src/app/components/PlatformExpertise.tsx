import { motion } from "motion/react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const B = {
  primary50:  "#E8F3FE",
  primary100: "#D6E7FD",
  primary200: "#A1CFFB",
  primary500: "#1A73E8",
  navy500:    "#0B1F3A",
  slate400:   "#94A3B8",
};

const platforms = ["IBM Sterling", "Cleo", "MuleSoft", "Boomi", "Apigee", "Axway B2Bi"];
const standards = ["ANSI X12", "EDIFACT", "AS2", "API Integration"];

export function PlatformExpertise() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-normal mb-4 tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <span style={{ color: B.navy500 }}>Deep Expertise Across Every</span>
            <br />
            <span style={{ color: B.primary500 }}>Major Integration Platform</span>
          </motion.h2>
          <motion.p
            className="text-base text-black/60"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            We're platform-agnostic experts. Whatever technology you use, we've mastered it.
          </motion.p>
        </div>

        <motion.div
          className="bg-white rounded-lg p-8"
          style={{ border: `1px solid ${B.primary100}`, boxShadow: `0 4px 24px rgba(26,115,232,0.06)` }}
          variants={fadeUp} custom={0.15} initial="hidden" whileInView="visible" viewport={VIEWPORT}>

          {/* Platforms */}
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-wide mb-6 text-center" style={{ color: B.primary500 }}>
              Integration Platforms
            </h3>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              {platforms.map((platform) => (
                <motion.div
                  key={platform}
                  variants={staggerItem}
                  className="text-center"
                  whileHover={{ scale: 1.04, transition: { duration: 0.18, ease: EASE } }}>
                  <div className="rounded-md p-4 cursor-default transition-colors"
                    style={{ background: B.primary50, border: `1px solid ${B.primary100}` }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = B.primary100;
                      (e.currentTarget as HTMLElement).style.borderColor = B.primary200;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = B.primary50;
                      (e.currentTarget as HTMLElement).style.borderColor = B.primary100;
                    }}>
                    <div className="text-xs font-medium" style={{ color: B.navy500 }}>{platform}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Standards */}
          <div className="pt-10" style={{ borderTop: `1px solid ${B.primary100}` }}>
            <h3 className="text-xs uppercase tracking-wide mb-6 text-center" style={{ color: B.primary500 }}>
              Integration Standards
            </h3>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              {standards.map((standard) => (
                <motion.div key={standard} variants={staggerItem} className="text-center">
                  <div className="rounded-md p-4" style={{ background: B.primary50, border: `1px solid ${B.primary100}` }}>
                    <div className="text-xs font-medium" style={{ color: B.navy500 }}>{standard}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}