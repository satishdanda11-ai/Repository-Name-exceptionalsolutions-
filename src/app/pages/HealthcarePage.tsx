import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const challenges = [
  { label: "Strict Compliance & Data Security", desc: "Healthcare data exchange operates under strict regulatory requirements. Integration that doesn't meet the standard isn't just a technical failure — it's a compliance risk with serious consequences." },
  { label: "Complex Payer & Provider Exchange",  desc: "Claims, eligibility, remittance, and authorisation data flowing between payers, providers, and clearinghouses — each with their own formats and mandates. The complexity is significant; the tolerance for error is zero." },
  { label: "Zero Tolerance for Error",           desc: "In healthcare, a failed message is not just an operational inconvenience. It can delay a claim, hold up authorisation, or interrupt patient care. Integration must be correct, every time." },
];

const helpItems = [
  { label: "Certified security posture — documentation available on request" },
  { label: "ANSI X12 healthcare transactions — 270/271, 835, 837, and more" },
  { label: "Full audit trails — compliant records for every data exchange" },
  { label: "Managed operations — monitored 24/7 so failures don't reach patients" },
];

const certBadges = [
  "ISO 27001 / SOC 2-class Certified",
  "Encryption in Transit & At Rest",
  "Full Audit Trails",
  "HIPAA-aware Delivery Practices",
];

