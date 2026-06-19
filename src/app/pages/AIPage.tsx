import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";
import { BrainCircuit, Cpu, GitBranch, Lightbulb, Bot, ArrowRight, Check } from "lucide-react";

const services = [
  { label: "Process Automation",           desc: "Automate repetitive, rules-based work to free your people for higher-value tasks. Built on clean, connected data — not isolated automation that breaks when systems change." },
  { label: "Document & Data Intelligence",  desc: "Extract, classify and act on information locked in documents and unstructured data. Intelligent processing that connects directly into your enterprise workflows." },
  { label: "AI for Integration Operations", desc: "Apply AI to your integration data to predict and prevent failures before they affect an order. Anomaly detection and intelligent exception handling that keeps the supply chain moving." },
];

const beforeAfter = [
  { before: "Fragmented data",           after: "single, trusted source",  badge: "↑ 94% accuracy" },
  { before: "Manual exception handling", after: "automated resolution",    badge: "↓ 80% effort"   },
  { before: "Reactive monitoring",       after: "predictive prevention",   badge: "3× faster"       },
  { before: "Disconnected insights",     after: "real-time decisions",     badge: "Zero lag"        },
];

const aiOfferings = [
  {
    icon: BrainCircuit, label:"Enterprise AI", badge:"LLM",
    title:"LLM-powered copilots & search systems trained on proprietary knowledge.",
    desc:"Deploy intelligent assistants across your enterprise — from HR and finance to legal and ops. Built on your proprietary knowledge, not generic models.",
    tags:["LLM","RAG","CAG","GenAI","Fine-tuning"],
    items:[
      "LLM copilots for teams: HR, finance, legal, ops",
      "AI search & knowledge assistants (RAG / CAG)",
      "Customer-facing GenAI assistants & bots",
      "Document analysis & text generation",
      "Custom LLM fine-tuning on proprietary data",
    ],
  },
  {
    icon: Cpu, label:"Cognitive AI", badge:"Applied",
    title:"Applied cognitive intelligence — infuse AI into high-friction tasks.",
    desc:"Forecasting, processing and automation powered by applied cognitive AI. Pattern discovery and personalization at enterprise scale.",
    tags:["NLP","Computer Vision","Predictive","Personalization"],
    items:[
      "Predictive & analytical modelling",
      "Computer vision",
      "NLP & natural language understanding",
      "Pattern discovery & personalization",
      "Intelligent ticketing, invoicing & support",
    ],
  },
  {
    icon: GitBranch, label:"MLOps", badge:"ML Platform",
    title:"Model lifecycle & deployment — custom ML models, APIs & pipelines.",
    desc:"Custom ML models with feedback loops at the core. We build, deploy and maintain the full pipeline — from feature engineering to production monitoring.",
    tags:["MLOps","AIOps","Microservices","Feature Eng","Governance"],
    items:[
      "MLOps, AIOps & automation",
      "Models & microservices",
      "Data orchestration & API pipelines",
      "Feature engineering & causal analysis",
      "AI ethics, governance & explainability",
      "Infrastructure, scalability & integration",
    ],
  },
  {
    icon: Lightbulb, label:"AI Strategy", badge:"Advisory",
    title:"Strategic guidance from data & model advisory to governance.",
    desc:"Before you build, we advise. AI strategy grounded in your actual data estate — not theoretical roadmaps that ignore implementation reality.",
    tags:["Strategy","Planning","Governance","Risk"],
    items:[
      "AI strategy & planning",
      "Data & model advisory",
      "Governance & risk management",
    ],
  },
  {
    icon: Bot, label:"Automation", badge:"Agentic",
    title:"Agentic AI, process automation & AI-assisted development.",
    desc:"From agentic AI workflows to back-office automation and AI-assisted engineering — we build intelligent automation that connects to your existing estate.",
    tags:["Agentic AI","RPA","AI Dev","ERP","SaaS"],
    items:[
      "Agentic AI & conversational bots",
      "Business & back-office process automation",
      "AI-assisted app development & vibe coding",
      "AI-assisted quality engineering",
      "UI/UX automation",
      "ERP, SaaS & data pipeline integration",
    ],
  },
];

