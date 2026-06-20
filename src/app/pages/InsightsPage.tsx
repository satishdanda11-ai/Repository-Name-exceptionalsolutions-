import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const articles = [
  { slug: "why-edi-migration-is-harder-than-you-think", category: "EDI Modernisation",  title: "Why your EDI migration is harder than you think — and how to make it easier",        excerpt: "Most EDI migrations fail not because of the technology, but because of what happens when you try to move a live trading network without losing a transaction.",                                    readTime: "9 min read" },
  { slug: "hidden-cost-of-slow-edi-partner-onboarding", category: "B2B Integration",    title: "The hidden cost of slow trading-partner onboarding",                                    excerpt: "Twelve weeks to onboard a new partner is not a project estimate — it is twelve weeks of delayed revenue. We quantify what most integration teams never put on a spreadsheet.",                    readTime: "7 min read" },
  { slug: "edi-is-not-a-legacy-problem",                category: "EDI Strategy",       title: "EDI is not a legacy problem — it is a competitive advantage",                          excerpt: "Enterprises that treat EDI as technical debt are running a machine they don't understand. The ones that invest in it properly are onboarding partners in days and protecting revenue at scale.", readTime: "8 min read" },
  { slug: "how-to-choose-the-right-edi-platform",       category: "Platform Selection", title: "How to choose the right EDI platform for your estate",                                  excerpt: "IBM Sterling, Boomi, Cleo, MuleSoft, Axway — each is right for a different estate. A vendor-neutral framework for choosing, without being sold to.",                              readTime: "10 min read" },
  { slug: "cost-of-a-failed-edi-transaction",           category: "Supply Chain",       title: "What a single failed EDI transaction actually costs a retailer",                       excerpt: "Chargebacks, delayed orders, manual re-work, and relationship damage. The visible cost is never the total cost — calculated retailer by retailer.",                                            readTime: "7 min read" },
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
    `radial-gradient(ellipse at ${x}% ${y}%, rgba(26,115,232,0.05) 0%, transparent 65%)`);
  const shimX = useMotionValue(-100);
  const shimT = useTransform(shimX, v => `${v}%`);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    glowX.set(((e.clientX - r.left) / r.width) * 100);
    glowY.set(((e.clientY - r.top)  / r.height) * 100);
  };
  const onEnter = useCallback(() => {
    setHovered(true);
    animate(glowOp, 1, { duration: 0.35, ease: "easeOut" });
    shimX.set(-100); animate(shimX, 200, { duration: 0.6, ease: "easeInOut" });
  }, [shimX, glowOp]);
  const onLeave = () => { setHovered(false); animate(glowOp, 0, { duration: 0.4, ease: "easeOut" }); };

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
    <motion.div ref={ref} variants={staggerItem} className="rounded-xl">
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>
    <Link to={`/insights/${article.slug}`}
      className="block border rounded-xl p-6 bg-white space-y-3 relative overflow-hidden cursor-pointer group h-full"
      style={{
        borderColor: hovered ? "rgba(26,115,232,0.35)" : "rgba(11,31,58,0.10)",
        boxShadow: hovered ? "0 18px 40px -12px rgba(26,115,232,0.22)" : "0 1px 2px rgba(11,31,58,0.04)",
        transition: "border-color 0.3s ease, box-shadow 0.35s ease",
      }}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>

      {/* cursor glow */}
      <motion.div className="absolute inset-0 pointer-events-none rounded-xl" style={{ opacity: glowOp, background: glowBg }} />
      {/* shimmer */}
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left: 0, width: "55%", height: 1, background: "linear-gradient(90deg,transparent,rgba(26,115,232,0.4),transparent)", x: shimT }} />
      {/* top accent line — grows from center on hover */}
      <motion.div className="absolute top-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full"
        style={{ background: "linear-gradient(90deg,#1A73E8,#439FF7)" }}
        animate={{ width: hovered ? "40%" : "0%", opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />

      <div className="relative">
        {/* category */}
        <p className="text-[10px] text-[#1A73E8] uppercase tracking-wide mb-2">{article.category}</p>

        {/* title */}
        <motion.h3 className="text-sm font-medium leading-snug mb-2"
          animate={{ color: hovered ? "#1A73E8" : "#0B1F3A" }} transition={{ duration: 0.25, ease: EASE }}>
          {article.title}
        </motion.h3>

        {/* excerpt */}
        <p className="text-xs text-[#475569] leading-relaxed mb-3">{article.excerpt}</p>

        {/* read time + progress bar */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#0B1F3A]/30">{article.readTime}</span>
          <div className="flex-1 h-px bg-[#0B1F3A]/[0.06] overflow-hidden rounded-full">
            <div className="h-full bg-[#1A73E8]/40 rounded-full" style={{ width: `${progW}%`, transition: "width 1s ease" }} />
          </div>
        </div>

        {/* read arrow — always present, brightens + slides on hover (no layout shift) */}
        <div className="flex items-center gap-1 mt-3 text-[11px]">
          <motion.span animate={{ color: hovered ? "#1A73E8" : "rgba(26,115,232,0.55)" }} transition={{ duration: 0.25, ease: EASE }}>
            Read article
          </motion.span>
          <motion.span className="text-[#1A73E8]" animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.55 }} transition={{ duration: 0.25, ease: EASE }}>→</motion.span>
        </div>
      </div>
    </Link>
    </motion.div>
    </motion.div>
  );
}

