import { motion } from "motion/react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const platforms = ["IBM Sterling", "Cleo", "MuleSoft", "Boomi", "Apigee", "Axway B2Bi"];
const standards = ["ANSI X12", "EDIFACT", "AS2", "API Integration"];

export function PlatformExpertise() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2 className="text-4xl md:text-5xl font-normal text-[#0B1F3A] mb-4 tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Deep Expertise Across <span className="text-[#1A73E8]">Every Major Integration Platform</span>
          </motion.h2>
          <motion.p className="text-base text-[#475569]"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            We're platform-agnostic experts. Whatever technology you use, we've mastered it.
          </motion.p>
        </div>

        <motion.div className="bg-white border border-[#0B1F3A]/10 rounded-lg p-8"
          variants={fadeUp} custom={0.15} initial="hidden" whileInView="visible" viewport={VIEWPORT}>

          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-wide text-[#1A73E8] mb-6 text-center">Integration Platforms</h3>
            <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              {platforms.map((platform) => (
                <motion.div key={platform} variants={staggerItem} className="text-center"
                  whileHover={{ scale: 1.04, transition: { duration: 0.18, ease: EASE } }}>
                  <div className="bg-[#1A73E8]/5 border border-[#1A73E8]/10 rounded-md p-4 hover:bg-[#1A73E8]/[0.1] hover:border-[#1A73E8]/30 transition-colors cursor-default">
                    <div className="text-xs font-medium text-[#0B1F3A]">{platform}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="pt-10 border-t border-[#0B1F3A]/10">
            <h3 className="text-xs uppercase tracking-wide text-[#1A73E8] mb-6 text-center">Integration Standards</h3>
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4"
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              {standards.map((standard) => (
                <motion.div key={standard} variants={staggerItem} className="text-center">
                  <div className="bg-[#1A73E8]/5 border border-[#1A73E8]/10 rounded-md p-4">
                    <div className="text-xs font-medium text-[#0B1F3A]">{standard}</div>
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