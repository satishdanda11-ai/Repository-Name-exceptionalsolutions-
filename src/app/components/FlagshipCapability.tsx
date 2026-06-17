import { motion, useAnimationFrame } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const B = {
  primary50:  "#E0EFF9",
  primary100: "#C9EBFC",
  primary200: "#8DD4F8",
  primary400: "#6BC3F5",
  primary500: "#43B0F1",
  primary600: "#2A9DE0",
  navy500:    "#0B1F3A",
  slate400:   "#94A3B8",
  success:    "#10B981",
};

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
    <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] mb-3"
      style={{ background: B.primary50, color: B.navy500, border: `1px solid ${B.primary100}` }}>
      <motion.span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: B.success }}
        animate={{ boxShadow: ["0 0 0 0px rgba(16,185,129,0.5)", "0 0 0 4px rgba(16,185,129,0)", "0 0 0 0px rgba(16,185,129,0.5)"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      Live — {count.toLocaleString()} transactions today
    </div>
  );
}

// ─── Horizontal packet ────────────────────────────────────────────────────────
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
      {/* floating label — brand navy */}
      <div
        ref={badgeRef}
        className="absolute -top-5 pointer-events-none text-[8px] px-1.5 py-0.5 rounded whitespace-nowrap"
        style={{ opacity: 0, background: B.navy500, color: "#fff" }}
      >
        {label}
      </div>
      {/* moving dot — brand blue */}
      <div
        ref={pktRef}
        className="absolute top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full"
        style={{ opacity: 0, background: B.primary500, boxShadow: `0 0 8px ${B.primary400}` }}
      />
    </>
  );
}

// ─── Connector ────────────────────────────────────────────────────────────────
function Connector({ pktDelay, pktLoop, label, shimmerDelay = 0 }: {
  pktDelay: number; pktLoop: number; label: string; shimmerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null!);
  return (
    <div ref={ref} className="flex-1 mx-3 relative" style={{ height: 2, background: B.primary100 }}>
      {/* shimmer — brand blue */}
      <motion.div
        className="absolute inset-0"
        style={{ background: `linear-gradient(90deg,transparent,${B.primary400},transparent)` }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear", delay: shimmerDelay }}
      />
      {/* midpoint dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
        style={{ background: B.primary300 }} />
      <HorizPacket connRef={ref} delay={pktDelay} loopMs={pktLoop} label={label} />
    </div>
  );
}

// ─── Vertical drop ────────────────────────────────────────────────────────────
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
      <div ref={lineRef} className="relative overflow-hidden" style={{ width: 1.5, height: 28, background: B.primary100 }}>
        <div ref={pktRef} className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
          style={{ background: B.primary500, boxShadow: `0 0 5px ${B.primary400}` }} />
      </div>
      <div className="relative overflow-hidden" style={{ width: "80%", height: 1.5, background: B.primary100 }}>
        <motion.div
          className="absolute inset-0"
          style={{ background: `linear-gradient(90deg,transparent,${B.primary400},transparent)` }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.4 }}
        />
      </div>
    </div>
  );
}

// ─── EDI Hub ──────────────────────────────────────────────────────────────────
function EDIHub() {
  return (
    <div className="relative flex items-center justify-center flex-shrink-0">
      {[{ inset: -8, delay: 0, opacity: 0.18 }, { inset: -15, delay: 0.5, opacity: 0.1 }, { inset: -22, delay: 1, opacity: 0.05 }]
        .map((r, i) => (
          <motion.div
            key={i}
            className="absolute rounded-lg border"
            style={{ inset: r.inset, borderColor: `rgba(26,115,232,${r.opacity})` }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.9, 0.2, 0.9] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: r.delay }}
          />
        ))}
      {/* hub body — brand navy */}
      <div className="relative z-10 text-white px-3 py-2 rounded-md text-center"
        style={{ background: B.primary500 }}>
        <div className="text-xs font-medium">EDI Hub</div>
        <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>B2B</div>
      </div>
    </div>
  );
}

// ─── Endpoint node ────────────────────────────────────────────────────────────
function EndpointNode({ label, sub, flashDelay }: { label: string; sub: string; flashDelay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const flash = () => {
      if (!ref.current) return;
      ref.current.style.transition = "box-shadow 0.15s";
      ref.current.style.boxShadow = `0 0 0 3px ${B.primary200}`;
      setTimeout(() => { if (ref.current) ref.current.style.boxShadow = "none"; }, 320);
    };
    const id = setInterval(flash, 2000);
    const t  = setTimeout(flash, flashDelay);
    return () => { clearInterval(id); clearTimeout(t); };
  }, [flashDelay]);

  return (
    <div ref={ref} className="border px-3 py-2 rounded-md text-center flex-shrink-0"
      style={{ background: B.primary50, borderColor: B.primary200 }}>
      <div className="text-xs font-medium" style={{ color: B.navy500 }}>{label}</div>
      <div className="text-[10px] mt-0.5" style={{ color: B.slate400 }}>{sub}</div>
    </div>
  );
}