// ─── Healthcare network canvas ────────────────────────────────────────────────
// Payer ↔ Clearinghouse Hub ↔ Provider — with a locked-shield visual on the hub
// representing the security/compliance story unique to healthcare
function HealthcareCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;

    type NodeType = "payer" | "hub" | "provider" | "clearinghouse";
    type Node   = { x: number; y: number; label: string; type: NodeType; phase: number };
    type Edge   = { from: number; to: number; secure: boolean };
    type Packet = { edge: Edge; t: number; spd: number };

    let nodes: Node[] = [], edges: Edge[] = [], packets: Packet[] = [];

    // Topology: Payers LEFT ↔ Clearinghouse Hub CENTER ↔ Providers RIGHT
    const LABELS = ["Payer A", "Payer B", "Payer C", "Clearinghouse\nHub", "Provider A", "Provider B", "Provider C"];
    const REL: [number, number][] = [
      [0.10, 0.22], [0.10, 0.50], [0.10, 0.78], // payers left
      [0.50, 0.50],                               // clearinghouse hub center
      [0.90, 0.22], [0.90, 0.50], [0.90, 0.78], // providers right
    ];
    const TYPES: NodeType[] = ["payer","payer","payer","hub","provider","provider","provider"];
    const EDGE_DEF: [number, number][] = [[0,3],[1,3],[2,3],[3,4],[3,5],[3,6]];

    const build = () => {
      const W = canvas.width = canvas.offsetWidth;
      const H = canvas.height = canvas.offsetHeight;
      nodes = REL.map((p, i) => ({ x: p[0]*W, y: p[1]*H, label: LABELS[i], type: TYPES[i], phase: i*0.9 }));
      edges = EDGE_DEF.map(([f, t]) => ({ from: f, to: t, secure: true }));
    };
    build(); window.addEventListener("resize", build);

    const spawn = () => {
      const e = edges[Math.floor(Math.random()*edges.length)];
      // randomly reverse direction to show bidirectional exchange
      const forward = Math.random() > 0.4;
      packets.push({ edge: forward ? e : { from: e.to, to: e.from, secure: true }, t: 0, spd: 0.007 + Math.random()*0.007 });
    };
    for (let i = 0; i < 4; i++) setTimeout(spawn, i * 300);

    let frame = 0, t = 0;
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H); t++;

      // edges — solid (not dashed) to show encrypted secure channels
      edges.forEach((e, i) => {
        const a = nodes[e.from], b = nodes[e.to];
        // draw two lines close together to suggest a secure tunnel
        const perp = { x: -(b.y-a.y), y: b.x-a.x };
        const len  = Math.sqrt(perp.x*perp.x+perp.y*perp.y) || 1;
        const off  = 1.5;
        ctx.globalAlpha = 0.06 + Math.sin(t*0.02+i)*0.02;
        ctx.strokeStyle = "#111"; ctx.lineWidth = 0.8; ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(a.x+perp.x/len*off, a.y+perp.y/len*off);
        ctx.lineTo(b.x+perp.x/len*off, b.y+perp.y/len*off);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(a.x-perp.x/len*off, a.y-perp.y/len*off);
        ctx.lineTo(b.x-perp.x/len*off, b.y-perp.y/len*off);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      // packets — slightly smaller, more precise (data integrity feel)
      packets = packets.filter(p => {
        p.t += p.spd; if (p.t > 1) return false;
        const a = nodes[p.edge.from], b = nodes[p.edge.to];
        const x = a.x+(b.x-a.x)*p.t, y = a.y+(b.y-a.y)*p.t;
        const fade = p.t < 0.08 ? p.t/0.08 : p.t > 0.88 ? (1-p.t)/0.12 : 1;
        for (let i = 1; i <= 4; i++) {
          const tt = Math.max(0, p.t-i*0.018);
          ctx.globalAlpha = ((4-i)/8)*0.28*fade; ctx.fillStyle = "#111";
          ctx.beginPath(); ctx.arc(a.x+(b.x-a.x)*tt, a.y+(b.y-a.y)*tt, Math.max(0.4,1.8-i*0.25),0,Math.PI*2); ctx.fill();
        }
        ctx.globalAlpha = fade*0.85; ctx.fillStyle = "#111";
        ctx.shadowColor = "#111"; ctx.shadowBlur = 5;
        ctx.beginPath(); ctx.arc(x, y, 2.8, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        return true;
      });

      // nodes
      nodes.forEach(n => {
        const breathe = Math.sin(t*0.03+n.phase)*1.5;
        const lines = n.label.split("\n");

        if (n.type === "hub") {
          // Clearinghouse Hub — black circle with lock icon drawn inside
          ctx.globalAlpha = 0.1+Math.sin(t*0.03+n.phase)*0.04;
          ctx.strokeStyle = "#111"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(n.x, n.y, 30+breathe, 0, Math.PI*2); ctx.stroke();
          ctx.globalAlpha = 0.04;
          ctx.beginPath(); ctx.arc(n.x, n.y, 40+breathe, 0, Math.PI*2); ctx.stroke();
          // fill
          ctx.globalAlpha = 1; ctx.fillStyle = "#111"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(n.x, n.y, 24, 0, Math.PI*2); ctx.fill();
          // draw a simple lock icon in white
          ctx.fillStyle = "#fff"; ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5;
          // lock body
          ctx.beginPath(); (ctx as any).roundRect
            ? (ctx as any).roundRect(n.x-7, n.y-1, 14, 10, 2)
            : ctx.rect(n.x-7, n.y-1, 14, 10);
          ctx.fill();
          // lock shackle
          ctx.fillStyle = "transparent"; ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(n.x, n.y-2, 5, Math.PI, 0, false);
          ctx.stroke();
          // keyhole dot
          ctx.fillStyle = "#111";
          ctx.beginPath(); ctx.arc(n.x, n.y+3, 1.5, 0, Math.PI*2); ctx.fill();
          // label below
          ctx.fillStyle = "#fff"; ctx.font = "500 7px system-ui";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText("Clearinghouse", n.x, n.y+14);

        } else if (n.type === "payer") {
          // Payers — shield-shaped (compliance/authority)
          ctx.globalAlpha = 0.05; ctx.strokeStyle = "#111"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(n.x, n.y, 22+breathe, 0, Math.PI*2); ctx.stroke();
          ctx.globalAlpha = 1; ctx.fillStyle = "#f9fafb"; ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = 1.2;
          // draw a rounded rect with a slightly pointed bottom to suggest shield
          ctx.beginPath();
          (ctx as any).roundRect
            ? (ctx as any).roundRect(n.x-18, n.y-16, 36, 32, [4,4,8,8])
            : ctx.rect(n.x-18, n.y-16, 36, 32);
          ctx.fill(); ctx.stroke();
          ctx.fillStyle = "rgba(0,0,0,0.65)"; ctx.font = "500 7.5px system-ui";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          lines.forEach((l,j) => ctx.fillText(l, n.x, n.y+(j-(lines.length-1)/2)*9));

        } else {
          // Providers — plain circle with green activity dot
          ctx.globalAlpha = 0.05; ctx.strokeStyle="#111"; ctx.lineWidth=1;
          ctx.beginPath(); ctx.arc(n.x, n.y, 21+breathe, 0, Math.PI*2); ctx.stroke();
          ctx.globalAlpha = 1; ctx.fillStyle="#fff"; ctx.strokeStyle="rgba(0,0,0,0.18)"; ctx.lineWidth=1.2;
          ctx.beginPath(); ctx.arc(n.x, n.y, 16, 0, Math.PI*2); ctx.fill(); ctx.stroke();
          // green verified dot — active/online
          ctx.fillStyle = "#22c55e";
          ctx.beginPath(); ctx.arc(n.x+10, n.y-10, 3.5, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle="rgba(0,0,0,0.65)"; ctx.font="500 7.5px system-ui";
          ctx.textAlign="center"; ctx.textBaseline="middle";
          lines.forEach((l,j) => ctx.fillText(l, n.x, n.y+(j-(lines.length-1)/2)*9));
        }
      });
      ctx.globalAlpha = 1;
      frame++; if (frame%52===0) spawn();
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", build); };
  }, []);

  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ─── Live healthcare metrics bar ──────────────────────────────────────────────
function HealthcareMetricsBar() {
  const [claims, setClaims]     = useState(4821);
  const [errors, setErrors]     = useState(0);
  const [compliant, setCompliant] = useState("100");

  useEffect(() => {
    const t1 = setInterval(() => setClaims(c => c + Math.floor(Math.random()*3)+1), 2000);
    return () => clearInterval(t1);
  }, []);

  return (
    <motion.div
      className="inline-flex items-center gap-5 border border-black/10 rounded-lg px-5 py-3"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}>
      {[
        { val: claims.toLocaleString(), lbl: "Claims processed today"   },
        { val: `${errors}`,              lbl: "Failed transactions"      },
        { val: `${compliant}%`,          lbl: "Compliance rate"          },
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
        animate={{ boxShadow: ["0 0 0 0px rgba(34,197,94,0.5)","0 0 0 4px rgba(34,197,94,0)","0 0 0 0px rgba(34,197,94,0.5)"] }}
        transition={{ duration: 1.8, repeat: Infinity }} />
    </motion.div>
  );
}

// ─── Animated compliance badge strip ─────────────────────────────────────────
function ComplianceBadges() {
  return (
    <motion.section
      className="py-12 px-4 border-t border-b border-black/10 bg-black/[0.02]"
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VIEWPORT}
      transition={{ duration: 0.5, ease: EASE }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-6">
          {certBadges.map((item, i) => (
            <motion.div
              key={item}
              className="flex items-center gap-2 text-xs text-black/50"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.4, ease: EASE, delay: i * 0.1 }}>
              {/* animated verified checkmark */}
              <motion.div
                className="w-5 h-5 rounded-full border border-black/15 flex items-center justify-center flex-shrink-0"
                whileInView={{ background: ["rgba(0,0,0,0)", "#111827"], borderColor: ["rgba(0,0,0,0.15)", "#111827"] }}
                viewport={VIEWPORT}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}>
                <motion.span
                  className="text-white text-[8px] font-bold"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.25, delay: 0.5 + i * 0.1 }}>
                  ✓
                </motion.span>
              </motion.div>
              {item}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// ─── Live healthcare message ticker ──────────────────────────────────────────
function ClaimsTicker() {
  const messages = [
    "270 Eligibility inquiry → Payer A",
    "271 Eligibility response ← Payer B",
    "837 Professional claim → Clearinghouse",
    "835 Remittance advice ← Payer A",
    "278 Auth request → Payer C",
    "999 Ack confirmed ← Clearinghouse",
  ];
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  const [count, setCnt] = useState(4821);

  useEffect(() => {
    const t1 = setInterval(() => {
      setVis(false);
      setTimeout(()=>{ setIdx(i=>(i+1)%messages.length); setVis(true); }, 220);
    }, 2200);
    const t2 = setInterval(() => setCnt(c=>c+Math.floor(Math.random()*2)+1), 2000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  return (
    <div className="mt-8 bg-white border border-black/10 rounded-lg px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[9px] text-black/35 uppercase tracking-widest">Live transaction stream</p>
        <div className="flex items-center gap-1.5 text-[9px] text-black/38">
          <motion.span className="w-1 h-1 rounded-full bg-green-500"
            animate={{ boxShadow: ["0 0 0 0px rgba(34,197,94,0.5)","0 0 0 3px rgba(34,197,94,0)","0 0 0 0px rgba(34,197,94,0.5)"] }}
            transition={{ duration: 1.8, repeat: Infinity }} />
          {count.toLocaleString()} today
        </div>
      </div>
      <div className="flex items-center gap-2 bg-black/[0.03] rounded-md px-3 py-2">
        {/* lock icon — encrypted */}
        <span className="text-black/30 text-xs flex-shrink-0">🔒</span>
        <span className="text-xs text-black/55 font-mono"
          style={{ opacity: vis ? 1 : 0, transition: "opacity 0.2s" }}>
          {messages[idx]}
        </span>
      </div>
      <p className="text-[9px] text-black/28 mt-2">All transactions encrypted in transit · Full audit trail maintained</p>
    </div>
  );
}

// ─── Challenge row ─────────────────────────────────────────────────────────────
function ChallengeRow({ label, desc, index }: { label: string; desc: string; index: number }) {
  const [hovered, setHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rowRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;
    type Pkt = { p: number; spd: number };
    let pkts: Pkt[] = [{ p: index * 0.33, spd: 0.005 + index * 0.001 }]; // slightly slower — precision
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
        const fade = pk.p < 0.05 ? pk.p/0.05 : pk.p > 0.9 ? (1-pk.p)/0.1 : 1;
        ctx.globalAlpha = fade * 0.5; ctx.fillStyle = "#111";
        ctx.shadowColor = "#111"; ctx.shadowBlur = 4;
        ctx.beginPath(); ctx.arc(x, canvas.height/2, 2.5, 0, Math.PI*2); ctx.fill();
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
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
      <motion.div className="absolute inset-0 bg-black/[0.018]" initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }} />
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
            animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }} />
        </div>
      </div>
      <div className="md:col-span-8 relative">
        <p className="text-sm text-black/60 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

// ─── Help card with cursor glow ───────────────────────────────────────────────
function HelpCard({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);
  const glowX = useMotionValue(50), glowY = useMotionValue(50), glowOp = useMotionValue(0);
  const glowBg = useTransform([glowX, glowY],
    ([x,y]) => `radial-gradient(ellipse at ${x}% ${y}%, rgba(0,0,0,0.04) 0%, transparent 65%)`);
  const shimX = useMotionValue(-100);
  const shimT = useTransform(shimX, v => `${v}%`);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    glowX.set(((e.clientX-r.left)/r.width)*100);
    glowY.set(((e.clientY-r.top)/r.height)*100);
    animate(glowOp, 1, { duration: 0.25 });
  };
  const onEnter = useCallback(()=>{
    setHovered(true);
    shimX.set(-100); animate(shimX, 200, { duration: 0.5, ease: "easeInOut" });
  }, [shimX]);
  const onLeave = () => { setHovered(false); animate(glowOp, 0, { duration: 0.3 }); };

  return (
    <motion.div variants={staggerItem}
      className="border border-black/10 rounded-lg p-5 bg-white flex items-start gap-3 relative overflow-hidden cursor-default"
      whileHover={{ y: -2, borderColor: "rgba(0,0,0,0.22)", boxShadow: "0 6px 22px rgba(0,0,0,0.07)", transition: { duration: 0.18, ease: EASE } }}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ opacity: glowOp, background: glowBg }} />
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left: 0, width: "55%", height: 1, background: "linear-gradient(90deg,transparent,rgba(0,0,0,0.28),transparent)", x: shimT }} />
      <motion.span className="text-black/30 mt-0.5 flex-shrink-0 relative z-10"
        animate={{ x: hovered ? 3 : 0, color: hovered ? "#111827" : "rgba(0,0,0,0.25)" }}
        transition={{ duration: 0.2 }}>→</motion.span>
      <motion.span className="text-sm relative z-10"
        animate={{ color: hovered ? "#111827" : "rgba(0,0,0,0.7)" }}
        transition={{ duration: 0.2 }}>
        {label}
      </motion.span>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function HealthcarePage() {
  return (
    <>
      {/* ── Hero — text LEFT, healthcare network RIGHT ── */}
      <section className="pt-40 pb-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* LEFT — copy only */}
            <div className="space-y-6">
              <motion.p className="text-xs text-black/40 uppercase tracking-wide"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>
                Healthcare
              </motion.p>
              <motion.h1 className="text-5xl md:text-6xl font-normal text-black leading-tight tracking-tight"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}>
                Secure, compliant data exchange, with no room for error.
              </motion.h1>
              <motion.p className="text-lg text-black/60 leading-relaxed"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
                Healthcare integration carries the highest bar for security and compliance. We meet it — so your data moves safely and your organisation stays compliant.
              </motion.p>

              <HealthcareMetricsBar />

              <motion.div className="flex flex-wrap gap-3 pt-2"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE, delay: 0.45 }}>
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
                  <Link to="/services/edi-b2b-integration"
                    className="block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors"
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(0,0,0,0.18)";}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
                    Explore EDI & B2B Integration
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
                  <Link to="/contact"
                    className="block border border-black/20 text-black px-6 py-2.5 text-sm rounded-md hover:bg-black/[0.03] transition-colors">
                    Book an EDI health assessment
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT — payer ↔ clearinghouse ↔ provider diagram */}
            <motion.div
              className="hidden md:block bg-white border border-black/10 rounded-xl overflow-hidden"
              style={{ height: 400 }}
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}>
              <div className="px-5 py-3 border-b border-black/[0.07] flex items-center justify-between">
                <span className="text-[9px] text-black/35 uppercase tracking-widest">Secure exchange network</span>
                <div className="flex items-center gap-2 text-[9px] text-black/38">
                  <span className="text-[10px]">🔒</span>
                  <span>Encrypted</span>
                  <div className="w-px h-3 bg-black/10" />
                  <motion.span className="w-1.5 h-1.5 rounded-full bg-green-500"
                    animate={{ boxShadow: ["0 0 0 0px rgba(34,197,94,0.5)","0 0 0 3px rgba(34,197,94,0)","0 0 0 0px rgba(34,197,94,0.5)"] }}
                    transition={{ duration: 1.8, repeat: Infinity }} />
                  Live
                </div>
              </div>
              <div style={{ height: "calc(100% - 41px)" }}>
                <HealthcareCanvas />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Compliance badge strip — animated ✓ reveals ── */}
      <ComplianceBadges />

      {/* ── Challenges ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              The Integration Challenges
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Why healthcare integration demands a specialist.
            </motion.h2>
          </div>
          <motion.div className="space-y-0" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {challenges.map((c, i) => (
              <ChallengeRow key={c.label} label={c.label} desc={c.desc} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How We Help ── */}
      <section className="py-24 px-4 bg-black/[0.02] border-t border-b border-black/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              How We Help
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-black leading-tight tracking-tight mb-6"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Compliant, secure, and reliable — by design.
            </motion.h2>
            <motion.p className="text-base text-black/60 leading-relaxed"
              variants={fadeUpLarge} custom={0.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              We implement and operate healthcare EDI with compliance built in from the architecture level — not checked at the end. Our team understands the regulatory requirements and the practical delivery challenges. We hold ISO 27001 / SOC 2-class certification and apply security-by-design across every engagement.
            </motion.p>
            {/* live claims ticker */}
            <motion.div variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              <ClaimsTicker />
            </motion.div>
          </div>

          <motion.div className="space-y-4"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {helpItems.map(item => <HelpCard key={item.label} label={item.label} />)}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.h2 className="text-4xl font-normal text-black tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Is your healthcare integration meeting the standard?
          </motion.h2>
          <motion.p className="text-base text-black/60 max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Book an EDI health assessment. We review your current setup and give you a clear, honest picture of where compliance and reliability risk sits.
          </motion.p>
          <motion.div className="flex flex-wrap justify-center gap-3"
            variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
              <Link to="/contact"
                className="block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors"
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(0,0,0,0.18)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
                Book an EDI health assessment
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
              <Link to="/why/trust-security"
                className="block border border-black/20 text-black px-6 py-2.5 text-sm rounded-md hover:bg-black/[0.03] transition-colors">
                See our security posture
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}