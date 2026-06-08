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
            <motion.p className="text-xs text-black/40 uppercase tracking-wide"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>
              Partnerships
            </motion.p>
            <motion.h1 className="text-5xl md:text-6xl font-normal text-black leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}>
              Certified expertise across the platforms enterprises rely on.
            </motion.h1>
            <motion.p className="text-lg text-black/60 leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
              Our technology partnerships mean certified depth on the platforms you already use, and independent advice on the ones you don't.
            </motion.p>
          </div>
        </div>
      </section>

      <motion.section className="py-16 px-4 border-t border-b border-black/10 bg-black/[0.02]"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VIEWPORT}
        transition={{ duration: 0.5, ease: EASE }}>
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-base text-black leading-relaxed">
              Our partnerships give you breadth and certified depth. They never lock you in: we remain vendor-neutral, and recommend only what is right for your business. We work across all six major platforms because we modernise your stack — we don't sell you ours.
            </p>
          </div>
        </div>
      </motion.section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Our Technology Partnerships
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Six enterprise platforms. Hands-on, certified depth.
            </motion.h2>
            <motion.p className="mt-4 text-sm text-black/40"
              variants={fadeUp} custom={0.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              We hold partnerships with [INSERT confirmed partners and tiers]. For each, our teams hold current certifications and hands-on delivery experience.
            </motion.p>
          </div>
          <motion.div className="grid md:grid-cols-2 gap-6"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {platforms.map((p) => (
              <motion.div key={p.name} variants={staggerItem}
                className="border border-black/10 rounded-lg p-8 bg-white space-y-3 hover:border-black/20 transition-colors"
                whileHover={{ y: -4, transition: { duration: 0.2, ease: EASE } }}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-black/20" />
                  <h3 className="text-base font-medium text-black">{p.name}</h3>
                </div>
                <p className="text-sm text-black/60 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-black/[0.02] border-t border-b border-black/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Standards & Protocols
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight mb-6"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Supporting the standards enterprise trading demands.
            </motion.h2>
            <motion.p className="text-base text-black/60 leading-relaxed"
              variants={fadeUpLarge} custom={0.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Our specialists are fluent in the EDI standards and communication protocols that enterprise trading partners require — including ANSI X12, EDIFACT, AS2, and API-led integration.
            </motion.p>
          </div>
          <motion.div className="space-y-3"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {["ANSI X12", "EDIFACT", "AS2", "SFTP / FTPS", "REST & SOAP APIs", "JSON / XML mapping", "VAN connectivity"].map((s) => (
              <motion.div key={s} variants={staggerItem}
                className="border border-black/10 rounded-md px-5 py-3 bg-white flex items-center gap-3 hover:border-black/20 transition-colors"
                whileHover={{ x: 4, transition: { duration: 0.15, ease: EASE } }}>
                <div className="w-1.5 h-1.5 rounded-full bg-black/20 flex-shrink-0" />
                <span className="text-sm text-black">{s}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.h2 className="text-4xl font-normal text-black tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Already on one of our platforms?
          </motion.h2>
          <motion.p className="text-base text-black/60 max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Talk to us about your platform — whether you are already on it or evaluating it. We advise on what is right for your business, not what suits us.
          </motion.p>
          <motion.div variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact" className="inline-block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors">
              Talk to us about your platform
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
