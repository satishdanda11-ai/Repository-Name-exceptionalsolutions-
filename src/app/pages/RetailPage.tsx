import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const challenges = [
  { label: "High Trading-Partner Volume", desc: "Hundreds of partners, each with their own requirements, all needing to be onboarded and kept running. Manual processes don't scale — and mistakes cost chargebacks." },
  { label: "Chargeback Exposure",         desc: "An EDI error becomes a retailer chargeback. At scale, that is a serious, avoidable cost. We reduce transaction errors so your chargebacks drop, not your margins." },
  { label: "Peak-Season Load",            desc: "Volumes spike sharply. Integration that copes in March must also cope in November. We build and operate EDI that handles peak without drama." },
];

// ─── Retail hub-and-spoke canvas ─────────────────────────────────────────────
// Suppliers (circles) LEFT → Brand Hub (large brand-blue circle) CENTER → Retailers (rounded rects) RIGHT
// Hub has triple breathing rings + flash on packet arrival
// Retailer rects flash briefly when a packet lands on them
function RetailNetworkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number;

    type NodeShape = "hub" | "retailer" | "supplier";
    type Node   = { x:number; y:number; label:string; shape:NodeShape; phase:number; flash:number };
    type Edge   = { from:number; to:number };
    type Packet = { edge:Edge; t:number; spd:number };

    let nodes: Node[] = [], edges: Edge[] = [], packets: Packet[] = [];

    const LABELS = ["Walmart","Amazon","Target","Costco","Brand\nHub","Supply A","Supply B","Supply C"];
    const REL: [number,number][] = [
      [0.86,0.14],[0.86,0.38],[0.86,0.62],[0.86,0.86], // retailers right
      [0.50,0.50],                                       // Brand Hub center
      [0.10,0.22],[0.10,0.52],[0.10,0.80],              // suppliers left
    ];
    const SHAPES: NodeShape[] = ["retailer","retailer","retailer","retailer","hub","supplier","supplier","supplier"];
    const EDGE_DEF: [number,number][] = [[5,4],[6,4],[7,4],[4,0],[4,1],[4,2],[4,3]];

    const build = () => {
      const W = canvas.width = canvas.offsetWidth;
      const H = canvas.height = canvas.offsetHeight;
      nodes = REL.map((p,i)=>({ x:p[0]*W, y:p[1]*H, label:LABELS[i], shape:SHAPES[i], phase:i*0.9, flash:0 }));
      edges = EDGE_DEF.map(([f,t])=>({ from:f, to:t }));
    };
    build(); window.addEventListener("resize", build);

    const spawn = () => {
      const e = edges[Math.floor(Math.random()*edges.length)];
      packets.push({ edge:e, t:0, spd:0.007+Math.random()*0.009 });
    };
    for (let i=0;i<5;i++) setTimeout(spawn, i*260);

    let frame=0, t=0;
    const draw = () => {
      const W=canvas.width, H=canvas.height;
      ctx.clearRect(0,0,W,H); t++;

      // edges — slightly different dash for supplier→hub vs hub→retailer
      edges.forEach((e,i) => {
        const a=nodes[e.from], b=nodes[e.to];
        ctx.globalAlpha = 0.08+Math.sin(t*0.02+i)*0.03;
        ctx.strokeStyle="#1A73E8"; ctx.lineWidth=1;
        // supplier→hub: shorter dash; hub→retailer: longer dash
        ctx.setLineDash(e.to===4 ? [3,10] : [5,7]);
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        ctx.setLineDash([]);
      });
      ctx.globalAlpha=1;

      // packets with comet trail — decay flash on arrival
      packets = packets.filter(p => {
        p.t += p.spd; if (p.t > 1) {
          // flash the destination node
          nodes[p.edge.to].flash = 18;
          return false;
        }
        const a=nodes[p.edge.from], b=nodes[p.edge.to];
        const x=a.x+(b.x-a.x)*p.t, y=a.y+(b.y-a.y)*p.t;
        const fade=p.t<0.08?p.t/0.08:p.t>0.88?(1-p.t)/0.12:1;
        // comet trail
        for (let i=1;i<=5;i++){
          const tt=Math.max(0,p.t-i*0.022);
          ctx.globalAlpha=((5-i)/10)*0.36*fade; ctx.fillStyle="#1A73E8";
          ctx.beginPath(); ctx.arc(a.x+(b.x-a.x)*tt,a.y+(b.y-a.y)*tt,Math.max(0.4,2.2-i*0.32),0,Math.PI*2); ctx.fill();
        }
        ctx.globalAlpha=fade*0.9; ctx.fillStyle="#1A73E8";
        ctx.shadowColor="#1A73E8"; ctx.shadowBlur=6;
        ctx.beginPath(); ctx.arc(x,y,3.2,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0; ctx.globalAlpha=1;
        return true;
      });

      // nodes — each shape tells a story
      nodes.forEach(n => {
        const breathe = Math.sin(t*0.03+n.phase)*1.5;
        const flashAlpha = n.flash > 0 ? (n.flash/18)*0.35 : 0;
        if (n.flash > 0) n.flash--;

        if (n.shape === "hub") {
          // Brand Hub — three concentric rings pulsing outward, dramatic presence
          const hubBreath = Math.sin(t*0.03+n.phase)*3;
          // ring 1
          ctx.globalAlpha=0.14+Math.sin(t*0.03+n.phase)*0.05;
          ctx.strokeStyle="#1A73E8"; ctx.lineWidth=1;
          ctx.beginPath(); ctx.arc(n.x,n.y,30+hubBreath,0,Math.PI*2); ctx.stroke();
          // ring 2
          ctx.globalAlpha=0.07+Math.sin(t*0.025+n.phase)*0.02;
          ctx.beginPath(); ctx.arc(n.x,n.y,42+hubBreath,0,Math.PI*2); ctx.stroke();
          // ring 3 (faintest, widest)
          ctx.globalAlpha=0.035;
          ctx.beginPath(); ctx.arc(n.x,n.y,56+hubBreath,0,Math.PI*2); ctx.stroke();
          // fill
          ctx.globalAlpha=1; ctx.fillStyle="#1A73E8"; ctx.lineWidth=1.5;
          ctx.beginPath(); ctx.arc(n.x,n.y,24,0,Math.PI*2); ctx.fill();
          // flash ring on packet arrival
          if (n.flash > 0) {
            ctx.globalAlpha=flashAlpha; ctx.strokeStyle="#1A73E8"; ctx.lineWidth=2;
            ctx.beginPath(); ctx.arc(n.x,n.y,30+(18-n.flash)*2,0,Math.PI*2); ctx.stroke();
          }
          ctx.globalAlpha=1;
          ctx.fillStyle="#fff"; ctx.font="600 8px system-ui";
          ctx.textAlign="center"; ctx.textBaseline="middle";
          ctx.fillText("Brand",n.x,n.y-5); ctx.fillText("Hub",n.x,n.y+6);

        } else if (n.shape === "retailer") {
          // Retailers — rounded rects (brand/store badge feel)
          // Flash: rect brightens briefly when a packet arrives
          ctx.globalAlpha=0.08; ctx.strokeStyle="#1A73E8"; ctx.lineWidth=1;
          ctx.beginPath(); (ctx as any).roundRect(n.x-25,n.y-14,50,28,4); ctx.stroke();
          ctx.globalAlpha=1;
          // flash fill on arrival
          ctx.fillStyle=n.flash>0 ? `rgba(26,115,232,${flashAlpha})` : "#F4F8FF";
          ctx.strokeStyle="rgba(26,115,232,0.28)"; ctx.lineWidth=1.2;
          ctx.beginPath(); (ctx as any).roundRect(n.x-23,n.y-13,46,26,4); ctx.fill(); ctx.stroke();
          ctx.fillStyle="rgba(11,31,58,0.72)"; ctx.font="500 8px system-ui";
          ctx.textAlign="center"; ctx.textBaseline="middle";
          ctx.fillText(n.label,n.x,n.y);

        } else {
          // Suppliers — breathing circles
          ctx.globalAlpha=0.06; ctx.strokeStyle="#1A73E8"; ctx.lineWidth=1;
          ctx.beginPath(); ctx.arc(n.x,n.y,22+breathe,0,Math.PI*2); ctx.stroke();
          ctx.globalAlpha=1; ctx.fillStyle="#fff"; ctx.strokeStyle="rgba(26,115,232,0.2)"; ctx.lineWidth=1.2;
          ctx.beginPath(); ctx.arc(n.x,n.y,17,0,Math.PI*2); ctx.fill(); ctx.stroke();
          ctx.fillStyle="rgba(11,31,58,0.65)"; ctx.font="500 7.5px system-ui";
          ctx.textAlign="center"; ctx.textBaseline="middle";
          ctx.fillText(n.label,n.x,n.y);
        }
      });
      ctx.globalAlpha=1;
      frame++; if (frame%52===0) spawn();
      id=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{ cancelAnimationFrame(id); window.removeEventListener("resize",build); };
  }, []);

  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}} />;
}