// ── Canvases ──────────────────────────────────────────────────────────────────
function WaveCanvas({ opacity = 1 }: { opacity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let id: number, t = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const WAVES = [{amp:20,freq:.011,spd:.016,y:.38,a:.09,lw:1.8},{amp:13,freq:.017,spd:.022,y:.52,a:.06,lw:1.2},{amp:24,freq:.008,spd:.012,y:.62,a:.05,lw:2.2},{amp:9,freq:.024,spd:.028,y:.30,a:.04,lw:1.0},{amp:16,freq:.013,spd:.018,y:.72,a:.04,lw:1.5}];
    const draw = () => {
      const W=canvas.width,H=canvas.height; ctx.clearRect(0,0,W,H); t++;
      WAVES.forEach(w=>{ctx.beginPath();ctx.moveTo(0,H*w.y);for(let x=0;x<=W;x+=2){const y=H*w.y+Math.sin(x*w.freq+t*w.spd)*w.amp+Math.sin(x*w.freq*1.7+t*w.spd*.6)*w.amp*.35;ctx.lineTo(x,y);}ctx.strokeStyle=`rgba(26,115,232,${w.a*opacity})`;ctx.lineWidth=w.lw;ctx.stroke();});
      id=requestAnimationFrame(draw);
    };
    draw(); return()=>{cancelAnimationFrame(id);window.removeEventListener("resize",resize);};
  },[opacity]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:0}} />;
}

function NeuralCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas=ref.current;if(!canvas)return;
    const ctx=canvas.getContext("2d")!;let id:number;
    type P={x:number;y:number;vx:number;vy:number;r:number;a:number};let pts:P[]=[];
    const resize=()=>{canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;pts=Array.from({length:32},()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,vx:(Math.random()-.5)*.3,vy:-Math.random()*.35-.08,r:Math.random()*2+1,a:Math.random()*.11+.04}));};
    resize();window.addEventListener("resize",resize);
    const draw=()=>{const W=canvas.width,H=canvas.height;ctx.clearRect(0,0,W,H);for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<130){ctx.globalAlpha=((130-d)/130)*.06;ctx.strokeStyle="#1A73E8";ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();}}pts.forEach(p=>{ctx.globalAlpha=p.a;ctx.fillStyle="#1A73E8";ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();p.x+=p.vx;p.y+=p.vy;if(p.y<-4){p.y=H+4;p.x=Math.random()*W;}if(p.x<0||p.x>W)p.vx*=-1;});ctx.globalAlpha=1;id=requestAnimationFrame(draw);};
    draw();return()=>{cancelAnimationFrame(id);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:0}} />;
}

// ── Hero stats ticker ─────────────────────────────────────────────────────────
function HeroStats() {
  const lines = ["14,382 transactions processed today","99.98% uptime across managed estates","3× faster partner onboarding","0 lost messages this month"];
  const [idx,setIdx]=useState(0);const [vis,setVis]=useState(true);
  useEffect(()=>{const id=setInterval(()=>{setVis(false);setTimeout(()=>{setIdx(i=>(i+1)%lines.length);setVis(true);},300);},2800);return()=>clearInterval(id);},[]);
  return (
    <motion.div className="inline-flex items-center gap-2 text-[11px] text-[#475569] border border-[#0B1F3A]/10 rounded-full px-3 py-1.5"
      initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.7,duration:.4}}>
      <motion.span className="w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0"
        animate={{boxShadow:["0 0 0 0px rgba(16,185,129,0.5)","0 0 0 4px rgba(16,185,129,0)","0 0 0 0px rgba(16,185,129,0.5)"]}}
        transition={{duration:1.8,repeat:Infinity}} />
      <span style={{opacity:vis?1:0,transition:"opacity 0.25s"}}>{lines[idx]}</span>
    </motion.div>
  );
}

