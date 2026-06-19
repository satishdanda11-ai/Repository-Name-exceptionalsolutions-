import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const services = [
  { label: "Cloud Migration",  desc: "Move workloads to the cloud safely, with no disruption to live operations. Planned carefully, executed with precision — not rushed lift-and-shift that creates new problems." },
  { label: "Modernisation",    desc: "Re-architect ageing systems to be scalable, resilient and cost-efficient. We build for the long term, not for the demo." },
  { label: "Managed Cloud",    desc: "Ongoing management and optimisation, so performance and cost stay under control. We watch it so you don't have to." },
];

const valueProps = [
  { label: "Scalable by design",    desc: "Infrastructure that grows with your partner network, not against it",                         metric: "∞",    unit: "scale" },
  { label: "Resilient operations",  desc: "No single point of failure in the systems your business depends on",                          metric: "99.9%", unit: "uptime" },
  { label: "Cost under control",    desc: "Optimised cloud spend — you pay for what you use, not what you provisioned three years ago",  metric: "40%",   unit: "avg saving" },
];

// ─── Floating cloud-node canvas — hero background ─────────────────────────────
function CloudNodeCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;

    type Node = { x: number; y: number; vx: number; vy: number; r: number; a: number; phase: number };
    let nodes: Node[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
      nodes = Array.from({ length: 26 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 3 + 1.5,
        a: Math.random() * 0.12 + 0.05,
        phase: Math.random() * Math.PI * 2,
      }));
    };
    resize(); window.addEventListener("resize", resize);

    let t = 0;
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H); t++;

      // connection lines
      for (let i = 0; i < nodes.length; i++)
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            ctx.globalAlpha = ((140 - d) / 140) * 0.07;
            ctx.strokeStyle = "#1A73E8"; ctx.lineWidth = 0.7;
            ctx.setLineDash([3, 7]);
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
            ctx.setLineDash([]);
          }
        }

      // nodes
      nodes.forEach(n => {
        const pulse = 0.7 + Math.sin(t * 0.025 + n.phase) * 0.3;
        ctx.globalAlpha = n.a * pulse;
        ctx.fillStyle = "#1A73E8";
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />;
}

// ─── Live cloud metrics bar ───────────────────────────────────────────────────
function CloudMetricsBar() {
  const [uptime, setUptime]   = useState("99.97");
  const [latency, setLatency] = useState(38);
  const [nodes, setNodes]     = useState(247);

  useEffect(() => {
    const t1 = setInterval(() => setLatency(Math.floor(Math.random() * 14) + 32), 2000);
    const t2 = setInterval(() => setNodes(n => n + Math.floor(Math.random() * 2)), 3000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  return (
    <motion.div
      className="inline-flex items-center gap-5 border border-[#0B1F3A]/10 rounded-lg px-5 py-3"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}>
      {[
        { val: `${uptime}%`, lbl: "Uptime SLA" },
        { val: `${latency}ms`, lbl: "Avg response" },
        { val: nodes.toLocaleString(), lbl: "Managed nodes" },
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
        animate={{ boxShadow: ["0 0 0 0px rgba(16,185,129,0.5)", "0 0 0 4px rgba(16,185,129,0)", "0 0 0 0px rgba(16,185,129,0.5)"] }}
        transition={{ duration: 1.8, repeat: Infinity }} />
    </motion.div>
  );
}

// ─── Animated infra diagram — on-prem → cloud migration ──────────────────────
function InfraDiagram() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);
  const [activeNode, setActiveNode] = useState(0);
  const NODES = ["On-prem", "Migrate", "Cloud-native", "Scale", "Optimise"];

  useEffect(() => {
    const id = setInterval(() => setActiveNode(n => (n + 1) % NODES.length), 1400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;
    type Pkt = { p: number; spd: number };
    let pkts: Pkt[] = [{ p: 0, spd: 0.007 }, { p: 0.38, spd: 0.009 }, { p: 0.72, spd: 0.006 }];

    const resize = () => {
      canvas.width  = (wrapRef.current?.offsetWidth ?? 500) * 2;
      canvas.height = 6; canvas.style.height = "3px";
      canvas.style.width = (wrapRef.current?.offsetWidth ?? 500) + "px";
    };
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pkts = pkts.map(pk => {
        pk.p += pk.spd; if (pk.p > 1) pk.p = 0;
        const x = pk.p * canvas.width;
        const fade = pk.p < 0.06 ? pk.p / 0.06 : pk.p > 0.88 ? (1 - pk.p) / 0.12 : 1;
        ctx.globalAlpha = fade * 0.75;
        ctx.fillStyle = "#1A73E8"; ctx.shadowColor = "#1A73E8"; ctx.shadowBlur = 5;
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
    <div className="mt-8 bg-white border border-[#0B1F3A]/10 rounded-lg px-7 py-6">
      <p className="text-[9px] text-[#1A73E8] uppercase tracking-widest mb-6">Migration journey</p>
      <div className="relative flex items-start justify-between">
        {NODES.map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-2" style={{ flex: 1, position: "relative", zIndex: 2 }}>
            <motion.div
              className="w-9 h-9 rounded-full border flex items-center justify-center text-[9px] font-medium"
              animate={{
                background:  activeNode === i ? "#1A73E8" : "#fff",
                borderColor: activeNode === i ? "#1A73E8" : "rgba(11,31,58,0.14)",
                color:       activeNode === i ? "#fff"    : "rgba(11,31,58,0.45)",
                boxShadow:   activeNode === i ? "0 0 0 5px rgba(26,115,232,0.1)" : "none",
              }}
              transition={{ duration: 0.32 }}>
              {i + 1}
            </motion.div>
            <motion.span className="text-[9px] text-center leading-tight"
              animate={{ color: activeNode === i ? "#1A73E8" : "rgba(11,31,58,0.38)", fontWeight: activeNode === i ? 600 : 400 }}
              transition={{ duration: 0.25 }}>
              {s}
            </motion.span>
          </div>
        ))}
        <div ref={wrapRef} className="absolute" style={{ top: 17, left: "5%", right: "5%", height: 2, background: "rgba(11,31,58,0.07)", zIndex: 1 }}>
          <motion.div className="absolute top-0 left-0 h-full bg-[#1A73E8]/30"
            animate={{ width: `${(activeNode / (NODES.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }} />
          <canvas ref={canvasRef} className="absolute" style={{ top: -1 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Uptime ring chart that animates on scroll ────────────────────────────────
function UptimeRing({ value, label }: { value: number; label: string }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimated(true); }, { threshold: 0.4 });
    obs.observe(el); return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;
    let progress = 0;
    const target = value / 100;
    const SIZE = 64;
    canvas.width = SIZE * 2; canvas.height = SIZE * 2;
    canvas.style.width = `${SIZE}px`; canvas.style.height = `${SIZE}px`;

    const draw = () => {
      ctx.clearRect(0, 0, SIZE * 2, SIZE * 2);
      const cx = SIZE, cy = SIZE, r = SIZE - 10;
      // track
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(11,31,58,0.07)"; ctx.lineWidth = 6; ctx.stroke();
      // fill
      const end = -Math.PI / 2 + progress * Math.PI * 2;
      ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, end);
      ctx.strokeStyle = "#1A73E8"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.stroke();
      // value
      ctx.fillStyle = "#0B1F3A"; ctx.font = `bold ${SIZE * 0.3}px system-ui`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(`${Math.round(progress * 100)}%`, cx, cy);
    };

    if (animated) {
      const step = () => {
        progress = Math.min(progress + 0.012, target);
        draw();
        if (progress < target) id = requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    } else draw();

    return () => cancelAnimationFrame(id);
  }, [animated, value]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <canvas ref={canvasRef} />
      <span className="text-[9px] text-[#0B1F3A]/45 uppercase tracking-wide text-center">{label}</span>
    </div>
  );
}

// ─── Value prop card ──────────────────────────────────────────────────────────
function ValueCard({ item, index }: { item: typeof valueProps[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const glowX = useMotionValue(50), glowY = useMotionValue(50), glowOp = useMotionValue(0);
  const glowBg = useTransform([glowX, glowY],
    ([x, y]) => `radial-gradient(ellipse at ${x}% ${y}%, rgba(26,115,232,0.05) 0%, transparent 65%)`);
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
      className="border border-[#0B1F3A]/10 rounded-lg p-6 bg-white relative overflow-hidden cursor-default"
      whileHover={{ y: -3, borderColor: "rgba(26,115,232,0.3)", boxShadow: "0 8px 28px rgba(26,115,232,0.1)", transition: { duration: 0.18, ease: EASE } }}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ opacity: glowOp, background: glowBg }} />
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left: 0, width: "55%", height: 1, background: "linear-gradient(90deg,transparent,rgba(26,115,232,0.4),transparent)", x: shimT }} />
      <motion.div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(26,115,232,0.35),transparent)" }}
        animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }} />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1">
          <motion.div className="text-2xl font-medium text-[#1A73E8] tabular-nums mb-0.5"
            animate={{ scale: hovered ? 1.04 : 1 }} transition={{ duration: 0.2 }}>
            {item.metric}
          </motion.div>
          <div className="text-[9px] text-[#0B1F3A]/35 uppercase tracking-wide mb-3">{item.unit}</div>
          <div className="text-sm font-medium text-[#0B1F3A] mb-1">{item.label}</div>
          <div className="text-sm text-[#475569]">{item.desc}</div>
        </div>
        {/* uptime ring — only on middle card */}
        {index === 1 && (
          <div className="flex-shrink-0">
            <UptimeRing value={99.9} label="SLA" />
          </div>
        )}
      </div>

      <motion.div className="mt-3 h-px bg-[#1A73E8] origin-left"
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
    </motion.div>
  );
}

// ─── Service row ──────────────────────────────────────────────────────────────
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
        ctx.globalAlpha = fade * 0.55;
        ctx.fillStyle = "#1A73E8"; ctx.shadowColor = "#1A73E8"; ctx.shadowBlur = 4;
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
      className="grid md:grid-cols-12 gap-6 py-10 border-b border-[#0B1F3A]/10 relative overflow-hidden cursor-default"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <motion.div className="absolute inset-0 bg-[#1A73E8]/[0.02]" initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} />
      <div className="absolute bottom-0 left-0 right-0" style={{ height: 2, background: "rgba(26,115,232,0.05)", overflow: "hidden" }}>
        <canvas ref={canvasRef} className="absolute top-0 left-0" />
      </div>
      <div className="md:col-span-1 pt-1 relative">
        <motion.span className="text-xs font-medium"
          animate={{ color: hovered ? "#1A73E8" : "rgba(26,115,232,0.35)" }} transition={{ duration: 0.2 }}>
          0{index + 1}
        </motion.span>
      </div>
      <div className="md:col-span-3 relative">
        <h3 className="text-base font-medium text-[#0B1F3A]">{label}</h3>
        <div className="mt-2 h-px w-full bg-[#0B1F3A]/[0.08] overflow-hidden">
          <motion.div className="h-full bg-[#1A73E8] origin-left"
            animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
        </div>
      </div>
      <div className="md:col-span-8 relative">
        <p className="text-sm text-[#475569] leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function CloudPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-40 pb-24 px-4 relative overflow-hidden bg-white">
        <CloudNodeCanvas />
        <div className="max-w-6xl mx-auto relative" style={{ zIndex: 1 }}>
          <div className="max-w-3xl space-y-6">
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>
              Cloud Services
            </motion.p>
            <motion.h1 className="text-5xl md:text-6xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}>
              Cloud built for <span className="text-[#1A73E8]">scale and reliability.</span>
            </motion.h1>
            <motion.p className="text-lg text-[#475569] leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
              Your integration and applications should never be the thing that slows the business down. We migrate and modernise on cloud foundations built to scale with you.
            </motion.p>

            {/* live cloud metrics */}
            <CloudMetricsBar />

            <motion.div className="flex flex-wrap gap-3 pt-2"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE, delay: 0.45 }}>
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
                <Link to="/contact" className="block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors"
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(26,115,232,0.28)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                  Talk to an architect about cloud
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Foundation section ── */}
      <section className="py-24 px-4 bg-[#1A73E8]/[0.02] border-t border-b border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              The Foundation
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-[#0B1F3A] leading-tight tracking-tight mb-6"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Modern integration belongs on <span className="text-[#1A73E8]">modern infrastructure.</span>
            </motion.h2>
            <motion.p className="text-base text-[#475569] leading-relaxed"
              variants={fadeUpLarge} custom={0.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              On-premise infrastructure that was designed for the workloads of five years ago becomes a ceiling as your integration estate grows. Every new partner, every new system, every new data feed adds pressure that ageing infrastructure was never built to absorb.
            </motion.p>
            <motion.p className="text-base text-[#475569] leading-relaxed mt-4"
              variants={fadeUpLarge} custom={0.18} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              We make sure the foundation can carry everything you connect to it — and keep carrying it as the business grows.
            </motion.p>
            {/* migration journey diagram */}
            <motion.div variants={fadeUp} custom={0.24} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              <InfraDiagram />
            </motion.div>
          </div>

          {/* value prop cards */}
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
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              What We Do
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              From migration to <span className="text-[#1A73E8]">managed operations</span>
            </motion.h2>
          </div>
          <motion.div className="space-y-0" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {services.map((s, i) => <ServiceRow key={s.label} label={s.label} desc={s.desc} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 border-t border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.h2 className="text-4xl font-normal text-[#0B1F3A] tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Ready to modernise <span className="text-[#1A73E8]">your infrastructure?</span>
          </motion.h2>
          <motion.p className="text-base text-[#475569] max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Talk to an architect about building the cloud foundation your integration estate needs to perform and scale.
          </motion.p>
          <motion.div variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact" className="inline-block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(26,115,232,0.28)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
              Talk to an architect about cloud
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}