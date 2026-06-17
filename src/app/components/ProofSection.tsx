import { motion } from "motion/react";
import { Link } from "react-router";
import { EASE, VIEWPORT, fadeUp, staggerContainer, staggerItem } from "../lib/animations";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const B = {
  primary50:  "#E0EFF9",
  primary100: "#C9EBFC",
  primary200: "#8DD4F8",
  primary500: "#43B0F1",
  primary600: "#2A9DE0",
  navy500:    "#0B1F3A",
  navy600:    "#091929",
  slate400:   "#94A3B8",
  success:    "#10B981",
};

const metrics = [
  { value: "5+ Years", label: "Continuous Partnership"     },
  { value: "100+",     label: "Trading Partners Onboarded" },
  { value: "$1.3M+",  label: "Annual Costs Saved"          },
  { value: "98%+",     label: "EDI Success Rate"           },
  { value: "67%",      label: "Reduction in Support FTEs"  },
  { value: "0",        label: "Critical Migration Outages" },
];

export function ProofSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <motion.h2 className="text-4xl md:text-5xl font-normal tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <span style={{ color: B.navy500 }}>Proof, </span>
            <span style={{ color: B.primary500 }}>Not Promises</span>
          </motion.h2>
        </div>

        <motion.div
          className="rounded-lg p-10"
          style={{ background: B.primary50, border: `1px solid ${B.primary100}` }}
          variants={fadeUp} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* ── Text side ── */}
            <div className="space-y-5">
              {/* Case Study badge */}
              <div className="inline-block text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-full"
                style={{ background: B.primary500 }}>
                Case Study
              </div>
              <h3 className="text-2xl font-normal leading-tight" style={{ color: B.navy500 }}>
                Global Logistics Leader Scaled EDI Without Downtime
              </h3>
              <div className="space-y-3 text-sm text-black/60">
                <p>
                  <span className="font-medium" style={{ color: B.navy500 }}>Challenge:</span> Mission-critical IBM Sterling EDI environment required modernization, partner onboarding, and 24×7 reliability across a global logistics network.
                </p>
                <p>
                  <span className="font-medium" style={{ color: B.navy500 }}>Solution:</span> Delivered end-to-end EDI modernization, partner onboarding, platform administration, production support, and Oracle Integration Cloud operations.
                </p>
                <p>
                  <span className="font-medium" style={{ color: B.navy500 }}>Outcome:</span> 100+ trading partners onboarded, zero critical migration outages, and expanded support across 4 integration service lines while maintaining uninterrupted operations.
                </p>
              </div>
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
                <Link to="/why/case-studies"
                  className="inline-block text-white px-6 py-2.5 text-sm rounded-md group transition-colors"
                  style={{ background: B.primary500 }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = B.primary600}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = B.primary500}>
                  Read Full Case Study
                  <span className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
            </div>

            {/* ── Metrics ── */}
            <motion.div
              className="flex flex-col gap-3"
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>

              {/* Featured — navy bg */}
              <motion.div variants={staggerItem}
                className="rounded-lg p-6 group relative overflow-hidden"
                style={{ background: B.primary500 }}
                whileHover={{ y:-3, boxShadow:`0 12px 32px rgba(26,115,232,0.35)`, transition:{ duration:0.18, ease:EASE } }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ backgroundImage:"radial-gradient(circle at 80% 50%, rgba(26,115,232,0.12) 0%, transparent 60%)" }} />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Flagship Engagement</div>
                    <div className="text-5xl font-light text-white tabular-nums mb-1">5+ Years</div>
                    <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Continuous Partnership</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Since</div>
                    <div className="text-2xl font-light" style={{ color: "rgba(255,255,255,0.6)" }}>2019</div>
                    <div className="flex items-center gap-1.5 justify-end mt-2">
                      <motion.span className="w-1.5 h-1.5 rounded-full"
                        style={{ background: B.success }}
                        animate={{ opacity:[1,.3,1] }} transition={{ duration:1.5, repeat:Infinity }} />
                      <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>Active</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 2×2 grid */}
              <div className="grid grid-cols-2 gap-3">
                {metrics.slice(1).map(({ value, label }) => (
                  <motion.div key={label} variants={staggerItem}
                    className="rounded-lg p-5 group"
                    style={{ background: "#fff", border: `1px solid ${B.primary100}` }}
                    whileHover={{ y:-3, boxShadow:`0 8px 24px rgba(26,115,232,0.10)`, transition:{ duration:0.18, ease:EASE } }}>
                    <div className="text-3xl font-light mb-1 tabular-nums whitespace-nowrap transition-colors"
                      style={{ color: B.primary500 }}>
                      {value}
                    </div>
                    <div className="text-[11px] leading-snug" style={{ color: B.slate400 }}>{label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}