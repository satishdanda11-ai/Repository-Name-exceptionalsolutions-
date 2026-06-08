import { motion } from "motion/react";
import { Link } from "react-router";
import { EASE, VIEWPORT, fadeUp, staggerContainer, staggerItem } from "../lib/animations";

const footerLinks = {
  Services: [
    { label: "EDI & B2B Integration", path: "/services/edi-b2b-integration" },
    { label: "AI Solutions", path: "/services/ai-solutions" },
    { label: "Data & Analytics", path: "/services/data-analytics" },
    { label: "Cloud Services", path: "/services/cloud-services" },
    { label: "Digital Engineering", path: "/services/digital-engineering" },
    { label: "Talent Solutions", path: "/services/talent-solutions" },
  ],
  Industries: [
    { label: "Retail & CPG", path: "/industries/retail-cpg" },
    { label: "Logistics & Supply Chain", path: "/industries/logistics-supply-chain" },
    { label: "Manufacturing", path: "/industries/manufacturing" },
    { label: "Healthcare", path: "/industries/healthcare" },
  ],
  "Why Exceptional": [
    { label: "Our Approach", path: "/why/our-approach" },
    { label: "Trust & Security", path: "/why/trust-security" },
    { label: "Case Studies", path: "/why/case-studies" },
    { label: "Partnerships", path: "/why/partnerships" },
  ],
  Company: [
    { label: "About Us", path: "/company/about" },
    { label: "Leadership", path: "/company/leadership" },
    { label: "Careers", path: "/company/careers" },
    { label: "Insights", path: "/insights" },
    { label: "Contact", path: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-black/[0.02] border-t border-black/10 pt-16 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div key={category} variants={staggerItem}>
              <h3 className="text-xs font-medium text-black mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="nav-link-underline text-xs text-black/40 hover:text-black transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="pt-10 border-t border-black/10"
          variants={fadeUp}
          custom={0.1}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6 text-xs text-black/40">
            {["ISO 27001 / SOC 2-class Certified", "54 Specialists", "Operating Since 2019", "6 Enterprise Platforms"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="text-center space-y-3">
            <div className="text-sm font-medium text-black">Exceptional Solutions</div>
            <p className="text-xs text-black/40 max-w-xl mx-auto">
              Connecting the systems, data, and people that modern enterprises run on.
            </p>
            <p className="text-[10px] text-black/30 pt-3">
              [INSERT registered company name and address] · [INSERT business email] · [INSERT business phone] · © 2026 Exceptional Solutions. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
