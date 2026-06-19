import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const challenges = [
  { label: "Multi-Party Data Exchange", desc: "Carriers, partners, customers, and warehouses all exchanging data simultaneously. A single message that arrives late or malformed can cascade into missed pickups, delayed shipments, and failed SLAs." },
  { label: "Real-Time Visibility",       desc: "Customers expect to know where their shipment is, right now. That requires every system in the chain to talk to each other without delays, drops, or translation errors." },
  { label: "The Cost of a Lost Message", desc: "In logistics, a delayed or lost data message is a delayed or lost shipment. EDI errors translate directly into operational failures and customer penalties." },
];

const howWeHelp = [
  { label: "Proactive monitoring — failures caught before they cascade" },
  { label: "Real-time data exchange across every party in the chain" },
  { label: "Managed exception handling — your team handles logistics, not EDI errors" },
];

// ─── Logistics journey canvas — strict LEFT→RIGHT shipment flow ───────────────
// Warehouse (navy rect) → TMS Hub (circle + rings) → Carriers (diamonds) → Customers (circles + green dot)
function LogisticsNetworkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;

    type NodeType = "origin" | "hub" | "carrier" | "destination";
    type Node   = { x: number; y: number; label: string; type: NodeType; phase: number };
    type Edge   = { from: number; to: number };
    type Packet = { edge: Edge; t: number; spd: number };

    let nodes: Node[] = [], edges: Edge[] = [], packets: Packet[] = [];

    // Strict left → right: Warehouse → TMS Hub → 3 Carriers → 3 Customers
    const LABELS = ["Warehouse", "TMS\nHub", "Carrier A", "3PL", "Carrier B", "Customer\nA", "Customer\nB", "Customer\nC"];
    const REL: [number, number][] = [
      [0.10, 0.50], // Warehouse — origin LEFT (navy rect)
      [0.38, 0.50], // TMS Hub  — center (large circle, double rings)
      [0.66, 0.20], // Carrier A — upper mid-right (diamond)
      [0.66, 0.50], // 3PL       — mid-right (diamond)
      [0.66, 0.80], // Carrier B — lower mid-right (diamond)
      [0.90, 0.18], // Customer A — far right top (circle + green dot)
      [0.90, 0.50], // Customer B — far right mid
      [0.90, 0.82], // Customer C — far right bottom
    ];
    const TYPES: NodeType[] = ["origin","hub","carrier","carrier","carrier","destination","destination","destination"];
    // Strictly left→right, no reverse edges — reinforces journey direction
    const EDGE_DEF: [number, number][] = [[0,1],[1,2],[1,3],[1,4],[2,5],[3,6],[4,7]];

    const build = () => {
      const W = canvas.width = canvas.offsetWidth;
      const H = canvas.height = canvas.offsetHeight;
      nodes = REL.map((p, i) => ({ x: p[0]*W, y: p[1]*H, label: LABELS[i], type: TYPES[i], phase: i * 0.85 }));
      edges = EDGE_DEF.map(([f, t]) => ({ from: f, to: t }));
    };
    build(); window.addEventListener("resize", build);

    // Packets always flow left→right to reinforce the journey
    const spawn = () => {
      const e = edges[Math.floor(Math.random() * edges.length)];
      packets.push({ edge: e, t: 0, spd: 0.008 + Math.random() * 0.007 });
    };
    for (let i = 0; i < 5; i++) setTimeout(spawn, i * 280);

    let frame = 0, t = 0;
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H); t++;

      // edges — dashed to suggest data in transit
      edges.forEach((e, i) => {
        const a = nodes[e.from], b = nodes[e.to];
        ctx.globalAlpha = 0.08 + Math.sin(t * 0.02 + i) * 0.03;
        ctx.strokeStyle = "#1A73E8"; ctx.lineWidth = 1; ctx.setLineDash([4, 8]);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        ctx.setLineDash([]);
      });
      ctx.globalAlpha = 1;

      // packets with comet trail
      packets = packets.filter(p => {
        p.t += p.spd; if (p.t > 1) return false;
        const a = nodes[p.edge.from], b = nodes[p.edge.to];
        const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
        const fade = p.t < 0.08 ? p.t / 0.08 : p.t > 0.88 ? (1 - p.t) / 0.12 : 1;
        for (let i = 1; i <= 5; i++) {
          const tt = Math.max(0, p.t - i * 0.02);
          ctx.globalAlpha = ((5-i)/10)*0.35*fade; ctx.fillStyle = "#1A73E8";
          ctx.beginPath(); ctx.arc(a.x+(b.x-a.x)*tt, a.y+(b.y-a.y)*tt, Math.max(0.5,2.2-i*0.3), 0, Math.PI*2); ctx.fill();
        }
        ctx.globalAlpha = fade*0.9; ctx.fillStyle = "#1A73E8";
        ctx.shadowColor = "#1A73E8"; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        return true;
      });

      // nodes — each shape tells its role in the journey
      nodes.forEach(n => {
        const breathe = Math.sin(t * 0.03 + n.phase) * 1.5;
        const lines = n.label.split("\n");

        if (n.type === "origin") {
          // Warehouse — solid NAVY rounded rect (heavy, grounded, starting point)
          ctx.globalAlpha = 0.07; ctx.strokeStyle = "#1A73E8"; ctx.lineWidth = 1;
          ctx.beginPath(); (ctx as any).roundRect(n.x-28, n.y-17, 56, 34, 3); ctx.stroke();
          ctx.globalAlpha = 1; ctx.fillStyle = "#0B1F3A"; ctx.lineWidth = 1.5;
          ctx.beginPath(); (ctx as any).roundRect(n.x-25, n.y-15, 50, 30, 3); ctx.fill();
          ctx.fillStyle = "#fff"; ctx.font = "500 8px system-ui";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          lines.forEach((l,j)=>ctx.fillText(l, n.x, n.y+(j-(lines.length-1)/2)*10));

        } else if (n.type === "hub") {
          // TMS Hub — large brand-blue circle, triple breathing rings
          ctx.globalAlpha = 0.12 + Math.sin(t*0.03+n.phase)*0.04; ctx.strokeStyle="#1A73E8"; ctx.lineWidth=1;
          ctx.beginPath(); ctx.arc(n.x,n.y,30+breathe,0,Math.PI*2); ctx.stroke();
          ctx.globalAlpha = 0.06;
          ctx.beginPath(); ctx.arc(n.x,n.y,40+breathe,0,Math.PI*2); ctx.stroke();
          ctx.globalAlpha = 0.03;
          ctx.beginPath(); ctx.arc(n.x,n.y,52+breathe,0,Math.PI*2); ctx.stroke();
          ctx.globalAlpha = 1; ctx.fillStyle = "#1A73E8"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(n.x,n.y,24,0,Math.PI*2); ctx.fill();
          ctx.fillStyle = "#fff"; ctx.font = "bold 8px system-ui";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          lines.forEach((l,j)=>ctx.fillText(l, n.x, n.y+(j-(lines.length-1)/2)*10));

        } else if (n.type === "carrier") {
          // Carriers — rotated DIAMOND (in motion, transit feel)
          ctx.globalAlpha = 0.06; ctx.strokeStyle="#1A73E8"; ctx.lineWidth=1;
          ctx.beginPath(); ctx.arc(n.x,n.y,22+breathe,0,Math.PI*2); ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.save(); ctx.translate(n.x,n.y); ctx.rotate(Math.PI/4);
          ctx.fillStyle = "#F4F8FF"; ctx.strokeStyle = "rgba(26,115,232,0.3)"; ctx.lineWidth = 1.2;
          ctx.beginPath(); (ctx as any).roundRect(-13,-13,26,26,2); ctx.fill(); ctx.stroke();
          ctx.restore();
          ctx.fillStyle = "rgba(11,31,58,0.68)"; ctx.font = "500 7.5px system-ui";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          lines.forEach((l,j)=>ctx.fillText(l, n.x, n.y+(j-(lines.length-1)/2)*9));

        } else {
          // Customers/Destinations — circle with green DELIVERED dot
          ctx.globalAlpha = 0.06; ctx.strokeStyle="#1A73E8"; ctx.lineWidth=1;
          ctx.beginPath(); ctx.arc(n.x,n.y,20+breathe,0,Math.PI*2); ctx.stroke();
          ctx.globalAlpha = 1; ctx.fillStyle="#fff"; ctx.strokeStyle="rgba(26,115,232,0.2)"; ctx.lineWidth=1.2;
          ctx.beginPath(); ctx.arc(n.x,n.y,15,0,Math.PI*2); ctx.fill(); ctx.stroke();
          // green delivered indicator
          ctx.fillStyle = "#10B981";
          ctx.beginPath(); ctx.arc(n.x+10, n.y-10, 3.5, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = "rgba(11,31,58,0.65)"; ctx.font = "500 7.5px system-ui";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          lines.forEach((l,j)=>ctx.fillText(l, n.x, n.y+(j-(lines.length-1)/2)*9));
        }
      });
      ctx.globalAlpha = 1;
      frame++; if (frame % 50 === 0) spawn();
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", build); };
  }, []);

  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ─── Live logistics metrics bar ───────────────────────────────────────────────
