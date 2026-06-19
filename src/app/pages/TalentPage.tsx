import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const models = [
  { label: "Contract",          desc: "Senior specialists for a defined period, productive from day one. No ramp-up time, no knowledge gap — our people already understand enterprise integration." },
  { label: "Contract-to-Hire",  desc: "Work with a specialist on a contract basis, then bring them onto your team permanently. Prove the fit before you commit." },
  { label: "Dedicated Teams",   desc: "A managed team that operates as a seamless extension of your own. The same standards, the same accountability, fully embedded in your delivery." },
];

const disciplines = [
  "Enterprise Integration & EDI",
  "Cloud Architecture",
  "Data Engineering",
  "AI & Machine Learning",
  "Quality Engineering",
  "Digital Engineering",
];

const whyCards = [
  { heading: "Domain-deep",           desc: "You get specialists who already understand enterprise integration — not generalists who need to learn your domain at your expense." },
  { heading: "Vetted to delivery standard", desc: "Every specialist is vetted to the standard we hold our own delivery teams to. The same bar, without exception." },
  { heading: "Fast to deploy",        desc: "A gap in your team should not become a gap in your roadmap. Our specialists are ready to contribute from day one." },
];

// ─── Floating avatar network — hero background ────────────────────────────────
function PeopleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;

    type Person = { x: number; y: number; vx: number; vy: number; r: number; a: number; phase: number; initials: string };
    const NAMES = ["SR","DK","AM","JL","PB","CW","NK","RT","EH","MG","SL","JP"];
    let people: Person[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
      people = Array.from({ length: 12 }, (_, i) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.16,
        r: 14 + Math.random() * 6,
        a: 0.08 + Math.random() * 0.07,
        phase: Math.random() * Math.PI * 2,
        initials: NAMES[i],
      }));
    };
    resize(); window.addEventListener("resize", resize);

    let t = 0;
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H); t++;

      // connection lines between nearby people
      for (let i = 0; i < people.length; i++)
        for (let j = i + 1; j < people.length; j++) {
          const dx = people[i].x - people[j].x, dy = people[i].y - people[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 160) {
            ctx.globalAlpha = ((160 - d) / 160) * 0.06;
            ctx.strokeStyle = "#1A73E8"; ctx.lineWidth = 0.7;
            ctx.setLineDash([3, 8]);
            ctx.beginPath(); ctx.moveTo(people[i].x, people[i].y); ctx.lineTo(people[j].x, people[j].y); ctx.stroke();
            ctx.setLineDash([]);
          }
        }

      // avatar circles
      people.forEach(p => {
        const pulse = 0.7 + Math.sin(t * 0.022 + p.phase) * 0.3;
        // outer ring
        ctx.globalAlpha = p.a * pulse * 0.4;
        ctx.strokeStyle = "#1A73E8"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r + 6, 0, Math.PI * 2); ctx.stroke();
        // fill
        ctx.globalAlpha = p.a * pulse;
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "rgba(26,115,232,0.2)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // initials
        ctx.fillStyle = `rgba(26,115,232,${p.a * pulse * 7})`;
        ctx.font = `500 ${p.r * 0.55}px system-ui`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(p.initials, p.x, p.y);
        ctx.globalAlpha = 1;

        p.x += p.vx; p.y += p.vy;
        if (p.x < p.r || p.x > W - p.r) p.vx *= -1;
        if (p.y < p.r || p.y > H - p.r) p.vy *= -1;
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />;
}

