import { motion } from "motion/react";
import { EASE, VIEWPORT, fadeUp, staggerContainer, staggerItem } from "../lib/animations";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const B = {
  grad:      "linear-gradient(135deg, #057DCD 0%, #43B0F1 100%)",
  primary:   "#057DCD",
  accent:    "#057DCD",
  navy:      "#0B1F3A",
  slate400:  "#94A3B8",
  slate500:  "#64748B",
  success:   "#10B981",
  error:     "#EF4444",
  warning:   "#F59E0B",
  white:     "#ffffff",
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
    <section className="py-24 px-4" style={{background:"#FFFFFF"}}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <div className="space-y-6">
            <motion.h2
              className="text-4xl md:text-5xl font-normal leading-tight tracking-tight"
              style={{background:"linear-gradient(135deg, #057DCD 0%, #43B0F1 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}
            variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              When integration breaks,{" "}
              <span style={{ color: "#057DCD" }}>the business feels it first.</span>
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
                  <span style={{color:"#4A6380"}}>{issue}</span>
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
            className=" rounded-lg p-6"
            style={{
              border: "1px solid rgba(67,176,241,0.2)",
              boxShadow: `0 4px 24px rgba(5,125,205,0.08)`,
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
                style={{ borderBottom: "1px solid rgba(67,176,241,0.15)" }}
              >
                <h3 className="text-sm font-medium" style={{ color: "#0A0F1E" }}>
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
                      border: "1px solid rgba(67,176,241,0.2)",
                      borderLeft: `3px solid ${row.accent}`,
                    }}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={VIEWPORT}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.25 + i * 0.1 }}
                  >
                    <div>
                      <div className="text-sm font-medium" style={{ color: "#0A0F1E" }}>{row.title}</div>
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