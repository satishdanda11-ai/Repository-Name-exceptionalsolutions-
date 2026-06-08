import { motion, useAnimationFrame } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const bullets = [
  { title: "Modernization",      desc: "Transform legacy EDI into cloud-native architecture" },
  { title: "Partner Onboarding", desc: "Reduce onboarding time from weeks to days" },
  { title: "24/7 Monitoring",    desc: "Proactive monitoring and rapid incident response" },
];

// ─── Live status pill ─────────────────────────────────────────────────────────
function StatusPill() {
  const [count, setCount] = useState(847);
  useEffect(() => {
    const id = setInterval(() => setCount(c => c + Math.floor(Math.random() * 3) + 1), 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="inline-flex items-center gap-1.5 bg-black/5 rounded-full px-3 py-1 text-[10px] text-black/60 mb-3">
      <motion.span
        className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"
        animate={{ boxShadow: ["0 0 0 0px rgba(34,197,94,0.5)", "0 0 0 4px rgba(34,197,94,0)", "0 0 0 0px rgba(34,197,94,0.5)"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      Live — {count.toLocaleString()} transactions today
    </div>
  );
}

// ─── Horizontal packet that slides along connector with a floating label ──────
function HorizPacket({ connRef, delay, loopMs, label }: {
  connRef: React.RefObject<HTMLDivElement>;
  delay: number; loopMs: number; label: string;
}) {
  const pktRef   = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<number | null>(null);

  useAnimationFrame((ts) => {
    if (!pktRef.current || !connRef.current) return;
    if (startRef.current === null) startRef.current = ts;
    const elapsed = ts - startRef.current - delay;
    if (elapsed < 0) { if (pktRef.current) pktRef.current.style.opacity = "0"; return; }
    const p = (elapsed % loopMs) / loopMs;
    const w = connRef.current.offsetWidth;
    pktRef.current.style.left = `${p * w - 3.5}px`;
    const fade = p < 0.08 ? p / 0.08 : p > 0.88 ? (1 - p) / 0.12 : 1;
    pktRef.current.style.opacity = String(fade);
    if (badgeRef.current) {
      badgeRef.current.style.left = `${p * w - badgeRef.current.offsetWidth / 2}px`;
      badgeRef.current.style.opacity = p > 0.3 && p < 0.7 ? String(fade * 0.9) : "0";
    }
  });

  return (
    <>
      {/* floating label */}
      <div
        ref={badgeRef}
        className="absolute -top-5 pointer-events-none bg-black text-white text-[8px] px-1.5 py-0.5 rounded whitespace-nowrap"
        style={{ opacity: 0 }}
      >
        {label}
      </div>
      {/* moving dot */}
      <div
        ref={pktRef}
        className="absolute top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-black"
        style={{ opacity: 0, boxShadow: "0 0 6px rgba(0,0,0,0.3)" }}
      />
    </>
  );
}

// ─── Connector line with scan shimmer + packet ────────────────────────────────
function Connector({ pktDelay, pktLoop, label, shimmerDelay = 0 }: {
  pktDelay: number; pktLoop: number; label: string; shimmerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null!);
  return (
    <div ref={ref} className="flex-1 mx-3 relative" style={{ height: 2, background: "rgba(0,0,0,0.08)" }}>
      {/* animated shimmer sweep */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.28),transparent)" }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear", delay: shimmerDelay }}
      />
      {/* midpoint dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full" />
      <HorizPacket connRef={ref} delay={pktDelay} loopMs={pktLoop} label={label} />
    </div>
  );
}

// ─── Vertical drop line with falling packet ───────────────────────────────────
function VerticalDrop() {
  const lineRef = useRef<HTMLDivElement>(null);
  const pktRef  = useRef<HTMLDivElement>(null);
  const startRef = useRef<number | null>(null);

  useAnimationFrame((ts) => {
    if (!lineRef.current || !pktRef.current) return;
    if (startRef.current === null) startRef.current = ts;
    const p = ((ts - startRef.current) % 1400) / 1400;
    const h = lineRef.current.offsetHeight;
    pktRef.current.style.top = `${p * (h + 6) - 6}px`;
    pktRef.current.style.opacity = p > 0.85 ? String((1 - p) / 0.15) : p < 0.05 ? String(p / 0.05) : "1";
  });

  return (
    <div className="flex flex-col items-center mb-3.5">
      {/* vertical */}
      <div ref={lineRef} className="relative overflow-hidden" style={{ width: 1.5, height: 28, background: "rgba(0,0,0,0.1)" }}>
        <div ref={pktRef} className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-black" style={{ boxShadow: "0 0 5px rgba(0,0,0,0.25)" }} />
      </div>
      {/* horizontal branch */}
      <div className="relative overflow-hidden" style={{ width: "80%", height: 1.5, background: "rgba(0,0,0,0.08)" }}>
        <motion.div
          className="absolute inset-0"
          style={{ background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.28),transparent)" }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.4 }}
        />
      </div>
    </div>
  );
}

// ─── EDI Hub with triple breathing rings ─────────────────────────────────────
function EDIHub() {
  return (
    <div className="relative flex items-center justify-center flex-shrink-0">
      {[{ inset: -8, delay: 0, opacity: 0.12 }, { inset: -15, delay: 0.5, opacity: 0.07 }, { inset: -22, delay: 1, opacity: 0.04 }]
        .map((r, i) => (
          <motion.div
            key={i}
            className="absolute rounded-lg border border-black"
            style={{ inset: r.inset, borderColor: `rgba(0,0,0,${r.opacity})` }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.9, 0.2, 0.9] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: r.delay }}
          />
        ))}
      <div className="relative z-10 bg-black text-white px-3 py-2 rounded-md text-center">
        <div className="text-xs font-medium">EDI Hub</div>
        <div className="text-[10px] text-white/60 mt-0.5">B2Bi</div>
      </div>
    </div>
  );
}