// ─── Live placement metrics bar ───────────────────────────────────────────────
function TalentMetricsBar() {
  const [placed, setPlaced]   = useState(148);
  const [time, setTime]       = useState("3.2");
  const [retain, setRetain]   = useState(94);

  useEffect(() => {
    const t1 = setInterval(() => setPlaced(p => p + 1), 8000);
    const t2 = setInterval(() => setTime((Math.random() * 1.5 + 2.5).toFixed(1)), 5000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  return (
    <motion.div
      className="inline-flex items-center gap-5 border border-[#0B1F3A]/10 rounded-lg px-5 py-3"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}>
      {[
        { val: placed.toString(),   lbl: "Specialists placed"   },
        { val: `${time} days`,      lbl: "Avg time to deploy"   },
        { val: `${retain}%`,        lbl: "Retention rate"       },
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

// ─── Why card with cursor glow + shimmer ──────────────────────────────────────
function WhyCard({ heading, desc }: { heading: string; desc: string }) {
  const [hovered, setHovered] = useState(false);
  const glowX = useMotionValue(50), glowY = useMotionValue(50), glowOp = useMotionValue(0);
  const glowBg = useTransform([glowX, glowY],
    ([x, y]) => `radial-gradient(ellipse at ${x}% ${y}%, rgba(26,115,232,0.05) 0%, transparent 65%)`);
  const shimX = useMotionValue(-100);
  const shimT = useTransform(shimX, v => `${v}%`);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    glowX.set(((e.clientX - r.left) / r.width) * 100);
    glowY.set(((e.clientY - r.top) / r.height) * 100);
    animate(glowOp, 1, { duration: 0.25 });
  };
  const onEnter = useCallback(() => {
    setHovered(true);
    shimX.set(-100); animate(shimX, 200, { duration: 0.5, ease: "easeInOut" });
  }, [shimX]);
  const onLeave = () => { setHovered(false); animate(glowOp, 0, { duration: 0.3 }); };

  return (
    <motion.div variants={staggerItem}
      className="border border-[#0B1F3A]/10 rounded-lg p-8 bg-white space-y-3 relative overflow-hidden cursor-default"
      whileHover={{ y: -4, borderColor: "rgba(26,115,232,0.3)", boxShadow: "0 10px 36px rgba(26,115,232,0.1)", transition: { duration: 0.2, ease: EASE } }}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ opacity: glowOp, background: glowBg }} />
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left: 0, width: "55%", height: 1, background: "linear-gradient(90deg,transparent,rgba(26,115,232,0.4),transparent)", x: shimT }} />
      <motion.div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(26,115,232,0.35),transparent)" }}
        animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }} />

      {/* animated checkmark on hover */}
      <div className="relative flex items-start gap-3">
        <motion.div
          className="w-5 h-5 rounded-full border border-[#1A73E8]/20 flex items-center justify-center flex-shrink-0 mt-0.5"
          animate={{ background: hovered ? "#1A73E8" : "#fff", borderColor: hovered ? "#1A73E8" : "rgba(26,115,232,0.2)" }}
          transition={{ duration: 0.25 }}>
          <motion.span className="text-white text-[9px] font-bold"
            animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }}>
            ✓
          </motion.span>
        </motion.div>
        <div>
          <h3 className="text-base font-medium text-[#0B1F3A] mb-2">{heading}</h3>
          <p className="text-sm text-[#475569] leading-relaxed">{desc}</p>
        </div>
      </div>

      <motion.div className="h-px bg-[#1A73E8] origin-left"
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
    </motion.div>
  );
}

// ─── Model row with hover sweep ───────────────────────────────────────────────
function ModelRow({ label, desc, index }: { label: string; desc: string; index: number }) {
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

// ─── Discipline pill with live activity dot ───────────────────────────────────
function DisciplinePill({ label, index }: { label: string; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div variants={staggerItem}
      className="border border-[#0B1F3A]/10 rounded-lg px-6 py-4 bg-white flex items-center gap-3 relative overflow-hidden cursor-default"
      whileHover={{ y: -2, borderColor: "rgba(26,115,232,0.3)", boxShadow: "0 6px 20px rgba(26,115,232,0.08)", transition: { duration: 0.18, ease: EASE } }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* slide fill */}
      <motion.div className="absolute inset-0 bg-[#1A73E8]/[0.04]" initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} />

      {/* pulsing activity dot */}
      <motion.div
        className="w-1.5 h-1.5 rounded-full flex-shrink-0 relative"
        style={{ background: "#1A73E8" }}
        animate={{ boxShadow: hovered
          ? ["0 0 0 0px rgba(26,115,232,0.4)", "0 0 0 4px rgba(26,115,232,0)", "0 0 0 0px rgba(26,115,232,0.4)"]
          : "none" }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 }}
      />
      <motion.span className="text-sm font-medium relative z-10"
        animate={{ color: hovered ? "#0B1F3A" : "rgba(11,31,58,0.85)" }}
        transition={{ duration: 0.2 }}>
        {label}
      </motion.span>

      {/* arrow that slides in on hover */}
      <motion.span className="ml-auto text-xs text-[#1A73E8]/40 relative z-10"
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -6 }}
        transition={{ duration: 0.2 }}>
        →
      </motion.span>
    </motion.div>
  );
}