// ─── Partner card ─────────────────────────────────────────────────────────────
function PartnerCard({ label, dotDelay, flashDelay }: { label: string; dotDelay: number; flashDelay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const flash = () => {
      if (!ref.current) return;
      ref.current.style.transition = "box-shadow 0.15s";
      ref.current.style.boxShadow = `0 0 0 2px ${B.primary200}`;
      setTimeout(() => { if (ref.current) ref.current.style.boxShadow = "none"; }, 300);
    };
    const id = setInterval(flash, 1400);
    const t  = setTimeout(flash, flashDelay);
    return () => { clearInterval(id); clearTimeout(t); };
  }, [flashDelay]);

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden border rounded-md p-2.5 text-center cursor-pointer"
      style={{ background: B.primary50, borderColor: B.primary100 }}
      variants={staggerItem}
      whileHover="hovered"
    >
      {/* activity dot — brand success green */}
      <motion.div
        className="w-1.5 h-1.5 rounded-full mx-auto mb-1.5"
        style={{ background: B.success }}
        animate={{ boxShadow: ["0 0 0 0px rgba(16,185,129,.5)", "0 0 0 4px rgba(16,185,129,0)", "0 0 0 0px rgba(16,185,129,.5)"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: dotDelay }}
      />
      {/* hover fill — brand navy */}
      <motion.span
        className="absolute inset-0 rounded-md"
        style={{ originX: 0, background: B.navy500 }}
        variants={{ initial: { scaleX: 0 }, hovered: { scaleX: 1 } }}
        initial="initial"
        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div className="text-[10px] relative z-10"
        variants={{ initial: { color: B.slate400 }, hovered: { color: "#fff" } }}
        initial="initial" transition={{ duration: 0.2 }}>
        {label}
      </motion.div>
      <motion.div className="text-sm relative z-10 mt-0.5"
        variants={{ initial: { color: B.navy500 }, hovered: { color: "#fff" } }}
        initial="initial" transition={{ duration: 0.2 }}>
        ✓
      </motion.div>
    </motion.div>
  );
}

// ─── Live stats ───────────────────────────────────────────────────────────────
function LiveStats() {
  const [txn, setTxn]     = useState(847);
  const [latency, setLat] = useState(58);
  useEffect(() => {
    const t1 = setInterval(() => setTxn(c => c + Math.floor(Math.random() * 3) + 1), 1800);
    const t2 = setInterval(() => setLat(Math.floor(Math.random() * 18) + 42), 2200);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);
  return (
    <div className="grid grid-cols-3 gap-2 mt-4 pt-4" style={{ borderTop: `1px solid ${B.primary100}` }}>
      {[
        { val: txn.toLocaleString(), lbl: "Transactions" },
        { val: "99.9%",              lbl: "Uptime" },
        { val: `${latency}ms`,       lbl: "Avg Latency" },
      ].map(({ val, lbl }) => (
        <div key={lbl} className="text-center">
          <div className="text-base font-medium tabular-nums" style={{ color: B.navy500 }}>{val}</div>
          <div className="text-[9px] uppercase tracking-wide mt-0.5" style={{ color: B.slate400 }}>{lbl}</div>
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
          <span className="text-xs uppercase tracking-wide" style={{ color: B.primary500 }}>
            OUR FLAGSHIP CAPABILITY
          </span>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* ── Left copy ── */}
          <div className="space-y-6">
            <motion.h2
              className="text-4xl md:text-5xl font-normal leading-tight tracking-tight"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              <span style={{ color: B.navy500 }}>EDI and B2B integration,</span>
              <br />
              <span style={{ color: B.primary500 }}>engineered for enterprises that can't afford downtime.</span>
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
                  <motion.span style={{ color: B.primary500, marginTop: 4 }}
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: Math.random() }}>
                    →
                  </motion.span>
                  <div>
                    <div className="text-sm font-medium" style={{ color: B.navy500 }}>{title}</div>
                    <div className="text-sm text-black/60">{desc}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={fadeUp} custom={0.35} initial="hidden" whileInView="visible" viewport={VIEWPORT}
              whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }} className="inline-block mt-6">
              <Link to="/services/edi-b2b-integration"
                className="text-white px-6 py-2.5 text-sm rounded-md transition-colors"
                style={{ background: B.primary500 }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = B.primary600;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px rgba(26,115,232,0.25)`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = B.primary500;
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}>
                Explore EDI & B2B Integration
              </Link>
            </motion.div>
          </div>

          {/* ── Right — animated diagram ── */}
          <motion.div
            className="bg-white rounded-lg p-8"
            style={{ border: `1px solid ${B.primary100}`, boxShadow: `0 4px 24px rgba(26,115,232,0.08)` }}
            variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <div className="space-y-6">

              <div className="text-center pb-5" style={{ borderBottom: `1px solid ${B.primary100}` }}>
                <StatusPill />
                <h3 className="text-sm font-medium mb-1" style={{ color: B.navy500 }}>
                  Enterprise Integration Architecture
                </h3>
                <p className="text-xs" style={{ color: B.slate400 }}>Real-time data flow visualization</p>
              </div>

              <div className="flex items-center">
                <EndpointNode label="ERP" sub="SAP"    flashDelay={100} />
                <Connector pktDelay={200}  pktLoop={2000} label="856 Order"  shimmerDelay={0} />
                <EDIHub />
                <Connector pktDelay={1050} pktLoop={2000} label="810 Invoice" shimmerDelay={0.9} />
                <EndpointNode label="WMS" sub="Oracle" flashDelay={1100} />
              </div>

              <VerticalDrop />

              <motion.div className="grid grid-cols-3 gap-2.5"
                variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
                <PartnerCard label="Partner A" dotDelay={0}   flashDelay={1200} />
                <PartnerCard label="Partner B" dotDelay={0.5} flashDelay={1450} />
                <PartnerCard label="Partner C" dotDelay={1.0} flashDelay={1700} />
              </motion.div>

              <LiveStats />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}