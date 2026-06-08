import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const lifecycle = [
  { phase: "Assess & Modernise",    desc: "We audit your existing EDI estate, identify risk and cost, and migrate you off ageing or unsupported platforms — without disrupting live trading." },
  { phase: "Implement & Integrate", desc: "We stand up EDI and B2B integration and connect it cleanly to your ERP, WMS, and trading-partner systems." },
  { phase: "Onboard Partners",      desc: "We run managed trading-partner onboarding, turning a process that takes weeks into one that takes days." },
  { phase: "Operate & Monitor",     desc: "We run managed EDI operations, monitoring and exception handling — so your internal team is never paged at 2am for a failed transaction." },
  { phase: "Optimise",              desc: "We apply analytics and AI to your integration data to predict and prevent failures before they affect an order." },
];

const platforms = ["IBM Sterling", "Cleo", "MuleSoft", "Boomi", "Apigee", "Axway B2B"];

const outcomes = [
  { label: "Revenue Protection",  desc: "Fewer failed transactions means fewer delayed and lost orders. Your revenue stops depending on integration that might break.",           metric: "99.98%" },
  { label: "Lower Cost-to-Serve", desc: "Automated exception handling removes the quiet, recurring labour cost of fixing EDI errors by hand.",                                   metric: "40%"    },
  { label: "Risk & Compliance",   desc: "Full audit trails, secure data exchange, and reliable conformance to trading-partner mandates.",                                        metric: "100%"   },
  { label: "Scalability",         desc: "Onboard your next hundred trading partners without adding a hundred partners' worth of cost or headcount.",                             metric: "10×"    },
];

const differentiators = [
  { heading: "Multi-platform specialists, not a single-vendor reseller.",  desc: "We are fluent across all six major platforms and vendor-neutral in our advice. You will never be pushed toward a platform because it suits us." },
  { heading: "Senior engineers on your work, not a junior support tier.", desc: "The people who scope your project are the people who deliver it. There is no handoff to a team you haven't met." },
  { heading: "Faster and more responsive than a global firm.",             desc: "More disciplined and certified than a typical offshore vendor. You get both — challenger speed and enterprise rigour." },
];