// ─── Guide row ────────────────────────────────────────────────────────────────
function GuideRow({ guide }: { guide: typeof guides[0] }) {
  const { hovered, glowBg, glowOp, shimT, onMove, onEnter, onLeave } = useCardInteraction();

  return (
    <motion.div variants={staggerItem}
      className="border border-[#0B1F3A]/10 rounded-lg p-8 bg-white flex items-start justify-between gap-6 relative overflow-hidden cursor-default"
      whileHover={{ y: -3, borderColor: "rgba(26,115,232,0.3)", boxShadow: "0 8px 28px rgba(26,115,232,0.1)", transition: { duration: 0.18, ease: EASE } }}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>

      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ opacity: glowOp, background: glowBg }} />
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left: 0, width: "55%", height: 1, background: "linear-gradient(90deg,transparent,rgba(26,115,232,0.4),transparent)", x: shimT }} />
      <motion.div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(26,115,232,0.35),transparent)" }}
        animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }} />

      {/* doc icon */}
      <div className="flex items-start gap-4 flex-1 relative">
        <motion.div
          className="w-8 h-10 rounded flex-shrink-0 border border-[#1A73E8]/15 flex items-end justify-center pb-1"
          animate={{ background: hovered ? "#1A73E8" : "#F4F8FF", borderColor: hovered ? "#1A73E8" : "rgba(26,115,232,0.15)" }}
          transition={{ duration: 0.25 }}>
          <motion.div className="w-4 h-0.5 rounded-full"
            animate={{ background: hovered ? "#fff" : "rgba(26,115,232,0.3)" }} transition={{ duration: 0.25 }} />
        </motion.div>
        <div>
          <h3 className="text-sm font-medium text-[#0B1F3A] mb-1.5">{guide.title}</h3>
          <p className="text-sm text-[#475569] leading-relaxed max-w-xl">{guide.desc}</p>
          {/* underline sweep */}
          <div className="h-px bg-[#0B1F3A]/[0.08] overflow-hidden mt-3 max-w-md">
            <motion.div className="h-full bg-[#1A73E8] origin-left"
              animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
          </div>
        </div>
      </div>

      {/* download button */}
      <motion.div className="flex-shrink-0 relative" whileHover={{ scale: 1.02 }} transition={{ duration: 0.15, ease: EASE }}>
        <Link to="/contact"
          className="flex items-center gap-1.5 border border-[#1A73E8]/30 text-[#1A73E8] px-4 py-1.5 text-xs rounded-md hover:bg-[#1A73E8]/[0.05] transition-colors relative overflow-hidden">
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
      className="border border-[#0B1F3A]/10 rounded-lg p-6 bg-white space-y-3 relative overflow-hidden cursor-default"
      whileHover={{ y: -4, borderColor: "rgba(26,115,232,0.3)", boxShadow: "0 10px 36px rgba(26,115,232,0.1)", transition: { duration: 0.2, ease: EASE } }}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>

      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ opacity: glowOp, background: glowBg }} />
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left: 0, width: "55%", height: 1, background: "linear-gradient(90deg,transparent,rgba(26,115,232,0.4),transparent)", x: shimT }} />
      <motion.div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(26,115,232,0.35),transparent)" }}
        animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }} />

      <div className="relative">
        <h3 className="text-sm font-medium text-[#0B1F3A] leading-snug mb-2">{res.title}</h3>
        <p className="text-xs text-[#475569] leading-relaxed mb-3">{res.desc}</p>
        {/* underline sweep */}
        <div className="h-px bg-[#0B1F3A]/[0.08] overflow-hidden mb-3">
          <motion.div className="h-full bg-[#1A73E8] origin-left"
            animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
        </div>
        <Link to="/contact" className="text-[11px] text-[#1A73E8] inline-flex items-center gap-1 group/link">
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
      className="inline-flex items-center gap-5 border border-[#0B1F3A]/10 rounded-lg px-5 py-3"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}>
      {[
        { val: `${articles.length}`, lbl: "Articles"        },
        { val: `${guides.length}`,   lbl: "Guides"          },
        { val: reads.toLocaleString(), lbl: "Reads this month" },
      ].map((m, i) => (
        <div key={m.lbl} className="flex items-center gap-4">
          {i > 0 && <div className="w-px h-6 bg-[#0B1F3A]/10" />}
          <div>
            <div className="text-base font-medium text-[#0B1F3A] tabular-nums">{m.val}</div>
            <div className="text-[9px] text-[#0B1F3A]/38 uppercase tracking-wide mt-0.5">{m.lbl}</div>
          </div>
        </div>
      ))}
      <div className="w-px h-6 bg-[#0B1F3A]/10" />
      <motion.span className="w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0"
        animate={{ boxShadow: ["0 0 0 0px rgba(16,185,129,.5)","0 0 0 4px rgba(16,185,129,0)","0 0 0 0px rgba(16,185,129,.5)"] }}
        transition={{ duration: 1.8, repeat: Infinity }} />
    </motion.div>
  );
}

