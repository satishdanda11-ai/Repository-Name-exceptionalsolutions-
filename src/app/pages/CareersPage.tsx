import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useCallback, useRef, useEffect, useState } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const openings = [
  { title: "Senior EDI Integration Engineer",        type: "Full-time · Remote",  team: "Delivery"         },
  { title: "Integration Architect — MuleSoft / Boomi", type: "Full-time · Hybrid", team: "Delivery"       },
  { title: "EDI Business Analyst",                   type: "Contract · Remote",   team: "Delivery"         },
  { title: "Senior Cloud Engineer (AWS / Azure)",    type: "Full-time · Remote",  team: "Cloud"            },
  { title: "Data Engineer",                          type: "Full-time · Remote",  team: "Data & Analytics" },
];

const whyItems = [
  { heading: "Senior colleagues",  desc: "You will work alongside experienced specialists — not be managed by someone two levels removed from the problem." },
  { heading: "Real ownership",     desc: "Projects are delivered with genuine accountability. You own your work, from design to go-live." },
  { heading: "Focused domain",     desc: "Deep work in a domain that matters — enterprise integration is complex, interesting, and genuinely important to the businesses that depend on it." },
];

// ─── Why card — cursor glow + shimmer + animated check ────────────────────────
function WhyCard({ item }: { item: typeof whyItems[0] }) {
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
        {/* animated check circle */}
        <motion.div className="w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5"
          animate={{ background: hovered ? "#111" : "#fff", borderColor: hovered ? "#111" : "rgba(0,0,0,0.18)" }}
          transition={{ duration: 0.25 }}>
          <motion.span className="text-white text-[9px] font-bold"
            animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }}>✓</motion.span>
        </motion.div>
        <div>
          <motion.div className="text-sm font-medium mb-1"
            animate={{ color: hovered ? "#000" : "#111" }} transition={{ duration: 0.2 }}>
            {item.heading}
          </motion.div>
          <div className="text-sm text-black/50">{item.desc}</div>
        </div>
      </div>

      <motion.div className="h-px bg-black origin-left mt-4"
        animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
    </motion.div>
  );
}

// ─── Opening row — hover sweep + packet dot + apply button ────────────────────
function OpeningRow({ role, index }: { role: typeof openings[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rowRef    = useRef<HTMLDivElement>(null);

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
      className="py-6 border-b border-black/[0.07] flex items-center justify-between gap-6 relative overflow-hidden -mx-4 px-4 rounded cursor-default"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* hover sweep */}
      <motion.div className="absolute inset-0 bg-black/[0.018] rounded" initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }} />
      {/* packet dot on bottom */}
      <div className="absolute bottom-0 left-4 right-4" style={{ height: 2, background: "rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <canvas ref={canvasRef} className="absolute top-0 left-0" />
      </div>

      <div className="space-y-1 relative">
        <motion.h3 className="text-base font-medium"
          animate={{ color: hovered ? "#000" : "#111" }} transition={{ duration: 0.2 }}>
          {role.title}
        </motion.h3>
        {/* title underline on hover */}
        <div className="h-px w-full bg-black/[0.07] overflow-hidden">
          <motion.div className="h-full bg-black origin-left"
            animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} />
        </div>
        <div className="flex items-center gap-3 text-xs text-black/40 pt-0.5">
          {/* live dot */}
          <motion.span className="w-1 h-1 rounded-full bg-green-500 flex-shrink-0"
            animate={{ boxShadow: ["0 0 0 0px rgba(34,197,94,.5)","0 0 0 3px rgba(34,197,94,0)","0 0 0 0px rgba(34,197,94,.5)"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }} />
          <span>{role.type}</span>
          <span>·</span>
          <span>{role.team}</span>
        </div>
      </div>

      {/* apply button */}
      <motion.div className="flex-shrink-0 relative"
        whileHover={{ scale: 1.02 }} transition={{ duration: 0.15, ease: EASE }}>
        <Link to="/contact"
          className="flex items-center gap-1.5 border border-black/20 text-black px-4 py-1.5 text-xs rounded-md relative overflow-hidden transition-colors hover:bg-black/[0.03]">
          <motion.span animate={{ x: hovered ? 2 : 0 }} transition={{ duration: 0.18 }}>Apply</motion.span>
          <motion.span animate={{ opacity: hovered ? 1 : 0.4, x: hovered ? 1 : 0 }} transition={{ duration: 0.18 }}>→</motion.span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function CareersPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-40 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl space-y-6">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>
              Careers
            </motion.p>
            <motion.h1 className="text-5xl md:text-6xl font-normal text-black leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}>
              Do specialist work, with people who take it seriously.
            </motion.h1>
            <motion.p className="text-lg text-black/60 leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
              We are integration and technology specialists who care about doing the work well. If that is how you want to work, we should talk.
            </motion.p>
            {/* team size pill */}
            <motion.div
              className="inline-flex items-center gap-2 border border-black/10 rounded-full px-4 py-2 text-[11px] text-black/50"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.4 }}>
              <motion.span className="w-1.5 h-1.5 rounded-full bg-green-500"
                animate={{ boxShadow: ["0 0 0 0px rgba(34,197,94,.5)","0 0 0 4px rgba(34,197,94,0)","0 0 0 0px rgba(34,197,94,.5)"] }}
                transition={{ duration: 1.8, repeat: Infinity }} />
              54 specialists · {openings.length} open roles
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Why Join Us ── */}
      <section className="py-24 px-4 bg-black/[0.02] border-t border-b border-black/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Why Join Us
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight mb-6"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Specialist depth, senior colleagues, real accountability.
            </motion.h2>
            <motion.p className="text-base text-black/60 leading-relaxed"
              variants={fadeUpLarge} custom={0.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              We are 54 specialists. That means you are not one of a thousand — you are one of a team where your work is visible, your ideas are heard, and your growth has room.
            </motion.p>
            <motion.p className="text-base text-black/60 leading-relaxed mt-4"
              variants={fadeUpLarge} custom={0.18} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              The problems we work on are real, complex, and consequential. The people you work alongside have built careers on getting them right.
            </motion.p>
          </div>
          <motion.div className="space-y-4"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {whyItems.map(item => <WhyCard key={item.heading} item={item} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Open Roles ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Open Roles
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Current openings
            </motion.h2>
            <motion.p className="text-sm text-black/40 mt-3"
              variants={fadeUp} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Roles below are illustrative — replace with live openings before launch.
            </motion.p>
          </div>

          <motion.div className="space-y-0"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {openings.map((role, i) => <OpeningRow key={role.title} role={role} index={i} />)}
          </motion.div>

          <motion.p className="text-sm text-black/40 mt-10"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Don't see the right role? We are always interested in meeting exceptional integration and technology specialists.{" "}
            <Link to="/contact" className="underline underline-offset-4 hover:text-black transition-colors">
              Get in touch
            </Link>
            .
          </motion.p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 border-t border-black/10">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.h2 className="text-4xl font-normal text-black tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Ready to work with people who take the craft seriously?
          </motion.h2>
          <motion.div variants={fadeUp} custom={0.15} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact" className="inline-block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
              Get in touch
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}