// ── Before/After card ─────────────────────────────────────────────────────────
function BeforeAfterCard() {
  const [active,setActive]=useState<number|null>(null);
  return (
    <motion.div className="border border-[#0B1F3A]/10 rounded-lg p-8 bg-white"
      variants={fadeUp} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs text-[#1A73E8] uppercase tracking-wide">What changes</div>
        <div className="inline-flex items-center gap-1.5 text-[9px] text-[#0B1F3A]/40 bg-[#1A73E8]/[0.06] rounded-full px-2.5 py-1">
          <motion.span className="w-1 h-1 rounded-full bg-[#10B981] flex-shrink-0"
            animate={{boxShadow:["0 0 0 0px rgba(16,185,129,0.5)","0 0 0 3px rgba(16,185,129,0)","0 0 0 0px rgba(16,185,129,0.5)"]}}
            transition={{duration:1.8,repeat:Infinity}} />
          Processing live
        </div>
      </div>
      <motion.div className="space-y-0" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
        {beforeAfter.map((row,i)=>(
          <motion.div key={row.before} variants={staggerItem}
            className="relative py-3 border-b border-[#0B1F3A]/[0.05] last:border-0 cursor-default overflow-hidden"
            onMouseEnter={()=>setActive(i)} onMouseLeave={()=>setActive(null)}>
            <motion.div className="absolute inset-0 bg-[#1A73E8]/[0.03]" initial={{scaleX:0,originX:0}}
              animate={{scaleX:active===i?1:0}} transition={{duration:.3,ease:[.16,1,.3,1]}} />
            <div className="flex items-center gap-2 relative">
              <motion.span className="text-sm" animate={{color:active===i?"rgba(11,31,58,0.3)":"rgba(11,31,58,0.42)",x:active===i?-3:0}}
                style={{textDecoration:active===i?"line-through":"none",textDecorationColor:"rgba(11,31,58,0.25)"}} transition={{duration:.22}}>
                {row.before}
              </motion.span>
              <motion.span className="text-xs flex-shrink-0" animate={{color:active===i?"#1A73E8":"rgba(26,115,232,0.35)",x:active===i?2:0}} transition={{duration:.2}}>→</motion.span>
              <motion.span className="text-sm" animate={{color:active===i?"#0B1F3A":"rgba(11,31,58,0.68)",fontWeight:active===i?500:400}} transition={{duration:.2}}>{row.after}</motion.span>
              <motion.span className="ml-auto text-[9px] font-medium text-[#1A73E8] bg-[#1A73E8]/[0.08] px-1.5 py-0.5 rounded flex-shrink-0"
                animate={{opacity:active===i?1:0,x:active===i?0:8}} transition={{duration:.2}}>{row.badge}</motion.span>
            </div>
            <motion.div className="absolute bottom-0 left-0 h-px bg-[#1A73E8]/40" animate={{scaleX:active===i?1:0}}
              style={{originX:0,width:"100%"}} transition={{duration:.32,ease:[.16,1,.3,1]}} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ── Pipeline diagram ──────────────────────────────────────────────────────────
function PipelineDiagram() {
  const steps=["Systems","Integration","Clean Data","AI Models","Outcomes"];
  const [activeStep,setActiveStep]=useState(0);
  const [counted,setCounted]=useState(false);
  const [nums,setNums]=useState(steps.map(()=>0));
  const trackRef=useRef<HTMLDivElement>(null);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const wrapRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{const id=setInterval(()=>setActiveStep(s=>(s+1)%steps.length),1500);return()=>clearInterval(id);},[]);
  useEffect(()=>{const el=wrapRef.current;if(!el)return;const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting&&!counted){setCounted(true);steps.forEach((_,i)=>{const target=i+1;let cur=0;const id=setInterval(()=>{cur++;setNums(prev=>{const n=[...prev];n[i]=Math.min(cur,target);return n;});if(cur>=target*4)clearInterval(id);},30);});}},{threshold:.3});obs.observe(el);return()=>obs.disconnect();},[counted]);
  useEffect(()=>{const canvas=canvasRef.current;if(!canvas)return;const ctx=canvas.getContext("2d")!;let id:number;type Pkt={p:number;spd:number};let pkts:Pkt[]=[{p:0,spd:.008},{p:.35,spd:.009},{p:.68,spd:.007}];const resize=()=>{canvas.width=(trackRef.current?.offsetWidth??400)*2;canvas.height=6;canvas.style.width=(trackRef.current?.offsetWidth??400)+"px";canvas.style.height="3px";};resize();const draw=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);pkts=pkts.map(pk=>{pk.p+=pk.spd;if(pk.p>1)pk.p=0;const x=pk.p*canvas.width;const fade=pk.p<.06?pk.p/.06:pk.p>.88?(1-pk.p)/.12:1;ctx.globalAlpha=fade*.75;ctx.fillStyle="#1A73E8";ctx.shadowColor="#1A73E8";ctx.shadowBlur=5;ctx.beginPath();ctx.arc(x,canvas.height/2,3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1;return pk;});id=requestAnimationFrame(draw);};draw();return()=>cancelAnimationFrame(id);},[]);
  return (
    <div ref={wrapRef} className="mt-8 bg-white border border-[#0B1F3A]/10 rounded-lg px-8 py-7">
      <p className="text-[9px] text-[#1A73E8] uppercase tracking-widest mb-7">How it connects</p>
      <div className="relative flex items-start justify-between">
        {steps.map((s,i)=>(
          <div key={s} className="flex flex-col items-center gap-2" style={{flex:1,zIndex:2,position:"relative"}}>
            <motion.div className="w-10 h-10 rounded-full border flex items-center justify-center text-xs font-medium tabular-nums"
              animate={{background:activeStep===i?"#1A73E8":"#fff",borderColor:activeStep===i?"#1A73E8":"rgba(11,31,58,0.14)",color:activeStep===i?"#fff":"rgba(11,31,58,0.45)",boxShadow:activeStep===i?"0 0 0 5px rgba(26,115,232,0.1)":"none"}}
              transition={{duration:.35}}>{nums[i]}</motion.div>
            <motion.span className="text-[9px] text-center leading-tight"
              animate={{color:activeStep===i?"#1A73E8":"rgba(11,31,58,0.42)",fontWeight:activeStep===i?600:400}}
              transition={{duration:.25}}>{s}</motion.span>
          </div>
        ))}
        <div ref={trackRef} className="absolute" style={{top:19,left:"5%",right:"5%",height:2,background:"rgba(11,31,58,0.07)",zIndex:1}}>
          <motion.div className="absolute top-0 left-0 h-full bg-[#1A73E8]/30"
            animate={{width:`${(activeStep/(steps.length-1))*100}%`}} transition={{duration:.5,ease:"easeInOut"}} />
          <canvas ref={canvasRef} className="absolute" style={{top:-1}} />
        </div>
      </div>
    </div>
  );
}

// ── Service row ───────────────────────────────────────────────────────────────
function ServiceRow({label,desc,index}:{label:string;desc:string;index:number}) {
  const [hovered,setHovered]=useState(false);
  const [counted,setCounted]=useState(false);
  const [num,setNum]=useState(0);
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{const el=ref.current;if(!el)return;const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting&&!counted){setCounted(true);let cur=0;const target=index+1;const id=setInterval(()=>{cur++;setNum(Math.min(cur,target));if(cur>=target*4)clearInterval(id);},30);}},{threshold:.4});obs.observe(el);return()=>obs.disconnect();},[counted,index]);
  return (
    <motion.div ref={ref} variants={staggerItem}
      className="grid md:grid-cols-12 gap-6 py-10 border-b border-[#0B1F3A]/10 relative overflow-hidden cursor-default"
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
      <motion.div className="absolute inset-0 bg-[#1A73E8]/[0.02]" initial={{scaleX:0,originX:0}} animate={{scaleX:hovered?1:0}} transition={{duration:.35,ease:[.16,1,.3,1]}} />
      <div className="md:col-span-1 pt-1 relative">
        <motion.span className="text-xs font-medium tabular-nums" animate={{color:hovered?"#1A73E8":"rgba(26,115,232,0.35)"}} transition={{duration:.2}}>{String(num).padStart(2,"0")}</motion.span>
      </div>
      <div className="md:col-span-3 relative">
        <h3 className="text-base font-medium text-[#0B1F3A]">{label}</h3>
        <div className="mt-2 h-px w-full bg-[#0B1F3A]/[0.08] overflow-hidden">
          <motion.div className="h-full bg-[#1A73E8] origin-left" animate={{scaleX:hovered?1:0}} transition={{duration:.5,ease:[.16,1,.3,1]}} />
        </div>
      </div>
      <div className="md:col-span-8 relative">
        <p className="text-sm text-[#475569] leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

// ── AI Offerings — same style as EDI offerings ────────────────────────────────
function AIOfferings() {
  const [active, setActive] = useState(0);
  const current = aiOfferings[active];
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            AI — The Thinking Layer
          </motion.p>
          <motion.h2 className="text-4xl md:text-5xl font-normal text-[#0B1F3A] tracking-tight leading-tight"
            variants={fadeUp} custom={.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Enterprise AI. <span className="text-[#1A73E8]">Delivered.</span>
          </motion.h2>
          <motion.p className="mt-4 text-base text-[#475569] leading-relaxed"
            variants={fadeUpLarge} custom={.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            5 specialised AI capabilities. 1 team that understands your data estate.
          </motion.p>
        </div>

        <motion.div className="grid md:grid-cols-[220px_1fr] border border-[#0B1F3A]/10 rounded-xl overflow-hidden"
          initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={VIEWPORT} transition={{duration:.6,delay:.15}}>

          {/* LEFT nav */}
          <div className="border-r border-[#0B1F3A]/10 py-2 bg-[#1A73E8]/[0.01]">
            {aiOfferings.map((o,i)=>{
              const NavIcon=o.icon;
              const isActive=active===i;
              return (
                <button key={o.label} onClick={()=>setActive(i)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left relative transition-all duration-200"
                  style={{ background:isActive?"#0B1F3A":"transparent" }}>
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

              <h3 className="text-xl md:text-2xl font-normal text-[#0B1F3A] leading-snug mb-3 tracking-tight">
                {current.title}
              </h3>
              <p className="text-sm text-[#475569] leading-relaxed mb-6 max-w-lg">{current.desc}</p>

              {/* tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {current.tags.map(t=>(
                  <span key={t} className="text-[11px] font-medium px-3 py-1 rounded-full border border-[#1A73E8]/15 text-[#1A73E8] bg-[#1A73E8]/[0.04]">{t}</span>
                ))}
              </div>

              {/* items */}
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

              {/* prev/next arrows */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#0B1F3A]/[0.06]">
                <span className="text-xs text-[#0B1F3A]/30">{active+1} of {aiOfferings.length}</span>
                <div className="flex gap-3">
                  <button onClick={()=>setActive(a=>(a-1+aiOfferings.length)%aiOfferings.length)}
                    className="flex items-center justify-center transition-all duration-200 hover:scale-105"
                    style={{width:38,height:38,borderRadius:"50%",background:"#1A73E8",border:"none",cursor:"pointer"}}>
                    <ArrowRight size={16} strokeWidth={2} color="#fff" style={{transform:"rotate(180deg)"}} />
                  </button>
                  <button onClick={()=>setActive(a=>(a+1)%aiOfferings.length)}
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
export function AIPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-24 px-4 relative overflow-hidden bg-white">
        <WaveCanvas /><NeuralCanvas />
        <div className="max-w-6xl mx-auto relative" style={{zIndex:1}}>
          <div className="max-w-3xl space-y-6">
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide"
              initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.4,ease:EASE,delay:.05}}>
              AI Solutions
            </motion.p>
            <motion.h1 className="text-5xl md:text-[64px] font-normal text-[#0B1F3A] leading-[1.06] tracking-tight"
              initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.55,ease:EASE,delay:.15}}>
              Applied AI, <span className="text-[#1A73E8]">grounded in data you can trust.</span>
            </motion.h1>
            <motion.p className="text-lg text-[#475569] leading-relaxed max-w-2xl"
              initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.5,ease:EASE,delay:.3}}>
              AI is only as good as the data underneath it. As integration specialists, we connect your data first, then put AI to work on it — so the results are real, not theoretical.
            </motion.p>
            <HeroStats />
            <motion.div className="flex flex-wrap gap-3 pt-2"
              initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.45,ease:EASE,delay:.45}}>
              <motion.div whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
                <Link to="/contact" className="block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors"
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(26,115,232,0.28)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
                  Talk to an architect about AI
                </Link>
              </motion.div>
              <motion.div whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
                <Link to="/services/edi-b2b-integration" className="block border border-[#1A73E8]/30 text-[#1A73E8] px-6 py-2.5 text-sm rounded-md hover:bg-[#1A73E8]/[0.05] transition-colors">
                  See our integration foundation
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 px-4 bg-[#1A73E8]/[0.02] border-t border-b border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              The Root Cause
            </motion.p>
            <motion.h2 className="text-4xl md:text-5xl font-normal text-[#0B1F3A] leading-tight tracking-tight mb-6"
              variants={fadeUp} custom={.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Most AI initiatives <span className="text-[#1A73E8]">stall before they start.</span>
            </motion.h2>
            <motion.p className="text-base text-[#475569] leading-relaxed"
              variants={fadeUpLarge} custom={.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Fragmented data, inconsistent formats, disconnected systems. When the foundation is broken, AI built on top of it produces unreliable results — and confident-looking dashboards that no one trusts.
            </motion.p>
            <motion.p className="text-base text-[#475569] leading-relaxed mt-4"
              variants={fadeUpLarge} custom={.18} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              We solve the root cause first. We connect your systems and data, then apply AI where it produces measurable business value.
            </motion.p>
          </div>
          <BeforeAfterCard />
        </div>
      </section>

      {/* AI Offerings */}
      <AIOfferings />

      {/* Services */}
      <section className="py-24 px-4 bg-[#1A73E8]/[0.02] border-t border-b border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              What We Do
            </motion.p>
            <motion.h2 className="text-4xl md:text-5xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
              variants={fadeUp} custom={.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Where we apply AI to <span className="text-[#1A73E8]">create measurable value.</span>
            </motion.h2>
          </div>
          <motion.div className="space-y-0" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {services.map((s,i)=><ServiceRow key={s.label} label={s.label} desc={s.desc} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto max-w-3xl">
          <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            How It Connects
          </motion.p>
          <motion.h2 className="text-4xl md:text-5xl font-normal text-[#0B1F3A] leading-tight tracking-tight mb-6"
            variants={fadeUp} custom={.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Integration-first. <span className="text-[#1A73E8]">Then AI.</span>
          </motion.h2>
          <motion.p className="text-base text-[#475569] leading-relaxed"
            variants={fadeUpLarge} custom={.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Because we connect your systems and data first, the AI we build runs on a foundation that is complete, current and trustworthy. The models are not the hard part — the data plumbing is.
          </motion.p>
          <motion.div variants={fadeUp} custom={.18} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <PipelineDiagram />
          </motion.div>
          <motion.div className="mt-8" variants={fadeUp} custom={.25} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <Link to="/services/edi-b2b-integration" className="text-sm text-[#1A73E8] underline underline-offset-4 hover:text-[#155CC0] transition-colors">
              Learn about our integration foundation →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <WaveCanvas opacity={0.8} />
        <div className="max-w-6xl mx-auto text-center space-y-6 relative" style={{zIndex:1}}>
          <motion.h2 className="text-4xl md:text-5xl font-normal text-[#0B1F3A] tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Ready to put your <span className="text-[#1A73E8]">data to work?</span>
          </motion.h2>
          <motion.p className="text-base text-[#475569] max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Talk to a senior architect about where AI can genuinely move the needle in your operations.
          </motion.p>
          <motion.div variants={fadeUp} custom={.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
            <Link to="/contact" className="inline-block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors"
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(26,115,232,0.28)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
              Talk to an architect about AI
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}