// ─── Animated specialist counter in CTA ──────────────────────────────────────
function SpeedCounter() {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    obs.observe(el); return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    const target = 3;
    const id = setInterval(() => {
      current += 0.1;
      setVal(Math.min(parseFloat(current.toFixed(1)), target));
      if (current >= target) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, [started]);

  return (
    <div ref={ref} className="inline-flex items-baseline gap-1">
      <span className="text-5xl font-medium text-[#1A73E8] tabular-nums">{val.toFixed(1)}</span>
      <span className="text-lg text-[#0B1F3A]/40">days avg</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function TalentPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-40 pb-24 px-4 relative overflow-hidden bg-white">
        <PeopleCanvas />
        <div className="max-w-6xl mx-auto relative" style={{ zIndex: 1 }}>
          <div className="max-w-3xl space-y-6">
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>
              Talent Solutions
            </motion.p>
            <motion.h1 className="text-5xl md:text-6xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}>
              The specialists behind our projects, <span className="text-[#1A73E8]">embedded directly in your team.</span>
            </motion.h1>
            <motion.p className="text-lg text-[#475569] leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
              When you need senior integration and technology talent fast, we give you direct access to the same specialists we deploy on our own enterprise projects — not generic resources.
            </motion.p>

            {/* live talent metrics */}
            <TalentMetricsBar />

            <motion.div className="flex flex-wrap gap-3 pt-2"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE, delay: 0.45 }}>
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
                <Link to="/contact" className="block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors"
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(26,115,232,0.28)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                  Discuss your resourcing needs
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Why Exceptional ── */}
      <section className="py-24 px-4 bg-[#1A73E8]/[0.02] border-t border-b border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Why Exceptional for Talent
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Specialists who don't need to <span className="text-[#1A73E8]">learn your domain.</span>
            </motion.h2>
          </div>
          <motion.div className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {whyCards.map(item => <WhyCard key={item.heading} heading={item.heading} desc={item.desc} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Engagement Models ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Engagement Models
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              The model that <span className="text-[#1A73E8]">fits your need</span>
            </motion.h2>
          </div>
          <motion.div className="space-y-0" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {models.map((m, i) => <ModelRow key={m.label} label={m.label} desc={m.desc} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Disciplines ── */}
      <section className="py-24 px-4 bg-[#1A73E8]/[0.02] border-t border-b border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-10">
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Where Our Talent Is Strong
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              The same depth you see <span className="text-[#1A73E8]">across the rest of our work</span>
            </motion.h2>
          </div>
          <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {disciplines.map((d, i) => <DisciplinePill key={d} label={d} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Average time to deploy
          </motion.p>
          <motion.div variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <SpeedCounter />
          </motion.div>
          <motion.h2 className="text-4xl font-normal text-[#0B1F3A] tracking-tight"
            variants={fadeUp} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Need senior <span className="text-[#1A73E8]">specialists now?</span>
          </motion.h2>
          <motion.p className="text-base text-[#475569] max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={0.15} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Tell us what you need and we will find the right specialist — fast, vetted, and ready to contribute from day one.
          </motion.p>
          <motion.div variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact" className="inline-block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(26,115,232,0.28)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
              Discuss your resourcing needs
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}