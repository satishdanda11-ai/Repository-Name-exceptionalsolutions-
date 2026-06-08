import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const articles = [
  { category: "EDI Modernisation",  title: "Why your EDI migration is harder than you think — and how to make it easier",        excerpt: "Most EDI migrations fail not because of the technology, but because of what happens when you try to move a live trading network without losing a transaction.",                                    readTime: "8 min read" },
  { category: "B2B Integration",    title: "The hidden cost of slow trading-partner onboarding",                                    excerpt: "Six weeks to onboard a new partner is not a project estimate — it is six weeks of delayed revenue. We quantify what most integration teams never put on a spreadsheet.",                    readTime: "6 min read" },
  { category: "Applied AI",         title: "AI for integration operations: what actually works today",                              excerpt: "Predictive failure detection and intelligent exception routing are real, deployed, and saving operational cost. The vendor demos are more modest than they look.",                         readTime: "7 min read" },
  { category: "EDI Strategy",       title: "EDI is not a legacy problem — it is a competitive advantage",                          excerpt: "Enterprises that treat EDI as technical debt are running a machine they don't understand. The ones that invest in it properly are onboarding partners in days and protecting revenue at scale.", readTime: "5 min read" },
  { category: "Platform Selection", title: "IBM Sterling vs Boomi vs Cleo: choosing the right platform for your EDI estate",      excerpt: "There is no universally right answer — but there are wrong answers for your specific situation. Here is how to think through the decision without being sold to.",                              readTime: "10 min read" },
  { category: "Supply Chain",       title: "What a single failed EDI transaction actually costs a retailer",                       excerpt: "Chargebacks, delayed orders, manual re-work, and relationship damage. The visible cost is never the total cost.",                                                                            readTime: "5 min read" },
];

const guides = [
  { title: "EDI Platform Migration Guide",          desc: "A practical guide to planning and executing an EDI platform migration — from audit to go-live — without disrupting live trading." },
  { title: "Integration Modernisation Checklist",   desc: "The 40-point checklist we use to assess an integration estate before any modernisation programme begins." },
  { title: "Trading-Partner Onboarding Playbook",  desc: "How to cut onboarding from weeks to days — the process, the tools, and the points of failure most teams miss." },
];

const ediResources = [
  { title: "ANSI X12 Transaction Sets: a buyer's guide",      desc: "Which transaction sets you actually need — and how to tell if your trading partners are asking for the right ones." },
  { title: "AS2 vs SFTP vs VAN: which connection protocol?",  desc: "The differences, the tradeoffs, and the situations where each makes sense." },
  { title: "EDI health assessment: what to expect",           desc: "What a structured EDI review covers, how long it takes, and what you get at the end." },
];

// ─── Shared cursor glow + shimmer hook ────────────────────────────────────────
function useCardInteraction() {
  const [hovered, setHovered] = useState(false);
  const glowX = useMotionValue(50), glowY = useMotionValue(50), glowOp = useMotionValue(0);
  const glowBg = useTransform([glowX, glowY], ([x, y]) =>
    `radial-gradient(ellipse at ${x}% ${y}%, rgba(0,0,0,0.04) 0%, transparent 65%)`);
  const shimX = useMotionValue(-100);
  const shimT = useTransform(shimX, v => `${v}%`);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    glowX.set(((e.clientX - r.left) / r.width) * 100);
    glowY.set(((e.clientY - r.top)  / r.height) * 100);
    animate(glowOp, 1, { duration: 0.25 });
  };
  const onEnter = useCallback(() => {
    setHovered(true);
    shimX.set(-100); animate(shimX, 200, { duration: 0.5, ease: "easeInOut" });
  }, [shimX]);
  const onLeave = () => { setHovered(false); animate(glowOp, 0, { duration: 0.3 }); };

  return { hovered, glowBg, glowOp, shimT, onMove, onEnter, onLeave };
}

