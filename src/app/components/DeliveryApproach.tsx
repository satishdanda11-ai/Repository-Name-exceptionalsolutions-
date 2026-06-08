import { motion, useAnimationFrame } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const phases = [
  { number: "01", title: "Discover & Assess",   description: "Deep-dive into your integration landscape. Map dependencies, identify risks, and establish baseline metrics.",                        progress: 100, state: "done"    },
  { number: "02", title: "Design",               description: "Architect the solution with your team. Review technical approach, validate decisions, and align on outcomes.",                       progress: 100, state: "done"    },
  { number: "03", title: "Build & Integrate",    description: "Develop with transparency. Daily commits, weekly demos, continuous integration testing.",                                            progress: 65,  state: "active"  },
  { number: "04", title: "Validate",             description: "Rigorous testing across scenarios. Load testing, failover validation, end-to-end integration tests.",                               progress: 0,   state: "pending" },
  { number: "05", title: "Operate & Optimize",   description: "Go-live support and ongoing optimization. Knowledge transfer, runbook documentation, continuous improvement.",                      progress: 0,   state: "pending" },
];

// ─── Packet that travels along the connector line ─────────────────────────────
function LinePacket({ trackRef }: { trackRef: React.RefObject<HTMLDivElement> }) {
  const pktRef  = useRef<HTMLDivElement>(null);
  const startRef = useRef<number | null>(null);
  const LOOP = 3000;
  const MAX_P = 0.52; // stop at ~active phase

  useAnimationFrame((ts) => {
    if (!pktRef.current || !trackRef.current) return;
    if (startRef.current === null) startRef.current = ts;
    const p = ((ts - startRef.current) % LOOP) / LOOP;
    const pp = p < MAX_P ? (p / MAX_P) * MAX_P : MAX_P - ((p - MAX_P) / (1 - MAX_P)) * MAX_P;
    const w  = trackRef.current.offsetWidth;
    pktRef.current.style.left    = `${pp * w - 3}px`;
    const fade = p < 0.04 ? p / 0.04 : p > 0.88 ? (1 - p) / 0.12 : 1;
    pktRef.current.style.opacity = String(fade);
  });

  return (
    <div
      ref={pktRef}
      className="absolute top-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full bg-black"
      style={{ opacity: 0, boxShadow: "0 0 6px rgba(0,0,0,0.28)" }}
    />
  );
}

// ─── Animated progress bar ────────────────────────────────────────────────────
function ProgressBar({ value, delay }: { value: number; delay: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div className="w-full h-[2px] rounded-full mt-2.5" style={{ background: "rgba(0,0,0,0.06)" }}>
      <div
        className="h-full rounded-full bg-black"
        style={{ width: `${width}%`, transition: "width 1.2s ease" }}
      />
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ state, delay }: { state: string; delay: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), delay); return () => clearTimeout(t); }, [delay]);

  const configs = {
    done:    { label: "Complete",    bg: "#f0fdf4", color: "#16a34a", dot: "#16a34a", pulse: false },
    active:  { label: "In progress", bg: "#f5f5f5", color: "#111",    dot: "#111",    pulse: true  },
    pending: { label: "Upcoming",    bg: "#fafafa", color: "rgba(0,0,0,0.38)", dot: "rgba(0,0,0,0.2)", pulse: false },
  };
  const cfg = configs[state as keyof typeof configs];

  return (
    <div className="flex justify-center mt-1.5" style={{ opacity: show ? 1 : 0, transition: "opacity 0.4s ease" }}>
      <div className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px]"
        style={{ background: cfg.bg, color: cfg.color }}>
        <motion.span
          className="w-1 h-1 rounded-full flex-shrink-0"
          style={{ background: cfg.dot }}
          animate={cfg.pulse ? { opacity: [1, 0.25, 1] } : {}}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
        {cfg.label}
      </div>
    </div>
  );
}