// ─── Vertical insight stack diagram ───────────────────────────────────────────
// Three source nodes (EDI · AI · Cloud) flow DOWN through a converging Analysis
// hub into a Published article card. Canvas draws the connectors + traveling
// packets; the published card cycles its title as each "batch" lands.
function InsightStack() {
  const SOURCES = ["EDI", "AI", "Cloud"];
  const TITLES = [
    "Why your EDI migration is harder than you think",
    "AI for integration operations: what works",
    "The hidden cost of slow partner onboarding",
    "Choosing the right platform for your estate",
  ];
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [titleIdx, setTitleIdx] = useState(0);
  const [titleVis, setTitleVis] = useState(true);
  const [hubPulse, setHubPulse] = useState(0);

  // cycle the published article title
  useEffect(() => {
    const id = setInterval(() => {
      setTitleVis(false);
      setTimeout(() => { setTitleIdx(i => (i + 1) % TITLES.length); setTitleVis(true); }, 240);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;

    // normalized anchor points (relative to canvas w/h)
    // 3 sources across the top, hub in the middle, output at the bottom
    const SRC_Y = 0.13, HUB_Y = 0.52, OUT_Y = 0.88;
    const srcX  = [0.2, 0.5, 0.8];

    type Pkt = { seg: 0 | 1; from: number; t: number; spd: number };
    // seg 0: a source → hub ; seg 1: hub → output
    let pkts: Pkt[] = [];
    const spawnTop = () => pkts.push({ seg: 0, from: Math.floor(Math.random() * 3), t: 0, spd: 0.012 + Math.random() * 0.006 });
    const spawnBottom = () => pkts.push({ seg: 1, from: 1, t: 0, spd: 0.012 + Math.random() * 0.005 });
    for (let i = 0; i < 3; i++) setTimeout(spawnTop, i * 260);

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener("resize", resize);

    let t = 0, frame = 0;
    const draw = () => {
      const W = canvas.width, H = canvas.height; t++;
      ctx.clearRect(0, 0, W, H);

      const hub = { x: 0.5 * W, y: HUB_Y * H };
      const out = { x: 0.5 * W, y: OUT_Y * H };
      const srcs = srcX.map(x => ({ x: x * W, y: SRC_Y * H }));

      // connectors — dashed, source→hub then hub→output
      ctx.setLineDash([4, 7]); ctx.lineWidth = 1; ctx.strokeStyle = "#1A73E8";
      srcs.forEach((s, i) => {
        ctx.globalAlpha = 0.1 + Math.sin(t * 0.02 + i) * 0.03;
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(hub.x, hub.y); ctx.stroke();
      });
      ctx.globalAlpha = 0.12 + Math.sin(t * 0.02) * 0.03;
      ctx.beginPath(); ctx.moveTo(hub.x, hub.y); ctx.lineTo(out.x, out.y); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;

      // packets
      pkts = pkts.filter(p => {
        p.t += p.spd;
        const a = p.seg === 0 ? srcs[p.from] : hub;
        const b = p.seg === 0 ? hub : out;
        if (p.t >= 1) {
          if (p.seg === 0) { setHubPulse(14); } // arrival pulses the hub
          return false;
        }
        const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
        const fade = p.t < 0.1 ? p.t / 0.1 : p.t > 0.85 ? (1 - p.t) / 0.15 : 1;
        // comet trail
        for (let k = 1; k <= 4; k++) {
          const tt = Math.max(0, p.t - k * 0.03);
          ctx.globalAlpha = ((4 - k) / 8) * 0.4 * fade; ctx.fillStyle = "#1A73E8";
          ctx.beginPath(); ctx.arc(a.x + (b.x - a.x) * tt, a.y + (b.y - a.y) * tt, Math.max(0.5, 2.4 - k * 0.4), 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = fade * 0.9; ctx.fillStyle = "#1A73E8";
        ctx.shadowColor = "#1A73E8"; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        return true;
      });

      // hub node — navy circle w/ breathing ring + arrival flash
      const breathe = Math.sin(t * 0.04) * 2;
      ctx.globalAlpha = 0.12; ctx.strokeStyle = "#1A73E8"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(hub.x, hub.y, 26 + breathe, 0, Math.PI * 2); ctx.stroke();
      if (hubPulse > 0) {
        ctx.globalAlpha = (hubPulse / 14) * 0.4; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(hub.x, hub.y, 22 + (14 - hubPulse) * 1.6, 0, Math.PI * 2); ctx.stroke();
        setHubPulse(v => v - 1);
      }
      ctx.globalAlpha = 1; ctx.fillStyle = "#0B1F3A";
      ctx.beginPath(); ctx.arc(hub.x, hub.y, 20, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "600 8px system-ui";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("Analyse", hub.x, hub.y);

      frame++;
      if (frame % 70 === 0) spawnTop();
      if (frame % 90 === 35) spawnBottom();
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, [hubPulse]);

  return (
    <motion.div
      className="hidden md:block bg-white border border-[#0B1F3A]/10 rounded-xl overflow-hidden"
      style={{ height: 440 }}
      initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}>
      <div className="px-5 py-3 border-b border-[#0B1F3A]/[0.07] flex items-center justify-between">
        <span className="text-[9px] text-[#1A73E8] uppercase tracking-widest">How an insight is made</span>
        <div className="flex items-center gap-1.5 text-[9px] text-[#0B1F3A]/38">
          <motion.span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"
            animate={{ boxShadow: ["0 0 0 0px rgba(16,185,129,.5)","0 0 0 3px rgba(16,185,129,0)","0 0 0 0px rgba(16,185,129,.5)"] }}
            transition={{ duration: 1.8, repeat: Infinity }} />
          Live
        </div>
      </div>

      <div className="relative" style={{ height: "calc(100% - 41px)" }}>
        {/* canvas connectors + hub */}
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />

        {/* source pills across the top */}
        <div className="absolute inset-x-0 flex justify-around px-8" style={{ top: "9%" }}>
          {SOURCES.map(s => (
            <div key={s}
              className="px-3 py-1.5 rounded-md border border-[#1A73E8]/20 bg-[#F4F8FF] text-[10px] font-medium text-[#1A73E8]">
              {s}
            </div>
          ))}
        </div>

        {/* published article card at the bottom */}
        <div className="absolute inset-x-0 px-7" style={{ top: "76%" }}>
          <div className="border border-[#0B1F3A]/10 rounded-lg bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[8px] text-[#1A73E8] uppercase tracking-widest">Published</span>
              <span className="text-[8px] text-[#0B1F3A]/35">Article</span>
            </div>
            <p className="text-[11px] font-medium text-[#0B1F3A] leading-snug"
              style={{ opacity: titleVis ? 1 : 0, transition: "opacity 0.24s" }}>
              {TITLES[titleIdx]}
            </p>
          </div>
        </div>
      </div>
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
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* LEFT — copy + stats */}
            <div className="space-y-6">
              <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>
                Insights & EDI Resource Hub
              </motion.p>
              <motion.h1 className="text-5xl md:text-6xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}>
                Insights on integration, <span className="text-[#1A73E8]">EDI and applied AI.</span>
              </motion.h1>
              <motion.p className="text-lg text-[#475569] leading-relaxed"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
                Practical thinking from our specialists, written to be useful — not to sell.
              </motion.p>
              <HeroStats />
            </div>

            {/* RIGHT — vertical insight stack diagram */}
            <InsightStack />

          </div>
        </div>
      </section>

      {/* ── Articles ── */}
      <section className="py-24 px-4 border-t border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-2"
                variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
                Articles & Blog
              </motion.p>
              <motion.h2 className="text-3xl font-normal text-[#0B1F3A] tracking-tight"
                variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
                Latest <span className="text-[#1A73E8]">thinking</span>
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
      <section className="py-24 px-4 bg-[#1A73E8]/[0.02] border-t border-b border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-2"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Whitepapers & Guides
            </motion.p>
            <motion.h2 className="text-3xl font-normal text-[#0B1F3A] tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              In-depth <span className="text-[#1A73E8]">resources</span>
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
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-2"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              EDI Resource Hub
            </motion.p>
            <motion.h2 className="text-3xl font-normal text-[#0B1F3A] tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              A focused library for <span className="text-[#1A73E8]">EDI buyers and practitioners</span>
            </motion.h2>
            <motion.p className="text-sm text-[#475569] mt-3"
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
      <section className="py-24 px-4 border-t border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.h2 className="text-4xl font-normal text-[#0B1F3A] tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Want the full <span className="text-[#1A73E8]">EDI modernisation guide?</span>
          </motion.h2>
          <motion.p className="text-base text-[#475569] max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Download our practical guide to planning and executing an EDI platform migration — from audit to go-live.
          </motion.p>
          <motion.div variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact"
              className="inline-block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(26,115,232,0.28)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
              Download the EDI modernisation guide
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}