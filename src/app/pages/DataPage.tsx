import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const services = [
  { label: "Analytics & Reporting", desc: "Dashboards and reporting that give leaders a single, trusted view of the business. Built on clean, connected data — so the numbers mean what they say." },
  { label: "Data Quality",          desc: "Clean, consistent, reliable data, so the decisions built on it are sound. We identify and resolve the quality issues that make analytics teams distrust their own reports." },
  { label: "Data Pipelines",        desc: "Robust pipelines that move data where it is needed, when it is needed. Designed for enterprise reliability — not brittle one-off scripts that break on a schema change." },
];

const valueProps = [
  { label: "Single trusted view",  desc: "One source of truth across ERP, WMS, and trading systems",      metric: "100%",  unit: "accuracy" },
  { label: "Real-time visibility", desc: "Data that reflects what is happening now, not last night",       metric: "<1s",   unit: "latency"  },
  { label: "Actionable reporting", desc: "Reports that leaders use, not reports that gather dust",         metric: "3×",    unit: "faster decisions" },
];

// ─── Flowing data stream canvas — hero background ─────────────────────────────
function DataStreamCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;

    type Stream = { x: number; y: number; vy: number; len: number; alpha: number; phase: number };
    let streams: Stream[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
      streams = Array.from({ length: 22 }, (_, i) => ({
        x: (canvas.width / 22) * i + Math.random() * 40 - 20,
        y: Math.random() * canvas.height,
        vy: 0.4 + Math.random() * 0.6,
        len: 40 + Math.random() * 60,
        alpha: 0.04 + Math.random() * 0.07,
        phase: Math.random() * Math.PI * 2,
      }));
    };
    resize(); window.addEventListener("resize", resize);

    let t = 0;
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H); t++;
      streams.forEach(s => {
        const pulse = 0.6 + Math.sin(t * 0.03 + s.phase) * 0.4;
        const grad = ctx.createLinearGradient(s.x, s.y - s.len, s.x, s.y);
        grad.addColorStop(0, `rgba(0,0,0,0)`);
        grad.addColorStop(1, `rgba(0,0,0,${s.alpha * pulse})`);
        ctx.strokeStyle = grad; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(s.x, s.y - s.len); ctx.lineTo(s.x, s.y); ctx.stroke();
        // head dot
        ctx.globalAlpha = s.alpha * pulse * 1.8;
        ctx.fillStyle = "#111";
        ctx.beginPath(); ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        s.y += s.vy;
        if (s.y - s.len > H) s.y = -s.len;
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />;
}

// ─── Live metric counter in hero ──────────────────────────────────────────────
function HeroLiveBar() {
  const metrics = [
    { label: "Records processed today", val: 2847392, increment: 120 },
    { label: "Pipeline health",         val: 99,      increment: 0,   suffix: "%" },
    { label: "Avg query time",          val: 48,      increment: 0,   suffix: "ms" },
  ];
  const [counts, setCounts] = useState(metrics.map(m => m.val));
  useEffect(() => {
    const id = setInterval(() => {
      setCounts(prev => prev.map((c, i) => i === 0 ? c + Math.floor(Math.random() * 8) + 2 : c));
    }, 800);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div className="inline-flex items-center gap-5 border border-black/10 rounded-lg px-5 py-3"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}>
      {metrics.map((m, i) => (
        <div key={m.label} className="flex items-center gap-3">
          {i > 0 && <div className="w-px h-6 bg-black/10" />}
          <div>
            <div className="text-base font-medium text-black tabular-nums">
              {i === 0 ? counts[i].toLocaleString() : counts[i]}{m.suffix ?? ""}
            </div>
            <div className="text-[9px] text-black/38 uppercase tracking-wide mt-0.5">{m.label}</div>
          </div>
        </div>
      ))}
      <div className="w-px h-6 bg-black/10" />
      <motion.span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"
        animate={{ boxShadow: ["0 0 0 0px rgba(34,197,94,0.5)", "0 0 0 4px rgba(34,197,94,0)", "0 0 0 0px rgba(34,197,94,0.5)"] }}
        transition={{ duration: 1.8, repeat: Infinity }} />
    </motion.div>
  );
}

// ─── Animated sparkline for value prop cards ──────────────────────────────────
function MiniSparkline({ seed }: { seed: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = canvas.offsetWidth * 2; canvas.height = 40;
    canvas.style.height = "20px";
    let r = seed;
    const rand = () => { r = (r * 1664525 + 1013904223) & 0xffffffff; return (r >>> 0) / 4294967296; };
    const pts: number[] = []; let v = 15;
    for (let i = 0; i < 20; i++) { v = Math.max(4, Math.min(32, v + (rand() - 0.42) * 12)); pts.push(v); }
    const W = canvas.width, H = canvas.height, step = W / (pts.length - 1);
    // fill
    ctx.beginPath(); ctx.moveTo(0, H);
    pts.forEach((p, i) => ctx.lineTo(i * step, H - p));
    ctx.lineTo(W, H); ctx.closePath();
    ctx.fillStyle = "rgba(0,0,0,0.04)"; ctx.fill();
    // line
    ctx.beginPath();
    pts.forEach((p, i) => i ? ctx.lineTo(i * step, H - p) : ctx.moveTo(0, H - p));
    ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 1.5; ctx.stroke();
    // last dot
    const lx = (pts.length - 1) * step, ly = H - pts[pts.length - 1];
    ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(lx, ly, 3, 0, Math.PI * 2); ctx.fill();
  }, [seed]);
  return <canvas ref={ref} className="w-full" style={{ display: "block", height: 20 }} />;
}

