import { motion } from "motion/react";
import { Link } from "react-router";
import { EASE, VIEWPORT, fadeUp, staggerContainer, staggerItem } from "../lib/animations";

const metrics = [
  { value: "99.97%", label: "Transaction Success Rate" },
  { value: "3 Days", label: "Partner Onboarding Time" },
  { value: "$1.2M", label: "Annual Cost Savings" },
];

export function ProofSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-normal text-black tracking-tight"
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            Proof, Not Promises
          </motion.h2>
        </div>

        <motion.div
          className="bg-black/[0.02] border border-black/10 rounded-lg p-10"
          variants={fadeUp}
          custom={0.1}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text side */}
            <div className="space-y-5">
              <div className="inline-block bg-black text-white text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                Case Study
              </div>

              <h3 className="text-2xl font-normal text-black leading-tight">
                Global Retailer Modernizes EDI Infrastructure
              </h3>

              <div className="space-y-3 text-sm text-black/60">
                <p>
                  <span className="font-medium text-black">Challenge:</span> Legacy EDI system causing daily transaction
                  failures, 6-week partner onboarding, and $2M annual operational costs.
                </p>
                <p>
                  <span className="font-medium text-black">Solution:</span> Migrated to cloud-native B2B integration
                  platform with automated partner onboarding and real-time monitoring.
                </p>
                <p>
                  <span className="font-medium text-black">Outcome:</span> 99.97% transaction success rate, partner
                  onboarding reduced to 3 days, $1.2M annual cost savings.
                </p>
              </div>

              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
                <Link
                  to="/why/case-studies"
                  className="inline-block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors group"
                >
                  Read Full Case Study
                  <span className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
            </div>

            {/* Metrics side — staggered reveal */}
            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              {metrics.map(({ value, label }) => (
                <motion.div
                  key={label}
                  variants={staggerItem}
                  className="bg-white border border-black/10 rounded-lg p-6 group"
                  whileHover={{ y: -3, transition: { duration: 0.18, ease: EASE } }}
                >
                  <div className="text-4xl font-normal text-black mb-1 group-hover:text-black/80 transition-colors">{value}</div>
                  <div className="text-xs text-black/40">{label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
