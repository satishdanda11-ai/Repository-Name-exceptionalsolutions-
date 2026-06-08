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

          {/* Left — text */}
          <div className="space-y-6">
            <motion.h2
              className="text-4xl md:text-5xl font-normal text-black leading-tight tracking-tight"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              When integration breaks, the business feels it first.
            </motion.h2>

            <motion.div
              className="space-y-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              {issues.map((issue) => (
                <motion.div
                  key={issue}
                  variants={staggerItem}
                  className="flex items-start gap-2"
                >
                  <span className="text-black/20 mt-1">•</span>
                  <span className="text-base text-black/60">{issue}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              className="text-base text-black/60 pt-4"
              variants={fadeUp}
              custom={0.3}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              Every failed integration has a real cost. We help enterprises eliminate these risks
              before they impact revenue.
            </motion.p>
          </div>

          {/* Right — dashboard card */}
          <motion.div
            className="bg-white border border-black/10 rounded-lg p-6"
            variants={fadeUp}
            custom={0.15}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-black/10">
                <h3 className="text-sm font-medium text-black">Integration Health</h3>
                <span className="text-xs text-black/40">3 Critical Issues</span>
              </div>
              <div className="space-y-3">
                {[
                  { title: "Failed Transactions", sub: "Partner ABC - EDI 850", value: "47" },
                  { title: "Delayed Orders", sub: "Average delay: 2.3 hours", value: "12" },
                  { title: "Partner Onboarding", sub: "Overdue by 5 days", value: "3" },
                ].map((row, i) => (
                  <motion.div
                    key={row.title}
                    className="flex items-center justify-between p-4 bg-black/[0.02] border border-black/10 rounded-md"
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={VIEWPORT}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.25 + i * 0.1 }}
                  >
                    <div>
                      <div className="text-sm font-medium text-black">{row.title}</div>
                      <div className="text-xs text-black/40 mt-0.5">{row.sub}</div>
                    </div>
                    <div className="text-xl font-normal text-black">{row.value}</div>
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
