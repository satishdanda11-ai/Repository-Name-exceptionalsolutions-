import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const phases = [
  { num: "01", name: "Discover",  fullLabel: "Discover & Assess",  desc: "We map your current estate, systems and trading partners, and agree the goals and risks before any build begins. No surprises later — start with no assumptions now.",                                                    state: "done",    prog: 100 },
  { num: "02", name: "Design",    fullLabel: "Design",              desc: "We design the integration architecture and the delivery plan, and review both with your team. You see exactly what we are building and why, before we build it.",                                                              state: "done",    prog: 100 },
  { num: "03", name: "Build",     fullLabel: "Build & Integrate",   desc: "Senior engineers build and connect, in controlled stages, with progress visible to you throughout. Controlled delivery means problems are small when they are found.",                                                          state: "active",  prog: 65  },
  { num: "04", name: "Validate",  fullLabel: "Validate",            desc: "We test thoroughly against real scenarios and trading-partner requirements before anything goes live. Validation is not a checkbox — it is the point where confidence is earned.",                                              state: "pending", prog: 0   },
  { num: "05", name: "Operate",   fullLabel: "Operate & Optimise",  desc: "We support, monitor and continuously improve, so the solution keeps delivering long after go-live. Delivery does not end at launch.",                                                                                           state: "pending", prog: 0   },
];

const predictability = [
  { label: "Single accountability",      desc: "One person owns your engagement. Not a team. Not a department. One person." },
  { label: "Honest reporting cadence",   desc: "Regular, factual updates — what is done, what is next, what needs your attention." },
  { label: "Quality built in",           desc: "Governance and quality at every phase, not inspected at the end when it's expensive to fix." },
];

const models = [
  { label: "Project-Based Delivery", desc: "A defined scope, timeline and outcome. Right for clear, bounded integration programmes." },
  { label: "Managed Services",       desc: "Ongoing operation, monitoring and improvement of your EDI and integration estate. Right when you want integration off your worry list." },
  { label: "Embedded Specialists",   desc: "Senior specialists working directly within your team. Right when you need depth fast, without a full engagement." },
];

const STATUS = {
  done:    { label: "Complete",    bg: "#f0fdf4", color: "#16a34a", dot: "#16a34a", pulse: false },
  active:  { label: "In progress", bg: "#f3f4f6", color: "#111827", dot: "#111827", pulse: true  },
  pending: { label: "Upcoming",    bg: "#fafafa", color: "rgba(0,0,0,0.38)", dot: "rgba(0,0,0,0.2)", pulse: false },
};

