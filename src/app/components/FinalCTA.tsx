import { motion } from "motion/react";
import { Link } from "react-router";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge } from "../lib/animations";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const B = {
  primary400: "#6BC3F5",
  primary500: "#43B0F1",
  navy500:    "#0B1F3A",
  navy700:    "#071323",
  navy800:    "#040C17",
};

export function FinalCTA() {
  return (
    <section className="py-24 px-4 text-white relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${B.navy800} 0%, ${B.navy500} 50%, ${B.navy700} 100%)`,
      }}>

      {/* Blue radial glow — top left like the image */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/3 -left-1/4 w-[70%] h-[160%] opacity-20 rounded-full"
          style={{ background: `radial-gradient(ellipse at center, ${B.primary500} 0%, transparent 65%)` }} />
        <div className="absolute -bottom-1/4 -right-1/4 w-[50%] h-[120%] opacity-10 rounded-full"
          style={{ background: `radial-gradient(ellipse at center, ${B.primary400} 0%, transparent 65%)` }} />
      </div>

      {/* Subtle dot grid overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }} />

      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
        <motion.h2
          className="text-4xl md:text-6xl font-normal leading-tight tracking-tight"
          variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          Let's pressure-test your integration.
        </motion.h2>

        <motion.p
          className="text-base leading-relaxed max-w-2xl mx-auto"
          style={{ color: "rgba(255,255,255,0.6)" }}
          variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          Book a no-obligation EDI health assessment. A senior architect reviews your current
          integration estate and gives you a clear, honest picture of what's working, what's at
          risk, and what to do next.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center pt-6"
          variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}>

          {/* Primary — brand blue like image */}
          <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact"
              className="block text-white px-6 py-2.5 text-sm rounded-md transition-colors"
              style={{ background: B.primary500 }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = B.primary400}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = B.primary500}>
              Book an EDI health assessment
            </Link>
          </motion.div>

          {/* Secondary — outlined */}
          <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact"
              className="block text-white px-6 py-2.5 text-sm rounded-md transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.2)" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
              Talk to an architect
            </Link>
          </motion.div>
        </motion.div>

        <motion.p
          className="text-xs pt-4"
          style={{ color: "rgba(255,255,255,0.4)" }}
          variants={fadeUp} custom={0.3} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          No obligation. A senior architect reviews your integration estate and shares what they find.
        </motion.p>
      </div>
    </section>
  );
}