// ─── Endpoint node with arrival flash ────────────────────────────────────────
function EndpointNode({ label, sub, flashDelay }: { label: string; sub: string; flashDelay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const flash = () => {
      if (!ref.current) return;
      ref.current.style.transition = "box-shadow 0.15s";
      ref.current.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.12)";
      setTimeout(() => { if (ref.current) ref.current.style.boxShadow = "none"; }, 320);
    };
    const id = setInterval(flash, 2000);
    const t  = setTimeout(flash, flashDelay);
    return () => { clearInterval(id); clearTimeout(t); };
  }, [flashDelay]);

  return (
    <div ref={ref} className="bg-black/5 border border-black/10 px-3 py-2 rounded-md text-center flex-shrink-0">
      <div className="text-xs font-medium text-black">{label}</div>
      <div className="text-[10px] text-black/40 mt-0.5">{sub}</div>
    </div>
  );
}

// ─── Partner card with green activity dot + black hover fill ──────────────────
function PartnerCard({ label, dotDelay, flashDelay }: { label: string; dotDelay: number; flashDelay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const flash = () => {
      if (!ref.current) return;
      ref.current.style.transition = "box-shadow 0.15s";
      ref.current.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.1)";
      setTimeout(() => { if (ref.current) ref.current.style.boxShadow = "none"; }, 300);
    };
    const id = setInterval(flash, 1400);
    const t  = setTimeout(flash, flashDelay);
    return () => { clearInterval(id); clearTimeout(t); };
  }, [flashDelay]);

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden bg-black/[0.03] border border-black/[0.08] rounded-md p-2.5 text-center cursor-pointer"
      variants={staggerItem}
      whileHover="hovered"
    >
      {/* green activity dot */}
      <motion.div
        className="w-1.5 h-1.5 rounded-full bg-green-500 mx-auto mb-1.5"
        animate={{ boxShadow: ["0 0 0 0px rgba(34,197,94,.5)", "0 0 0 4px rgba(34,197,94,0)", "0 0 0 0px rgba(34,197,94,.5)"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: dotDelay }}
      />
      {/* black slide fill */}
      <motion.span
        className="absolute inset-0 bg-black rounded-md"
        style={{ originX: 0 }}
        variants={{ initial: { scaleX: 0 }, hovered: { scaleX: 1 } }}
        initial="initial"
        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div className="text-[10px] relative z-10"
        variants={{ initial: { color: "rgba(0,0,0,0.4)" }, hovered: { color: "#fff" } }}
        initial="initial" transition={{ duration: 0.2 }}>
        {label}
      </motion.div>
      <motion.div className="text-sm relative z-10 mt-0.5"
        variants={{ initial: { color: "#111" }, hovered: { color: "#fff" } }}
        initial="initial" transition={{ duration: 0.2 }}>
        ✓
      </motion.div>
    </motion.div>
  );
}

