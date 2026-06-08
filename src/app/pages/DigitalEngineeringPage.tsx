import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const services = [
  { label: "Custom Application Development", desc: "Applications built around your actual business, not a generic template. We design for your workflows, your data model, and your users — not a theoretical average customer." },
  { label: "System Modernisation",           desc: "Rebuild ageing applications into modern, maintainable systems. We assess what is worth keeping, what needs replacing, and how to get from here to there without disrupting live operations." },
  { label: "Product Engineering",            desc: "End-to-end engineering for digital products, from idea to running software. Senior engineers throughout — architecture, build, testing, and deployment." },
];

const valueProps = [
  { label: "Senior engineers",          desc: "The people who scope your project are the people who build it",           metric: "100%", unit: "senior" },
  { label: "Connected by design",       desc: "Applications built to integrate cleanly with your existing estate",        metric: "Day 1", unit: "connectivity" },
  { label: "Long-term maintainability", desc: "Code written for the team who will own it — not the team who built it",   metric: "0",    unit: "handoff debt" },
];

// ─── Typewriter code canvas — hero background ─────────────────────────────────
function CodeCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;

    const LINES = [
      "const integration = connect(erp, wms);",
      "await pipeline.deploy({ env: 'prod' });",
      "function transform(data: EDIMessage) {",
      "  return normalize(data.segments);",
      "const health = monitor.uptime();   // 99.98%",
      "export class IntegrationHub {",
      "  private readonly partners: Map<>;",
      "  async onboard(partner: Partner) {",
      "dispatch({ type: 'SYNC_COMPLETE' });",
      "const schema = validate(payload, x12);",
    ];

    type Stream = { x: number; y: number; lineIdx: number; charIdx: number; speed: number; alpha: number; phase: number };
    let streams: Stream[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
      streams = Array.from({ length: 8 }, (_, i) => ({
        x: (canvas.width / 8) * i + Math.random() * 40,
        y: Math.random() * canvas.height,
        lineIdx: Math.floor(Math.random() * LINES.length),
        charIdx: 0,
        speed: 0.5 + Math.random() * 0.8,
        alpha: 0.04 + Math.random() * 0.05,
        phase: Math.random() * Math.PI * 2,
      }));
    };
    resize(); window.addEventListener("resize", resize);

    let t = 0, last = 0;
    const draw = (ts: number) => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H); t++;
      const delta = ts - last; last = ts;

      streams.forEach(s => {
        const line = LINES[s.lineIdx];
        const visible = line.slice(0, Math.floor(s.charIdx));
        const pulse = 0.6 + Math.sin(t * 0.02 + s.phase) * 0.4;
        ctx.globalAlpha = s.alpha * pulse;
        ctx.fillStyle = "#111";
        ctx.font = "11px 'Courier New', monospace";
        ctx.textAlign = "left";
        ctx.fillText(visible, s.x, s.y);
        // cursor blink
        if (Math.floor(t / 18) % 2 === 0) {
          const w = ctx.measureText(visible).width;
          ctx.fillRect(s.x + w, s.y - 11, 1, 13);
        }
        ctx.globalAlpha = 1;
        s.charIdx += s.speed * (delta / 60);
        if (s.charIdx > line.length + 20) {
          s.charIdx = 0;
          s.lineIdx = Math.floor(Math.random() * LINES.length);
          s.y += 28;
          if (s.y > H + 20) s.y = -20;
        }
      });

      id = requestAnimationFrame(draw);
    };
    id = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />;
}

