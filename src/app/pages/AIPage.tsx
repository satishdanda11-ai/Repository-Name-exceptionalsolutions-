import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const services = [
  { label: "Process Automation",           desc: "Automate repetitive, rules-based work to free your people for higher-value tasks. Built on clean, connected data — not isolated automation that breaks when systems change." },
  { label: "Document & Data Intelligence",  desc: "Extract, classify and act on information locked in documents and unstructured data. Intelligent processing that connects directly into your enterprise workflows." },
  { label: "AI for Integration Operations", desc: "Apply AI to your integration data to predict and prevent failures before they affect an order. Anomaly detection and intelligent exception handling that keeps the supply chain moving." },
];

const beforeAfter = [
  { before: "Fragmented data",           after: "single, trusted source",  badge: "↑ 94% accuracy" },
  { before: "Manual exception handling", after: "automated resolution",    badge: "↓ 80% effort"   },
  { before: "Reactive monitoring",       after: "predictive prevention",   badge: "3× faster"       },
  { before: "Disconnected insights",     after: "real-time decisions",     badge: "Zero lag"        },
];

// ─── Wave canvas — black only (no blue) ──────────────────────────────────────
function WaveCanvas({ opacity = 1 }: { opacity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number, t = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const WAVES = [
      { amp: 20, freq: 0.011, spd: 0.016, y: 0.38, a: 0.07, lw: 1.8 },
      { amp: 13, freq: 0.017, spd: 0.022, y: 0.52, a: 0.05, lw: 1.2 },
      { amp: 24, freq: 0.008, spd: 0.012, y: 0.62, a: 0.04, lw: 2.2 },
      { amp:  9, freq: 0.024, spd: 0.028, y: 0.30, a: 0.03, lw: 1.0 },
      { amp: 16, freq: 0.013, spd: 0.018, y: 0.72, a: 0.03, lw: 1.5 },
    ];
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H); t++;
      WAVES.forEach(w => {
        ctx.beginPath(); ctx.moveTo(0, H * w.y);
        for (let x = 0; x <= W; x += 2) {
          const y = H * w.y + Math.sin(x * w.freq + t * w.spd) * w.amp
                             + Math.sin(x * w.freq * 1.7 + t * w.spd * 0.6) * w.amp * 0.35;
          ctx.lineTo(x, y);
        }
        // black only — no blue
        ctx.strokeStyle = `rgba(0,0,0,${w.a * opacity})`; ctx.lineWidth = w.lw; ctx.stroke();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, [opacity]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />;
}

// ─── Neural particle canvas — black only ─────────────────────────────────────
function NeuralCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;
    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    let pts: P[] = [];
    const resize = () => {
      canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
      pts = Array.from({ length: 32 }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, vy: -Math.random() * 0.35 - 0.08,
        r: Math.random() * 2 + 1, a: Math.random() * 0.09 + 0.03,
      }));
    };
    resize(); window.addEventListener("resize", resize);
    const draw = () => {
      const W = canvas.width, H = canvas.height; ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx*dx+dy*dy);
          if (d < 130) {
            // black edges, not blue
            ctx.globalAlpha = ((130-d)/130)*0.05; ctx.strokeStyle = "#111"; ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke();
          }
        }
      pts.forEach(p => {
        ctx.globalAlpha = p.a; ctx.fillStyle = "#111"; // black, not blue
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < -4) { p.y = H+4; p.x = Math.random()*W; }
        if (p.x < 0 || p.x > W) p.vx *= -1;
      });
      ctx.globalAlpha = 1; id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />;
}

// ─── Hero stat pill — green dot, no blue ─────────────────────────────────────
function HeroStats() {
  const lines = ["14,382 transactions processed today", "99.98% uptime across managed estates", "3× faster partner onboarding", "0 lost messages this month"];
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const id = setInterval(() => { setVis(false); setTimeout(() => { setIdx(i => (i+1)%lines.length); setVis(true); }, 300); }, 2800);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.div className="inline-flex items-center gap-2 text-[11px] text-black/50 border border-black/10 rounded-full px-3 py-1.5"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}>
      {/* green dot — consistent with rest of site */}
      <motion.span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"
        animate={{ boxShadow: ["0 0 0 0px rgba(34,197,94,0.5)","0 0 0 4px rgba(34,197,94,0)","0 0 0 0px rgba(34,197,94,0.5)"] }}
        transition={{ duration: 1.8, repeat: Infinity }} />
      <span style={{ opacity: vis ? 1 : 0, transition: "opacity 0.25s" }}>{lines[idx]}</span>
    </motion.div>
  );
}