// ─── Live stat counter ────────────────────────────────────────────────────────
function LiveStats() {
  const [txn, setTxn]     = useState(847);
  const [latency, setLat] = useState(58);
  useEffect(() => {
    const t1 = setInterval(() => setTxn(c => c + Math.floor(Math.random() * 3) + 1), 1800);
    const t2 = setInterval(() => setLat(Math.floor(Math.random() * 18) + 42), 2200);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);
  return (
    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-black/[0.06]">
      {[
        { val: txn.toLocaleString(), lbl: "Transactions" },
        { val: "99.9%",              lbl: "Uptime" },
        { val: `${latency}ms`,       lbl: "Avg Latency" },
      ].map(({ val, lbl }) => (
        <div key={lbl} className="text-center">
          <div className="text-base font-medium text-black tabular-nums">{val}</div>
          <div className="text-[9px] text-black/38 uppercase tracking-wide mt-0.5">{lbl}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function FlagshipCapability() {
  return (
    <section className="py-24 px-4 bg-black/[0.02]">
      <div className="max-w-6xl mx-auto">

        <motion.div className="text-center mb-12"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VIEWPORT}
          transition={{ duration: 0.4, ease: EASE }}>
          <span className="text-xs text-black/40 uppercase tracking-wide">OUR FLAGSHIP CAPABILITY</span>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* ── Left copy ── */}
          <div className="space-y-6">
            <motion.h2
              className="text-4xl md:text-5xl font-normal text-black leading-tight tracking-tight"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              EDI and B2B integration, engineered for enterprises that can't afford downtime.
            </motion.h2>

            <motion.p className="text-base text-black/60 leading-relaxed"
              variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              We modernize legacy EDI systems, accelerate partner onboarding, and build resilient
              integration architectures that scale with your business.
            </motion.p>

            <motion.div className="space-y-4 pt-4"
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              {bullets.map(({ title, desc }) => (
                <motion.div key={title} variants={staggerItem} className="flex items-start gap-3">
                  <motion.span className="text-black/20 mt-1"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: Math.random() }}>
                    →
                  </motion.span>
                  <div>
                    <div className="text-sm font-medium text-black">{title}</div>
                    <div className="text-sm text-black/60">{desc}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={fadeUp} custom={0.35} initial="hidden" whileInView="visible" viewport={VIEWPORT}
              whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }} className="inline-block mt-6">
              <Link to="/services/edi-b2b-integration"
                className="bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors"
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                Explore EDI & B2B Integration
              </Link>
            </motion.div>
          </div>

          {/* ── Right — animated diagram ── */}
          <motion.div
            className="bg-white border border-black/10 rounded-lg p-8"
            variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <div className="space-y-6">

              {/* Header */}
              <div className="text-center pb-5 border-b border-black/[0.08]">
                <StatusPill />
                <h3 className="text-sm font-medium text-black mb-1">Enterprise Integration Architecture</h3>
                <p className="text-xs text-black/40">Real-time data flow visualization</p>
              </div>

              {/* ERP → Hub → WMS flow */}
              <div className="flex items-center">
                <EndpointNode label="ERP" sub="SAP"    flashDelay={100} />
                <Connector pktDelay={200}  pktLoop={2000} label="856 Order"  shimmerDelay={0} />
                <EDIHub />
                <Connector pktDelay={1050} pktLoop={2000} label="810 Invoice" shimmerDelay={0.9} />
                <EndpointNode label="WMS" sub="Oracle" flashDelay={1100} />
              </div>

              {/* Vertical drop to partners */}
              <VerticalDrop />

              {/* Partners */}
              <motion.div className="grid grid-cols-3 gap-2.5"
                variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
                <PartnerCard label="Partner A" dotDelay={0}   flashDelay={1200} />
                <PartnerCard label="Partner B" dotDelay={0.5} flashDelay={1450} />
                <PartnerCard label="Partner C" dotDelay={1.0} flashDelay={1700} />
              </motion.div>

              {/* Live stats */}
              <LiveStats />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}