// ─── Article card ─────────────────────────────────────────────────────────────
function ArticleCard({ article }: { article: typeof articles[0] }) {
  const { hovered, glowBg, glowOp, shimT, onMove, onEnter, onLeave } = useCardInteraction();
  // read-time progress bar — fills based on read time number
  const mins = parseInt(article.readTime);
  const barWidth = Math.min(100, (mins / 10) * 100);
  const [progW, setProgW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setProgW(barWidth); }, { threshold: 0.3 });
    obs.observe(el); return () => obs.disconnect();
  }, [barWidth]);

  return (
    <motion.div ref={ref} variants={staggerItem}
      className="border border-black/10 rounded-lg p-6 bg-white space-y-3 relative overflow-hidden cursor-pointer group"
      whileHover={{ y: -4, borderColor: "rgba(0,0,0,0.22)", boxShadow: "0 10px 36px rgba(0,0,0,0.08)", transition: { duration: 0.2, ease: EASE } }}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>

      {/* cursor glow */}
      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ opacity: glowOp, background: glowBg }} />
      {/* shimmer */}
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left: 0, width: "55%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.28),transparent)", x: shimT }} />
      {/* top border on hover */}
      <motion.div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.18),transparent)" }}
        animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }} />

      <div className="relative">
        {/* category */}
        <p className="text-[10px] text-black/38 uppercase tracking-wide mb-2">{article.category}</p>

        {/* title */}
        <motion.h3 className="text-sm font-medium leading-snug mb-2"
          animate={{ color: hovered ? "rgba(0,0,0,0.7)" : "#111" }} transition={{ duration: 0.2 }}>
          {article.title}
        </motion.h3>

        {/* excerpt */}
        <p className="text-xs text-black/50 leading-relaxed mb-3">{article.excerpt}</p>

        {/* read time + progress bar */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-black/30">{article.readTime}</span>
          <div className="flex-1 h-px bg-black/[0.06] overflow-hidden rounded-full">
            <div className="h-full bg-black/25 rounded-full" style={{ width: `${progW}%`, transition: "width 1s ease" }} />
          </div>
        </div>

        {/* read arrow that slides in on hover */}
        <motion.div className="flex items-center gap-1 mt-3 text-[11px] text-black/40"
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
          transition={{ duration: 0.2 }}>
          Read article
          <motion.span animate={{ x: hovered ? 3 : 0 }} transition={{ duration: 0.2 }}>→</motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Guide row ────────────────────────────────────────────────────────────────
function GuideRow({ guide }: { guide: typeof guides[0] }) {
  const { hovered, glowBg, glowOp, shimT, onMove, onEnter, onLeave } = useCardInteraction();

  return (
    <motion.div variants={staggerItem}
      className="border border-black/10 rounded-lg p-8 bg-white flex items-start justify-between gap-6 relative overflow-hidden cursor-default"
      whileHover={{ y: -3, borderColor: "rgba(0,0,0,0.22)", boxShadow: "0 8px 28px rgba(0,0,0,0.07)", transition: { duration: 0.18, ease: EASE } }}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>

      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ opacity: glowOp, background: glowBg }} />
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left: 0, width: "55%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.28),transparent)", x: shimT }} />
      <motion.div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.18),transparent)" }}
        animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }} />

      {/* doc icon */}
      <div className="flex items-start gap-4 flex-1 relative">
        <motion.div
          className="w-8 h-10 rounded flex-shrink-0 border border-black/15 flex items-end justify-center pb-1"
          animate={{ background: hovered ? "#111" : "#f9fafb", borderColor: hovered ? "#111" : "rgba(0,0,0,0.15)" }}
          transition={{ duration: 0.25 }}>
          <motion.div className="w-4 h-0.5 rounded-full"
            animate={{ background: hovered ? "#fff" : "rgba(0,0,0,0.2)" }} transition={{ duration: 0.25 }} />
        </motion.div>
        <div>
          <h3 className="text-sm font-medium text-black mb-1.5">{guide.title}</h3>
          <p className="text-sm text-black/50 leading-relaxed max-w-xl">{guide.desc}</p>
          {/* underline sweep */}
          <div className="h-px bg-black/[0.08] overflow-hidden mt-3 max-w-md">
            <motion.div className="h-full bg-black origin-left"
              animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
          </div>
        </div>
      </div>

      {/* download button */}
      <motion.div className="flex-shrink-0 relative" whileHover={{ scale: 1.02 }} transition={{ duration: 0.15, ease: EASE }}>
        <Link to="/contact"
          className="flex items-center gap-1.5 border border-black/20 text-black px-4 py-1.5 text-xs rounded-md hover:bg-black/[0.03] transition-colors relative overflow-hidden">
          <motion.span animate={{ y: hovered ? -1 : 0 }} transition={{ duration: 0.18 }}>↓</motion.span>
          Download
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ─── EDI resource card ────────────────────────────────────────────────────────
function ResourceCard({ res }: { res: typeof ediResources[0] }) {
  const { hovered, glowBg, glowOp, shimT, onMove, onEnter, onLeave } = useCardInteraction();

  return (
    <motion.div variants={staggerItem}
      className="border border-black/10 rounded-lg p-6 bg-white space-y-3 relative overflow-hidden cursor-default"
      whileHover={{ y: -4, borderColor: "rgba(0,0,0,0.22)", boxShadow: "0 10px 36px rgba(0,0,0,0.08)", transition: { duration: 0.2, ease: EASE } }}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>

      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ opacity: glowOp, background: glowBg }} />
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left: 0, width: "55%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.28),transparent)", x: shimT }} />
      <motion.div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.18),transparent)" }}
        animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }} />

      <div className="relative">
        <h3 className="text-sm font-medium text-black leading-snug mb-2">{res.title}</h3>
        <p className="text-xs text-black/50 leading-relaxed mb-3">{res.desc}</p>
        {/* underline sweep */}
        <div className="h-px bg-black/[0.08] overflow-hidden mb-3">
          <motion.div className="h-full bg-black origin-left"
            animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
        </div>
        <Link to="/contact" className="text-[11px] text-black/50 inline-flex items-center gap-1 group/link">
          Read
          <motion.span animate={{ x: hovered ? 3 : 0 }} transition={{ duration: 0.2 }}>→</motion.span>
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Animated reading stats in hero ──────────────────────────────────────────
function HeroStats() {
  const [reads, setReads] = useState(2841);
  useEffect(() => {
    const id = setInterval(() => setReads(r => r + Math.floor(Math.random() * 2) + 1), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="inline-flex items-center gap-5 border border-black/10 rounded-lg px-5 py-3"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}>
      {[
        { val: `${articles.length}`, lbl: "Articles"        },
        { val: `${guides.length}`,   lbl: "Guides"          },
        { val: reads.toLocaleString(), lbl: "Reads this month" },
      ].map((m, i) => (
        <div key={m.lbl} className="flex items-center gap-4">
          {i > 0 && <div className="w-px h-6 bg-black/10" />}
          <div>
            <div className="text-base font-medium text-black tabular-nums">{m.val}</div>
            <div className="text-[9px] text-black/38 uppercase tracking-wide mt-0.5">{m.lbl}</div>
          </div>
        </div>
      ))}
      <div className="w-px h-6 bg-black/10" />
      <motion.span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"
        animate={{ boxShadow: ["0 0 0 0px rgba(34,197,94,.5)","0 0 0 4px rgba(34,197,94,0)","0 0 0 0px rgba(34,197,94,.5)"] }}
        transition={{ duration: 1.8, repeat: Infinity }} />
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function InsightsPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-40 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl space-y-6">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>
              Insights & EDI Resource Hub
            </motion.p>
            <motion.h1 className="text-5xl md:text-6xl font-normal text-black leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}>
              Insights on integration, EDI and applied AI.
            </motion.h1>
            <motion.p className="text-lg text-black/60 leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
              Practical thinking from our specialists, written to be useful — not to sell.
            </motion.p>
            <HeroStats />
          </div>
        </div>
      </section>

      {/* ── Articles ── */}
      <section className="py-24 px-4 border-t border-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-2"
                variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
                Articles & Blog
              </motion.p>
              <motion.h2 className="text-3xl font-normal text-black tracking-tight"
                variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
                Latest thinking
              </motion.h2>
            </div>
          </div>
          <motion.div className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {articles.map(article => <ArticleCard key={article.title} article={article} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Guides ── */}
      <section className="py-24 px-4 bg-black/[0.02] border-t border-b border-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-2"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Whitepapers & Guides
            </motion.p>
            <motion.h2 className="text-3xl font-normal text-black tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              In-depth resources
            </motion.h2>
          </div>
          <motion.div className="space-y-4"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {guides.map(guide => <GuideRow key={guide.title} guide={guide} />)}
          </motion.div>
        </div>
      </section>

      {/* ── EDI Resources ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-2"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              EDI Resource Hub
            </motion.p>
            <motion.h2 className="text-3xl font-normal text-black tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              A focused library for EDI buyers and practitioners
            </motion.h2>
            <motion.p className="text-sm text-black/40 mt-3"
              variants={fadeUp} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Practical answers to the questions enterprises ask when researching, assessing, or modernising their EDI estate.
            </motion.p>
          </div>
          <motion.div className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {ediResources.map(res => <ResourceCard key={res.title} res={res} />)}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 border-t border-black/10">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.h2 className="text-4xl font-normal text-black tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Want the full EDI modernisation guide?
          </motion.h2>
          <motion.p className="text-base text-black/60 max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Download our practical guide to planning and executing an EDI platform migration — from audit to go-live.
          </motion.p>
          <motion.div variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact"
              className="inline-block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
              Download the EDI modernisation guide
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}