import { motion } from "motion/react";
import { Link } from "react-router";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const platforms = [
  { name: "IBM Sterling", desc: "Deep delivery experience across IBM Sterling B2B Integrator and IBM Sterling File Gateway — the backbone of many enterprise EDI estates." },
  { name: "Cleo", desc: "Certified expertise in Cleo's integration cloud platform — a benchmark for modern EDI and B2B integration." },
  { name: "MuleSoft", desc: "Hands-on capability across MuleSoft Anypoint Platform — connection as a design principle." },
  { name: "Boomi", desc: "Certified delivery on Dell Boomi — a clean, outcome-led integration platform for enterprise scale." },
  { name: "Apigee", desc: "API management and integration expertise on Google Apigee — for API-led integration architectures." },
  { name: "Axway B2Bi", desc: "Specialist delivery experience on Axway B2Bi — a tier-one platform for global trading-partner integration." },
];

export function PartnershipsPage() {
  return (
    <>
      <section className="pt-40 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl space-y-6">
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>
              Partnerships
            </motion.p>
            <motion.h1 className="text-5xl md:text-6xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}>
              Certified expertise across <span className="text-[#1A73E8]">the platforms enterprises rely on.</span>
            </motion.h1>
            <motion.p className="text-lg text-[#475569] leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
              Our technology partnerships mean certified depth on the platforms you already use, and independent advice on the ones you don't.
            </motion.p>
          </div>
        </div>
      </section>

      <motion.section className="py-16 px-4 border-t border-b border-[#0B1F3A]/10 bg-[#1A73E8]/[0.02]"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VIEWPORT}
        transition={{ duration: 0.5, ease: EASE }}>
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-base text-[#334155] leading-relaxed">
              Our partnerships give you breadth and certified depth. They never lock you in: we remain vendor-neutral, and recommend only what is right for your business. We work across all six major platforms because we modernise your stack — we don't sell you ours.
            </p>
          </div>
        </div>
      </motion.section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Our Technology Partnerships
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Six enterprise platforms. <span className="text-[#1A73E8]">Hands-on, certified depth.</span>
            </motion.h2>
            <motion.p className="mt-4 text-sm text-[#0B1F3A]/40"
              variants={fadeUp} custom={0.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              We hold partnerships with [INSERT confirmed partners and tiers]. For each, our teams hold current certifications and hands-on delivery experience.
            </motion.p>
          </div>
          <motion.div className="grid md:grid-cols-2 gap-6"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {platforms.map((p) => (
              <motion.div key={p.name} variants={staggerItem}
                className="border border-[#0B1F3A]/10 rounded-lg p-8 bg-white space-y-3 hover:border-[#1A73E8]/30 transition-colors"
                whileHover={{ y: -4, transition: { duration: 0.2, ease: EASE } }}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#1A73E8]" />
                  <h3 className="text-base font-medium text-[#0B1F3A]">{p.name}</h3>
                </div>
                <p className="text-sm text-[#475569] leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-[#1A73E8]/[0.02] border-t border-b border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Standards & Protocols
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-[#0B1F3A] leading-tight tracking-tight mb-6"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Supporting the standards <span className="text-[#1A73E8]">enterprise trading demands.</span>
            </motion.h2>
            <motion.p className="text-base text-[#475569] leading-relaxed"
              variants={fadeUpLarge} custom={0.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Our specialists are fluent in the EDI standards and communication protocols that enterprise trading partners require — including ANSI X12, EDIFACT, AS2, and API-led integration.
            </motion.p>
          </div>
          <motion.div className="space-y-3"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {["ANSI X12", "EDIFACT", "AS2", "SFTP / FTPS", "REST & SOAP APIs", "JSON / XML mapping", "VAN connectivity"].map((s) => (
              <motion.div key={s} variants={staggerItem}
                className="border border-[#0B1F3A]/10 rounded-md px-5 py-3 bg-white flex items-center gap-3 hover:border-[#1A73E8]/30 transition-colors"
                whileHover={{ x: 4, transition: { duration: 0.15, ease: EASE } }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] flex-shrink-0" />
                <span className="text-sm text-[#0B1F3A]">{s}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.h2 className="text-4xl font-normal text-[#0B1F3A] tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Already on <span className="text-[#1A73E8]">one of our platforms?</span>
          </motion.h2>
          <motion.p className="text-base text-[#475569] max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Talk to us about your platform — whether you are already on it or evaluating it. We advise on what is right for your business, not what suits us.
          </motion.p>
          <motion.div variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact" className="inline-block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors"
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(26,115,232,0.28)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
              Talk to us about your platform
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}