// ─── Animated peak-season load bar ───────────────────────────────────────────
// Shows volume at different months — spikes in Nov/Dec to illustrate the point
function PeakBar({ month, val, peak=false }: { month:string; val:number; peak?:boolean }) {
  const [w, setW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el=ref.current; if (!el) return;
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting) setW(val); },{threshold:.4});
    obs.observe(el); return ()=>obs.disconnect();
  },[val]);
  return (
    <div ref={ref} className="flex items-center gap-2.5">
      <span className="text-[9px] text-[#0B1F3A]/38 w-6 text-right flex-shrink-0">{month}</span>
      <div className="flex-1 h-2 bg-[#1A73E8]/[0.08] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width:`${w}%`, background: peak ? "#1A73E8" : "rgba(26,115,232,0.35)" }} />
      </div>
      {peak && <span className="text-[8px] text-[#1A73E8] flex-shrink-0 font-medium">Peak</span>}
    </div>
  );
}

// ─── Live retail metrics bar ──────────────────────────────────────────────────
function RetailMetricsBar() {
  const [orders, setOrders] = useState(14829);
  const [chargebacks, setCB] = useState(0.3);

  useEffect(()=>{
    const t1=setInterval(()=>setOrders(o=>o+Math.floor(Math.random()*6)+2),1400);
    const t2=setInterval(()=>setCB(parseFloat((Math.random()*0.2+0.2).toFixed(1))),4000);
    return ()=>{ clearInterval(t1); clearInterval(t2); };
  },[]);

  return (
    <motion.div className="inline-flex items-center gap-5 border border-[#0B1F3A]/10 rounded-lg px-5 py-3"
      initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.7,duration:.4}}>
      {[
        {val:orders.toLocaleString(), lbl:"Orders today"},
        {val:"247+",                  lbl:"Active partners"},
        {val:`${chargebacks}%`,        lbl:"Chargeback rate"},
      ].map((m,i)=>(
        <div key={m.lbl} className="flex items-center gap-4">
          {i>0 && <div className="w-px h-6 bg-[#0B1F3A]/10" />}
          <div>
            <div className="text-base font-medium text-[#0B1F3A] tabular-nums">{m.val}</div>
            <div className="text-[9px] text-[#0B1F3A]/38 uppercase tracking-wide mt-0.5">{m.lbl}</div>
          </div>
        </div>
      ))}
      <div className="w-px h-6 bg-[#0B1F3A]/10" />
      <motion.span className="w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0"
        animate={{boxShadow:["0 0 0 0px rgba(16,185,129,.5)","0 0 0 4px rgba(16,185,129,0)","0 0 0 0px rgba(16,185,129,.5)"]}}
        transition={{duration:1.8,repeat:Infinity}} />
    </motion.div>
  );
}

