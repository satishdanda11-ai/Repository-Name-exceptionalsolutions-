import { motion } from "motion/react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const B = {
  primary50:  "#E0EFF9",
  primary100: "#C9EBFC",
  primary400: "#6BC3F5",
  primary500: "#43B0F1",
  primary600: "#2A9DE0",
  navy500:    "#0B1F3A",
};

const insights = [
  { title: "EDI Modernization Guide",          description: "A comprehensive roadmap for migrating legacy EDI to cloud-native platforms.",           category: "Guide"       },
  { title: "Integration Best Practices",       description: "Battle-tested patterns for building resilient B2B integration architectures.",          category: "Whitepaper"  },
  { title: "Applied AI in Enterprise Operations", description: "Real-world use cases for AI in supply chain, procurement, and operations.",          category: "Report"      },
  { title: "Cloud Modernization Roadmap",      description: "Step-by-step approach to migrating enterprise integrations to the cloud.",              category: "Framework"   },
];

export function Insights() {
  return (
    <section className="py-24 px-4" id="insights">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-normal mb-4 tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <span style={{ color: B.navy500 }}>Insights & </span>
            <span style={{ color: B.primary500 }}>Resources</span>
          </motion.h2>
          <motion.p
            className="text-base text-black/60"
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
              className="bg-white rounded-lg p-6 cursor-pointer overflow-hidden group"
              style={{ border: `1px solid ${B.primary100}` }}
              whileHover={{ y: -5, borderColor: B.primary300, boxShadow: `0 8px 28px rgba(26,115,232,0.10)`, transition: { duration: 0.2, ease: EASE } }}>

              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-wider" style={{ color: B.primary500 }}>
                  {category}
                </span>
              </div>

              <h3 className="text-base font-medium mb-2 transition-colors duration-200"
                style={{ color: B.navy500 }}>
                {title}
              </h3>
              <p className="text-xs text-black/60 mb-4 leading-relaxed">{description}</p>

              <div className="text-xs flex items-center gap-1 transition-colors duration-200"
                style={{ color: B.primary500 }}
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