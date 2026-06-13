import { motion } from "motion/react";
import { Link } from "react-router";
import { useState } from "react";
import { BrainCircuit, BarChart3, Cloud, Code2 } from "lucide-react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const capabilities = [
  {
    icon: BrainCircuit,
    title: "AI & Automation",
    description: "Enterprise AI built for execution",
    details: "Automation, document intelligence, and AI-powered operations — grounded in connected data",
    path: "/services/ai-solutions",
  },
  {
    icon: BarChart3,
    title: "Data & Analytics",
    description: "Turn connected data into decisions.",
    details: "Analytics, reporting, and data quality that give leaders a single, trusted view of the business.",
    path: "/services/data-analytics",
  },
  {
    icon: Cloud,
    title: "Cloud Services",
    description: "Cloud built for scale and reliability.",
    details: "Migrate and modernise on cloud foundations built to scale with your integration estate.",
    path: "/services/cloud-services",
  },
  {
    icon: Code2,
    title: "Digital Engineering",
    description: "Senior engineers building modern connected systems",
    details: "Custom applications and system modernization for the enterprise",
    path: "/services/digital-engineering",
  },
];

function CapCard({ icon: Icon, title, description, details, path }: typeof capabilities[0]) {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      variants={staggerItem}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#191919" : "#fff",
        border: `1px solid ${hov ? "#111827" : "rgba(0,0,0,0.1)"}`,
        borderRadius: 10,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "background .28s ease, border-color .28s ease, box-shadow .28s ease",
        boxShadow: hov ? "0 16px 40px rgba(0,0,0,0.18)" : "none",
      }}
      whileHover={{ y: -5, transition: { duration: 0.2, ease: EASE } }}>

      {/* top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "#111827",
        opacity: hov ? 1 : 0,
        transition: "opacity .28s ease",
        borderRadius: "10px 10px 0 0",
      }} />

      {/* icon box */}
      <div style={{
        width: 44, height: 44, borderRadius: 10, marginBottom: 18,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: hov ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
        border: `1px solid ${hov ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)"}`,
        transition: "background .25s ease, border-color .25s ease",
        flexShrink: 0,
      }}>
        <Icon size={20} strokeWidth={1.75} color={hov ? "#fff" : "#111827"} style={{ transition: "color .2s" }} />
      </div>

      {/* content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, color: hov ? "#fff" : "#111827", margin: 0, transition: "color .22s" }}>
          {title}
        </h3>
        <p style={{ fontSize: 13, color: hov ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.55)", margin: 0, lineHeight: 1.55, transition: "color .22s" }}>
          {description}
        </p>
        <p style={{ fontSize: 12, color: hov ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)", margin: 0, lineHeight: 1.65, transition: "color .22s" }}>
          {details}
        </p>
      </div>

      {/* learn more */}
      <div style={{ paddingTop: 20, marginTop: "auto" }}>
        <Link to={path} style={{
          fontSize: 12, color: hov ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
          textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4,
          transition: "color .2s",
        }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = hov ? "#fff" : "#111"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = hov ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"}>
          Learn more
          <motion.span animate={{ x: hov ? 4 : 0 }} transition={{ duration: .18 }}>→</motion.span>
        </Link>
      </div>
    </motion.div>
  );
}

export function SupportingCapabilities() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">

        {/* header */}
        <div className="text-center mb-6 max-w-3xl mx-auto">
          <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Supporting Capabilities
          </motion.p>
          <motion.h2 className="text-4xl md:text-5xl font-normal text-black mb-4 tracking-tight"
            variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Connected data is only the beginning.
          </motion.h2>
          <motion.p className="text-base text-black/60"
            variants={fadeUpLarge} custom={0.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Here's what we help you do with it.
          </motion.p>
        </div>

        {/* cards */}
        <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          {capabilities.map(cap => <CapCard key={cap.title} {...cap} />)}
        </motion.div>
      </div>
    </section>
  );
}