// ─── Wave background — black only ────────────────────────────────────────────
function WaveBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number, t = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const WAVES = [
      { amp: 18, freq: 0.012, spd: 0.018, y: 0.42, a: 0.07, lw: 1.8 },
      { amp: 12, freq: 0.018, spd: 0.024, y: 0.52, a: 0.05, lw: 1.2 },
      { amp: 22, freq: 0.009, spd: 0.013, y: 0.60, a: 0.04, lw: 2.2 },
      { amp:  9, freq: 0.025, spd: 0.031, y: 0.35, a: 0.03, lw: 1.0 },
      { amp: 15, freq: 0.014, spd: 0.020, y: 0.70, a: 0.03, lw: 1.5 },
    ];
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H); t++;
      WAVES.forEach(w => {
        ctx.beginPath(); ctx.moveTo(0, H * w.y);
        for (let x = 0; x <= W; x += 2) {
          const y = H * w.y + Math.sin(x * w.freq + t * w.spd) * w.amp
                             + Math.sin(x * w.freq * 1.6 + t * w.spd * 0.7) * w.amp * 0.4;
          ctx.lineTo(x, y);
        }
        // black/dark only — no blue
        ctx.strokeStyle = `rgba(0,0,0,${w.a})`; ctx.lineWidth = w.lw; ctx.stroke();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />;
}

// ─── Particle canvas — black only ────────────────────────────────────────────
function DataParticles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;
    type P = { x: number; y: number; vx: number; vy: number; a: number; r: number };
    let pts: P[] = [];
    const resize = () => {
      canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
      pts = Array.from({ length: 28 }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35, vy: -Math.random() * 0.4 - 0.1,
        a: Math.random() * 0.09 + 0.03, r: Math.random() * 2 + 1,
      }));
    };
    resize(); window.addEventListener("resize", resize);
    const draw = () => {
      const W = canvas.width, H = canvas.height; ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx*dx+dy*dy);
          if (d < 120) {
            ctx.globalAlpha = ((120-d)/120)*0.05;
            ctx.strokeStyle = "#111"; ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke();
          }
        }
      pts.forEach(p => {
        ctx.globalAlpha = p.a; ctx.fillStyle = "#111";
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

// ─── Live counter ─────────────────────────────────────────────────────────────
function LiveCounter() {
  const [count, setCount] = useState(14382);
  useEffect(() => {
    const id = setInterval(() => setCount(c => c + Math.floor(Math.random()*4)+1), 1600);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.div className="inline-flex items-center gap-2 text-[11px] text-black/50 border border-black/10 rounded-full px-3 py-1.5"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}>
      <motion.span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"
        animate={{ boxShadow: ["0 0 0 0px rgba(34,197,94,.5)","0 0 0 4px rgba(34,197,94,0)","0 0 0 0px rgba(34,197,94,.5)"] }}
        transition={{ duration: 1.8, repeat: Infinity }} />
      {count.toLocaleString()} EDI transactions processed today
    </motion.div>
  );
}

// ─── Lifecycle row — number scrolls up on enter ───────────────────────────────
function LifecycleRow({ item, index }: { item: typeof lifecycle[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [counted, setCounted] = useState(false);
  const [num, setNum] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // scroll-count the step number when it enters view
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !counted) {
        setCounted(true);
        let current = 0;
        const target = index + 1;
        const steps = target * 4;
        const id = setInterval(() => {
          current++;
          setNum(Math.min(current, target));
          if (current >= steps) clearInterval(id);
        }, 30);
      }
    }, { threshold: 0.4 });
    obs.observe(el); return () => obs.disconnect();
  }, [counted, index]);

  return (
    <motion.div ref={ref} variants={staggerItem}
      className="grid md:grid-cols-12 gap-6 py-8 border-b border-black/10 items-start relative overflow-hidden cursor-default"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* hover sweep */}
      <motion.div className="absolute inset-0 bg-black/[0.015]" initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }} />

      {/* animated step number */}
      <div className="md:col-span-1 relative">
        <motion.span className="text-xs font-medium tabular-nums"
          animate={{ color: hovered ? "#111827" : "rgba(0,0,0,0.2)" }} transition={{ duration: 0.2 }}>
          {String(num).padStart(2, "0")}
        </motion.span>
      </div>

      {/* phase title + sweep bar */}
      <div className="md:col-span-3 relative">
        <motion.h3 className="text-base font-medium"
          animate={{ color: hovered ? "#000" : "#111827" }} transition={{ duration: 0.2 }}>
          {item.phase}
        </motion.h3>
        <div className="mt-2 h-px w-full bg-black/[0.08] overflow-hidden">
          <motion.div className="h-full bg-black origin-left"
            animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }} />
        </div>
      </div>

      {/* desc */}
      <div className="md:col-span-8 relative">
        <p className="text-sm text-black/60 leading-relaxed">{item.desc}</p>
      </div>
    </motion.div>
  );
}

// ─── Platform card — black only, no blue ─────────────────────────────────────
function PlatformCard({ name }: { name: string }) {
  const [hovered, setHovered] = useState(false);
  const glowX = useMotionValue(50), glowY = useMotionValue(50), glowOp = useMotionValue(0);
  const glowBg = useTransform([glowX, glowY], ([x, y]) =>
    `radial-gradient(ellipse at ${x}% ${y}%, rgba(0,0,0,0.04) 0%, transparent 65%)`);
  const shimX = useMotionValue(-100);
  const shimT = useTransform(shimX, v => `${v}%`);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    glowX.set(((e.clientX-r.left)/r.width)*100);
    glowY.set(((e.clientY-r.top)/r.height)*100);
    animate(glowOp, 1, { duration: 0.25 });
  };
  const onEnter = useCallback(() => {
    setHovered(true); shimX.set(-100); animate(shimX, 200, { duration: 0.55, ease: "easeInOut" });
  }, [shimX]);
  const onLeave = () => { setHovered(false); animate(glowOp, 0, { duration: 0.3 }); };

  return (
    <motion.div variants={staggerItem}
      className="border border-black/10 rounded-lg px-6 py-5 flex items-center gap-3 relative overflow-hidden cursor-pointer"
      whileHover={{ y: -3, borderColor: "rgba(0,0,0,0.22)", boxShadow: "0 6px 20px rgba(0,0,0,0.07)", transition: { duration: 0.18, ease: EASE } }}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ opacity: glowOp, background: glowBg }} />
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left: 0, width: "55%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.28),transparent)", x: shimT }} />
      {/* dot — black only */}
      <motion.div className="w-2 h-2 rounded-full flex-shrink-0"
        animate={{ background: hovered ? "#111827" : "rgba(0,0,0,0.2)" }} transition={{ duration: 0.2 }} />
      <span className="text-sm text-black font-medium relative z-10">{name}</span>
    </motion.div>
  );
}

