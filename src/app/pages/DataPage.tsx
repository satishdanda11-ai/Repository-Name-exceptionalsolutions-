import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";
import { Layers, ShieldCheck, BarChart3, Lightbulb, ArrowRight, Check } from "lucide-react";

const services = [
  { label:"Analytics & Reporting", desc:"Dashboards and reporting that give leaders a single, trusted view of the business. Built on clean, connected data — so the numbers mean what they say." },
  { label:"Data Quality",          desc:"Clean, consistent, reliable data, so the decisions built on it are sound. We identify and resolve the quality issues that make analytics teams distrust their own reports." },
  { label:"Data Pipelines",        desc:"Robust pipelines that move data where it is needed, when it is needed. Designed for enterprise reliability — not brittle one-off scripts that break on a schema change." },
];

const valueProps = [
  { label:"Single trusted view",  desc:"One source of truth across ERP, WMS, and trading systems",    metric:"100%", unit:"accuracy"        },
  { label:"Real-time visibility", desc:"Data that reflects what is happening now, not last night",     metric:"<1s",  unit:"latency"          },
  { label:"Actionable reporting", desc:"Reports that leaders use, not reports that gather dust",       metric:"3×",   unit:"faster decisions"  },
];

const dataOfferings = [
  {
    icon: Layers, label:"Engineering", badge:"Data Eng",
    title:"Data modernization & engineering — cloud-native pipelines at scale.",
    desc:"Modern data architecture and cloud-native pipelines that unlock real-time, reliable data at scale. We design, build and migrate your data estate to the cloud.",
    tags:["Snowflake","DataOps","MLOps","Cloud","Hybrid"],
    items:[
      "Modern data architecture design",
      "Cloud migration & optimization",
      "Data engineering & integration",
      "Snowflake implementation",
      "DataOps, MLOps & cloud modernization",
      "Cloud & hybrid database management",
    ],
  },
  {
    icon: ShieldCheck, label:"Governance", badge:"Compliance",
    title:"Data & operations at scale — secure, compliant & governed.",
    desc:"Enterprise data governance, security and compliance — so your data is trusted, protected and auditable. We build the controls that make data quality sustainable.",
    tags:["Security","Privacy","GDPR","MDM","Observability"],
    items:[
      "Data security & access controls",
      "Data privacy & compliance",
      "Data governance & master data management",
      "Data quality & observability",
      "Performance tuning & optimization",
      "DevOps & automation for databases",
    ],
  },
  {
    icon: BarChart3, label:"Analytics", badge:"Intelligence",
    title:"Analytics & intelligence — self-serve dashboards and ML-powered insights.",
    desc:"Business intelligence modernization and ML-powered analytics that help your teams make faster, better decisions — without waiting for a data team to pull a report.",
    tags:["BI","Visualization","ML","AI Testing","Forecasting"],
    items:[
      "BI modernization & strategy roadmap",
      "Analytics at scale & data visualization",
      "ML-powered business intelligence",
      "AI testing & data validation",
      "Demand forecasting solutions",
    ],
  },
  {
    icon: Lightbulb, label:"Advisory", badge:"Strategy",
    title:"Strategic advisory services — data strategy, unification & infrastructure.",
    desc:"Senior advisory on data strategy and infrastructure. We help you decide what to build, what to migrate, and what to retire — grounded in your actual estate.",
    tags:["Strategy","Architecture","Cloud","Consulting"],
    items:[
      "Data strategy & unification",
      "Data infrastructure & modernization",
      "Cloud optimization & flexibility",
      "Data engineering & architecture consulting",
    ],
  },
];

