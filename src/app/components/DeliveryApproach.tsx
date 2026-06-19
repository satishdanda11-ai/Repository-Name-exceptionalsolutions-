import { motion, useAnimationFrame } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const phases = [
  { number: "01", title: "Discover & Assess",   description: "Deep-dive into your integration landscape. Map dependencies, identify risks, and set baseline metrics." },
  { number: "02", title: "Design",               description: "Architect the solution with your team. Review technical approach, validate decisions, and align on outcomes." },
  { number: "03", title: "Build & Integrate",    description: "Develop with transparency. Daily commits, weekly demos, continuous integration testing." },
  { number: "04", title: "Validate",             description: "Rigorous testing across scenarios. Load testing, failover validation, end-to-end integration tests." },
  { number: "05", title: "Operate & Optimize",   description: "Seamless Go-Live, operational readiness, knowledge transfer and continuous improvement." },
];

const STEP_DURATION = 2000;
const TOTAL = phases.length;

function LinePacket({ trackRef }: { trackRef: React.RefObject<HTMLDivElement> }) {
  const pktRef   = useRef<HTMLDivElement>(null);
  const startRef = useRef<number | null>(null);
  const LOOP     = STEP_DURATION * TOTAL;

  useAnimationFrame((ts) => {
    if (!pktRef.current || !trackRef.current) return;
    if (startRef.current === null) startRef.current = ts;
    const p    = ((ts - startRef.current) % LOOP) / LOOP;
    const w    = trackRef.current.offsetWidth;
    pktRef.current.style.left    = `${p * w - 3}px`;
    const fade = p < 0.03 ? p / 0.03 : p > 0.96 ? (1 - p) / 0.04 : 1;
    pktRef.current.style.opacity = String(fade * 0.9);
  });

  return (
    <div ref={pktRef} style={{ position:"absolute", top:"50%", transform:"translateY(-50%)", width:7, height:7, borderRadius:"50%", background:"#1A73E8", opacity:0, boxShadow:"0 0 8px rgba(26,115,232,0.45)" }} />
  );
}

function ProgressBar({ active, done }: { active: boolean; done: boolean }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (done)   { setW(100); return; }
    if (active) { setW(0); const t = setTimeout(() => setW(100), 80); return () => clearTimeout(t); }
    setW(0);
  }, [active, done]);

  return (
    <div style={{ width:"100%", height:2, borderRadius:99, background:"rgba(11,31,58,0.06)", marginTop:10 }}>
      <div style={{ height:"100%", borderRadius:99, background:"#1A73E8", width:`${w}%`, transition:"width 1.8s cubic-bezier(.16,1,.3,1)" }} />
    </div>
  );
}

function StatusBadge({ state }: { state: "done"|"active"|"pending" }) {
  const cfg = {
    done:    { label:"Complete",    bg:"#ECFDF5", color:"#10B981", dot:"#10B981", pulse:false },
    active:  { label:"In progress", bg:"#E8F3FE", color:"#1A73E8", dot:"#1A73E8", pulse:true  },
    pending: { label:"Upcoming",    bg:"#F8FAFC", color:"rgba(11,31,58,0.38)", dot:"rgba(11,31,58,0.2)", pulse:false },
  }[state];

  return (
    <div style={{ display:"flex", justifyContent:"center", marginTop:8 }}>
      <div style={{ display:"inline-flex", alignItems:"center", gap:5, borderRadius:999, padding:"3px 9px", fontSize:9, background:cfg.bg, color:cfg.color }}>
        <motion.span style={{ width:5, height:5, borderRadius:"50%", background:cfg.dot, flexShrink:0, display:"inline-block" }}
          animate={cfg.pulse ? { opacity:[1,.25,1] } : {}}
          transition={{ duration:1.2, repeat:Infinity, ease:"easeInOut" }} />
        {cfg.label}
      </div>
    </div>
  );
}