// ─── Value prop card with metric + sparkline + cursor glow ────────────────────
function ValueCard({ item, index }: { item: typeof valueProps[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const glowX = useMotionValue(50), glowY = useMotionValue(50), glowOp = useMotionValue(0);
  const glowBg = useTransform([glowX, glowY],
    ([x, y]) => `radial-gradient(ellipse at ${x}% ${y}%, rgba(0,0,0,0.04) 0%, transparent 65%)`);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    glowX.set(((e.clientX - r.left) / r.width) * 100);
    glowY.set(((e.clientY - r.top)  / r.height) * 100);
    animate(glowOp, 1, { duration: 0.25 });
  };
  const onLeave = () => { setHovered(false); animate(glowOp, 0, { duration: 0.3 }); };

  // shimmer on enter
  const shimX = useMotionValue(-100);
  const shimT = useTransform(shimX, v => `${v}%`);
  const onEnter = useCallback(() => {
    setHovered(true);
    shimX.set(-100); animate(shimX, 200, { duration: 0.5, ease: "easeInOut" });
  }, [shimX]);

  return (
    <motion.div variants={staggerItem}
      className="border border-black/10 rounded-lg p-6 bg-white relative overflow-hidden cursor-default"
      whileHover={{ y: -3, borderColor: "rgba(0,0,0,0.22)", boxShadow: "0 8px 32px rgba(0,0,0,0.07)", transition: { duration: 0.18, ease: EASE } }}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>

      {/* cursor glow */}
      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ opacity: glowOp, background: glowBg }} />
      {/* shimmer */}
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left: 0, width: "55%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.3),transparent)", x: shimT }} />
      {/* top border on hover */}
      <motion.div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.18),transparent)" }}
        animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }} />

      <div className="relative">
        {/* metric + sparkline row */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <motion.div className="text-2xl font-medium text-black tabular-nums"
              animate={{ scale: hovered ? 1.04 : 1 }} transition={{ duration: 0.2 }}>
              {item.metric}
            </motion.div>
            <div className="text-[9px] text-black/35 uppercase tracking-wide mt-0.5">{item.unit}</div>
          </div>
          <div className="w-24">
            <MiniSparkline seed={index * 37 + 11} />
          </div>
        </div>
        <div className="text-sm font-medium text-black mb-1">{item.label}</div>
        <div className="text-sm text-black/50">{item.desc}</div>
        {/* animated underline sweep */}
        <motion.div className="mt-3 h-px bg-black origin-left"
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
      </div>
    </motion.div>
  );
}

