import { motion } from "motion/react";
import { Link } from "react-router";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";
import { insightsArticles } from "../lib/insightsArticles";

// show the latest few articles on the homepage (pulled from the same source)
const featured = insightsArticles.slice(0, 4);

export function Insights() {
  return (
    <section className="py-24 px-4" id="insights">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.p className="text-xs text-[#1A73E8] uppercase tracking-widest mb-4"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Articles & Insights
          </motion.p>
          <motion.h2 className="text-4xl md:text-5xl font-normal text-[#0B1F3A] mb-4 tracking-tight"
            variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Insights From  <span className="text-[#1A73E8]">The Integration Frontline</span>
          </motion.h2>
          <motion.p className="text-base text-[#475569]"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            What works. What doesn't. What matters.
          </motion.p>
        </div>

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          {featured.map((article) => (
            <motion.div key={article.slug} variants={staggerItem}
              whileHover={{ y: -5, transition: { duration: 0.2, ease: EASE } }}>
              <Link to={`/insights/${article.slug}`}
                className="flex flex-col h-full bg-white border border-[#0B1F3A]/10 rounded-lg p-6 cursor-pointer overflow-hidden group hover:border-[#1A73E8]/30 transition-colors"
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(26,115,232,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-wider text-[#1A73E8]">{article.category}</span>
                  <span className="text-[10px] text-[#0B1F3A]/35">{article.readTime}</span>
                </div>
                <h3 className="text-base font-medium text-[#0B1F3A] mb-2 leading-snug group-hover:text-[#1A73E8] transition-colors duration-200">{article.title}</h3>
                <p className="text-xs text-[#475569] mb-4 leading-relaxed">{article.intro}</p>
                <div className="mt-auto text-xs text-[#1A73E8] group-hover:text-[#155CC0] transition-colors duration-200 flex items-center gap-1">
                  Read article
                  <span className="transition-transform duration-250 group-hover:translate-x-1">→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* view all */}
        <motion.div className="text-center mt-12"
          variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          <Link to="/insights"
            className="inline-flex items-center gap-2 border border-[#1A73E8]/30 text-[#1A73E8] px-6 py-2.5 text-sm rounded-md hover:bg-[#1A73E8]/[0.05] transition-colors group">
            View all articles
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}