// ─── Phase circle ─────────────────────────────────────────────────────────────
function PhaseCircle({ number, state }: { number: string; state: string }) {
  const isDone   = state === "done";
  const isActive = state === "active";

  return (
    <div className="relative flex items-center justify-center mx-auto mb-4" style={{ width: 42, height: 42 }}>
      {/* breathing ring — active phase only */}
      {isActive && (
        <>
          <motion.div className="absolute inset-0 rounded-full border border-black/20"
            animate={{ scale: [1, 1.18, 1], opacity: [0.8, 0.1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute rounded-full border border-black/10"
            style={{ inset: -5 }}
            animate={{ scale: [1, 1.14, 1], opacity: [0.5, 0.05, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} />
        </>
      )}
      {/* circle */}
      <motion.div
        className="relative z-10 w-[42px] h-[42px] rounded-full border flex items-center justify-center"
        style={{
          background:   isDone ? "#111" : "#fff",
          borderColor:  isDone ? "#111" : isActive ? "#111" : "rgba(0,0,0,0.18)",
          color:        isDone ? "#fff" : "#111",
          boxShadow:    isActive ? "0 0 0 4px rgba(0,0,0,0.07)" : "none",
        }}
        whileHover={{ scale: 1.12, boxShadow: "0 0 0 6px rgba(0,0,0,0.07)" }}
        transition={{ duration: 0.18, ease: EASE }}
      >
        {/* checkmark for done, number otherwise */}
        <motion.span className="text-xs font-medium absolute"
          animate={{ opacity: isDone ? 0 : 1 }}>{number}</motion.span>
        <motion.span className="text-sm absolute"
          animate={{ opacity: isDone ? 1 : 0 }}
          transition={{ duration: 0.3 }}>✓</motion.span>
      </motion.div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function DeliveryApproach() {
  const trackRef = useRef<HTMLDivElement>(null!);
  const [lineVisible, setLineVisible] = useState(false);

  return (
    <section className="py-24 px-4 bg-black/[0.02]">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-normal text-black mb-4 tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            A Delivery Approach Built for Zero Surprises
          </motion.h2>
          <motion.p className="text-base text-black/60"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Predictable, transparent, collaborative. No black boxes, no last-minute shocks.
          </motion.p>
        </div>

        <div className="relative">

          {/* ── Connector line ── */}
          <div
            ref={trackRef}
            className="hidden md:block absolute top-5 left-[10%] right-[10%] h-px"
            style={{ background: "rgba(0,0,0,0.08)" }}
          >
            {/* animated fill that draws left→right on scroll into view */}
            <motion.div
              className="absolute inset-0 bg-black origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 0.52 }}          // fills up to active phase
              viewport={VIEWPORT}
              transition={{ duration: 1, ease: EASE, delay: 0.3 }}
              onAnimationComplete={() => setLineVisible(true)}
            />
            {/* connector dots between each phase */}
            {[0,1,2,3].map(i => (
              <motion.div key={i} className="absolute top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full"
                style={{ left: `${(i+1)*20}%`, background: i < 2 ? "#111" : "rgba(0,0,0,0.15)" }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.3, ease: EASE, delay: 0.4 + i*0.12 }}
              />
            ))}
            {/* moving packet */}
            {lineVisible && <LinePacket trackRef={trackRef} />}
          </div>

          {/* ── Phase cards ── */}
          <motion.div
            className="grid md:grid-cols-5 gap-8 relative"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            {phases.map(({ number, title, description, progress, state }, i) => (
              <motion.div
                key={number}
                variants={staggerItem}
                className="relative group cursor-default"
              >
                <PhaseCircle number={number} state={state} />

                <div className="text-center space-y-1.5">
                  <motion.h3
                    className="text-sm font-medium text-black transition-colors"
                    whileHover={{ color: "#000", fontWeight: "600" }}
                  >
                    {title}
                  </motion.h3>
                  <p className="text-xs text-black/60 leading-relaxed">{description}</p>

                  {/* Progress bar */}
                  <ProgressBar value={progress} delay={600 + i * 180} />

                  {/* Status badge */}
                  <StatusBadge state={state} delay={700 + i * 180} />
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}