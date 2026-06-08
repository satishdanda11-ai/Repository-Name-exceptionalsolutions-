import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

// ─── Order: Logistics first, then Retail, Manufacturing, Healthcare ───────────
const industries = [
  {
    title: "Logistics & Supply Chain",
    challenge: "Multi-party data exchange, real-time visibility, the cost of a single lost message.",
    path: "/industries/logistics-supply-chain",
    link: "Explore logistics solutions",
    dot: "Live",
    stats: [{ val: "<2s", lbl: "Latency" }, { val: "Zero", lbl: "Lost msgs" }],
    tickers: ["856 Order dispatched → Partner A", "214 Ship notice → WMS", "810 Invoice confirmed", "997 Ack received", "204 Load tender → Carrier"],
    sparkSeed: 42,
  },
  {
    title: "Retail & CPG",
    challenge: "High trading-partner volumes, chargeback exposure from EDI errors, peak-season load.",
    path: "/industries/retail-cpg",
    link: "Explore retail solutions",
    dot: "Active",
    stats: [{ val: "2,400+", lbl: "Partners" }, { val: "99.98%", lbl: "Uptime" }],
    tickers: ["850 PO received → SAP", "856 ASN confirmed", "810 Invoice sent", "997 Ack → Partner B", "860 PO Change processed"],
    sparkSeed: 17,
  },
  {
    title: "Manufacturing",
    challenge: "Supplier and distributor integration, ERP connectivity, just-in-time supply chain reliability.",
    path: "/industries/manufacturing",
    link: "Explore manufacturing solutions",
    dot: "Active",
    stats: [{ val: "340+", lbl: "Suppliers" }, { val: "24/7", lbl: "Monitored" }],
    tickers: ["830 Forecast → Supplier", "862 Schedule synced", "856 Ship notice received", "997 Ack sent", "855 PO Ack confirmed"],
    sparkSeed: 88,
  },
  {
    title: "Healthcare",
    challenge: "Strict compliance, complex payer-provider exchange, zero tolerance for error.",
    path: "/industries/healthcare",
    link: "Explore healthcare solutions",
    dot: "Secure",
    stats: [{ val: "100%", lbl: "Compliant" }, { val: "0", lbl: "Errors" }],
    tickers: ["270 Eligibility checked", "271 Response received", "835 Remittance processed", "837 Claim submitted", "999 Ack confirmed"],
    sparkSeed: 55,
  },
];