function LogisticsMetricsBar() {
  const [msgs, setMsgs]   = useState(28471);
  const [latency, setLat] = useState(1.4);

  useEffect(() => {
    const t1 = setInterval(() => setMsgs(m => m + Math.floor(Math.random()*5)+2), 1200);
    const t2 = setInterval(() => setLat(parseFloat((Math.random()*0.8+0.9).toFixed(1))), 2500);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  return (
    <motion.div
      className="inline-flex items-center gap-5 border border-[#0B1F3A]/10 rounded-lg px-5 py-3"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}>
      {[
        { val: msgs.toLocaleString(), lbl: "Messages today"  },
        { val: `${latency}s`,          lbl: "Avg latency"    },
        { val: "0",                    lbl: "Failed messages" },
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
        animate={{ boxShadow: ["0 0 0 0px rgba(16,185,129,.5)","0 0 0 4px rgba(16,185,129,0)","0 0 0 0px rgba(16,185,129,.5)"] }}
        transition={{ duration: 1.8, repeat: Infinity }} />
    </motion.div>
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
    let pkts: Pkt[] = [{ p: index * 0.33, spd: 0.006 + index * 0.001 }];
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
        ctx.globalAlpha = fade*0.55; ctx.fillStyle="#1A73E8";
        ctx.shadowColor="#1A73E8"; ctx.shadowBlur=4;
        ctx.beginPath(); ctx.arc(x, canvas.height/2, 2.5, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur=0; ctx.globalAlpha=1;
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
        animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.35, ease: [0.16,1,0.3,1] }} />
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
            animate={{ scaleX: hovered ? 1 : 0 }} transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }} />
        </div>
      </div>
      <div className="md:col-span-8 relative">
        <p className="text-sm text-[#475569] leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

// ─── Help card ────────────────────────────────────────────────────────────────
function HelpCard({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);
  const glowX = useMotionValue(50), glowY = useMotionValue(50), glowOp = useMotionValue(0);
  const glowBg = useTransform([glowX, glowY], ([x,y]) =>
    `radial-gradient(ellipse at ${x}% ${y}%, rgba(26,115,232,0.07) 0%, transparent 65%)`);
  const shimX = useMotionValue(-100);
  const shimT = useTransform(shimX, v => `${v}%`);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    glowX.set(((e.clientX-r.left)/r.width)*100);
    glowY.set(((e.clientY-r.top)/r.height)*100);
    animate(glowOp, 1, { duration: 0.25 });
  };
  const onEnter = useCallback(() => {
    setHovered(true); shimX.set(-100); animate(shimX, 200, { duration: 0.5, ease: "easeInOut" });
  }, [shimX]);
  const onLeave = () => { setHovered(false); animate(glowOp, 0, { duration: 0.3 }); };

  return (
    <motion.div variants={staggerItem}
      className="border border-[#0B1F3A]/10 rounded-lg p-5 bg-white flex items-start gap-3 relative overflow-hidden cursor-default"
      whileHover={{ y: -2, borderColor: "rgba(26,115,232,0.3)", boxShadow: "0 6px 22px rgba(26,115,232,0.1)", transition: { duration: 0.18, ease: EASE } }}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ opacity: glowOp, background: glowBg }} />
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left: 0, width: "55%", height: 1, background: "linear-gradient(90deg,transparent,rgba(26,115,232,0.4),transparent)", x: shimT }} />
      <motion.span className="text-[#1A73E8]/40 mt-0.5 flex-shrink-0 relative z-10"
        animate={{ x: hovered ? 3 : 0, color: hovered ? "#1A73E8" : "rgba(26,115,232,0.4)" }} transition={{ duration: 0.2 }}>
        →
      </motion.span>
      <motion.span className="text-sm relative z-10"
        animate={{ color: hovered ? "#0B1F3A" : "rgba(71,85,105,1)" }} transition={{ duration: 0.2 }}>
        {label}
      </motion.span>
    </motion.div>
  );
}