// ─── Live build metrics bar ───────────────────────────────────────────────────
function BuildMetricsBar() {
  const [commits, setCommits] = useState(1247);
  const [coverage, setCoverage] = useState(94);
  const [deploy, setDeploy] = useState("2m 14s");

  useEffect(() => {
    const t1 = setInterval(() => setCommits(c => c + Math.floor(Math.random() * 2) + 1), 3500);
    const t2 = setInterval(() => {
      const mins = Math.floor(Math.random() * 2) + 1;
      const secs = Math.floor(Math.random() * 59).toString().padStart(2, "0");
      setDeploy(`${mins}m ${secs}s`);
    }, 4000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  return (
    <motion.div
      className="inline-flex items-center gap-5 border border-black/10 rounded-lg px-5 py-3"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}>
      {[
        { val: commits.toLocaleString(), lbl: "Commits shipped" },
        { val: `${coverage}%`,           lbl: "Test coverage"  },
        { val: deploy,                   lbl: "Avg deploy time" },
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
        animate={{ boxShadow: ["0 0 0 0px rgba(34,197,94,0.5)", "0 0 0 4px rgba(34,197,94,0)", "0 0 0 0px rgba(34,197,94,0.5)"] }}
        transition={{ duration: 1.8, repeat: Infinity }} />
    </motion.div>
  );
}

// ─── Engineering lifecycle diagram ────────────────────────────────────────────
function EngineeringLifecycle() {
  const STEPS = ["Assess", "Architect", "Build", "Test", "Deploy", "Own"];
  const [active, setActive] = useState(0);
  const trackRef  = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const id = setInterval(() => setActive(s => (s + 1) % STEPS.length), 1300);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;
    type Pkt = { p: number; spd: number };
    let pkts: Pkt[] = [{ p: 0, spd: 0.007 }, { p: 0.4, spd: 0.009 }, { p: 0.75, spd: 0.006 }];
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
      <p className="text-[9px] text-black/35 uppercase tracking-widest mb-6">Engineering lifecycle</p>
      <div className="relative flex items-start justify-between">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-2" style={{ flex: 1, position: "relative", zIndex: 2 }}>
            <motion.div
              className="w-9 h-9 rounded-full border flex items-center justify-center text-[9px] font-medium"
              animate={{
                background:  active === i ? "#111827" : "#fff",
                borderColor: active === i ? "#111827" : "rgba(0,0,0,0.14)",
                color:       active === i ? "#fff"    : "rgba(0,0,0,0.45)",
                boxShadow:   active === i ? "0 0 0 5px rgba(0,0,0,0.08)" : "none",
              }}
              transition={{ duration: 0.32 }}>
              {i + 1}
            </motion.div>
            <motion.span className="text-[9px] text-center leading-tight"
              animate={{ color: active === i ? "#111827" : "rgba(0,0,0,0.38)", fontWeight: active === i ? 600 : 400 }}
              transition={{ duration: 0.25 }}>
              {s}
            </motion.span>
          </div>
        ))}
        <div ref={trackRef} className="absolute" style={{ top: 17, left: "4%", right: "4%", height: 2, background: "rgba(0,0,0,0.07)", zIndex: 1 }}>
          <motion.div className="absolute top-0 left-0 h-full bg-black/20"
            animate={{ width: `${(active / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }} />
          <canvas ref={canvasRef} className="absolute" style={{ top: -1 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Value prop card ──────────────────────────────────────────────────────────
function ValueCard({ item, index }: { item: typeof valueProps[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const glowX = useMotionValue(50), glowY = useMotionValue(50), glowOp = useMotionValue(0);
  const glowBg = useTransform([glowX, glowY],
    ([x, y]) => `radial-gradient(ellipse at ${x}% ${y}%, rgba(0,0,0,0.04) 0%, transparent 65%)`);
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
      <div className="relative">
        <motion.div className="text-2xl font-medium text-black tabular-nums mb-0.5"
          animate={{ scale: hovered ? 1.04 : 1 }} transition={{ duration: 0.2 }}>
          {item.metric}
        </motion.div>
        <div className="text-[9px] text-black/35 uppercase tracking-wide mb-3">{item.unit}</div>
        <div className="text-sm font-medium text-black mb-1">{item.label}</div>
        <div className="text-sm text-black/50">{item.desc}</div>
        <motion.div className="mt-3 h-px bg-black origin-left"
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
      </div>
    </motion.div>
  );
}

// ─── Service row with packet animation ───────────────────────────────────────
function ServiceRow({ label, desc, index }: { label: string; desc: string; index: number }) {
  const [hovered, setHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rowRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;
    type Pkt = { p: number; spd: number };
    let pkts: Pkt[] = [{ p: index * 0.33, spd: 0.006 + index * 0.001 }];
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
        ctx.globalAlpha = fade * 0.5;
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
      <motion.div className="absolute inset-0 bg-black/[0.018]" initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} />
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export function DigitalEngineeringPage() {
  return (
    <>
      {/* ── Hero — typewriter code canvas ── */}
      <section className="pt-40 pb-24 px-4 relative overflow-hidden bg-white">
        <CodeCanvas />
        <div className="max-w-6xl mx-auto relative" style={{ zIndex: 1 }}>
          <div className="max-w-3xl space-y-6">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>
              Digital Engineering
            </motion.p>
            <motion.h1 className="text-5xl md:text-6xl font-normal text-black leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}>
              Senior engineers, building what moves your business forward.
            </motion.h1>
            <motion.p className="text-lg text-black/60 leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
              When off-the-shelf software cannot do the job, we build the custom applications and modern systems that can — engineered properly, for the long term.
            </motion.p>

            {/* live build metrics */}
            <BuildMetricsBar />

            <motion.div className="flex flex-wrap gap-3 pt-2"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE, delay: 0.45 }}>
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
                <Link to="/contact" className="block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors"
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                  Talk to an architect about engineering
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Approach ── */}
      <section className="py-24 px-4 bg-black/[0.02] border-t border-b border-black/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Our Approach
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight mb-6"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Everything we build is designed to connect.
            </motion.h2>
            <motion.p className="text-base text-black/60 leading-relaxed"
              variants={fadeUpLarge} custom={0.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Custom applications that can't talk to the rest of your enterprise create new integration debt the moment they go live. We build with connectivity as a first principle — not an afterthought.
            </motion.p>
            <motion.p className="text-base text-black/60 leading-relaxed mt-4"
              variants={fadeUpLarge} custom={0.18} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Because connected systems are what we do, the applications we engineer are designed to integrate cleanly with the rest of your estate from day one.
            </motion.p>
            <motion.div variants={fadeUp} custom={0.24} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              <EngineeringLifecycle />
            </motion.div>
          </div>

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
              What We Build
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Custom, modern, built to last
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
            Ready to build something that lasts?
          </motion.h2>
          <motion.p className="text-base text-black/60 max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Talk to an architect about the application or system you need to build — and what it needs to connect to.
          </motion.p>
          <motion.div variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact" className="inline-block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
              Talk to an architect about engineering
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}