// ── Canvases ──────────────────────────────────────────────────────────────────
function DataStreamCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas=ref.current;if(!canvas)return;
    const ctx=canvas.getContext("2d")!;let id:number;
    type Stream={x:number;y:number;vy:number;len:number;alpha:number;phase:number};let streams:Stream[]=[];
    const resize=()=>{canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;streams=Array.from({length:22},(_,i)=>({x:(canvas.width/22)*i+Math.random()*40-20,y:Math.random()*canvas.height,vy:.4+Math.random()*.6,len:40+Math.random()*60,alpha:.05+Math.random()*.08,phase:Math.random()*Math.PI*2}));};
    resize();window.addEventListener("resize",resize);
    let t=0;
    const draw=()=>{const W=canvas.width,H=canvas.height;ctx.clearRect(0,0,W,H);t++;streams.forEach(s=>{const pulse=.6+Math.sin(t*.03+s.phase)*.4;const grad=ctx.createLinearGradient(s.x,s.y-s.len,s.x,s.y);grad.addColorStop(0,"rgba(26,115,232,0)");grad.addColorStop(1,`rgba(26,115,232,${s.alpha*pulse})`);ctx.strokeStyle=grad;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(s.x,s.y-s.len);ctx.lineTo(s.x,s.y);ctx.stroke();ctx.globalAlpha=s.alpha*pulse*1.8;ctx.fillStyle="#1A73E8";ctx.beginPath();ctx.arc(s.x,s.y,1.5,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;s.y+=s.vy;if(s.y-s.len>H)s.y=-s.len;});id=requestAnimationFrame(draw);};
    draw();return()=>{cancelAnimationFrame(id);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:0}} />;
}

// ── Live metric bar ───────────────────────────────────────────────────────────
function HeroLiveBar() {
  const metrics=[{label:"Records processed today",val:2847392,increment:120},{label:"Pipeline health",val:99,increment:0,suffix:"%"},{label:"Avg query time",val:48,increment:0,suffix:"ms"}];
  const [counts,setCounts]=useState(metrics.map(m=>m.val));
  useEffect(()=>{const id=setInterval(()=>{setCounts(prev=>prev.map((c,i)=>i===0?c+Math.floor(Math.random()*8)+2:c));},800);return()=>clearInterval(id);},[]);
  return (
    <motion.div className="inline-flex items-center gap-5 border border-[#0B1F3A]/10 rounded-lg px-5 py-3"
      initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.7,duration:.4}}>
      {metrics.map((m,i)=>(
        <div key={m.label} className="flex items-center gap-3">
          {i>0&&<div className="w-px h-6 bg-[#0B1F3A]/10" />}
          <div>
            <div className="text-base font-medium text-[#0B1F3A] tabular-nums">{i===0?counts[i].toLocaleString():counts[i]}{m.suffix??""}</div>
            <div className="text-[9px] text-[#0B1F3A]/38 uppercase tracking-wide mt-0.5">{m.label}</div>
          </div>
        </div>
      ))}
      <div className="w-px h-6 bg-[#0B1F3A]/10" />
      <motion.span className="w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0"
        animate={{boxShadow:["0 0 0 0px rgba(16,185,129,0.5)","0 0 0 4px rgba(16,185,129,0)","0 0 0 0px rgba(16,185,129,0.5)"]}}
        transition={{duration:1.8,repeat:Infinity}} />
    </motion.div>
  );
}

// ── Sparkline ─────────────────────────────────────────────────────────────────
function MiniSparkline({seed}:{seed:number}) {
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{const canvas=ref.current;if(!canvas)return;const ctx=canvas.getContext("2d")!;canvas.width=canvas.offsetWidth*2;canvas.height=40;canvas.style.height="20px";let r=seed;const rand=()=>{r=(r*1664525+1013904223)&0xffffffff;return(r>>>0)/4294967296;};const pts:number[]=[];let v=15;for(let i=0;i<20;i++){v=Math.max(4,Math.min(32,v+(rand()-.42)*12));pts.push(v);}const W=canvas.width,H=canvas.height,step=W/(pts.length-1);ctx.beginPath();ctx.moveTo(0,H);pts.forEach((p,i)=>ctx.lineTo(i*step,H-p));ctx.lineTo(W,H);ctx.closePath();ctx.fillStyle="rgba(26,115,232,0.08)";ctx.fill();ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(i*step,H-p):ctx.moveTo(0,H-p));ctx.strokeStyle="rgba(26,115,232,0.4)";ctx.lineWidth=1.5;ctx.stroke();const lx=(pts.length-1)*step,ly=H-pts[pts.length-1];ctx.fillStyle="#1A73E8";ctx.beginPath();ctx.arc(lx,ly,3,0,Math.PI*2);ctx.fill();},[seed]);
  return <canvas ref={ref} className="w-full" style={{display:"block",height:20}} />;
}