// ─── Challenge row ─────────────────────────────────────────────────────────────
function ChallengeRow({ label, desc, index }: { label:string; desc:string; index:number }) {
  const [hovered, setHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rowRef    = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const canvas=canvasRef.current; if (!canvas) return;
    const ctx=canvas.getContext("2d")!;
    let id:number;
    type Pkt={p:number;spd:number};
    let pkts:Pkt[]=[{p:index*0.33,spd:0.006+index*0.001}];
    const resize=()=>{
      canvas.width=(rowRef.current?.offsetWidth??600)*2;
      canvas.height=4;canvas.style.height="2px";
      canvas.style.width=(rowRef.current?.offsetWidth??600)+"px";
    };
    resize();
    const draw=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pkts=pkts.map(pk=>{
        pk.p+=pk.spd;if(pk.p>1)pk.p=0;
        const x=pk.p*canvas.width;
        const fade=pk.p<0.05?pk.p/0.05:pk.p>0.9?(1-pk.p)/0.1:1;
        ctx.globalAlpha=fade*0.55;ctx.fillStyle="#1A73E8";
        ctx.shadowColor="#1A73E8";ctx.shadowBlur=4;
        ctx.beginPath();ctx.arc(x,canvas.height/2,2.5,0,Math.PI*2);ctx.fill();
        ctx.shadowBlur=0;ctx.globalAlpha=1;
        return pk;
      });
      id=requestAnimationFrame(draw);
    };
    draw();
    return ()=>cancelAnimationFrame(id);
  },[index]);

  return (
    <motion.div ref={rowRef} variants={staggerItem}
      className="grid md:grid-cols-12 gap-6 py-10 border-b border-[#0B1F3A]/10 relative overflow-hidden cursor-default"
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
      <motion.div className="absolute inset-0 bg-[#1A73E8]/[0.02]" initial={{scaleX:0,originX:0}}
        animate={{scaleX:hovered?1:0}} transition={{duration:.35,ease:[.16,1,.3,1]}} />
      <div className="absolute bottom-0 left-0 right-0" style={{height:2,background:"rgba(26,115,232,0.05)",overflow:"hidden"}}>
        <canvas ref={canvasRef} className="absolute top-0 left-0" />
      </div>
      <div className="md:col-span-1 pt-1 relative">
        <motion.span className="text-xs font-medium"
          animate={{color:hovered?"#1A73E8":"rgba(26,115,232,0.35)"}} transition={{duration:.2}}>
          0{index+1}
        </motion.span>
      </div>
      <div className="md:col-span-3 relative">
        <h3 className="text-base font-medium text-[#0B1F3A]">{label}</h3>
        <div className="mt-2 h-px w-full bg-[#0B1F3A]/[0.08] overflow-hidden">
          <motion.div className="h-full bg-[#1A73E8] origin-left"
            animate={{scaleX:hovered?1:0}} transition={{duration:.5,ease:[.16,1,.3,1]}} />
        </div>
      </div>
      <div className="md:col-span-8 relative">
        <p className="text-sm text-[#475569] leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

// ─── Live order ticker ────────────────────────────────────────────────────────
function OrderTicker() {
  const messages = [
    "850 PO received ← Walmart",
    "856 ASN confirmed → Target",
    "810 Invoice sent → Amazon",
    "997 Ack received ← Costco",
    "860 PO Change → Supplier A",
    "855 PO Ack ← Supplier B",
  ];
  const [idx,setIdx]=useState(0);
  const [vis,setVis]=useState(true);
  const [count,setCnt]=useState(14829);
  useEffect(()=>{
    const t1=setInterval(()=>{
      setVis(false);
      setTimeout(()=>{setIdx(i=>(i+1)%messages.length);setVis(true);},220);
    },2000);
    const t2=setInterval(()=>setCnt(c=>c+Math.floor(Math.random()*5)+2),1400);
    return ()=>{clearInterval(t1);clearInterval(t2);};
  },[]);
  return (
    <div className="mt-8 bg-white border border-[#0B1F3A]/10 rounded-lg px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[9px] text-[#0B1F3A]/35 uppercase tracking-widest">Live order stream</p>
        <div className="flex items-center gap-1.5 text-[9px] text-[#0B1F3A]/38">
          <motion.span className="w-1 h-1 rounded-full bg-[#10B981]"
            animate={{boxShadow:["0 0 0 0px rgba(16,185,129,.5)","0 0 0 3px rgba(16,185,129,0)","0 0 0 0px rgba(16,185,129,.5)"]}}
            transition={{duration:1.8,repeat:Infinity}} />
          {count.toLocaleString()} today
        </div>
      </div>
      <div className="flex items-center gap-2 bg-[#1A73E8]/[0.04] rounded-md px-3 py-2">
        <motion.span className="w-1 h-1 rounded-full bg-[#1A73E8] flex-shrink-0"
          animate={{opacity:[1,.3,1]}} transition={{duration:.9,repeat:Infinity}} />
        <span className="text-xs text-[#475569] font-mono"
          style={{opacity:vis?1:0,transition:"opacity 0.2s"}}>
          {messages[idx]}
        </span>
      </div>
    </div>
  );
}

// ─── Metric card ──────────────────────────────────────────────────────────────
function MetricCard({ metric, label }: { metric:string; label:string }) {
  const [hovered,setHovered]=useState(false);
  const glowX=useMotionValue(50),glowY=useMotionValue(50),glowOp=useMotionValue(0);
  const glowBg=useTransform([glowX,glowY],([x,y])=>`radial-gradient(ellipse at ${x}% ${y}%, rgba(26,115,232,0.05) 0%, transparent 65%)`);
  const shimX=useMotionValue(-100);
  const shimT=useTransform(shimX,v=>`${v}%`);
  const onMove=(e:React.MouseEvent<HTMLDivElement>)=>{
    const r=e.currentTarget.getBoundingClientRect();
    glowX.set(((e.clientX-r.left)/r.width)*100);
    glowY.set(((e.clientY-r.top)/r.height)*100);
    animate(glowOp,1,{duration:.25});
  };
  const onEnter=useCallback(()=>{
    setHovered(true);shimX.set(-100);animate(shimX,200,{duration:.5,ease:"easeInOut"});
  },[shimX]);
  const onLeave=()=>{setHovered(false);animate(glowOp,0,{duration:.3});};
  return (
    <motion.div variants={staggerItem}
      className="border border-[#0B1F3A]/10 rounded-lg p-6 bg-white flex items-center gap-4 relative overflow-hidden cursor-default"
      whileHover={{y:-3,borderColor:"rgba(26,115,232,0.3)",boxShadow:"0 8px 28px rgba(26,115,232,0.1)",transition:{duration:.18,ease:EASE}}}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{opacity:glowOp,background:glowBg}} />
      <motion.div className="absolute top-0 pointer-events-none"
        style={{left:0,width:"55%",height:1,background:"linear-gradient(90deg,transparent,rgba(26,115,232,0.4),transparent)",x:shimT}} />
      <motion.div className="absolute top-0 left-0 right-0 h-px"
        style={{background:"linear-gradient(90deg,transparent,rgba(26,115,232,0.35),transparent)"}}
        animate={{opacity:hovered?1:0}} transition={{duration:.2}} />
      <motion.div className="text-2xl font-light text-[#1A73E8] w-24 flex-shrink-0 tabular-nums"
        animate={{scale:hovered?1.06:1}} transition={{duration:.2}}>
        {metric}
      </motion.div>
      <div className="flex-1 relative">
        <motion.div className="text-sm text-[#475569]"
          animate={{color:hovered?"#0B1F3A":"rgba(71,85,105,1)"}} transition={{duration:.2}}>
          {label}
        </motion.div>
        <motion.div className="mt-2 h-px bg-[#1A73E8] origin-left"
          animate={{scaleX:hovered?1:0}} transition={{duration:.4,ease:[.16,1,.3,1]}} />
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function RetailPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-40 pb-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <div className="space-y-6">
              <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide"
                initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.4,ease:EASE,delay:.05}}>
                Retail & CPG
              </motion.p>
              <motion.h1 className="text-5xl md:text-6xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
                initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.55,ease:EASE,delay:.15}}>
                When a trading partner mandates it, <span className="text-[#1A73E8]">you have to be ready.</span>
              </motion.h1>
              <motion.p className="text-lg text-[#475569] leading-relaxed"
                initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.5,ease:EASE,delay:.3}}>
                Retail and consumer goods run on EDI — high partner volumes, strict retailer mandates, and unforgiving peak seasons. We keep that machine running.
              </motion.p>
              <RetailMetricsBar />
              <motion.div className="flex flex-wrap gap-3 pt-2"
                initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.45,ease:EASE,delay:.45}}>
                <motion.div whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
                  <Link to="/services/edi-b2b-integration"
                    className="block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors"
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(26,115,232,0.28)";}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
                    Explore EDI & B2B Integration
                  </Link>
                </motion.div>
                <motion.div whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
                  <Link to="/contact" className="block border border-[#1A73E8]/30 text-[#1A73E8] px-6 py-2.5 text-sm rounded-md hover:bg-[#1A73E8]/[0.05] transition-colors">
                    Book an EDI health assessment
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT — hub-and-spoke diagram */}
            <motion.div
              className="hidden md:block bg-white border border-[#0B1F3A]/10 rounded-xl overflow-hidden"
              style={{height:420}}
              initial={{opacity:0,x:24}} animate={{opacity:1,x:0}}
              transition={{duration:.7,ease:EASE,delay:.35}}>
              <div className="px-5 py-3 border-b border-[#0B1F3A]/[0.07] flex items-center justify-between">
                <span className="text-[9px] text-[#1A73E8] uppercase tracking-widest">Partner network</span>
                <div className="flex items-center gap-1.5 text-[9px] text-[#0B1F3A]/38">
                  <motion.span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"
                    animate={{boxShadow:["0 0 0 0px rgba(16,185,129,.5)","0 0 0 3px rgba(16,185,129,0)","0 0 0 0px rgba(16,185,129,.5)"]}}
                    transition={{duration:1.8,repeat:Infinity}} />
                  Live
                </div>
              </div>
              <div style={{height:"calc(100% - 41px)"}}>
                <RetailNetworkCanvas />
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
              Where retail integration breaks — <span className="text-[#1A73E8]">and costs you.</span>
            </motion.h2>
          </div>
          <motion.div className="space-y-0" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {challenges.map((c,i)=><ChallengeRow key={c.label} label={c.label} desc={c.desc} index={i} />)}
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
              Protecting revenue <span className="text-[#1A73E8]">when it matters most.</span>
            </motion.h2>
            <motion.p className="text-base text-[#475569] leading-relaxed"
              variants={fadeUpLarge} custom={0.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              We onboard partners fast, cut transaction errors that drive chargebacks, and make sure your integration scales through peak without drama. The result: revenue protected when the pressure is highest.
            </motion.p>
            <motion.div variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              <OrderTicker />
            </motion.div>

            {/* peak-season volume bars — scroll-animate in */}
            <motion.div className="mt-8 bg-white border border-[#0B1F3A]/10 rounded-lg px-6 py-5 space-y-2"
              variants={fadeUp} custom={0.28} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              <p className="text-[9px] text-[#0B1F3A]/35 uppercase tracking-widest mb-4">Volume by month</p>
              {[
                {m:"Mar",v:42},  {m:"Jun",v:55}, {m:"Sep",v:60},
                {m:"Oct",v:72},  {m:"Nov",v:100,peak:true}, {m:"Dec",v:92,peak:true},
              ].map(b=><PeakBar key={b.m} month={b.m} val={b.v} peak={b.peak} />)}
            </motion.div>
          </div>

          <motion.div className="space-y-4"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {[
              {metric:"Days",       label:"Partner onboarding, not weeks"},
              {metric:"↓",          label:"Chargeback rates, through fewer EDI errors"},
              {metric:"Peak-ready", label:"Infrastructure that handles November, not just March"},
            ].map(item=><MetricCard key={item.label} metric={item.metric} label={item.label} />)}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 border-t border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.h2 className="text-4xl font-normal text-[#0B1F3A] tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Ready to protect <span className="text-[#1A73E8]">your retail integration?</span>
          </motion.h2>
          <motion.p className="text-base text-[#475569] max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Book a no-obligation EDI health assessment. We review your current estate and give you a clear, honest picture of what's at risk.
          </motion.p>
          <motion.div className="flex flex-wrap justify-center gap-3"
            variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <motion.div whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
              <Link to="/contact" className="block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors"
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(26,115,232,0.28)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
                Book an EDI health assessment
              </Link>
            </motion.div>
            <motion.div whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
              <Link to="/services/edi-b2b-integration" className="block border border-[#1A73E8]/30 text-[#1A73E8] px-6 py-2.5 text-sm rounded-md hover:bg-[#1A73E8]/[0.05] transition-colors">
                Explore EDI & B2B Integration
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}