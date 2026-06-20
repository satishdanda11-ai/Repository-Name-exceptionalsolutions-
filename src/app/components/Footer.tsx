import { motion } from "motion/react";
import { Link } from "react-router";
import { VIEWPORT, fadeUp, staggerContainer, staggerItem } from "../lib/animations";

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
    { label: "Our Journey", path: "/company/our-journey" },
    { label: "Careers", path: "/company/careers" },
    { label: "Insights", path: "/insights" },
    { label: "Contact", path: "/contact" },
  ],
};

const registration = [
  { k: "CIN", v: "26060600740810HDFC" },
  { k: "TAN", v: "HYDE06177D" },
  { k: "PAN", v: "AAHFE8397F" },
  { k: "GST", v: "37AAHFE8397F1ZY" },
];

export function Footer() {
  return (
    <footer className="bg-[#1A73E8]/[0.02] border-t border-[#0B1F3A]/10 pt-16 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 gap-y-10 mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {/* link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div key={category} variants={staggerItem}>
              <h3 className="text-xs font-semibold text-[#0B1F3A] mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="nav-link-underline text-xs text-[#475569] hover:text-[#1A73E8] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* 4th column — company + HQ, fills the previously empty right side */}
          <motion.div variants={staggerItem} className="col-span-2 md:col-span-1">
            <h3 className="text-xs font-semibold text-[#0B1F3A] mb-3">Corporate Headquarters</h3>
            <p className="text-xs text-[#475569] leading-relaxed mb-4">
             5th floor,
Capital Pk Rd, Ayyappa Society, VIP Hills, Silicon Valley, Madhapur, Hyderabad, Telangana 500081
            </p>
            <dl className="space-y-1.5">
              {registration.map((item) => (
                <div key={item.k} className="flex items-start gap-2 text-[11px]">
                  <dt className="text-[#0B1F3A]/45 w-9 flex-shrink-0">{item.k}</dt>
                  <dd className="text-[#475569] tabular-nums">{item.v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </motion.div>

        {/* bottom bar */}
        <motion.div
          className="pt-8 border-t border-[#0B1F3A]/10 flex flex-col sm:flex-row items-center justify-between gap-4"
          variants={fadeUp}
          custom={0.1}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <div className="text-sm font-medium text-[#0B1F3A]">Exceptional Solutions</div>
          <p className="text-xs text-[#475569] text-center sm:text-right">
           © 2026 Exceptional Solutions. All Rights Reserved
          </p>
        </motion.div>
      </div>
    </footer>
  );
}