// ─── Outcome card — black metric, no blue ────────────────────────────────────
function OutcomeCard({ label, desc, metric, index }: { label: string; desc: string; metric: string; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const glowX = useMotionValue(50), glowY = useMotionValue(50), glowOp = useMotionValue(0);
  const glowBg = useTransform([glowX, glowY], ([x, y]) =>
    `radial-gradient(ellipse at ${x}% ${y}%, rgba(0,0,0,0.04) 0%, transparent 65%)`);
  const shimX = useMotionValue(-100);
  const shimT = useTransform(shimX, v => `${v}%`);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    glowX.set(((e.clientX-r.left)/r.width)*100);
    glowY.set(((e.clientY-r.top)/r.height)*100);
    animate(glowOp, 1, { duration: 0.25 });
  };
  const onEnter = useCallback(() => {
    setHovered(true); shimX.set(-100); animate(shimX, 200, { duration: 0.5, ease: "easeInOut" });
  }, [shimX]);
  const onLeave = () => { setHovered(false); animate(glowOp, 0, { duration: 0.3 }); };

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShown(true); }, { threshold: 0.4 });
    obs.observe(el); return () => obs.disconnect();
  }, []);

  return (
    <motion.div ref={ref} variants={staggerItem}
      className="bg-white border border-black/10 rounded-lg p-8 space-y-3 relative overflow-hidden cursor-default"
      whileHover={{ y: -4, borderColor: "rgba(0,0,0,0.22)", boxShadow: "0 10px 36px rgba(0,0,0,0.07)", transition: { duration: 0.2, ease: EASE } }}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ opacity: glowOp, background: glowBg }} />
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left: 0, width: "55%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.28),transparent)", x: shimT }} />
      {/* top border on hover — black only */}
      <motion.div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.18),transparent)" }}
        animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }} />

      {/* metric — black, not blue */}
      <motion.div className="text-2xl font-medium tabular-nums text-black"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 8 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}>
        {metric}
      </motion.div>

      <h3 className="text-base font-medium text-black relative z-10">{label}</h3>
      <p className="text-sm text-black/60 leading-relaxed relative z-10">{desc}</p>

      {/* underline sweep on hover */}
      <motion.div className="h-px bg-black origin-left relative z-10"
        animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }} />
    </motion.div>
  );
}

// ─── Differentiator row — black arrow ─────────────────────────────────────────
function DiffRow({ heading, desc }: { heading: string; desc: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div variants={staggerItem}
      className="py-8 border-b border-black/10 grid md:grid-cols-2 gap-6 relative overflow-hidden cursor-default"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <motion.div className="absolute inset-0 bg-black/[0.015]" initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }} />
      <h3 className="text-base font-medium text-black relative flex items-start gap-2">
        {/* arrow — black, not blue */}
        <motion.span className="text-black/25 mt-0.5 flex-shrink-0"
          animate={{ x: hovered ? 3 : 0, color: hovered ? "#111827" : "rgba(0,0,0,0.25)" }}
          transition={{ duration: 0.2 }}>
          →
        </motion.span>
        {heading}
      </h3>
      <p className="text-sm text-black/60 leading-relaxed relative">{desc}</p>
    </motion.div>
  );
}

