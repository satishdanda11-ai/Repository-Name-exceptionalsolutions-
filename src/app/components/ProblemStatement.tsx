import { motion } from "motion/react";
import { EASE, VIEWPORT, fadeUp, staggerContainer, staggerItem } from "../lib/animations";

const issues = [
  "Failed transactions",
  "Delayed shipments",
  "Missed orders",
  "Chargebacks",
  "Slow partner onboarding",
  "Manual operational costs",
];

export function ProblemStatement() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          <div className="space-y-6">
            <motion.h2 className="text-4xl md:text-5xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              When integration breaks, <span className="text-[#1A73E8]">the business feels it first.</span>
            </motion.h2>

            <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              {issues.map((issue) => (
                <motion.div key={issue} variants={staggerItem} className="flex items-start gap-2">
                  <span className="text-[#1A73E8]/40 mt-1">•</span>
                  <span className="text-base text-[#475569]">{issue}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.p className="text-base text-[#475569] pt-4"
              variants={fadeUp} custom={0.3} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Every failed integration has a real cost. We help enterprises eliminate these risks
              before they impact revenue.
            </motion.p>
          </div>

          <motion.div className="bg-white border border-[#0B1F3A]/10 rounded-lg p-6"
            variants={fadeUp} custom={0.15} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#0B1F3A]/10">
                <h3 className="text-sm font-medium text-[#0B1F3A]">Integration Health</h3>
                <span className="text-xs text-[#EF4444]">3 Critical Issues</span>
              </div>
              <div className="space-y-3">
                {[
                  { title: "Failed Transactions", sub: "Partner ABC - EDI 850", value: "47" },
                  { title: "Delayed Orders",      sub: "Average delay: 2.3 hours", value: "12" },
                  { title: "Partner Onboarding",  sub: "Overdue by 5 days",        value: "3" },
                ].map((row, i) => (
                  <motion.div key={row.title} className="flex items-center justify-between p-4 bg-[#EF4444]/[0.03] border border-[#0B1F3A]/10 rounded-md"
                    initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={VIEWPORT}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.25 + i * 0.1 }}>
                    <div>
                      <div className="text-sm font-medium text-[#0B1F3A]">{row.title}</div>
                      <div className="text-xs text-[#0B1F3A]/40 mt-0.5">{row.sub}</div>
                    </div>
                    <div className="text-xl font-normal text-[#EF4444]">{row.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}