// ─── Live transaction counter ─────────────────────────────────────────────────
function LiveCounter() {
  const [count, setCount] = useState(14382);
  useEffect(() => {
    const id = setInterval(() => setCount(c => c + Math.floor(Math.random() * 4) + 1), 1400);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{count.toLocaleString()} transactions today</span>;
}

// ─── Packet canvas on pipeline track ─────────────────────────────────────────
function TrackPackets({ trackRef }: { trackRef: React.RefObject<HTMLDivElement> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;
    type Pkt = { p: number; spd: number };
    let pkts: Pkt[] = [];

    const resize = () => {
      const w = trackRef.current?.offsetWidth ?? 400;
      canvas.width = w * 2; canvas.height = 4;
      canvas.style.width = w + "px"; canvas.style.height = "3px";
    };
    resize(); window.addEventListener("resize", resize);

    const spawn = () => pkts.push({ p: 0, spd: 0.007 + Math.random() * 0.008 });
    for (let i = 0; i < 3; i++) setTimeout(spawn, i * 380);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pkts = pkts.filter(p => {
        p.p += p.spd; if (p.p > 1) return false;
        const x = p.p * canvas.width;
        const fade = p.p < 0.06 ? p.p / 0.06 : p.p > 0.88 ? (1 - p.p) / 0.12 : 1;
        ctx.globalAlpha = fade * 0.75;
        ctx.fillStyle = "#111"; ctx.shadowColor = "#111"; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(x, canvas.height / 2, 3, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        return true;
      });
      if (Math.random() < 0.012) spawn();
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute" style={{ top: -1, left: 0 }} />;
}

// ─── Progress bar — animates when in view ────────────────────────────────────
function ProgressBar({ value, delay }: { value: number; delay: number }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return (
    <div className="w-full h-[2px] rounded-full" style={{ background: "rgba(0,0,0,0.06)", marginTop: 6 }}>
      <div className="h-full rounded-full bg-black" style={{ width: `${w}%`, transition: "width 1.2s ease" }} />
    </div>
  );
}

// ─── Prominent pipeline in hero ───────────────────────────────────────────────
function HeroPipeline() {
  const trackRef = useRef<HTMLDivElement>(null!);
  const [ready, setReady] = useState(false);
  const [trackWidth, setTrackWidth] = useState("0%");

  useEffect(() => {
    const t = setTimeout(() => {
      setReady(true);
      setTrackWidth(`${(2 / 4) * 100}%`); // filled to active phase (index 2 of 4)
    }, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="bg-white border border-black/10 rounded-xl p-7"
      style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.05)" }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}>

      {/* header */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-2 text-[9px] text-black/38 uppercase tracking-widest">
          <motion.span className="w-1.5 h-1.5 rounded-full bg-green-500"
            animate={{ boxShadow: ["0 0 0 0px rgba(34,197,94,.5)","0 0 0 4px rgba(34,197,94,0)","0 0 0 0px rgba(34,197,94,.5)"] }}
            transition={{ duration: 1.8, repeat: Infinity }} />
          Active engagement — Phase 03 in progress
        </div>
        <div className="text-[9px] text-black/38 tabular-nums">
          <LiveCounter />
        </div>
      </div>

      {/* phase nodes */}
      <div className="relative flex items-start justify-between">
        {phases.map((p, i) => {
          const cfg = STATUS[p.state as keyof typeof STATUS];
          return (
            <div key={p.num} className="flex flex-col items-center gap-2" style={{ flex: 1, position: "relative", zIndex: 2 }}>
              {/* circle */}
              <motion.div
                className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-xs font-medium relative"
                animate={{
                  background:  p.state === "done" ? "#111" : "#fff",
                  borderColor: p.state === "done" ? "#111" : p.state === "active" ? "#111" : "rgba(0,0,0,0.15)",
                  color:       p.state === "done" ? "#fff" : p.state === "active" ? "#111" : "rgba(0,0,0,0.4)",
                  boxShadow:   p.state === "active" ? "0 0 0 5px rgba(0,0,0,0.07)" : "none",
                }}
                transition={{ duration: 0.3 }}>
                {/* active ring */}
                {p.state === "active" && (
                  <motion.div className="absolute inset-0 rounded-full border border-black/15"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                )}
                {p.state === "done" ? "✓" : p.num}
              </motion.div>

              {/* name */}
              <span className="text-[9px] text-center font-medium leading-tight"
                style={{ color: p.state === "active" ? "#111" : "rgba(0,0,0,0.4)" }}>
                {p.name}
              </span>

              {/* progress bar */}
              <ProgressBar value={p.prog} delay={600 + i * 150} />

              {/* status badge */}
              <div className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px]"
                style={{ background: cfg.bg, color: cfg.color }}>
                <motion.span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: cfg.dot }}
                  animate={cfg.pulse ? { opacity: [1, 0.2, 1] } : {}}
                  transition={{ duration: 1.2, repeat: Infinity }} />
                {cfg.label}
              </div>
            </div>
          );
        })}

        {/* track */}
        <div ref={trackRef} className="absolute" style={{ top: 22, left: "5%", right: "5%", height: 2, background: "rgba(0,0,0,0.07)", zIndex: 1 }}>
          <div className="absolute top-0 left-0 h-full bg-black/25 transition-all duration-700 ease-out" style={{ width: trackWidth }} />
          {ready && <TrackPackets trackRef={trackRef} />}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Phase detail row ─────────────────────────────────────────────────────────
function PhaseRow({ phase, index }: { phase: typeof phases[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rowRef    = useRef<HTMLDivElement>(null);
  const cfg = STATUS[phase.state as keyof typeof STATUS];

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;
    type Pkt = { p: number; spd: number };
    let pkts: Pkt[] = [{ p: index * 0.22, spd: 0.006 + index * 0.001 }];
    const resize = () => {
      canvas.width  = (rowRef.current?.offsetWidth ?? 600) * 2;
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
        ctx.globalAlpha = fade * 0.5; ctx.fillStyle = "#111";
        ctx.shadowColor = "#111"; ctx.shadowBlur = 4;
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
      className="grid md:grid-cols-12 gap-6 py-8 border-b border-black/[0.07] items-start relative overflow-hidden cursor-default"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* hover sweep */}
      <motion.div className="absolute inset-0 bg-black/[0.018]" initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} />
      {/* packet trail on bottom */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 2, background: "rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <canvas ref={canvasRef} className="absolute top-0 left-0" />
      </div>

      {/* number */}
      <div className="md:col-span-1 relative pt-0.5">
        <motion.span className="text-xs font-medium"
          animate={{ color: hovered ? "#111827" : "rgba(0,0,0,0.2)" }} transition={{ duration: 0.2 }}>
          {phase.num}
        </motion.span>
      </div>

      {/* label + bar + badge */}
      <div className="md:col-span-3 relative">
        <h3 className="text-sm font-medium text-black">{phase.fullLabel}</h3>
        <div className="mt-2 h-px w-full bg-black/[0.08] overflow-hidden">
          <motion.div className="h-full bg-black origin-left"
            animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
        </div>
        <div className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8.5px] mt-2"
          style={{ background: cfg.bg, color: cfg.color }}>
          <motion.span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: cfg.dot }}
            animate={cfg.pulse ? { opacity: [1, 0.2, 1] } : {}}
            transition={{ duration: 1.2, repeat: Infinity }} />
          {cfg.label}
        </div>
      </div>

      {/* desc */}
      <div className="md:col-span-8 relative">
        <p className="text-sm text-black/60 leading-relaxed">{phase.desc}</p>
      </div>
    </motion.div>
  );
}

// ─── Predictability card ──────────────────────────────────────────────────────
function PredictCard({ label, desc }: { label: string; desc: string }) {
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

  return (
    <motion.div variants={staggerItem}
      className="border border-black/10 rounded-lg p-6 bg-white relative overflow-hidden cursor-default"
      whileHover={{ y: -3, borderColor: "rgba(0,0,0,0.22)", boxShadow: "0 8px 28px rgba(0,0,0,0.07)", transition: { duration: 0.18, ease: EASE } }}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ opacity: glowOp, background: glowBg }} />
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left: 0, width: "55%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.28),transparent)", x: shimT }} />
      <motion.div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.18),transparent)" }}
        animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }} />

      <div className="flex items-start gap-3 relative">
        <motion.div className="w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5"
          animate={{ background: hovered ? "#111" : "#fff", borderColor: hovered ? "#111" : "rgba(0,0,0,0.2)" }}
          transition={{ duration: 0.25 }}>
          <motion.span className="text-white text-[9px] font-bold"
            animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }}>✓</motion.span>
        </motion.div>
        <div>
          <div className="text-sm font-medium text-black mb-1">{label}</div>
          <div className="text-sm text-black/50">{desc}</div>
        </div>
      </div>

      <motion.div className="h-px bg-black origin-left mt-3"
        animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
    </motion.div>
  );
}