// ─── CTA wave section ─────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-24 px-4 border-t border-black/10 relative overflow-hidden">
      <WaveBackground />
      <div className="max-w-6xl mx-auto text-center space-y-6 relative" style={{ zIndex: 1 }}>
        <motion.h2 className="text-4xl font-normal text-black tracking-tight"
          variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          Find out exactly where your EDI estate stands.
        </motion.h2>
        <motion.p className="text-base text-black/60 max-w-xl mx-auto leading-relaxed"
          variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          Book a no-obligation EDI health assessment. We review your current setup and give you a clear, honest picture — with no commitment to go further.
        </motion.p>
        <motion.div className="flex flex-wrap justify-center gap-3 pt-2"
          variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact" className="block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
              Book an EDI health assessment
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact" className="block border border-black/20 text-black px-6 py-2.5 text-sm rounded-md hover:bg-black/[0.03] transition-colors">
              Talk to an architect
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function EDIPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-40 pb-24 px-4 relative overflow-hidden" style={{ background: "#fff" }}>
        <WaveBackground />
        <DataParticles />
        <div className="max-w-6xl mx-auto relative" style={{ zIndex: 1 }}>
          <div className="max-w-3xl space-y-6">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>
              EDI & B2B Integration
            </motion.p>
            <motion.h1 className="text-5xl md:text-6xl font-normal text-black leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}>
              EDI is not a legacy problem. It's a competitive advantage — when it's done right.
            </motion.h1>
            <motion.p className="text-lg text-black/60 leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
              Exceptional Solutions assesses, modernises, runs and de-risks enterprise EDI and B2B integration, across every major platform — so the data your business depends on always flows.
            </motion.p>
            <LiveCounter />
            <motion.div className="flex flex-wrap gap-3 pt-2"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE, delay: 0.45 }}>
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
                <Link to="/contact" className="block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors"
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                  Book an EDI health assessment
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
                <Link to="/contact" className="block border border-black/20 text-black px-6 py-2.5 text-sm rounded-md hover:bg-black/[0.03] transition-colors">
                  Talk to an architect
                </Link>
              </motion.div>
            </motion.div>
            <motion.p className="text-xs text-black/30"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.6 }}>
              No obligation. A senior architect reviews your integration estate and shares what they find.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── Lifecycle ── */}
      <section className="py-24 px-4 bg-black/[0.02] border-t border-b border-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              End-to-End Coverage
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Everything your EDI estate needs, across its whole lifecycle
            </motion.h2>
            <motion.p className="mt-4 text-base text-black/60 leading-relaxed"
              variants={fadeUpLarge} custom={0.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              EDI is not a one-time project. We support it end to end, whichever stage you are at.
            </motion.p>
          </div>
          <motion.div className="space-y-0" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {lifecycle.map((item, i) => <LifecycleRow key={item.phase} item={item} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Platforms ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Platform Expertise
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Deep expertise across every major integration platform
            </motion.h2>
          </div>
          <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {platforms.map(p => <PlatformCard key={p} name={p} />)}
          </motion.div>
          <motion.div className="border border-black/10 rounded-lg px-8 py-6 bg-black/[0.02]"
            variants={fadeUp} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <p className="text-base text-black leading-relaxed">
              We work across all of them, because we modernise your stack — we don't sell you ours. You will never be pushed toward a platform because it suits us. Our only goal is the one that suits you.
            </p>
            <p className="mt-3 text-sm text-black/40">We support ANSI X12, EDIFACT, AS2, and API-led integration standards.</p>
          </motion.div>
        </div>
      </section>

      {/* ── Outcomes ── */}
      <section className="py-24 px-4 bg-black/[0.02] border-t border-b border-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Business Outcomes
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              What done-right EDI delivers to your business
            </motion.h2>
          </div>
          <motion.div className="grid md:grid-cols-2 gap-6"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {outcomes.map((o, i) => (
              <OutcomeCard key={o.label} label={o.label} desc={o.desc} metric={o.metric} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Why Exceptional ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Why Exceptional for EDI
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              The integration specialist enterprises bring in when good enough stops being good enough
            </motion.h2>
          </div>
          <motion.div className="space-y-0" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {differentiators.map(d => <DiffRow key={d.heading} heading={d.heading} desc={d.desc} />)}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTASection />
    </>
  );
}