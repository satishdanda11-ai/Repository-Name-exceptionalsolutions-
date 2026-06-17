import { motion } from "motion/react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const B = {
  grad:      "linear-gradient(135deg, #057DCD 0%, #43B0F1 100%)",
  primary:   "#057DCD",
  accent:    "#057DCD",
  navy:      "#0B1F3A",
  slate400:  "#94A3B8",
  slate500:  "#64748B",
  success:   "#10B981",
  error:     "#EF4444",
  warning:   "#F59E0B",
  white:     "#ffffff",
};

const platforms = ["IBM Sterling", "Cleo", "MuleSoft", "Boomi", "Apigee", "Axway B2Bi"];
const standards = ["ANSI X12", "EDIFACT", "AS2", "API Integration"];

export function PlatformExpertise() {
  return (
    <section className="py-24 px-4" style={{background:"#FFFFFF"}}>
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-normal mb-4 tracking-tight"
            style={{background:"linear-gradient(135deg, #057DCD 0%, #43B0F1 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <span style={{ background:"linear-gradient(135deg,#0B1F3A,#43B0F1)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Deep Expertise Across Every</span>
            <br />
            <span style={{ color: "#057DCD" }}>Major Integration Platform</span>
          </motion.h2>
          <motion.p
            style={{color:"#4A6380",fontSize:16}}
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            We're platform-agnostic experts. Whatever technology you use, we've mastered it.
          </motion.p>
        </div>

        <motion.div
          className="rounded-lg p-8"
          style={{ background:"#ffffff", border:"1px solid rgba(67,176,241,0.22)", boxShadow:"0 4px 24px rgba(67,176,241,0.1)" }}
          variants={fadeUp} custom={0.15} initial="hidden" whileInView="visible" viewport={VIEWPORT}>

          {/* Platforms */}
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-wide mb-6 text-center" style={{ color: "#057DCD" }}>
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
                    style={{ background: "rgba(67,176,241,0.06)", border: "1px solid rgba(67,176,241,0.22)" }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(67,176,241,0.1)";
                      (e.currentTarget as HTMLElement).style.borderColor = "#90BFFF";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(67,176,241,0.06)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(67,176,241,0.1)";
                    }}>
                    <div className="text-xs font-medium" style={{ color: "#0B1F3A" }}>{platform}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Standards */}
          <div className="pt-10" style={{ borderTop: "1px solid rgba(67,176,241,0.15)" }}>
            <h3 className="text-xs uppercase tracking-wide mb-6 text-center" style={{ color: "#057DCD" }}>
              Integration Standards
            </h3>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              {standards.map((standard) => (
                <motion.div key={standard} variants={staggerItem} className="text-center">
                  <div className="rounded-md p-4" style={{ background: "rgba(67,176,241,0.06)", border: "1px solid rgba(67,176,241,0.22)" }}>
                    <div className="text-xs font-medium" style={{ color: "#0B1F3A" }}>{standard}</div>
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