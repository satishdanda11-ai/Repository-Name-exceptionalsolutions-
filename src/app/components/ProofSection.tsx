import { motion } from "motion/react";
import { Link } from "react-router";
import { EASE, VIEWPORT, fadeUp, staggerContainer, staggerItem } from "../lib/animations";

const metrics = [
  { value: "5+ Years", label: "Continuous Partnership"     },
  { value: "100+",     label: "Trading Partners Onboarded" },
  { value: "$1.3M+",  label: "Annual Costs Saved"          },
  { value: "98%+",     label: "EDI Success Rate"           },
  { value: "67%",  label: "Reduction in Support FTEs"        },
  { value: "0",        label: "Critical Migration Outages" },

];

export function ProofSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 className="text-4xl md:text-5xl font-normal text-black tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Proof, Not Promises
          </motion.h2>
        </div>

        <motion.div className="bg-black/[0.02] border border-black/10 rounded-lg p-10"
          variants={fadeUp} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* ── Text side ── */}
            <div className="space-y-5">
              <div className="inline-block bg-black text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                Case Study
              </div>
              <h3 className="text-2xl font-normal text-black leading-tight">
                Global Logistics Leader Scaled EDI Without Downtime
              </h3>
              <div className="space-y-3 text-sm text-black/60">
                <p>
                  <span className="font-medium text-black">Challenge:</span> Mission-critical IBM Sterling EDI environment required modernization, partner onboarding, and 24×7 reliability across a global logistics network.
                </p>
                <p>
                  <span className="font-medium text-black">Solution:</span> Delivered end-to-end EDI modernization, partner onboarding, platform administration, production support, and Oracle Integration Cloud operations.
                </p>
                <p>
                  <span className="font-medium text-black">Outcome:</span> 100+ trading partners onboarded, zero critical migration outages, and expanded support across 4 integration service lines while maintaining uninterrupted operations.
                </p>
              </div>
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
                <Link to="/why/case-studies"
                  className="inline-block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors group">
                  Read Full Case Study
                  <span className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
            </div>

            {/* ── Metrics — featured top card + 2×2 grid below ── */}
            <motion.div
              className="flex flex-col gap-3"
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>

              {/* Featured — 5+ Years full width */}
              <motion.div variants={staggerItem}
                className="bg-black rounded-lg p-6 group relative overflow-hidden"
                whileHover={{ y:-3, boxShadow:"0 12px 32px rgba(0,0,0,0.25)", transition:{ duration:0.18, ease:EASE } }}>
                {/* subtle bg texture */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ backgroundImage:"radial-gradient(circle at 80% 50%, rgba(255,255,255,0.04) 0%, transparent 60%)" }} />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Flagship Engagement</div>
                    <div className="text-5xl font-light text-white tabular-nums mb-1">5+ Years</div>
                    <div className="text-sm text-white/50">Continuous Partnership</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Since</div>
                    <div className="text-2xl font-light text-white/60">2019</div>
                    <div className="flex items-center gap-1.5 justify-end mt-2">
                      <motion.span className="w-1.5 h-1.5 rounded-full bg-green-400"
                        animate={{ opacity:[1,.3,1] }} transition={{ duration:1.5, repeat:Infinity }} />
                      <span className="text-[10px] text-white/30">Active</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Remaining 5 in 2-col grid */}
              <div className="grid grid-cols-2 gap-3">
                {metrics.slice(1).map(({ value, label }) => (
                  <motion.div key={label} variants={staggerItem}
                    className="bg-white border border-black/10 rounded-lg p-5 group"
                    whileHover={{ y:-3, boxShadow:"0 8px 24px rgba(0,0,0,0.08)", transition:{ duration:0.18, ease:EASE } }}>
                    <div className="text-3xl font-light text-black mb-1 tabular-nums group-hover:text-black/80 transition-colors whitespace-nowrap">
                      {value}
                    </div>
                    <div className="text-[11px] text-black/40 leading-snug">{label}</div>
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