// ─── Model card ───────────────────────────────────────────────────────────────
function ModelCard({ label, desc }: { label: string; desc: string }) {
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

  return (
    <motion.div variants={staggerItem}
      className="border border-black/10 rounded-lg p-8 bg-white relative overflow-hidden cursor-default"
      whileHover={{ y: -4, borderColor: "rgba(0,0,0,0.22)", boxShadow: "0 10px 36px rgba(0,0,0,0.08)", transition: { duration: 0.2, ease: EASE } }}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ opacity: glowOp, background: glowBg }} />
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left: 0, width: "55%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.28),transparent)", x: shimT }} />
      <motion.div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.18),transparent)" }}
        animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }} />
      <h3 className="text-base font-medium text-black mb-3 relative">{label}</h3>
      <p className="text-sm text-black/60 leading-relaxed relative">{desc}</p>
      <motion.div className="h-px bg-black origin-left mt-4"
        animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function OurApproachPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-40 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl space-y-6">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>
              Our Approach
            </motion.p>
            <motion.h1 className="text-5xl md:text-6xl font-normal text-black leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}>
              A delivery approach built for zero surprises.
            </motion.h1>
            <motion.p className="text-lg text-black/60 leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
              Enterprise integration goes wrong when delivery is improvised. Ours isn't. Every engagement follows a defined, proven path — with a single point of accountability and clear communication throughout.
            </motion.p>
            {/* prominent pipeline */}
            <HeroPipeline />
          </div>
        </div>
      </section>

      {/* ── Five Phases ── */}
      <section className="py-24 px-4 bg-black/[0.02] border-t border-b border-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              The Five Phases
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Every engagement. Same discipline.
            </motion.h2>
          </div>
          <motion.div className="space-y-0" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {phases.map((p, i) => <PhaseRow key={p.num} phase={p} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Delivery Predictability ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Delivery Predictability
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight mb-6"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              How we keep delivery on track.
            </motion.h2>
            <motion.p className="text-base text-black/60 leading-relaxed"
              variants={fadeUpLarge} custom={0.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Most integration projects go wrong not because the technology is hard, but because delivery is improvised and accountability is shared by everyone, which means it is owned by no one.
            </motion.p>
            <motion.p className="text-base text-black/60 leading-relaxed mt-4"
              variants={fadeUpLarge} custom={0.18} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              We give you a single point of accountability — one person responsible for your engagement from the first call to go-live and beyond.
            </motion.p>
          </div>
          <motion.div className="space-y-4"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {predictability.map(item => <PredictCard key={item.label} label={item.label} desc={item.desc} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Engagement Models ── */}
      <section className="py-24 px-4 bg-black/[0.02] border-t border-b border-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Engagement Models
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              We work in the model that suits you.
            </motion.h2>
          </div>
          <motion.div className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {models.map(m => <ModelCard key={m.label} label={m.label} desc={m.desc} />)}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.h2 className="text-4xl font-normal text-black tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Ready to talk about your project?
          </motion.h2>
          <motion.p className="text-base text-black/60 max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Tell us what you need to connect and we will tell you how we would approach it — clearly, honestly, without obligation.
          </motion.p>
          <motion.div variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact"
              className="inline-block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
              Talk to us about your project
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}