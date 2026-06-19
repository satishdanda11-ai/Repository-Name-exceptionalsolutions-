import { motion } from "motion/react";
import { Link } from "react-router";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const sections = [
  { label: "Certifications", content: "Exceptional Solutions holds [INSERT exact certification name, e.g. ISO 27001:2022], issued by [INSERT issuing body], covering [INSERT scope], valid through [INSERT expiry date]. Certificate available on request." },
  { label: "Information Security", content: "We follow defined practices for data handling, access control, encryption in transit and at rest, and a secure development lifecycle. All engagements are governed by documented security controls aligned to our certification framework." },
  { label: "Delivery Assurance", content: "Engagements are governed by clear service levels, a defined support and escalation model, and a documented business-continuity approach. [INSERT standard SLA summary — e.g. response times, escalation tiers, uptime commitments.]" },
  { label: "Company Stability", content: "Exceptional Solutions has operated since 2019 and employs 54 specialists. [INSERT any further detail the company is comfortable stating, e.g. legal entity, registrations, incorporated in.] We are not funded, not a startup — a stable, operating firm." },
  { label: "References & Documentation", content: "Client references, our security pack, certificates and a data processing agreement are available to qualified buyers on request. We prepare documentation for procurement review as a standard part of any enterprise engagement." },
];

export function TrustSecurityPage() {
  return (
    <>
      <section className="pt-40 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl space-y-6">
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>
              Trust & Security
            </motion.p>
            <motion.h1 className="text-5xl md:text-6xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}>
              Built to clear <span className="text-[#1A73E8]">enterprise due diligence.</span>
            </motion.h1>
            <motion.p className="text-lg text-[#475569] leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
              Exceptional Solutions is structured to meet the security, compliance and assurance standards enterprise buyers and their procurement teams require. This page summarises our posture; full documentation is available on request.
            </motion.p>
            <motion.div className="flex flex-wrap gap-3 pt-2"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.45 }}>
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
                <Link to="/contact" className="block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors"
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(26,115,232,0.28)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
                  Request our security documentation
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <motion.section className="py-12 px-4 border-t border-b border-[#0B1F3A]/10 bg-[#1A73E8]/[0.02]"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VIEWPORT}
        transition={{ duration: 0.5, ease: EASE }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-[#475569]">
            {["ISO 27001 / SOC 2-class Certified", "Encryption in Transit & At Rest", "Secure Development Lifecycle", "Business Continuity Plan", "Operating Since 2019", "54 Specialists"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div className="space-y-0" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {sections.map((s, i) => (
              <motion.div key={s.label} variants={staggerItem}
                className="grid md:grid-cols-12 gap-6 py-10 border-b border-[#0B1F3A]/10">
                <div className="md:col-span-1 text-xs text-[#1A73E8]/40 pt-1">0{i + 1}</div>
                <div className="md:col-span-3"><h3 className="text-base font-medium text-[#0B1F3A]">{s.label}</h3></div>
                <div className="md:col-span-8"><p className="text-sm text-[#475569] leading-relaxed">{s.content}</p></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#1A73E8]/[0.02] border-t border-b border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto max-w-3xl">
          <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            A note on placeholders
          </motion.p>
          <motion.p className="text-sm text-[#475569] leading-relaxed"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Where specific certification details appear in brackets above, those values are pending internal confirmation and will be updated before launch. Where certification is in progress, that will be stated honestly — an in-progress statement is still reassuring; a false claim is disqualifying. Enterprise procurement teams verify every claim.
          </motion.p>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.h2 className="text-4xl font-normal text-[#0B1F3A] tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Ready to complete <span className="text-[#1A73E8]">your vendor review?</span>
          </motion.h2>
          <motion.p className="text-base text-[#475569] max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Request our full security pack — certificates, data processing agreement, and supporting documentation — prepared for enterprise procurement review.
          </motion.p>
          <motion.div variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact" className="inline-block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors"
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(26,115,232,0.28)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
              Request our security documentation
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}