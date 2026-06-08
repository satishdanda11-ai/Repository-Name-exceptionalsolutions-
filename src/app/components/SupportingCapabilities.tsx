import { motion } from "motion/react";
import { Link } from "react-router";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const capabilities = [
  {
    title: "AI Solutions",
    description: "Practical, applied AI built on data you can trust.",
    details: "Process automation, document intelligence, and AI for integration operations — grounded in connected data.",
    path: "/services/ai-solutions",
  },
  {
    title: "Data & Analytics",
    description: "Turn connected data into decisions.",
    details: "Analytics, reporting, and data quality that give leaders a single, trusted view of the business.",
    path: "/services/data-analytics",
  },
  {
    title: "Cloud Services",
    description: "Cloud built for scale and reliability.",
    details: "Migrate and modernise on cloud foundations built to scale with your integration estate.",
    path: "/services/cloud-services",
  },
  {
    title: "Digital Engineering",
    description: "Senior engineers building modern systems.",
    details: "Custom applications and system modernisation, built to connect cleanly with your enterprise.",
    path: "/services/digital-engineering",
  },
];

export function SupportingCapabilities() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 max-w-3xl mx-auto">
          <motion.p
            className="text-xs text-black/40 uppercase tracking-wide mb-4"
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            Supporting Capabilities
          </motion.p>
          <motion.h2
            className="text-4xl md:text-5xl font-normal text-black mb-4 tracking-tight"
            variants={fadeUp}
            custom={0.05}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            Connected data is only the beginning.
          </motion.h2>
          <motion.p
            className="text-base text-black/60"
            variants={fadeUpLarge}
            custom={0.12}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            Here's what we help you do with it.
          </motion.p>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {capabilities.map(({ title, description, details, path }) => (
            <motion.div
              key={title}
              variants={staggerItem}
              className="bg-white border border-black/10 rounded-lg p-6 flex flex-col group cursor-pointer"
              whileHover={{ y: -6, transition: { duration: 0.2, ease: EASE } }}
            >
              <div className="space-y-3 flex-1">
                <h3 className="text-base font-medium text-black group-hover:text-black/80 transition-colors">{title}</h3>
                <p className="text-sm text-black/60">{description}</p>
                <p className="text-xs text-black/40 leading-relaxed">{details}</p>
              </div>
              <Link
                to={path}
                className="text-xs text-black/60 hover:text-black inline-flex items-center gap-1 pt-4 mt-auto group/link"
              >
                Learn more
                <span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