// ─── Live EDI message ticker ──────────────────────────────────────────────────
function MessageTicker() {
  const messages = [
    "204 Load Tender → Carrier A",
    "856 Ship Notice → Customer A",
    "214 Transport Status → WMS",
    "990 Response received ← 3PL",
    "997 Functional Ack → Partner",
    "210 Freight Invoice → ERP",
  ];
  const [idx, setIdx]   = useState(0);
  const [vis, setVis]   = useState(true);
  const [count, setCnt] = useState(28471);

  useEffect(() => {
    const t1 = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(i=>(i+1)%messages.length); setVis(true); }, 220);
    }, 2000);
    const t2 = setInterval(() => setCnt(c=>c+Math.floor(Math.random()*4)+1), 1200);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  return (
    <div className="mt-8 bg-white border border-[#0B1F3A]/10 rounded-lg px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[9px] text-[#0B1F3A]/35 uppercase tracking-widest">Live message stream</p>
        <div className="flex items-center gap-1.5 text-[9px] text-[#0B1F3A]/38">
          <motion.span className="w-1 h-1 rounded-full bg-[#10B981]"
            animate={{ boxShadow: ["0 0 0 0px rgba(16,185,129,.5)","0 0 0 3px rgba(16,185,129,0)","0 0 0 0px rgba(16,185,129,.5)"] }}
            transition={{ duration: 1.8, repeat: Infinity }} />
          {count.toLocaleString()} today
        </div>
      </div>
      <div className="flex items-center gap-2 bg-[#1A73E8]/[0.04] rounded-md px-3 py-2">
        <motion.span className="w-1 h-1 rounded-full bg-[#1A73E8] flex-shrink-0"
          animate={{ opacity:[1,0.3,1] }} transition={{ duration: 0.9, repeat: Infinity }} />
        <span className="text-xs text-[#475569] font-mono"
          style={{ opacity: vis ? 1 : 0, transition: "opacity 0.2s" }}>
          {messages[idx]}
        </span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function LogisticsPage() {
  return (
    <>
      {/* ── Hero — text LEFT, journey diagram RIGHT ── */}
      <section className="pt-40 pb-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* LEFT — copy + metrics, no canvas */}
            <div className="space-y-6">
              <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>
                Logistics & Supply Chain
              </motion.p>
              <motion.h1 className="text-5xl md:text-6xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}>
                Every shipment depends on <span className="text-[#1A73E8]">data that arrives on time.</span>
              </motion.h1>
              <motion.p className="text-lg text-[#475569] leading-relaxed"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
                Logistics runs on the constant, accurate exchange of data between carriers, partners and customers. We make sure that exchange never fails.
              </motion.p>

              <LogisticsMetricsBar />

              <motion.div className="flex flex-wrap gap-3 pt-2"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE, delay: 0.45 }}>
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
                  <Link to="/services/edi-b2b-integration"
                    className="block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors"
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(26,115,232,0.28)";}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
                    Explore EDI & B2B Integration
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
                  <Link to="/contact"
                    className="block border border-[#1A73E8]/30 text-[#1A73E8] px-6 py-2.5 text-sm rounded-md hover:bg-[#1A73E8]/[0.05] transition-colors">
                    Book an EDI health assessment
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT — logistics journey diagram in contained card */}
            <motion.div
              className="hidden md:block bg-white border border-[#0B1F3A]/10 rounded-xl overflow-hidden"
              style={{ height: 400 }}
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}>
              <div className="px-5 py-3 border-b border-[#0B1F3A]/[0.07] flex items-center justify-between">
                <span className="text-[9px] text-[#1A73E8] uppercase tracking-widest">Supply chain network</span>
                <div className="flex items-center gap-1.5 text-[9px] text-[#0B1F3A]/38">
                  <motion.span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"
                    animate={{ boxShadow: ["0 0 0 0px rgba(16,185,129,.5)","0 0 0 3px rgba(16,185,129,0)","0 0 0 0px rgba(16,185,129,.5)"] }}
                    transition={{ duration: 1.8, repeat: Infinity }} />
                  Live
                </div>
              </div>
              <div style={{ height: "calc(100% - 41px)" }}>
                <LogisticsNetworkCanvas />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Challenges ── */}
      <section className="py-24 px-4 bg-[#1A73E8]/[0.02] border-t border-b border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              The Integration Challenges
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Where logistics integration <span className="text-[#1A73E8]">breaks down.</span>
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
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              How We Help
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-[#0B1F3A] leading-tight tracking-tight mb-6"
              variants={fadeUp} custom={0.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Data that flows. <span className="text-[#1A73E8]">Operations that run.</span>
            </motion.h2>
            <motion.p className="text-base text-[#475569] leading-relaxed"
              variants={fadeUpLarge} custom={0.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              We implement and operate EDI and B2B integration across the carrier, partner, and customer network — so every message arrives correctly, every time. We monitor proactively and handle exceptions before they become shipment failures.
            </motion.p>
            <motion.div variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              <MessageTicker />
            </motion.div>
          </div>
          <motion.div className="space-y-4"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {howWeHelp.map(item => <HelpCard key={item.label} label={item.label} />)}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 border-t border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.h2 className="text-4xl font-normal text-[#0B1F3A] tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Protect the data behind <span className="text-[#1A73E8]">every shipment.</span>
          </motion.h2>
          <motion.p className="text-base text-[#475569] max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Book an EDI health assessment and find out exactly where your logistics integration is at risk.
          </motion.p>
          <motion.div variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact"
              className="inline-block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors"
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(26,115,232,0.28)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
              Book an EDI health assessment
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}