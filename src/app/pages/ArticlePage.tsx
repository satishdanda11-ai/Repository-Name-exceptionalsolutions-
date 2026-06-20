import { motion, useScroll, useSpring, useMotionValueEvent } from "motion/react";
import { Link, useParams } from "react-router";
import { useEffect, useRef, useState, useMemo } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge } from "../lib/animations";
import { getArticle, insightsArticles, type Block } from "../lib/insightsArticles";

// slugify a heading into an anchor id
const anchorId = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ─── Count-up number (fires when scrolled into view) ──────────────────────────
function CountUpStat({ value }: { value: string }) {
  // parse the numeric part + keep prefix/suffix (e.g. "$1.3M+", "98%+", "100+")
  const match = value.match(/^([^\d]*)([\d.,]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const numStr = match?.[2] ?? "0";
  const suffix = match?.[3] ?? "";
  const target = parseFloat(numStr.replace(/,/g, ""));
  const decimals = numStr.includes(".") ? (numStr.split(".")[1]?.length ?? 0) : 0;

  const [val, setVal] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !done) setDone(true); }, { threshold: 0.6 });
    obs.observe(el); return () => obs.disconnect();
  }, [done]);

  useEffect(() => {
    if (!done) return;
    let raf = 0; const start = performance.now(); const dur = 1300;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [done, target]);

  const shown = val.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <span ref={ref} className="tabular-nums">{prefix}{shown}{suffix}</span>;
}

// A "stat" list item is one that starts with a number/$ — render those as callouts
function isStat(item: string) {
  return /^[$]?\d/.test(item.trim());
}
function splitStat(item: string): { value: string; label: string } {
  // value = leading number with its symbols/units, e.g. "$1.3M+", "98%+", "5+ years"
  const m = item.match(/^([$]?[\d.,]+\s?(?:[KMB])?[%+x]*\s?(?:days|yrs|years)?)\s*(.*)$/i);
  if (m) return { value: m[1].trim(), label: m[2].trim() };
  return { value: item, label: "" };
}

// ─── Block renderer ───────────────────────────────────────────────────────────
function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <motion.h2 id={anchorId(block.text)}
          className="text-2xl md:text-3xl font-normal text-[#0B1F3A] tracking-tight leading-snug mt-14 mb-5 scroll-mt-28"
          variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          {block.text}
        </motion.h2>
      );
    case "p":
      return (
        <motion.p className="text-[17px] text-[#334155] leading-[1.78] mb-5"
          variants={fadeUpLarge} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          {block.text}
        </motion.p>
      );
    case "ul": {
      const allStats = block.items.every(isStat);
      if (allStats) {
        // render as an animated stat-callout grid
        return (
          <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-8"
            variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {block.items.map((it, i) => {
              const { value, label } = splitStat(it);
              return (
                <div key={i} className="rounded-xl border border-[#1A73E8]/15 bg-[#1A73E8]/[0.03] p-5">
                  <div className="text-2xl md:text-3xl font-light text-[#1A73E8] tracking-tight mb-1">
                    <CountUpStat value={value} />
                  </div>
                  <div className="text-xs text-[#475569] leading-snug">{label}</div>
                </div>
              );
            })}
          </motion.div>
        );
      }
      return (
        <motion.ul className="space-y-3 mb-6"
          variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          {block.items.map((it, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#1A73E8] flex-shrink-0" />
              <span className="text-[16px] text-[#334155] leading-[1.7]">{it}</span>
            </li>
          ))}
        </motion.ul>
      );
    }
    case "quote":
      return (
        <motion.figure className="my-10 pl-6 border-l-2 border-[#1A73E8] relative"
          variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          <span className="absolute -left-1 -top-4 text-5xl text-[#1A73E8]/15 select-none font-serif">“</span>
          <blockquote className="text-xl md:text-2xl font-normal text-[#0B1F3A] leading-snug tracking-tight italic">
            {block.text}
          </blockquote>
          {block.cite && (
            <figcaption className="mt-3 text-sm text-[#1A73E8] not-italic">— {block.cite}</figcaption>
          )}
        </motion.figure>
      );
    case "cta":
      return (
        <motion.div className="my-12 rounded-2xl p-8 md:p-10 relative overflow-hidden"
          style={{ background: "#0B1F3A" }}
          variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 60% 80% at 85% 10%, rgba(26,115,232,0.25) 0%, transparent 70%)",
          }} />
          <div className="relative">
            <p className="text-base text-white/70 leading-relaxed mb-6 max-w-2xl">{block.text}</p>
            <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }} className="inline-block">
              <Link to="/contact"
                className="inline-flex items-center gap-2 bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-lg hover:bg-[#155CC0] transition-colors"
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(26,115,232,0.4)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                {block.label}
                <span>→</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      );
  }
}