// ── Value card ────────────────────────────────────────────────────────────────
function ValueCard({item,index}:{item:typeof valueProps[0];index:number}) {
  const [hovered,setHovered]=useState(false);
  const glowX=useMotionValue(50),glowY=useMotionValue(50),glowOp=useMotionValue(0);
  const glowBg=useTransform([glowX,glowY],([x,y])=>`radial-gradient(ellipse at ${x}% ${y}%, rgba(26,115,232,0.05) 0%, transparent 65%)`);
  const onMove=(e:React.MouseEvent<HTMLDivElement>)=>{const r=e.currentTarget.getBoundingClientRect();glowX.set(((e.clientX-r.left)/r.width)*100);glowY.set(((e.clientY-r.top)/r.height)*100);animate(glowOp,1,{duration:.25});};
  const onLeave=()=>{setHovered(false);animate(glowOp,0,{duration:.3});};
  const shimX=useMotionValue(-100);const shimT=useTransform(shimX,v=>`${v}%`);
  const onEnter=useCallback(()=>{setHovered(true);shimX.set(-100);animate(shimX,200,{duration:.5,ease:"easeInOut"});},[shimX]);
  return (
    <motion.div variants={staggerItem}
      className="border border-[#0B1F3A]/10 rounded-lg p-6 bg-white relative overflow-hidden cursor-default"
      whileHover={{y:-3,borderColor:"rgba(26,115,232,0.3)",boxShadow:"0 8px 32px rgba(26,115,232,0.1)",transition:{duration:.18,ease:EASE}}}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{opacity:glowOp,background:glowBg}} />
      <motion.div className="absolute top-0 pointer-events-none" style={{left:0,width:"55%",height:1,background:"linear-gradient(90deg,transparent,rgba(26,115,232,0.4),transparent)",x:shimT}} />
      <motion.div className="absolute top-0 left-0 right-0 h-px" style={{background:"linear-gradient(90deg,transparent,rgba(26,115,232,0.35),transparent)"}} animate={{opacity:hovered?1:0}} transition={{duration:.2}} />
      <div className="relative">
        <div className="flex items-end justify-between mb-3">
          <div>
            <motion.div className="text-2xl font-medium text-[#1A73E8] tabular-nums" animate={{scale:hovered?1.04:1}} transition={{duration:.2}}>{item.metric}</motion.div>
            <div className="text-[9px] text-[#0B1F3A]/35 uppercase tracking-wide mt-0.5">{item.unit}</div>
          </div>
          <div className="w-24"><MiniSparkline seed={index*37+11} /></div>
        </div>
        <div className="text-sm font-medium text-[#0B1F3A] mb-1">{item.label}</div>
        <div className="text-sm text-[#475569]">{item.desc}</div>
        <motion.div className="mt-3 h-px bg-[#1A73E8] origin-left" animate={{scaleX:hovered?1:0}} transition={{duration:.4,ease:[.16,1,.3,1]}} />
      </div>
    </motion.div>
  );
}