function PhaseCircle({ number, state }: { number:string; state:"done"|"active"|"pending" }) {
  return (
    <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", width:44, height:44 }}>
      {state === "active" && (
        <>
          <motion.div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1px solid rgba(26,115,232,0.3)" }}
            animate={{ scale:[1,1.2,1], opacity:[.8,.1,.8] }} transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }} />
          <motion.div style={{ position:"absolute", inset:-5, borderRadius:"50%", border:"1px solid rgba(26,115,232,0.15)" }}
            animate={{ scale:[1,1.16,1], opacity:[.5,.05,.5] }} transition={{ duration:2, repeat:Infinity, ease:"easeInOut", delay:.5 }} />
        </>
      )}
      <motion.div style={{
        position:"relative", zIndex:1, width:44, height:44, borderRadius:"50%",
        border:`1px solid ${state==="done" ? "#1A73E8" : state==="active" ? "#1A73E8" : "rgba(11,31,58,0.18)"}`,
        background: state==="done" ? "#1A73E8" : "#fff",
        color: state==="done" ? "#fff" : "#0B1F3A",
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow: state==="active" ? "0 0 0 4px rgba(26,115,232,0.1)" : "none",
        fontSize:12, fontWeight:500,
      }}
        whileHover={{ scale:1.1, boxShadow:"0 0 0 6px rgba(26,115,232,0.1)" }}
        transition={{ duration:.18, ease:EASE }}>
        {state === "done" ? "✓" : number}
      </motion.div>
    </div>
  );
}

export function DeliveryApproach() {
  const trackRef    = useRef<HTMLDivElement>(null!);
  const [step, setStep] = useState(0);
  const [lineW, setLineW] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const id = setInterval(() => {
      setStep(s => {
        const next = (s + 1) % TOTAL;
        setLineW(((next) / (TOTAL - 1)) * 100);
        return next;
      });
    }, STEP_DURATION);
    return () => clearInterval(id);
  }, [started]);

  const stateOf = (i: number): "done"|"active"|"pending" => {
    if (i < step) return "done";
    if (i === step) return "active";
    return "pending";
  };

  return (
    <section className="py-24 px-4 bg-[#1A73E8]/[0.02]">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2 className="text-4xl md:text-5xl font-normal text-[#0B1F3A] mb-4 tracking-tight leading-[1.35]"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            A Delivery Approach Built for{" "}
            <span className="whitespace-nowrap text-[#1A73E8]">'0' Surprises</span>
          </motion.h2>
          <motion.p className="text-base text-[#475569]"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Predictable, transparent, collaborative. No black boxes, no last-minute shocks.
          </motion.p>
        </div>

        <div className="relative">
          <div ref={trackRef} className="hidden md:block absolute top-5 left-[10%] right-[10%] h-px" style={{ background:"rgba(11,31,58,0.08)" }}>
            <div style={{ position:"absolute", inset:0, background:"#1A73E8", transformOrigin:"left", width:`${lineW}%`, transition:`width ${STEP_DURATION * 0.9}ms cubic-bezier(.16,1,.3,1)` }} />
            {[0,1,2,3].map(i => (
              <div key={i} style={{ position:"absolute", top:"50%", transform:"translateY(-50%)", left:`${(i+1)*20}%`, width:6, height:6, borderRadius:"50%", background: i < step ? "#1A73E8" : "rgba(11,31,58,0.15)", transition:"background 0.4s ease" }} />
            ))}
            {started && <LinePacket trackRef={trackRef} />}
          </div>

          <motion.div className="grid md:grid-cols-5 gap-8 relative"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            onAnimationComplete={() => setStarted(true)}>
            {phases.map(({ number, title, description }, i) => (
              <motion.div key={number} variants={staggerItem} className="cursor-default">
                <PhaseCircle number={number} state={stateOf(i)} />
                <div style={{ textAlign:"center" }}>
                  <h3 style={{ fontSize:13, fontWeight:500, color:"#0B1F3A", marginBottom:6, lineHeight:1.3 }}>{title}</h3>
                  <p style={{ fontSize:11, color:"rgba(71,85,105,0.95)", lineHeight:1.65, margin:0 }}>{description}</p>
                  <ProgressBar active={stateOf(i)==="active"} done={stateOf(i)==="done"} />
                  <StatusBadge state={stateOf(i)} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}