// ─── Article page ─────────────────────────────────────────────────────────────
export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticle(slug) : undefined;

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  // table of contents = every h2
  const toc = useMemo(
    () => (article ? article.blocks.filter(b => b.type === "h2").map(b => ({ id: anchorId((b as any).text), text: (b as any).text })) : []),
    [article]
  );

  const [activeId, setActiveId] = useState<string>("");
  const [pct, setPct] = useState(0);
  const totalMins = article ? parseInt(article.readTime) || 6 : 6;
  const minsLeft = Math.max(0, Math.ceil(totalMins * (1 - pct / 100)));

  useMotionValueEvent(scrollYProgress, "change", (v) => setPct(Math.round(v * 100)));

  // scroll-spy: highlight the section currently in view
  useEffect(() => {
    if (!article) return;
    const headings = toc.map(t => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    if (!headings.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
    );
    headings.forEach(h => obs.observe(h));
    return () => obs.disconnect();
  }, [article, toc]);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  useEffect(() => { if (article) document.title = article.metaTitle; }, [article]);

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!article) {
    return (
      <section className="pt-40 pb-32 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <p className="text-xs text-[#1A73E8] uppercase tracking-widest">Article not found</p>
          <h1 className="text-3xl font-normal text-[#0B1F3A] tracking-tight">We couldn't find that article.</h1>
          <p className="text-[#475569]">It may have moved or the link may be out of date.</p>
          <Link to="/insights" className="inline-block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-lg hover:bg-[#155CC0] transition-colors">
            Back to all insights
          </Link>
        </div>
      </section>
    );
  }

  const related = insightsArticles.filter(a => a.slug !== article.slug).slice(0, 3);
  const activeIndex = Math.max(0, toc.findIndex(t => t.id === activeId));

  return (
    <>
      {/* reading progress bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left"
        style={{ scaleX: progress, background: "linear-gradient(90deg,#1A73E8,#439FF7)" }} />

      {/* floating reading meta — time left + current section (desktop) */}
      <motion.div
        className="hidden lg:flex fixed top-24 right-6 z-40 flex-col items-end gap-1 pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: pct > 4 && pct < 97 ? 1 : 0 }} transition={{ duration: 0.3 }}>
        <div className="bg-white/90 backdrop-blur-sm border border-[#0B1F3A]/10 rounded-full px-4 py-2 shadow-sm flex items-center gap-2.5">
          <div className="relative w-7 h-7 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-7 h-7 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(11,31,58,0.08)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="#1A73E8" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 15}
                strokeDashoffset={2 * Math.PI * 15 * (1 - pct / 100)}
                style={{ transition: "stroke-dashoffset 0.2s linear" }} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-medium text-[#0B1F3A] tabular-nums">{pct}%</span>
          </div>
          <div className="text-right leading-tight">
            <div className="text-[11px] font-medium text-[#0B1F3A] tabular-nums">{minsLeft} min left</div>
            <div className="text-[9px] text-[#0B1F3A]/45 max-w-[140px] truncate">{toc[activeIndex]?.text ?? ""}</div>
          </div>
        </div>
      </motion.div>

      {/* ── Body: ToC rail + article ── */}
      <div className="pt-36 pb-24 px-4">
        <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">

          {/* sticky ToC (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <Link to="/insights"
                className="inline-flex items-center gap-1.5 text-sm text-[#1A73E8] hover:text-[#155CC0] transition-colors mb-6 group">
                <span className="transition-transform group-hover:-translate-x-0.5">←</span>
                All insights
              </Link>
              <p className="text-[10px] uppercase tracking-widest text-[#0B1F3A]/40 mb-3">On this page</p>
              <nav className="space-y-1 border-l border-[#0B1F3A]/10">
                {toc.map((t) => {
                  const active = t.id === activeId;
                  return (
                    <button key={t.id} onClick={() => jumpTo(t.id)}
                      className="block w-full text-left pl-4 -ml-px py-1.5 text-[12.5px] leading-snug transition-colors"
                      style={{
                        borderLeft: `2px solid ${active ? "#1A73E8" : "transparent"}`,
                        color: active ? "#1A73E8" : "rgba(11,31,58,0.5)",
                        fontWeight: active ? 500 : 400,
                      }}
                      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(11,31,58,0.8)"; }}
                      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(11,31,58,0.5)"; }}>
                      {t.text}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* article column */}
          <article className="max-w-3xl">
            {/* back link (mobile only — desktop has it in the rail) */}
            <Link to="/insights"
              className="lg:hidden inline-flex items-center gap-1.5 text-sm text-[#1A73E8] hover:text-[#155CC0] transition-colors mb-8 group">
              <span className="transition-transform group-hover:-translate-x-0.5">←</span>
              All insights
            </Link>

            {/* eyebrow */}
            <motion.div className="flex items-center gap-3 mb-5"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>
              <span className="text-xs text-[#1A73E8] uppercase tracking-widest">{article.category}</span>
              <span className="w-1 h-1 rounded-full bg-[#0B1F3A]/20" />
              <span className="text-xs text-[#0B1F3A]/40">{article.readTime}</span>
            </motion.div>

            {/* title */}
            <motion.h1 className="text-4xl md:text-[50px] font-normal text-[#0B1F3A] leading-[1.1] tracking-tight mb-6"
              style={{ letterSpacing: "-0.02em" }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.12 }}>
              {article.title}
            </motion.h1>

            {/* intro lead */}
            <motion.p className="text-xl text-[#475569] leading-relaxed mb-4"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.24 }}>
              {article.intro}
            </motion.p>

            <motion.div className="h-px bg-[#0B1F3A]/10 my-10 origin-left"
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, ease: EASE, delay: 0.3 }} />

            {/* body */}
            <div>{article.blocks.map((b, i) => <BlockView key={i} block={b} />)}</div>
          </article>
        </div>
      </div>

      {/* ── Related ── */}
      <section className="py-20 px-4 border-t border-[#0B1F3A]/10 bg-[#1A73E8]/[0.02]">
        <div className="max-w-5xl mx-auto">
          <motion.h2 className="text-2xl font-normal text-[#0B1F3A] tracking-tight mb-8"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Keep reading
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map(r => (
              <motion.div key={r.slug}
                variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
                <Link to={`/insights/${r.slug}`}
                  className="block h-full border border-[#0B1F3A]/10 rounded-xl p-6 bg-white hover:border-[#1A73E8]/30 transition-colors group"
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(26,115,232,0.08)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                  <p className="text-[10px] text-[#1A73E8] uppercase tracking-wide mb-2">{r.category}</p>
                  <h3 className="text-sm font-medium text-[#0B1F3A] leading-snug mb-3 group-hover:text-[#1A73E8] transition-colors">{r.title}</h3>
                  <span className="text-[11px] text-[#1A73E8] inline-flex items-center gap-1">
                    Read article
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}