// ─── Pulsing live dot ─────────────────────────────────────────────────────────
function LiveDot({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <motion.span
        className="w-[5px] h-[5px] rounded-full bg-green-500 flex-shrink-0"
        animate={{ boxShadow: ["0 0 0 0px rgba(34,197,94,0.5)", "0 0 0 4px rgba(34,197,94,0)", "0 0 0 0px rgba(34,197,94,0.5)"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="text-[9px] text-black/35 uppercase tracking-wide">{label}</span>
    </div>
  );
}

// ─── Live tx counter ──────────────────────────────────────────────────────────
function TxCounter({ seed }: { seed: number }) {
  const [count, setCount] = useState(() => Math.floor(seed * 3.7) + 200);
  useEffect(() => {
    const id = setInterval(() => setCount(c => c + Math.floor(Math.random() * 3) + 1), 1400 + seed * 3);
    return () => clearInterval(id);
  }, [seed]);
  return (
    <div className="text-[9px] text-black/40 tabular-nums px-1.5 py-0.5 rounded"
      style={{ background: "rgba(0,0,0,0.04)" }}>
      {count.toLocaleString()} tx
    </div>
  );
}

// ─── Sparkline canvas — 7-day activity ───────────────────────────────────────
function Sparkline({ seed }: { seed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width  = canvas.offsetWidth * 2;
    const H = canvas.height = 64;

    // deterministic random from seed
    let r = seed;
    const rand = () => { r = (r * 1664525 + 1013904223) & 0xffffffff; return (r >>> 0) / 4294967296; };

    const pts: number[] = [];
    let v = 30;
    for (let i = 0; i < 28; i++) { v = Math.max(8, Math.min(56, v + (rand() - 0.45) * 18)); pts.push(v); }

    const step = W / (pts.length - 1);

    // fill area
    ctx.beginPath(); ctx.moveTo(0, H);
    pts.forEach((p, i) => ctx.lineTo(i * step, H - p));
    ctx.lineTo(W, H); ctx.closePath();
    ctx.fillStyle = "rgba(0,0,0,0.04)"; ctx.fill();

    // line
    ctx.beginPath();
    pts.forEach((p, i) => i ? ctx.lineTo(i * step, H - p) : ctx.moveTo(0, H - p));
    ctx.strokeStyle = "rgba(0,0,0,0.18)"; ctx.lineWidth = 2; ctx.stroke();

    // last point dot
    const lx = (pts.length - 1) * step, ly = H - pts[pts.length - 1];
    ctx.beginPath(); ctx.arc(lx, ly, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#111"; ctx.fill();
  }, [seed]);

  return (
    <div className="relative mb-3" style={{ height: 32 }}>
      <canvas ref={canvasRef} className="w-full" style={{ height: 32, display: "block" }} />
      <span className="absolute right-0 top-0 text-[9px] text-black/35">7d activity</span>
    </div>
  );
}

// ─── Rotating EDI message ticker ──────────────────────────────────────────────
function MessageTicker({ messages, offset }: { messages: string[]; offset: number }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % messages.length); setVisible(true); }, 220);
    }, 2200 + offset);
    return () => clearInterval(id);
  }, [messages, offset]);

  return (
    <div className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 mb-3.5 text-[10px] text-black/42"
      style={{ background: "rgba(0,0,0,0.03)" }}>
      <motion.span
        className="w-1 h-1 rounded-full bg-black flex-shrink-0"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />
      <span style={{ opacity: visible ? 1 : 0, transition: "opacity 0.22s", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
        {messages[idx]}
      </span>
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ val, lbl }: { val: string; lbl: string }) {
  return (
    <div className="flex-1 rounded-md px-2.5 py-1.5 border border-black/[0.05]"
      style={{ background: "rgba(0,0,0,0.03)" }}>
      <div className="text-sm font-medium text-black tabular-nums">{val}</div>
      <div className="text-[9px] text-black/38 uppercase tracking-wide mt-0.5">{lbl}</div>
    </div>
  );
}

// ─── Corner bracket accents ───────────────────────────────────────────────────
function CornerBrackets({ hovered }: { hovered: boolean }) {
  const c = hovered ? "rgba(0,0,0,0.32)" : "rgba(0,0,0,0.1)";
  const s: React.CSSProperties = { position: "absolute", width: 11, height: 11, borderColor: c, borderStyle: "solid", transition: "border-color 0.22s" };
  return (
    <>
      <span style={{ ...s, top: 9, left: 9, borderWidth: "1px 0 0 1px" }} />
      <span style={{ ...s, bottom: 9, right: 9, borderWidth: "0 1px 1px 0" }} />
    </>
  );
}

// ─── Industry card ────────────────────────────────────────────────────────────
function IndustryCard({ title, challenge, path, link, dot, stats, tickers, sparkSeed }: typeof industries[0]) {
  const [hovered, setHovered] = useState(false);

  // cursor glow
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glowOpacity = useMotionValue(0);
  const glowBg = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(ellipse at ${x}% ${y}%, rgba(0,0,0,0.05) 0%, transparent 65%)`
  );

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    glowX.set(((e.clientX - r.left) / r.width) * 100);
    glowY.set(((e.clientY - r.top) / r.height) * 100);
    animate(glowOpacity, 1, { duration: 0.25 });
  };
  const onMouseLeave = () => {
    setHovered(false);
    animate(glowOpacity, 0, { duration: 0.35 });
  };

  // shimmer on enter
  const shimmerX = useMotionValue(-100);
  const shimmerTranslate = useTransform(shimmerX, v => `${v}%`);
  const onMouseEnter = useCallback(() => {
    setHovered(true);
    shimmerX.set(-100);
    animate(shimmerX, 200, { duration: 0.55, ease: "easeInOut" });
  }, [shimmerX]);

  return (
    <motion.div
      variants={staggerItem}
      className="bg-white border border-black/[0.08] rounded-xl p-6 relative overflow-hidden cursor-pointer"
      whileHover={{ y: -6, borderColor: "rgba(0,0,0,0.2)", boxShadow: "0 14px 44px rgba(0,0,0,0.1)", transition: { duration: 0.2, ease: EASE } }}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* cursor glow */}
      <motion.div className="absolute inset-0 pointer-events-none rounded-xl"
        style={{ opacity: glowOpacity, background: glowBg }} />

      {/* top gradient border on hover */}
      <motion.div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.22),transparent)" }}
        animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }} />

      {/* shimmer sweep */}
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left: 0, width: "55%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.35),transparent)", x: shimmerTranslate }} />

      {/* corner brackets */}
      <CornerBrackets hovered={hovered} />

      <div className="relative">
        {/* activity row */}
        <div className="flex items-center justify-between mb-2.5">
          <LiveDot label={dot} />
          <TxCounter seed={sparkSeed} />
        </div>

        {/* sparkline */}
        <Sparkline seed={sparkSeed} />

        {/* stats */}
        <div className="flex gap-2 mb-3.5">
          {stats.map(s => <StatPill key={s.lbl} val={s.val} lbl={s.lbl} />)}
        </div>

        {/* message ticker */}
        <MessageTicker messages={tickers} offset={sparkSeed * 10} />

        <motion.h3
          className="text-[17px] font-medium text-black mb-2"
          animate={{ color: hovered ? "#000" : "rgba(0,0,0,0.85)" }}
        >
          {title}
        </motion.h3>
        <p className="text-xs text-black/55 leading-relaxed mb-4">{challenge}</p>

        <Link to={path} className="text-[11px] text-black/50 hover:text-black inline-flex items-center gap-1">
          {link}
          <motion.span animate={{ x: hovered ? 4 : 0 }} transition={{ duration: 0.2, ease: EASE }}>→</motion.span>
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function Industries() {
  return (
    <section className="py-24 px-4 bg-black/[0.02]" id="industries">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Industries
          </motion.p>
          <motion.h2 className="text-4xl md:text-5xl font-normal text-black mb-4 tracking-tight"
            variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Built for industries where integration failure isn't an option.
          </motion.h2>
          <motion.p className="text-base text-black/60"
            variants={fadeUpLarge} custom={0.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Deep experience in the sectors where EDI and B2B integration matter most.
          </motion.p>
        </div>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {industries.map(ind => (
            <IndustryCard key={ind.title} {...ind} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}