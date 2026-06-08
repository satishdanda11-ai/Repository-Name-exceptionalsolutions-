import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useCallback, useState } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const leaders = [
  { name: "[INSERT Name]", title: "[INSERT Title, e.g. Chief Executive Officer]",  bio: "[INSERT substantive bio focused on relevant enterprise integration and technology experience — typically 3–5 sentences. Include years of experience, specific domains of expertise, and what they personally bring to client engagements.]" },
  { name: "[INSERT Name]", title: "[INSERT Title, e.g. Chief Technology Officer]",  bio: "[INSERT substantive bio — domain depth, platforms worked across, the kind of problems they are known for solving.]" },
  { name: "[INSERT Name]", title: "[INSERT Title, e.g. VP, Delivery]",             bio: "[INSERT substantive bio — delivery track record, industries covered, what accountability looks like in practice.]" },
  { name: "[INSERT Name]", title: "[INSERT Title, e.g. VP, Client Success]",       bio: "[INSERT substantive bio — client relationship depth, sectors served, what they bring to client engagements.]" },
];

const whyPoints = [
  { label: "Senior people on your engagement", desc: "Not managing a team below them — actually doing the work. That is a deliberate structural choice." },
  { label: "No handoff after the pitch",       desc: "The experience you see in the room is the experience that delivers your engagement." },
  { label: "Single point of accountability",  desc: "One person owns your outcome. Not a team, not a department. One person." },
];

// ─── Leader card ──────────────────────────────────────────────────────────────
function LeaderCard({ leader, index }: { leader: typeof leaders[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  // cursor glow
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
      className="border border-black/10 rounded-lg p-8 bg-white space-y-4 relative overflow-hidden cursor-default"
      whileHover={{ y: -4, borderColor: "rgba(0,0,0,0.22)", boxShadow: "0 12px 40px rgba(0,0,0,0.08)", transition: { duration: 0.2, ease: EASE } }}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>

      {/* cursor glow */}
      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ opacity: glowOp, background: glowBg }} />
      {/* shimmer on top edge */}
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left: 0, width: "55%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.28),transparent)", x: shimT }} />
      {/* top border on hover */}
      <motion.div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.18),transparent)" }}
        animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }} />

      <div className="relative flex items-start gap-4">
        {/* avatar with breathing ring on hover */}
        <div className="relative flex-shrink-0">
          <motion.div
            className="absolute inset-0 rounded-full border border-black/10"
            style={{ margin: -5 }}
            animate={{ scale: hovered ? 1.08 : 1, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }} />
          <motion.div
            className="w-16 h-16 rounded-full border flex items-center justify-center"
            animate={{
              background:   hovered ? "#111" : "rgba(0,0,0,0.04)",
              borderColor:  hovered ? "#111" : "rgba(0,0,0,0.1)",
            }}
            transition={{ duration: 0.28 }}>
            <motion.svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"
              animate={{ color: hovered ? "#fff" : "rgba(0,0,0,0.2)" }}
              transition={{ duration: 0.25 }}>
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </motion.svg>
          </motion.div>
        </div>

        {/* name + title */}
        <div>
          <motion.h3 className="text-base font-medium"
            animate={{ color: hovered ? "#000" : "#111" }} transition={{ duration: 0.2 }}>
            {leader.name}
          </motion.h3>
          <p className="text-sm text-black/40 mt-0.5">{leader.title}</p>
        </div>
      </div>

      {/* bio */}
      <p className="text-sm text-black/60 leading-relaxed relative">{leader.bio}</p>

      {/* underline sweep */}
      <motion.div className="h-px bg-black origin-left relative"
        animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
    </motion.div>
  );
}

// ─── Why point row ─────────────────────────────────────────────────────────────
function WhyPoint({ label, desc, index }: { label: string; desc: string; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div variants={staggerItem}
      className="py-6 border-b border-black/[0.07] grid md:grid-cols-2 gap-6 relative overflow-hidden cursor-default"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* hover sweep */}
      <motion.div className="absolute inset-0 bg-black/[0.018]" initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }} />
      <div className="relative">
        <motion.div className="text-sm font-medium"
          animate={{ color: hovered ? "#000" : "#111" }} transition={{ duration: 0.2 }}>
          {label}
        </motion.div>
        <div className="mt-1.5 h-px w-full bg-black/[0.07] overflow-hidden">
          <motion.div className="h-full bg-black origin-left"
            animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} />
        </div>
      </div>
      <p className="text-sm text-black/55 leading-relaxed relative">{desc}</p>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function LeadershipPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-40 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl space-y-6">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>
              Leadership
            </motion.p>
            <motion.h1 className="text-5xl md:text-6xl font-normal text-black leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}>
              Senior people, accountable for your success.
            </motion.h1>
            <motion.p className="text-lg text-black/60 leading-relaxed"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
              Exceptional Solutions is led by specialists with real depth in enterprise integration and technology delivery. When you work with us, this is the experience standing behind your engagement.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── Leader cards ── */}
      <section className="py-24 px-4 border-t border-black/10">
        <div className="max-w-6xl mx-auto">
          <motion.div className="grid md:grid-cols-2 gap-8"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {leaders.map((leader, i) => (
              <LeaderCard key={i} leader={leader} index={i} />
            ))}
          </motion.div>

          <motion.p className="text-sm text-black/30 mt-10 max-w-xl"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Build note: Replace placeholder blocks with real photographs, names, titles, and substantive bios. For a challenger, visible and credible leadership materially increases buyer confidence.
          </motion.p>
        </div>
      </section>

      {/* ── Why it matters ── */}
      <section className="py-24 px-4 bg-black/[0.02] border-t border-b border-black/10">
        <div className="max-w-6xl mx-auto max-w-3xl">
          <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Why It Matters
          </motion.p>
          <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight mb-6"
            variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            When you work with us, senior people are on your work.
          </motion.h2>
          <motion.p className="text-base text-black/60 leading-relaxed"
            variants={fadeUpLarge} custom={0.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            At larger firms, the senior person in the pitch is rarely the senior person on the engagement. That is not how we operate. At Exceptional Solutions, the experience you see on this page is the experience that stands behind what we deliver.
          </motion.p>
          <motion.p className="text-base text-black/60 leading-relaxed mt-4"
            variants={fadeUpLarge} custom={0.18} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            That matters most on the engagements where the stakes are highest — when you are migrating a live integration estate, or when a failed transaction will cost you a trading-partner relationship.
          </motion.p>

          {/* animated why points */}
          <motion.div className="mt-10 space-y-0"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {whyPoints.map((p, i) => (
              <WhyPoint key={p.label} label={p.label} desc={p.desc} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.h2 className="text-4xl font-normal text-black tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Ready to talk with a senior architect?
          </motion.h2>
          <motion.p className="text-base text-black/60 max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Book an EDI health assessment or get in touch directly. You will speak with someone who knows the subject — not a sales team with a script.
          </motion.p>
          <motion.div className="flex flex-wrap justify-center gap-3"
            variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
              <Link to="/contact" className="block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors"
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                Book an EDI health assessment
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
              <Link to="/company/about" className="block border border-black/20 text-black px-6 py-2.5 text-sm rounded-md hover:bg-black/[0.03] transition-colors">
                Learn about the firm
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}