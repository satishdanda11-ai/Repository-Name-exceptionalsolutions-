import { motion } from "motion/react";
import { Link } from "react-router";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge } from "../lib/animations";

export function FinalCTA() {
  return (
    <section className="py-24 px-4 bg-[#0B1F3A] text-white relative overflow-hidden">

      {/* Animated gradient mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="animate-mesh absolute -top-1/2 -left-1/4 w-[80%] h-[200%] opacity-[0.12] rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(26,115,232,0.8) 0%, transparent 70%)" }} />
        <div className="animate-mesh absolute -bottom-1/4 -right-1/4 w-[60%] h-[150%] opacity-[0.1] rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(67,176,241,0.6) 0%, transparent 70%)", animationDelay: "4s" }} />
      </div>

      {/* Subtle grid overlay */}
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
          Let's <span className="text-[#439FF7]">pressure-test</span> your integration.
        </motion.h2>

        <motion.p
          className="text-base text-white/60 leading-relaxed max-w-2xl mx-auto"
          variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          Book a no-obligation EDI health assessment. A senior architect reviews your current
          integration estate and gives you a clear, honest picture of what's working, what's at
          risk, and what to do next.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center pt-6"
          variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}>

          <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact"
              className="animate-btn-pulse block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors">
              Book an EDI health assessment
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact"
              className="block border border-white/20 text-white px-6 py-2.5 text-sm rounded-md hover:bg-white/10 transition-colors">
              Talk to an architect
            </Link>
          </motion.div>
        </motion.div>

        <motion.p
          className="text-xs text-white/40 pt-4"
          variants={fadeUp} custom={0.3} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          No obligation. A senior architect reviews your integration estate and shares what they find.
        </motion.p>
      </div>
    </section>
  );
}