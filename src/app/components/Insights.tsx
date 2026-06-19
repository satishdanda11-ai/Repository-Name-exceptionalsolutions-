import { motion } from "motion/react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const insights = [
  { title: "EDI Modernization Guide", description: "A comprehensive roadmap for migrating legacy EDI to cloud-native platforms.", category: "Guide" },
  { title: "Integration Best Practices", description: "Battle-tested patterns for building resilient B2B integration architectures.", category: "Whitepaper" },
  { title: "Applied AI in Enterprise Operations", description: "Real-world use cases for AI in supply chain, procurement, and operations.", category: "Report" },
  { title: "Cloud Modernization Roadmap", description: "Step-by-step approach to migrating enterprise integrations to the cloud.", category: "Framework" },
];

export function Insights() {
  return (
    <section className="py-24 px-4" id="insights">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2 className="text-4xl md:text-5xl font-normal text-[#0B1F3A] mb-4 tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Insights & <span className="text-[#1A73E8]">Resources</span>
          </motion.h2>
          <motion.p className="text-base text-[#475569]"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Learn from our experience building enterprise integrations.
          </motion.p>
        </div>

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          {insights.map(({ title, description, category }) => (
            <motion.div key={title} variants={staggerItem}
              className="bg-white border border-[#0B1F3A]/10 rounded-lg p-6 cursor-pointer overflow-hidden group hover:border-[#1A73E8]/30 transition-colors"
              whileHover={{ y: -5, transition: { duration: 0.2, ease: EASE } }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase tracking-wider text-[#1A73E8]">{category}</span>
              </div>
              <h3 className="text-base font-medium text-[#0B1F3A] mb-2 group-hover:text-[#1A73E8] transition-colors duration-200">{title}</h3>
              <p className="text-xs text-[#475569] mb-4 leading-relaxed">{description}</p>
              <div className="text-xs text-[#1A73E8] group-hover:text-[#155CC0] transition-colors duration-200 flex items-center gap-1">
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