// ─── Service row with hover sweep ─────────────────────────────────────────────
function ServiceRow({ label, desc, index }: { label: string; desc: string; index: number }) {
  const [hovered, setHovered] = useState(false);

  // data packet canvas inside each row
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rowRef    = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;
    type Pkt = { p: number; spd: number };
    let pkts: Pkt[] = [{ p: index * 0.3, spd: 0.006 + index * 0.001 }];
    const resize = () => {
      canvas.width = (rowRef.current?.offsetWidth ?? 600) * 2;
      canvas.height = 4; canvas.style.height = "2px";
      canvas.style.width = (rowRef.current?.offsetWidth ?? 600) + "px";
    };
    resize();
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pkts = pkts.map(pk => {
        pk.p += pk.spd; if (pk.p > 1) pk.p = 0;
        const x = pk.p * canvas.width;
        const fade = pk.p < 0.05 ? pk.p / 0.05 : pk.p > 0.9 ? (1 - pk.p) / 0.1 : 1;
        ctx.globalAlpha = fade * 0.55;
        ctx.fillStyle = "#111"; ctx.shadowColor = "#111"; ctx.shadowBlur = 4;
        ctx.beginPath(); ctx.arc(x, canvas.height / 2, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        return pk;
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, [index]);

  return (
    <motion.div ref={rowRef} variants={staggerItem}
      className="grid md:grid-cols-12 gap-6 py-10 border-b border-black/10 relative overflow-hidden cursor-default"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* hover bg sweep */}
      <motion.div className="absolute inset-0 bg-black/[0.018]" initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} />
      {/* packet line at bottom of row */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 2, background: "rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <canvas ref={canvasRef} className="absolute top-0 left-0" />
      </div>
      <div className="md:col-span-1 pt-1 relative">
        <motion.span className="text-xs font-medium"
          animate={{ color: hovered ? "#111827" : "rgba(0,0,0,0.2)" }} transition={{ duration: 0.2 }}>
          0{index + 1}
        </motion.span>
      </div>
      <div className="md:col-span-3 relative">
        <h3 className="text-base font-medium text-black">{label}</h3>
        <div className="mt-2 h-px w-full bg-black/[0.08] overflow-hidden">
          <motion.div className="h-full bg-black origin-left"
            animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
        </div>
      </div>
      <div className="md:col-span-8 relative">
        <p className="text-sm text-black/60 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

// ─── Animated data flow diagram in "Connection" section ───────────────────────
function DataFlowDiagram() {
  const steps = ["ERP", "Integration", "Data Lake", "Analytics", "Decisions"];
  const colors = ["rgba(0,0,0,0.12)", "rgba(0,0,0,0.18)", "rgba(0,0,0,0.22)", "rgba(0,0,0,0.18)", "rgba(0,0,0,0.12)"];
  const [activeStep, setActiveStep] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setActiveStep(s => (s + 1) % steps.length), 1400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;
    type Pkt = { p: number; spd: number };
    let pkts: Pkt[] = [{ p: 0, spd: 0.007 }, { p: 0.4, spd: 0.008 }, { p: 0.7, spd: 0.006 }];
    const resize = () => {
      canvas.width = (trackRef.current?.offsetWidth ?? 500) * 2;
      canvas.height = 6; canvas.style.height = "3px";
      canvas.style.width = (trackRef.current?.offsetWidth ?? 500) + "px";
    };
    resize();
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pkts = pkts.map(pk => {
        pk.p += pk.spd; if (pk.p > 1) pk.p = 0;
        const x = pk.p * canvas.width;
        const fade = pk.p < 0.06 ? pk.p / 0.06 : pk.p > 0.88 ? (1 - pk.p) / 0.12 : 1;
        ctx.globalAlpha = fade * 0.7;
        ctx.fillStyle = "#111"; ctx.shadowColor = "#111"; ctx.shadowBlur = 5;
        ctx.beginPath(); ctx.arc(x, canvas.height / 2, 3, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        return pk;
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="mt-8 bg-white border border-black/10 rounded-lg px-7 py-6">
      <p className="text-[9px] text-black/35 uppercase tracking-widest mb-6">Data flow</p>
      <div className="relative flex items-start justify-between">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-2" style={{ flex: 1, position: "relative", zIndex: 2 }}>
            <motion.div
              className="w-9 h-9 rounded-full border flex items-center justify-center text-[9px] font-medium"
              animate={{
                background:  activeStep === i ? "#111827" : "#fff",
                borderColor: activeStep === i ? "#111827" : "rgba(0,0,0,0.14)",
                color:       activeStep === i ? "#fff"    : "rgba(0,0,0,0.45)",
                boxShadow:   activeStep === i ? "0 0 0 5px rgba(0,0,0,0.08)" : "none",
              }}
              transition={{ duration: 0.32 }}>
              {i + 1}
            </motion.div>
            <motion.span className="text-[9px] text-center leading-tight"
              animate={{ color: activeStep === i ? "#111827" : "rgba(0,0,0,0.38)", fontWeight: activeStep === i ? 600 : 400 }}
              transition={{ duration: 0.25 }}>
              {s}
            </motion.span>
          </div>
        ))}
        {/* track */}
        <div ref={trackRef} className="absolute" style={{ top: 17, left: "5%", right: "5%", height: 2, background: "rgba(0,0,0,0.07)", zIndex: 1 }}>
          <motion.div className="absolute top-0 left-0 h-full bg-black/20"
            animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }} />
          <canvas ref={canvasRef} className="absolute" style={{ top: -1 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function DataPage() {
  return (
    <>
      {/* ── Hero — data stream background ── */}
      <section className="pt-40 pb-24 px-4 relative overflow-hidden bg-white">
        <DataStreamCanvas />
        <div className="max-w-6xl mx-auto relative" style={{ zIndex: 1 }}>
          <div className="max-w-3xl space-y-6">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>
              Data & Analytics
            </motion.p>
            <motion.h1 className="text-5xl md:text-6xl font-normal text-black leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}>
              Turn connected data into decisions.
            </motion.h1>
            <motion.p className="text-lg text-black/60 leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
              Once your data flows freely, it becomes your most valuable asset. We help you turn it into clear, reliable insight your leaders can act on — built on a foundation we connect first.
            </motion.p>

            {/* live metrics bar */}
            <HeroLiveBar />

            <motion.div className="flex flex-wrap gap-3 pt-2"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE, delay: 0.45 }}>
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
                <Link to="/contact" className="block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors"
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                  Talk to an architect about data
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Connection section ── */}
      <section className="py-24 px-4 bg-black/[0.02] border-t border-b border-black/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              The Connection
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight mb-6"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Integration and data are two halves of the same job.
            </motion.h2>
            <motion.p className="text-base text-black/60 leading-relaxed"
              variants={fadeUpLarge} custom={0.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Most data projects underdeliver because the underlying data is incomplete or inconsistent. Systems that don't talk to each other produce reports no one trusts — and decisions no one acts on.
            </motion.p>
            <motion.p className="text-base text-black/60 leading-relaxed mt-4"
              variants={fadeUpLarge} custom={0.18} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              We connect the systems first. Then we make the data they produce work for you: clean, reliable, actionable.
            </motion.p>
            {/* Data flow pipeline */}
            <motion.div variants={fadeUp} custom={0.24} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              <DataFlowDiagram />
            </motion.div>
          </div>

          {/* Value prop cards */}
          <motion.div className="space-y-4"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {valueProps.map((item, i) => <ValueCard key={item.label} item={item} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              What We Do
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Where we help you get more from your data
            </motion.h2>
          </div>
          <motion.div className="space-y-0" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {services.map((s, i) => <ServiceRow key={s.label} label={s.label} desc={s.desc} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 border-t border-black/10">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.h2 className="text-4xl font-normal text-black tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Make your data work for you.
          </motion.h2>
          <motion.p className="text-base text-black/60 max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Talk to an architect about turning your connected enterprise data into decisions that move the business forward.
          </motion.p>
          <motion.div variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact" className="inline-block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
              Talk to an architect about data
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}