import { motion } from "motion/react";
import { useState } from "react";
import { Target, UserCheck, Zap } from "lucide-react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const reasons = [
  { icon: Target,    number: "01", title: "Depth Over Breadth",                    description: "We do one thing exceptionally well: enterprise integration. Deep specialists, proven at scale.",        stat: "100%",    statLabel: "of our work is in integration, data, and cloud" },
  { icon: UserCheck, number: "02", title: "Built for Partnership, Not Dependency", description: "Seasoned practitioners design solutions that your team can own. Expert-led from day one.",             stat: "18+ yrs", statLabel: "avg. team experience" },
  { icon: Zap,       number: "03", title: "Startup Agility. Enterprise Reliability.", description: "Faster delivery and stronger governance backed by enterprise-grade discipline.",                     stat: "50%",     statLabel: "faster delivery than traditional consultancies" },
];

function ReasonCard({ icon: Icon, number, title, description, stat, statLabel }: typeof reasons[0]) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      variants={staggerItem}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#1A73E8" : "#fff",
        border: `1px solid ${hov ? "#1A73E8" : "rgba(11,31,58,0.1)"}`,
        borderRadius: 10, padding: "32px 28px", display: "flex", flexDirection: "column", gap: 0,
        cursor: "default", position: "relative", overflow: "hidden",
        transition: "background .28s ease, border-color .28s ease, box-shadow .28s ease",
        boxShadow: hov ? "0 16px 40px rgba(11,31,58,0.22)" : "none",
      }}
      whileHover={{ y: -5, transition: { duration: 0.2, ease: EASE } }}>

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#1A73E8", opacity: hov ? 1 : 0, transition: "opacity .28s", borderRadius: "10px 10px 0 0" }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: hov ? "rgba(255,255,255,0.35)" : "rgba(11,31,58,0.25)", letterSpacing: ".12em", transition: "color .22s" }}>{number}</span>
        <div style={{ width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: hov ? "rgba(255,255,255,0.1)" : "rgba(26,115,232,0.08)", border: `1px solid ${hov ? "rgba(255,255,255,0.15)" : "rgba(26,115,232,0.15)"}`, transition: "background .25s, border-color .25s" }}>
          <Icon size={18} strokeWidth={1.75} color={hov ? "#fff" : "#1A73E8"} />
        </div>
      </div>

      <div style={{ flex: 1, marginBottom: 24 }}>
        <h3 style={{ fontSize: 17, fontWeight: 500, color: hov ? "#fff" : "#0B1F3A", marginBottom: 10, lineHeight: 1.3, transition: "color .22s" }}>{title}</h3>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: hov ? "rgba(255,255,255,0.55)" : "rgba(71,85,105,0.95)", margin: 0, transition: "color .22s" }}>{description}</p>
      </div>

      <div style={{ borderTop: `1px solid ${hov ? "rgba(255,255,255,0.1)" : "rgba(11,31,58,0.08)"}`, paddingTop: 20, transition: "border-color .22s" }}>
        <div style={{ fontSize: 24, fontWeight: 300, color: hov ? "#fff" : "#1A73E8", lineHeight: 1, marginBottom: 4, transition: "color .22s", fontVariantNumeric: "tabular-nums" }}>{stat}</div>
        <div style={{ fontSize: 11, color: hov ? "rgba(255,255,255,0.4)" : "rgba(11,31,58,0.4)", lineHeight: 1.5, transition: "color .22s" }}>{statLabel}</div>
      </div>
    </motion.div>
  );
}

export function WhyExceptional() {
  return (
    <section className="py-24 px-4 bg-[#1A73E8]/[0.02]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <motion.p className="text-xs text-[#1A73E8] uppercase tracking-widest mb-4"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Why Choose Us
          </motion.p>
          <motion.h2 className="text-4xl md:text-5xl font-normal text-[#0B1F3A] mb-4 tracking-tight"
            variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Why enterprises choose <span className="text-[#1A73E8]">Exceptional Solutions?</span>
          </motion.h2>
          <motion.p className="text-base text-[#475569]"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            We're built differently. No offshore teams, no junior consultants, no vendor lock-in.
          </motion.p>
        </div>
        <motion.div className="grid md:grid-cols-3 gap-6"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          {reasons.map(r => <ReasonCard key={r.title} {...r} />)}
        </motion.div>
      </div>
    </section>
  );
}