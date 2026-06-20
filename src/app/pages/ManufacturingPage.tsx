import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const challenges = [
  { label: "Supplier & Distributor Integration", desc: "Manufacturing depends on a constant flow of orders, advance shipment notices, and invoices across dozens or hundreds of suppliers. A break in that flow is a break in production." },
  { label: "ERP Connectivity",                   desc: "Your ERP is the centre of manufacturing operations. EDI that isn't cleanly connected to it creates manual re-entry, reconciliation errors, and unreliable production data." },
  { label: "Just-in-Time Dependence",             desc: "JIT manufacturing leaves no buffer. When an EDI message fails or arrives late, the impact on the production line is immediate and measurable." },
];

const helpItems = [
  { label: "ERP-connected EDI — no manual re-entry, no reconciliation errors" },
  { label: "Supplier network onboarded fast — days not weeks" },
  { label: "Proactive monitoring — exceptions caught before the line notices" },
];

// ─── Manufacturing supply chain canvas ───────────────────────────────────────
// Linear production flow: Suppliers → ERP Hub → Production → Distributors
// Nodes: suppliers (circles) LEFT → ERP Hub (navy rect) CENTER-LEFT
//        → Production Line (animated rect) CENTER → Distributors (rects) RIGHT
function ManufacturingCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;

    type NodeType = "supplier" | "erp" | "line" | "distributor";
    type Node   = { x: number; y: number; label: string; type: NodeType; phase: number };
    type Edge   = { from: number; to: number };
    type Packet = { edge: Edge; t: number; spd: number };

    let nodes: Node[] = [], edges: Edge[] = [], packets: Packet[] = [];

    // Topology: 3 suppliers LEFT → ERP Hub → Production Line → 3 distributors RIGHT
    const LABELS = ["Supplier A", "Supplier B", "Supplier C", "ERP\nHub", "Production\nLine", "Distributor A", "Distributor B", "Distributor C"];
    const REL: [number, number][] = [
      [0.11, 0.24], [0.11, 0.50], [0.11, 0.76], // suppliers left
      [0.38, 0.50],                               // ERP Hub
      [0.62, 0.50],                               // Production Line
      [0.89, 0.24], [0.89, 0.50], [0.89, 0.76], // distributors right
    ];
    const TYPES: NodeType[] = ["supplier","supplier","supplier","erp","line","distributor","distributor","distributor"];
    const EDGE_DEF: [number,number][] = [[0,3],[1,3],[2,3],[3,4],[4,5],[4,6],[4,7]];

    const build = () => {
      const W = canvas.width = canvas.offsetWidth;
      const H = canvas.height = canvas.offsetHeight;
      nodes = REL.map((p, i) => ({ x: p[0]*W, y: p[1]*H, label: LABELS[i], type: TYPES[i], phase: i * 0.8 }));
      edges = EDGE_DEF.map(([f, t]) => ({ from: f, to: t }));
    };
    build(); window.addEventListener("resize", build);

    const spawn = () => {
      const e = edges[Math.floor(Math.random() * edges.length)];
      packets.push({ edge: e, t: 0, spd: 0.008 + Math.random() * 0.007 });
    };
    for (let i = 0; i < 5; i++) setTimeout(spawn, i * 250);

    let frame = 0, t = 0;
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H); t++;

      // edges
      edges.forEach((e, i) => {
        const a = nodes[e.from], b = nodes[e.to];
        ctx.globalAlpha = 0.08 + Math.sin(t * 0.02 + i) * 0.03;
        ctx.strokeStyle = "#1A73E8"; ctx.lineWidth = 1; ctx.setLineDash([4, 8]);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        ctx.setLineDash([]);
      });
      ctx.globalAlpha = 1;

      // packets
      packets = packets.filter(p => {
        p.t += p.spd; if (p.t > 1) return false;
        const a = nodes[p.edge.from], b = nodes[p.edge.to];
        const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
        const fade = p.t < 0.08 ? p.t / 0.08 : p.t > 0.88 ? (1 - p.t) / 0.12 : 1;
        for (let i = 1; i <= 4; i++) {
          const tt = Math.max(0, p.t - i * 0.02);
          ctx.globalAlpha = ((4-i)/8)*0.35*fade; ctx.fillStyle = "#1A73E8";
          ctx.beginPath(); ctx.arc(a.x+(b.x-a.x)*tt, a.y+(b.y-a.y)*tt, Math.max(0.4,2-i*0.3), 0, Math.PI*2); ctx.fill();
        }
        ctx.globalAlpha = fade*0.9; ctx.fillStyle = "#1A73E8";
        ctx.shadowColor = "#1A73E8"; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        return true;
      });

      // nodes — shapes + icons first
      nodes.forEach(n => {
        const breathe = Math.sin(t * 0.03 + n.phase) * 1.5;

        if (n.type === "supplier") {
          // Suppliers — circle; icon = factory/warehouse
          ctx.globalAlpha = 0.06; ctx.strokeStyle="#1A73E8"; ctx.lineWidth=1;
          ctx.beginPath(); ctx.arc(n.x, n.y, 19+breathe, 0, Math.PI*2); ctx.stroke();
          ctx.globalAlpha = 1; ctx.fillStyle="#fff"; ctx.strokeStyle="rgba(26,115,232,0.22)"; ctx.lineWidth=1.3;
          ctx.beginPath(); ctx.arc(n.x, n.y, 15, 0, Math.PI*2); ctx.fill(); ctx.stroke();
          // factory icon: base + two roof peaks + chimney
          ctx.fillStyle = "#1A73E8"; ctx.strokeStyle = "#1A73E8"; ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(n.x-7, n.y+5);
          ctx.lineTo(n.x-7, n.y-1);
          ctx.lineTo(n.x-2, n.y+2);
          ctx.lineTo(n.x-2, n.y-1);
          ctx.lineTo(n.x+3, n.y+2);
          ctx.lineTo(n.x+3, n.y-2);
          ctx.lineTo(n.x+7, n.y-2);
          ctx.lineTo(n.x+7, n.y+5);
          ctx.closePath(); ctx.fill();
          ctx.fillStyle = "#fff";
          ctx.fillRect(n.x-5, n.y+2, 1.6, 2.4);
          ctx.fillRect(n.x, n.y+2, 1.6, 2.4);

        } else if (n.type === "erp") {
          // ERP Hub — navy rounded rect; icon = database cylinder
          ctx.globalAlpha=0.12+Math.sin(t*0.03+n.phase)*0.04; ctx.strokeStyle="#1A73E8"; ctx.lineWidth=1;
          ctx.beginPath(); (ctx as any).roundRect(n.x-36, n.y-22, 72, 44, 6); ctx.stroke();
          ctx.globalAlpha=1; ctx.fillStyle="#0B1F3A";
          ctx.beginPath(); (ctx as any).roundRect(n.x-32, n.y-19, 64, 38, 5); ctx.fill();
          // database icon (left) + label drawn in label pass
          const dbx = n.x-18, dby = n.y;
          ctx.strokeStyle = "#fff"; ctx.fillStyle = "#fff"; ctx.lineWidth = 1.3;
          ctx.beginPath(); ctx.ellipse(dbx, dby-6, 6, 2.4, 0, 0, Math.PI*2); ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(dbx-6, dby-6); ctx.lineTo(dbx-6, dby+6);
          ctx.moveTo(dbx+6, dby-6); ctx.lineTo(dbx+6, dby+6);
          ctx.stroke();
          ctx.beginPath(); ctx.ellipse(dbx, dby, 6, 2.4, 0, 0, Math.PI); ctx.stroke();
          ctx.beginPath(); ctx.ellipse(dbx, dby+6, 6, 2.4, 0, 0, Math.PI); ctx.stroke();

        } else if (n.type === "line") {
          // Production Line — animated rect with conveyor; icon = gear (right)
          const pulse = 0.5 + Math.sin(t * 0.06 + n.phase) * 0.5;
          ctx.globalAlpha=0.1+pulse*0.06; ctx.strokeStyle="#1A73E8"; ctx.lineWidth=1;
          ctx.beginPath(); (ctx as any).roundRect(n.x-38, n.y-24, 76, 48, 6); ctx.stroke();
          ctx.globalAlpha=1; ctx.fillStyle="#F4F8FF"; ctx.strokeStyle="rgba(26,115,232,0.3)"; ctx.lineWidth=1.5;
          ctx.beginPath(); (ctx as any).roundRect(n.x-34, n.y-21, 68, 42, 5); ctx.fill(); ctx.stroke();
          // rotating gear — top-LEFT, small (label fills the rest of the top row)
          const gx = n.x-22, gy = n.y-11, gr = 5, teeth = 8, rot = t*0.04;
          ctx.fillStyle = "rgba(26,115,232,0.85)";
          ctx.beginPath();
          for (let i=0;i<teeth*2;i++){
            const ang = rot + (Math.PI/teeth)*i;
            const rr = i%2===0 ? gr : gr*0.7;
            const px = gx+Math.cos(ang)*rr, py = gy+Math.sin(ang)*rr;
            i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
          }
          ctx.closePath(); ctx.fill();
          ctx.fillStyle = "#F4F8FF";
          ctx.beginPath(); ctx.arc(gx, gy, 2, 0, Math.PI*2); ctx.fill();
          // conveyor dots — thin strip along the very TOP of the box
          for (let i = 0; i < 3; i++) {
            const dx = -8 + i * 12 + ((t * 0.8) % 12) - 6;
            ctx.fillStyle = "rgba(26,115,232,0.32)";
            ctx.beginPath(); ctx.arc(n.x + 6 + dx, n.y - 11, 2, 0, Math.PI*2); ctx.fill();
          }

        } else {
          // Distributors — rounded rect; icon = truck
          ctx.globalAlpha=0.06; ctx.strokeStyle="#1A73E8"; ctx.lineWidth=1;
          ctx.beginPath(); (ctx as any).roundRect(n.x-24, n.y-15, 48, 30, 5); ctx.stroke();
          ctx.globalAlpha=1; ctx.fillStyle="#F4F8FF"; ctx.strokeStyle="rgba(26,115,232,0.28)"; ctx.lineWidth=1.3;
          ctx.beginPath(); (ctx as any).roundRect(n.x-22, n.y-13, 44, 26, 4); ctx.fill(); ctx.stroke();
          // truck icon
          ctx.fillStyle = "#1A73E8"; ctx.strokeStyle = "#1A73E8"; ctx.lineWidth = 1.2;
          ctx.beginPath(); (ctx as any).roundRect(n.x-12, n.y-5, 13, 9, 1.5); ctx.fill();   // cargo box
          ctx.beginPath();
          ctx.moveTo(n.x+1, n.y-1); ctx.lineTo(n.x+8, n.y-1); ctx.lineTo(n.x+11, n.y+2);
          ctx.lineTo(n.x+11, n.y+4); ctx.lineTo(n.x+1, n.y+4); ctx.closePath(); ctx.fill(); // cab
          ctx.fillStyle = "#0B1F3A";
          ctx.beginPath(); ctx.arc(n.x-7, n.y+5, 2.2, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(n.x+7, n.y+5, 2.2, 0, Math.PI*2); ctx.fill();
        }
      });

      // label pass — suppliers/distributors labels BELOW shape (halo);
      // ERP label = white on its navy box; Production label = navy on its light box.
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      nodes.forEach(n => {
        const lines = n.label.split("\n");
        const below = n.type === "supplier" || n.type === "distributor";
        const onNavy = n.type === "erp"; // only the ERP box is dark → white text
        const color = onNavy ? "#fff" : "rgba(11,31,58,0.82)";
        const weight = (n.type === "erp" || n.type === "line") ? "600" : "500";
        // production label sits in the lower box, slightly smaller so both words fit
        ctx.font = `${weight} ${n.type === "line" ? 9 : 10}px system-ui, -apple-system, sans-serif`;
        const lineH = n.type === "line" ? 11 : 12;
        // anchor per node so labels never sit under their icons:
        //  - supplier/distributor: centered BELOW the shape (with halo)
        //  - erp: to the RIGHT of the db cylinder (icon is on the left)
        //  - line: INSIDE the box, lower-center (gear + conveyor are along the top)
        const ax = n.type === "erp" ? n.x + 12 : n.x;
        const offsetY = n.type === "supplier" ? 28
          : n.type === "distributor" ? 26
          : n.type === "line" ? 6
          : 0;
        const startY = n.y + offsetY - ((lines.length - 1) * lineH) / 2;
        lines.forEach((l, j) => {
          const ly = startY + j * lineH;
          if (below) {
            ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255,255,255,0.92)";
            ctx.strokeText(l, n.x, ly);
          }
          ctx.fillStyle = color;
          ctx.fillText(l, ax, ly);
        });
      });
      ctx.globalAlpha = 1;
      ctx.globalAlpha = 1;
      frame++; if (frame % 50 === 0) spawn();
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", build); };
  }, []);

  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ─── Live manufacturing metrics bar ──────────────────────────────────────────
