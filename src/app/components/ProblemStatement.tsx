import { motion } from "motion/react";
import { EASE, VIEWPORT, fadeUp, staggerContainer, staggerItem } from "../lib/animations";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const B = {
  primary50:  "#E0EFF9",
  primary100: "#C9EBFC",
  primary500: "#43B0F1",
  navy500:    "#0B1F3A",
  slate400:   "#94A3B8",
  error:      "#EF4444",
  warning:    "#F59E0B",
};

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
              className="text-4xl md:text-5xl font-normal leading-tight tracking-tight"
              style={{ color: B.navy500 }}
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              When integration breaks,{" "}
              <span style={{ color: B.primary500 }}>the business feels it first.</span>
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
                  <span style={{ color: B.primary500, marginTop: 4 }}>•</span>
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
            className="bg-white rounded-lg p-6"
            style={{
              border: `1px solid ${B.primary100}`,
              boxShadow: `0 4px 24px rgba(26,115,232,0.08)`,
            }}
            variants={fadeUp}
            custom={0.15}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            <div className="space-y-5">
              <div
                className="flex items-center justify-between pb-4"
                style={{ borderBottom: `1px solid ${B.primary100}` }}
              >
                <h3 className="text-sm font-medium" style={{ color: B.navy500 }}>
                  Integration Health
                </h3>
                <span className="text-xs" style={{ color: B.error }}>3 Critical Issues</span>
              </div>

              <div className="space-y-3">
                {[
                  { title: "Failed Transactions", sub: "Partner ABC - EDI 850",   value: "47", accent: B.error },
                  { title: "Delayed Orders",      sub: "Average delay: 2.3 hours", value: "12", accent: B.warning },
                  { title: "Partner Onboarding",  sub: "Overdue by 5 days",        value: "3",  accent: B.primary500 },
                ].map((row, i) => (
                  <motion.div
                    key={row.title}
                    className="flex items-center justify-between p-4 rounded-md"
                    style={{
                      background: B.primary50,
                      border: `1px solid ${B.primary100}`,
                      borderLeft: `3px solid ${row.accent}`,
                    }}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={VIEWPORT}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.25 + i * 0.1 }}
                  >
                    <div>
                      <div className="text-sm font-medium" style={{ color: B.navy500 }}>{row.title}</div>
                      <div className="text-xs mt-0.5" style={{ color: B.slate400 }}>{row.sub}</div>
                    </div>
                    <div className="text-xl font-normal" style={{ color: row.accent }}>{row.value}</div>
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