// ── Service row ───────────────────────────────────────────────────────────────
function ServiceRow({label,desc,index}:{label:string;desc:string;index:number}) {
  const [hovered,setHovered]=useState(false);
  const canvasRef=useRef<HTMLCanvasElement>(null);const rowRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{const canvas=canvasRef.current;if(!canvas)return;const ctx=canvas.getContext("2d")!;let id:number;type Pkt={p:number;spd:number};let pkts:Pkt[]=[{p:index*.3,spd:.006+index*.001}];const resize=()=>{canvas.width=(rowRef.current?.offsetWidth??600)*2;canvas.height=4;canvas.style.height="2px";canvas.style.width=(rowRef.current?.offsetWidth??600)+"px";};resize();const draw=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);pkts=pkts.map(pk=>{pk.p+=pk.spd;if(pk.p>1)pk.p=0;const x=pk.p*canvas.width;const fade=pk.p<.05?pk.p/.05:pk.p>.9?(1-pk.p)/.1:1;ctx.globalAlpha=fade*.55;ctx.fillStyle="#1A73E8";ctx.shadowColor="#1A73E8";ctx.shadowBlur=4;ctx.beginPath();ctx.arc(x,canvas.height/2,2.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1;return pk;});id=requestAnimationFrame(draw);};draw();return()=>cancelAnimationFrame(id);},[index]);
  return (
    <motion.div ref={rowRef} variants={staggerItem}
      className="grid md:grid-cols-12 gap-6 py-10 border-b border-[#0B1F3A]/10 relative overflow-hidden cursor-default"
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
      <motion.div className="absolute inset-0 bg-[#1A73E8]/[0.02]" initial={{scaleX:0,originX:0}} animate={{scaleX:hovered?1:0}} transition={{duration:.35,ease:[.16,1,.3,1]}} />
      <div className="absolute bottom-0 left-0 right-0" style={{height:2,background:"rgba(26,115,232,0.05)",overflow:"hidden"}}>
        <canvas ref={canvasRef} className="absolute top-0 left-0" />
      </div>
      <div className="md:col-span-1 pt-1 relative">
        <motion.span className="text-xs font-medium" animate={{color:hovered?"#1A73E8":"rgba(26,115,232,0.35)"}} transition={{duration:.2}}>0{index+1}</motion.span>
      </div>
      <div className="md:col-span-3 relative">
        <h3 className="text-base font-medium text-[#0B1F3A]">{label}</h3>
        <div className="mt-2 h-px w-full bg-[#0B1F3A]/[0.08] overflow-hidden">
          <motion.div className="h-full bg-[#1A73E8] origin-left" animate={{scaleX:hovered?1:0}} transition={{duration:.5,ease:[.16,1,.3,1]}} />
        </div>
      </div>
      <div className="md:col-span-8 relative"><p className="text-sm text-[#475569] leading-relaxed">{desc}</p></div>
    </motion.div>
  );
}

// ── Data flow diagram ─────────────────────────────────────────────────────────
function DataFlowDiagram() {
  const steps=["ERP","Integration","Data Lake","Analytics","Decisions"];
  const [activeStep,setActiveStep]=useState(0);
  const canvasRef=useRef<HTMLCanvasElement>(null);const trackRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{const id=setInterval(()=>setActiveStep(s=>(s+1)%steps.length),1400);return()=>clearInterval(id);},[]);
  useEffect(()=>{const canvas=canvasRef.current;if(!canvas)return;const ctx=canvas.getContext("2d")!;let id:number;type Pkt={p:number;spd:number};let pkts:Pkt[]=[{p:0,spd:.007},{p:.4,spd:.008},{p:.7,spd:.006}];const resize=()=>{canvas.width=(trackRef.current?.offsetWidth??500)*2;canvas.height=6;canvas.style.height="3px";canvas.style.width=(trackRef.current?.offsetWidth??500)+"px";};resize();const draw=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);pkts=pkts.map(pk=>{pk.p+=pk.spd;if(pk.p>1)pk.p=0;const x=pk.p*canvas.width;const fade=pk.p<.06?pk.p/.06:pk.p>.88?(1-pk.p)/.12:1;ctx.globalAlpha=fade*.75;ctx.fillStyle="#1A73E8";ctx.shadowColor="#1A73E8";ctx.shadowBlur=5;ctx.beginPath();ctx.arc(x,canvas.height/2,3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1;return pk;});id=requestAnimationFrame(draw);};draw();return()=>cancelAnimationFrame(id);},[]);
  return (
    <div className="mt-8 bg-white border border-[#0B1F3A]/10 rounded-lg px-7 py-6">
      <p className="text-[9px] text-[#1A73E8] uppercase tracking-widest mb-6">Data flow</p>
      <div className="relative flex items-start justify-between">
        {steps.map((s,i)=>(
          <div key={s} className="flex flex-col items-center gap-2" style={{flex:1,position:"relative",zIndex:2}}>
            <motion.div className="w-9 h-9 rounded-full border flex items-center justify-center text-[9px] font-medium"
              animate={{background:activeStep===i?"#1A73E8":"#fff",borderColor:activeStep===i?"#1A73E8":"rgba(11,31,58,0.14)",color:activeStep===i?"#fff":"rgba(11,31,58,0.45)",boxShadow:activeStep===i?"0 0 0 5px rgba(26,115,232,0.1)":"none"}}
              transition={{duration:.32}}>{i+1}</motion.div>
            <motion.span className="text-[9px] text-center leading-tight"
              animate={{color:activeStep===i?"#1A73E8":"rgba(11,31,58,0.38)",fontWeight:activeStep===i?600:400}}
              transition={{duration:.25}}>{s}</motion.span>
          </div>
        ))}
        <div ref={trackRef} className="absolute" style={{top:17,left:"5%",right:"5%",height:2,background:"rgba(11,31,58,0.07)",zIndex:1}}>
          <motion.div className="absolute top-0 left-0 h-full bg-[#1A73E8]/30" animate={{width:`${(activeStep/(steps.length-1))*100}%`}} transition={{duration:.5,ease:"easeInOut"}} />
          <canvas ref={canvasRef} className="absolute" style={{top:-1}} />
        </div>
      </div>
    </div>
  );
}