function ManufacturingMetricsBar() {
  const [messages, setMessages] = useState(9241);
  const [suppliers, setSuppliers] = useState(340);
  const [uptime, setUptime] = useState("99.97");

  useEffect(() => {
    const t1 = setInterval(() => setMessages(m => m + Math.floor(Math.random()*4)+1), 1600);
    return () => clearInterval(t1);
  }, []);

  return (
    <motion.div
      className="inline-flex items-center gap-5 border border-[#0B1F3A]/10 rounded-lg px-5 py-3"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}>
      {[
        { val: messages.toLocaleString(), lbl: "EDI messages today"  },
        { val: `${suppliers}+`,            lbl: "Suppliers connected" },
        { val: `${uptime}%`,               lbl: "Line uptime"         },
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
        animate={{ boxShadow: ["0 0 0 0px rgba(16,185,129,0.5)","0 0 0 4px rgba(16,185,129,0)","0 0 0 0px rgba(16,185,129,0.5)"] }}
        transition={{ duration: 1.8, repeat: Infinity }} />
    </motion.div>
  );
}

// ─── Live supply chain message ticker ────────────────────────────────────────
function SupplyTicker() {
  const messages = [
    "830 Planning Schedule → Supplier A",
    "855 PO Ack received ← Supplier B",
    "856 ASN incoming ← Supplier C",
    "862 Shipping Schedule → Distributor A",
    "997 Ack confirmed ← Distributor B",
    "810 Invoice processed ← Supplier A",
  ];
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  const [count, setCnt] = useState(9241);

  useEffect(() => {
    const t1 = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(i => (i+1)%messages.length); setVis(true); }, 220);
    }, 2000);
    const t2 = setInterval(() => setCnt(c => c + Math.floor(Math.random()*3)+1), 1600);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  return (
    <div className="mt-8 bg-white border border-[#0B1F3A]/10 rounded-lg px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[9px] text-[#0B1F3A]/35 uppercase tracking-widest">Live supply chain stream</p>
        <div className="flex items-center gap-1.5 text-[9px] text-[#0B1F3A]/38">
          <motion.span className="w-1 h-1 rounded-full bg-[#10B981]"
            animate={{ boxShadow: ["0 0 0 0px rgba(16,185,129,0.5)","0 0 0 3px rgba(16,185,129,0)","0 0 0 0px rgba(16,185,129,0.5)"] }}
            transition={{ duration: 1.8, repeat: Infinity }} />
          {count.toLocaleString()} today
        </div>
      </div>
      <div className="flex items-center gap-2 bg-[#1A73E8]/[0.04] rounded-md px-3 py-2">
        <motion.span className="w-1 h-1 rounded-full bg-[#1A73E8] flex-shrink-0"
          animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.9, repeat: Infinity }} />
        <span className="text-xs text-[#475569] font-mono"
          style={{ opacity: vis ? 1 : 0, transition: "opacity 0.2s" }}>
          {messages[idx]}
        </span>
      </div>
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
        const fade = pk.p < 0.05 ? pk.p / 0.05 : pk.p > 0.9 ? (1 - pk.p) / 0.1 : 1;
        ctx.globalAlpha = fade * 0.55; ctx.fillStyle = "#1A73E8";
        ctx.shadowColor = "#1A73E8"; ctx.shadowBlur = 4;
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

