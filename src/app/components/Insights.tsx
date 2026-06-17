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

const insights = [
  { title: "EDI Modernization Guide",          description: "A comprehensive roadmap for migrating legacy EDI to cloud-native platforms.",           category: "Guide"       },
  { title: "Integration Best Practices",       description: "Battle-tested patterns for building resilient B2B integration architectures.",          category: "Whitepaper"  },
  { title: "Applied AI in Enterprise Operations", description: "Real-world use cases for AI in supply chain, procurement, and operations.",          category: "Report"      },
  { title: "Cloud Modernization Roadmap",      description: "Step-by-step approach to migrating enterprise integrations to the cloud.",              category: "Framework"   },
];

export function Insights() {
  return (
    <section className="py-24 px-4" id="insights" style={{background:"#FFFFFF"}}>
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-normal mb-4 tracking-tight"
            style={{background:"linear-gradient(135deg, #057DCD 0%, #43B0F1 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <span style={{ background:"linear-gradient(135deg,#0B1F3A,#43B0F1)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Insights & </span>
            <span style={{ color: "#057DCD" }}>Resources</span>
          </motion.h2>
          <motion.p
            style={{color:"#4A6380",fontSize:16}}
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Learn from our experience building enterprise integrations.
          </motion.p>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          {insights.map(({ title, description, category }) => (
            <motion.div
              key={title}
              variants={staggerItem}
              className="rounded-lg p-6 cursor-pointer overflow-hidden group"
              style={{ background:"#ffffff", border:"1px solid rgba(67,176,241,0.22)" }}
              whileHover={{ y: -5, borderColor: "rgba(5,125,205,0.45)", boxShadow: "0 8px 24px rgba(5,125,205,0.08)", transition: { duration: 0.2, ease: EASE } }}>

              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-wider" style={{ color: "#057DCD" }}>
                  {category}
                </span>
              </div>

              <h3 className="text-base font-medium mb-2 transition-colors duration-200"
                style={{ color: "#0B1F3A" }}>
                {title}
              </h3>
              <p className="text-xs mb-4 leading-relaxed" style={{color:"#4A6380"}}>{description}</p>

              <div className="text-xs flex items-center gap-1 transition-colors duration-200"
                style={{ color: "#057DCD" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = B.primary600}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = B.primary500}>
                Read More
                <span className="transition-transform duration-250 group-hover:translate-x-1">→</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}