// ── Data Offerings — same style as EDI/AI offerings ───────────────────────────
function DataOfferings() {
  const [active, setActive] = useState(0);
  const current = dataOfferings[active];
  return (
    <section className="py-24 px-4 bg-[#1A73E8]/[0.02] border-t border-b border-[#0B1F3A]/10">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Data — The Connecting Layer
          </motion.p>
          <motion.h2 className="text-4xl md:text-5xl font-normal text-[#0B1F3A] tracking-tight leading-tight"
            variants={fadeUp} custom={.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Data capabilities. <span className="text-[#1A73E8]">End to end.</span>
          </motion.h2>
          <motion.p className="mt-4 text-base text-[#475569] leading-relaxed"
            variants={fadeUpLarge} custom={.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Four specialised data capabilities. One team that connects your systems first.
          </motion.p>
        </div>

        <motion.div className="grid md:grid-cols-[220px_1fr] border border-[#0B1F3A]/10 rounded-xl overflow-hidden"
          initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={VIEWPORT} transition={{duration:.6,delay:.15}}>

          {/* LEFT nav */}
          <div className="border-r border-[#0B1F3A]/10 py-2 bg-[#1A73E8]/[0.01]">
            {dataOfferings.map((o,i)=>{
              const NavIcon=o.icon;const isActive=active===i;
              return (
                <button key={o.label} onClick={()=>setActive(i)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left relative transition-all duration-200"
                  style={{background:isActive?"#0B1F3A":"transparent"}}>
                  <NavIcon size={15} strokeWidth={1.75} color={isActive?"#fff":"rgba(26,115,232,0.55)"} style={{flexShrink:0,transition:"color .18s"}} />
                  <span style={{fontSize:13,fontWeight:isActive?500:400,color:isActive?"#fff":"rgba(11,31,58,0.6)",transition:"color .18s",lineHeight:1.3}}>{o.label}</span>
                </button>
              );
            })}
          </div>

          {/* RIGHT detail */}
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}}
              transition={{duration:.25,ease:EASE}} className="p-8 md:p-10">

              {/* badge — solid brand blue */}
              <div style={{display:"inline-block",fontSize:10,fontWeight:600,letterSpacing:".12em",textTransform:"uppercase",padding:"4px 12px",borderRadius:999,background:"#1A73E8",color:"#fff",marginBottom:20}}>
                {current.badge}
              </div>

              <h3 className="text-xl md:text-2xl font-normal text-[#0B1F3A] leading-snug mb-3 tracking-tight">{current.title}</h3>
              <p className="text-sm text-[#475569] leading-relaxed mb-6 max-w-lg">{current.desc}</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {current.tags.map(t=>(
                  <span key={t} className="text-[11px] font-medium px-3 py-1 rounded-full border border-[#1A73E8]/15 text-[#1A73E8] bg-[#1A73E8]/[0.04]">{t}</span>
                ))}
              </div>

              <div className="space-y-3">
                {current.items.map((item,i)=>(
                  <motion.div key={item} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                    transition={{duration:.3,delay:i*.07,ease:EASE}}
                    className="flex items-start gap-3 p-3 rounded-lg border border-[#0B1F3A]/[0.07] hover:border-[#1A73E8]/30 transition-colors group">
                    <div className="w-5 h-5 rounded-full border border-[#1A73E8]/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-[#1A73E8]/40 transition-colors">
                      <Check size={10} strokeWidth={2.5} color="#1A73E8" />
                    </div>
                    <span className="text-sm text-[#475569] leading-snug">{item}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#0B1F3A]/[0.06]">
                <span className="text-xs text-[#0B1F3A]/30">{active+1} of {dataOfferings.length}</span>
                <div className="flex gap-3">
                  <button onClick={()=>setActive(a=>(a-1+dataOfferings.length)%dataOfferings.length)}
                    className="flex items-center justify-center transition-all duration-200 hover:scale-105"
                    style={{width:38,height:38,borderRadius:"50%",background:"#1A73E8",border:"none",cursor:"pointer"}}>
                    <ArrowRight size={16} strokeWidth={2} color="#fff" style={{transform:"rotate(180deg)"}} />
                  </button>
                  <button onClick={()=>setActive(a=>(a+1)%dataOfferings.length)}
                    className="flex items-center justify-center transition-all duration-200 hover:scale-105"
                    style={{width:38,height:38,borderRadius:"50%",background:"#1A73E8",border:"none",cursor:"pointer"}}>
                    <ArrowRight size={16} strokeWidth={2} color="#fff" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function DataPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-24 px-4 relative overflow-hidden bg-white">
        <DataStreamCanvas />
        <div className="max-w-6xl mx-auto relative" style={{zIndex:1}}>
          <div className="max-w-3xl space-y-6">
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide"
              initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.4,ease:EASE,delay:.05}}>
              Data & Analytics
            </motion.p>
            <motion.h1 className="text-5xl md:text-[64px] font-normal text-[#0B1F3A] leading-[1.06] tracking-tight"
              initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.55,ease:EASE,delay:.15}}>
              Turn connected data <span className="text-[#1A73E8]">into decisions.</span>
            </motion.h1>
            <motion.p className="text-lg text-[#475569] leading-relaxed max-w-2xl"
              initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.5,ease:EASE,delay:.3}}>
              Once your data flows freely, it becomes your most valuable asset. We help you turn it into clear, reliable insight your leaders can act on — built on a foundation we connect first.
            </motion.p>
            <HeroLiveBar />
            <motion.div className="flex flex-wrap gap-3 pt-2"
              initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.45,ease:EASE,delay:.45}}>
              <motion.div whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
                <Link to="/contact" className="block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors"
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(26,115,232,0.28)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
                  Talk to an architect about data
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Connection */}
      <section className="py-24 px-4 bg-[#1A73E8]/[0.02] border-t border-b border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              The Connection
            </motion.p>
            <motion.h2 className="text-4xl md:text-5xl font-normal text-[#0B1F3A] leading-tight tracking-tight mb-6"
              variants={fadeUp} custom={.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Integration and data are <span className="text-[#1A73E8]">two halves of the same job.</span>
            </motion.h2>
            <motion.p className="text-base text-[#475569] leading-relaxed"
              variants={fadeUpLarge} custom={.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Most data projects underdeliver because the underlying data is incomplete or inconsistent. We connect the systems first. Then we make the data they produce work for you.
            </motion.p>
            <motion.div variants={fadeUp} custom={.24} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              <DataFlowDiagram />
            </motion.div>
          </div>
          <motion.div className="space-y-4" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {valueProps.map((item,i)=><ValueCard key={item.label} item={item} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* Data Offerings */}
      <DataOfferings />

      {/* Services */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              What We Do
            </motion.p>
            <motion.h2 className="text-4xl md:text-5xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
              variants={fadeUp} custom={.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Where we help you <span className="text-[#1A73E8]">get more from your data.</span>
            </motion.h2>
          </div>
          <motion.div className="space-y-0" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {services.map((s,i)=><ServiceRow key={s.label} label={s.label} desc={s.desc} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 border-t border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.h2 className="text-4xl md:text-5xl font-normal text-[#0B1F3A] tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Make your data <span className="text-[#1A73E8]">work for you.</span>
          </motion.h2>
          <motion.p className="text-base text-[#475569] max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Talk to an architect about turning your connected enterprise data into decisions that move the business forward.
          </motion.p>
          <motion.div variants={fadeUp} custom={.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
            <Link to="/contact" className="inline-block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors"
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(26,115,232,0.28)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
              Talk to an architect about data
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}