// ─── Before/After card — all black, no blue ───────────────────────────────────
function BeforeAfterCard() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <motion.div className="border border-black/10 rounded-lg p-8 bg-white"
      variants={fadeUp} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs text-black/40 uppercase tracking-wide">What changes</div>
        <div className="inline-flex items-center gap-1.5 text-[9px] text-black/40 bg-black/[0.04] rounded-full px-2.5 py-1">
          <motion.span className="w-1 h-1 rounded-full bg-green-500 flex-shrink-0"
            animate={{ boxShadow: ["0 0 0 0px rgba(34,197,94,0.5)","0 0 0 3px rgba(34,197,94,0)","0 0 0 0px rgba(34,197,94,0.5)"] }}
            transition={{ duration: 1.8, repeat: Infinity }} />
          Processing live
        </div>
      </div>
      <motion.div className="space-y-0" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
        {beforeAfter.map((row, i) => (
          <motion.div key={row.before} variants={staggerItem}
            className="relative py-3 border-b border-black/[0.05] last:border-0 cursor-default overflow-hidden"
            onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}>
            {/* black sweep — no blue-50 */}
            <motion.div className="absolute inset-0 bg-black/[0.025]"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: active === i ? 1 : 0 }}
              transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }} />
            <div className="flex items-center gap-2 relative">
              <motion.span className="text-sm"
                animate={{ color: active === i ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0.38)", x: active === i ? -3 : 0 }}
                style={{ textDecoration: active === i ? "line-through" : "none", textDecorationColor: "rgba(0,0,0,0.2)" }}
                transition={{ duration: 0.22 }}>
                {row.before}
              </motion.span>
              {/* arrow — black, not blue */}
              <motion.span className="text-xs flex-shrink-0"
                animate={{ color: active === i ? "#111827" : "rgba(0,0,0,0.2)", x: active === i ? 2 : 0 }}
                transition={{ duration: 0.2 }}>→</motion.span>
              <motion.span className="text-sm"
                animate={{ color: active === i ? "#111827" : "rgba(0,0,0,0.68)", fontWeight: active === i ? 500 : 400 }}
                transition={{ duration: 0.2 }}>
                {row.after}
              </motion.span>
              {/* badge — black, not blue */}
              <motion.span className="ml-auto text-[9px] font-medium text-black/60 bg-black/[0.06] px-1.5 py-0.5 rounded flex-shrink-0"
                animate={{ opacity: active === i ? 1 : 0, x: active === i ? 0 : 8 }}
                transition={{ duration: 0.2 }}>
                {row.badge}
              </motion.span>
            </div>
            {/* underline — black, not blue */}
            <motion.div className="absolute bottom-0 left-0 h-px bg-black/30"
              animate={{ scaleX: active === i ? 1 : 0 }}
              style={{ originX: 0, width: "100%" }}
              transition={{ duration: 0.32, ease: [0.16,1,0.3,1] }} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Pipeline diagram — black only, scroll-count numbers ─────────────────────
function PipelineDiagram() {
  const steps = ["Systems", "Integration", "Clean Data", "AI Models", "Outcomes"];
  const [activeStep, setActiveStep] = useState(0);
  const [counted, setCounted] = useState(false);
  const [nums, setNums] = useState(steps.map(() => 0));
  const trackRef  = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setActiveStep(s => (s+1) % steps.length), 1500);
    return () => clearInterval(id);
  }, []);

  // scroll-count numbers when pipeline enters view
  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !counted) {
        setCounted(true);
        steps.forEach((_, i) => {
          const target = i + 1;
          let cur = 0;
          const id = setInterval(() => {
            cur++;
            setNums(prev => { const n = [...prev]; n[i] = Math.min(cur, target); return n; });
            if (cur >= target * 4) clearInterval(id);
          }, 30);
        });
      }
    }, { threshold: 0.3 });
    obs.observe(el); return () => obs.disconnect();
  }, [counted]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;
    type Pkt = { p: number; spd: number };
    let pkts: Pkt[] = [{ p: 0, spd: 0.008 }, { p: 0.35, spd: 0.009 }, { p: 0.68, spd: 0.007 }];
    const resize = () => {
      canvas.width  = (trackRef.current?.offsetWidth ?? 400) * 2;
      canvas.height = 6; canvas.style.width = (trackRef.current?.offsetWidth ?? 400) + "px"; canvas.style.height = "3px";
    };
    resize();
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pkts = pkts.map(pk => {
        pk.p += pk.spd; if (pk.p > 1) pk.p = 0;
        const x = pk.p * canvas.width;
        const fade = pk.p < 0.06 ? pk.p/0.06 : pk.p > 0.88 ? (1-pk.p)/0.12 : 1;
        ctx.globalAlpha = fade * 0.7;
        // black dots, not blue
        ctx.fillStyle = "#111"; ctx.shadowColor = "#111"; ctx.shadowBlur = 5;
        ctx.beginPath(); ctx.arc(x, canvas.height/2, 3, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        return pk;
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div ref={wrapRef} className="mt-8 bg-white border border-black/10 rounded-lg px-8 py-7">
      <p className="text-[9px] text-black/35 uppercase tracking-widest mb-7">How it connects</p>
      <div className="relative flex items-start justify-between">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-2" style={{ flex: 1, zIndex: 2, position: "relative" }}>
            <motion.div
              className="w-10 h-10 rounded-full border flex items-center justify-center text-xs font-medium tabular-nums"
              animate={{
                background:  activeStep === i ? "#111827" : "#fff",
                borderColor: activeStep === i ? "#111827" : "rgba(0,0,0,0.14)",
                color:       activeStep === i ? "#fff"    : "rgba(0,0,0,0.45)",
                // black ring, not blue
                boxShadow:   activeStep === i ? "0 0 0 5px rgba(0,0,0,0.08)" : "none",
              }}
              transition={{ duration: 0.35 }}>
              {/* scroll-counted number */}
              {nums[i]}
            </motion.div>
            <motion.span className="text-[9px] text-center leading-tight"
              animate={{
                color:      activeStep === i ? "#111827" : "rgba(0,0,0,0.42)",
                fontWeight: activeStep === i ? 600 : 400,
              }}
              transition={{ duration: 0.25 }}>
              {s}
            </motion.span>
          </div>
        ))}
        <div ref={trackRef} className="absolute" style={{ top: 19, left: "5%", right: "5%", height: 2, background: "rgba(0,0,0,0.07)", zIndex: 1 }}>
          {/* fill — black/grey, not blue */}
          <motion.div className="absolute top-0 left-0 h-full bg-black/20"
            animate={{ width: `${(activeStep / (steps.length-1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }} />
          <canvas ref={canvasRef} className="absolute" style={{ top: -1 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Service row — black hover, no blue ──────────────────────────────────────
function ServiceRow({ label, desc, index }: { label: string; desc: string; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [counted, setCounted] = useState(false);
  const [num, setNum] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // scroll-count the step number
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !counted) {
        setCounted(true);
        let cur = 0; const target = index + 1;
        const id = setInterval(() => {
          cur++; setNum(Math.min(cur, target));
          if (cur >= target * 4) clearInterval(id);
        }, 30);
      }
    }, { threshold: 0.4 });
    obs.observe(el); return () => obs.disconnect();
  }, [counted, index]);

  return (
    <motion.div ref={ref} variants={staggerItem}
      className="grid md:grid-cols-12 gap-6 py-10 border-b border-black/10 relative overflow-hidden cursor-default"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* black sweep — no blue-50 */}
      <motion.div className="absolute inset-0 bg-black/[0.018]" initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }} />
      <div className="md:col-span-1 pt-1 relative">
        <motion.span className="text-xs font-medium tabular-nums"
          // black on hover, not blue
          animate={{ color: hovered ? "#111827" : "rgba(0,0,0,0.2)" }} transition={{ duration: 0.2 }}>
          {String(num).padStart(2, "0")}
        </motion.span>
      </div>
      <div className="md:col-span-3 relative">
        <h3 className="text-base font-medium text-black">{label}</h3>
        <div className="mt-2 h-px w-full bg-black/[0.08] overflow-hidden">
          {/* underline — black, not blue */}
          <motion.div className="h-full bg-black origin-left"
            animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }} />
        </div>
      </div>
      <div className="md:col-span-8 relative">
        <p className="text-sm text-black/60 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function AIPage() {
  return (
    <>
      {/* ── Hero — waves + particles, all black ── */}
      <section className="pt-40 pb-24 px-4 relative overflow-hidden bg-white">
        <WaveCanvas />
        <NeuralCanvas />
        <div className="max-w-6xl mx-auto relative" style={{ zIndex: 1 }}>
          <div className="max-w-3xl space-y-6">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>
              AI Solutions
            </motion.p>
            <motion.h1 className="text-5xl md:text-6xl font-normal text-black leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}>
              Applied AI, grounded in data you can trust.
            </motion.h1>
            <motion.p className="text-lg text-black/60 leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
              AI is only as good as the data underneath it. As integration specialists, we connect your data first, then put AI to work on it — so the results are real, not theoretical.
            </motion.p>
            <HeroStats />
            <motion.div className="flex flex-wrap gap-3 pt-2"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE, delay: 0.45 }}>
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
                <Link to="/contact" className="block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors"
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                  Talk to an architect about AI
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
                <Link to="/services/edi-b2b-integration" className="block border border-black/20 text-black px-6 py-2.5 text-sm rounded-md hover:bg-black/[0.03] transition-colors">
                  See our integration foundation
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="py-24 px-4 bg-black/[0.02] border-t border-b border-black/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              The Root Cause
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight mb-6"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Most AI initiatives stall before they start.
            </motion.h2>
            <motion.p className="text-base text-black/60 leading-relaxed"
              variants={fadeUpLarge} custom={0.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Fragmented data, inconsistent formats, disconnected systems. When the foundation is broken, AI built on top of it produces unreliable results — and confident-looking dashboards that no one trusts.
            </motion.p>
            <motion.p className="text-base text-black/60 leading-relaxed mt-4"
              variants={fadeUpLarge} custom={0.18} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              We solve the root cause first. We connect your systems and data, then apply AI where it produces measurable business value.
            </motion.p>
          </div>
          <BeforeAfterCard />
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
              Where we apply AI to create measurable value
            </motion.h2>
          </div>
          <motion.div className="space-y-0" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {services.map((s, i) => <ServiceRow key={s.label} label={s.label} desc={s.desc} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── How It Connects ── */}
      <section className="py-24 px-4 bg-black/[0.02] border-t border-b border-black/10">
        <div className="max-w-6xl mx-auto max-w-3xl">
          <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            How It Connects
          </motion.p>
          <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight mb-6"
            variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Integration-first. Then AI.
          </motion.h2>
          <motion.p className="text-base text-black/60 leading-relaxed"
            variants={fadeUpLarge} custom={0.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Because we connect your systems and data first, the AI we build runs on a foundation that is complete, current and trustworthy. The models are not the hard part — the data plumbing is.
          </motion.p>
          <motion.div variants={fadeUp} custom={0.18} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <PipelineDiagram />
          </motion.div>
          <motion.div className="mt-8" variants={fadeUp} custom={0.25} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <Link to="/services/edi-b2b-integration" className="text-sm text-black underline underline-offset-4 hover:text-black/60 transition-colors">
              Learn about our integration foundation →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── CTA — waves only here ── */}
      <section className="py-24 px-4 relative overflow-hidden">
        <WaveCanvas opacity={0.8} />
        <div className="max-w-6xl mx-auto text-center space-y-6 relative" style={{ zIndex: 1 }}>
          <motion.h2 className="text-4xl font-normal text-black tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Ready to put your data to work?
          </motion.h2>
          <motion.p className="text-base text-black/60 max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Talk to a senior architect about where AI can genuinely move the needle in your operations.
          </motion.p>
          <motion.div variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact" className="inline-block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
              Talk to an architect about AI
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}