// ─── Help card with cursor glow + shimmer ─────────────────────────────────────
function HelpCard({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);
  const glowX = useMotionValue(50), glowY = useMotionValue(50), glowOp = useMotionValue(0);
  const glowBg = useTransform([glowX, glowY],
    ([x, y]) => `radial-gradient(ellipse at ${x}% ${y}%, rgba(26,115,232,0.07) 0%, transparent 65%)`);
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
      className="border border-[#0B1F3A]/10 rounded-lg p-5 bg-white flex items-start gap-3 relative overflow-hidden cursor-default"
      whileHover={{ y: -2, borderColor: "rgba(26,115,232,0.3)", boxShadow: "0 6px 22px rgba(26,115,232,0.1)", transition: { duration: 0.18, ease: EASE } }}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{ opacity: glowOp, background: glowBg }} />
      <motion.div className="absolute top-0 pointer-events-none"
        style={{ left: 0, width: "55%", height: 1, background: "linear-gradient(90deg,transparent,rgba(26,115,232,0.4),transparent)", x: shimT }} />
      <motion.span className="text-[#1A73E8]/40 mt-0.5 flex-shrink-0 relative z-10"
        animate={{ x: hovered ? 3 : 0, color: hovered ? "#1A73E8" : "rgba(26,115,232,0.4)" }}
        transition={{ duration: 0.2 }}>→</motion.span>
      <motion.span className="text-sm relative z-10"
        animate={{ color: hovered ? "#0B1F3A" : "rgba(71,85,105,1)" }}
        transition={{ duration: 0.2 }}>
        {label}
      </motion.span>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function ManufacturingPage() {
  return (
    <>
      {/* ── Hero — text LEFT, supply chain diagram RIGHT ── */}
      <section className="pt-40 pb-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* LEFT — copy only */}
            <div className="space-y-6">
              <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}>
                Manufacturing
              </motion.p>
              <motion.h1 className="text-5xl md:text-6xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE, delay: 0.15 }}>
                Connect the supply chain that <span className="text-[#1A73E8]">keeps the line moving.</span>
              </motion.h1>
              <motion.p className="text-lg text-[#475569] leading-relaxed"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}>
                From suppliers to distributors, manufacturing depends on connected systems. A break in the chain is a break in production.
              </motion.p>

              <ManufacturingMetricsBar />

              <motion.div className="flex flex-wrap gap-3 pt-2"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE, delay: 0.45 }}>
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
                  <Link to="/services/edi-b2b-integration"
                    className="block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors"
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(26,115,232,0.28)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
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

            {/* RIGHT — manufacturing supply chain diagram in contained card */}
            <motion.div
              className="hidden md:block bg-white border border-[#0B1F3A]/10 rounded-xl overflow-hidden"
              style={{ height: 400 }}
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}>
              <div className="px-5 py-3 border-b border-[#0B1F3A]/[0.07] flex items-center justify-between">
                <span className="text-[9px] text-[#1A73E8] uppercase tracking-widest">Supply chain network</span>
                <div className="flex items-center gap-1.5 text-[9px] text-[#0B1F3A]/38">
                  <motion.span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"
                    animate={{ boxShadow: ["0 0 0 0px rgba(16,185,129,0.5)","0 0 0 3px rgba(16,185,129,0)","0 0 0 0px rgba(16,185,129,0.5)"] }}
                    transition={{ duration: 1.8, repeat: Infinity }} />
                  Live
                </div>
              </div>
              <div style={{ height: "calc(100% - 41px)" }}>
                <ManufacturingCanvas />
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
              Where manufacturing integration is <span className="text-[#1A73E8]">most at risk.</span>
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
              Integration that keeps <span className="text-[#1A73E8]">production flowing.</span>
            </motion.h2>
            <motion.p className="text-base text-[#475569] leading-relaxed"
              variants={fadeUpLarge} custom={0.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              We implement and operate EDI and B2B integration across your supplier and distributor network, with clean ERP connectivity at the centre. The result: a supply chain that sends and receives data reliably, so production plans stay on track.
            </motion.p>
            {/* live supply chain ticker */}
            <motion.div variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              <SupplyTicker />
            </motion.div>
          </div>

          <motion.div className="space-y-4"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {helpItems.map(item => (
              <HelpCard key={item.label} label={item.label} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 border-t border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.h2 className="text-4xl font-normal text-[#0B1F3A] tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Is your supply chain integration <span className="text-[#1A73E8]">as reliable as your production?</span>
          </motion.h2>
          <motion.p className="text-base text-[#475569] max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Book an EDI health assessment and get a clear picture of where integration risk sits in your supply chain.
          </motion.p>
          <motion.div variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            whileHover={{ y: -3 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link to="/contact"
              className="inline-block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors"
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(26,115,232,0.28)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
              Book an EDI health assessment
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}