import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";
import { Package, Sparkles, RefreshCw, Building2, CheckCircle2, ArrowRight, Check } from "lucide-react";

const services = [
  { label:"Custom Application Development", desc:"Applications built around your actual business, not a generic template. We design for your workflows, your data model, and your users — not a theoretical average customer." },
  { label:"System Modernisation",           desc:"Rebuild ageing applications into modern, maintainable systems. We assess what is worth keeping, what needs replacing, and how to get from here to there without disrupting live operations." },
  { label:"Product Engineering",            desc:"End-to-end engineering for digital products, from idea to running software. Senior engineers throughout — architecture, build, testing, and deployment." },
];

const valueProps = [
  { label:"Senior engineers",          desc:"The people who scope your project are the people who build it",           metric:"100%",  unit:"senior"         },
  { label:"Connected by design",       desc:"Applications built to integrate cleanly with your existing estate",        metric:"Day 1", unit:"connectivity"    },
  { label:"Long-term maintainability", desc:"Code written for the team who will own it — not the team who built it",   metric:"0",     unit:"handoff debt"    },
];

const digitalOfferings = [
  {
    icon: Package, label:"Product", badge:"Platform",
    title:"Platform & product engineering — end-to-end from MVP to cloud-native.",
    desc:"We build products the right way from the start — agile, API-first, and designed to scale. From MVP through full-cycle product delivery.",
    tags:["Agile","MVP","Microservices","SaaS","Open API"],
    items:[
      "Agile & MVP-first approach",
      "Full cycle product engineering",
      "Custom API development & integrations",
      "Monolithic to microservices migration",
      "Domain-specific solutions: BFSI, insurance, ecommerce",
      "Multi-tenant SaaS platforms",
      "Open API ecosystems",
    ],
  },
  {
    icon: Sparkles, label:"Experience", badge:"UX/CX",
    title:"Customer-centric experience — human-centered, conversion-optimized.",
    desc:"Digital experiences that people actually want to use. Design-driven development that puts the user first — from web to mobile to internal tools.",
    tags:["UX Design","Mobile","Web","Portals","Field Apps"],
    items:[
      "Design-driven development & UX design",
      "Custom mobile app development",
      "Web experience design",
      "Internal tools & portals",
      "Field force & operations apps",
    ],
  },
  {
    icon: RefreshCw, label:"Modernization", badge:"Cloud-Native",
    title:"Digital acceleration & modernization — re-architect for scale.",
    desc:"We take legacy systems and rebuild them into modern, cloud-native architectures — without disrupting what's live while we work.",
    tags:["Legacy","Cloud-Native","Low-Code","Digital Workplace"],
    items:[
      "Legacy system modernization & refactoring",
      "Cloud-native architecture & migration",
      "Low-code / no-code platforms",
      "Digital workplace solutions",
    ],
  },
  {
    icon: Building2, label:"Enterprise", badge:"ERP/CRM",
    title:"Enterprise platform solutions — ERP, CRM, M365 & integration.",
    desc:"End-to-end enterprise platform delivery. We implement, integrate and extend the platforms your business runs on — with AI-powered automation built in.",
    tags:["Dynamics 365","Salesforce","M365","SharePoint","Power Automate"],
    items:[
      "ERP & CRM: Microsoft Dynamics, Salesforce",
      "Microsoft 365 & SharePoint collaboration",
      "Enterprise integration services: ESB, APIs",
      "AI-powered automation: Copilot, Power Automate",
      "Document & knowledge management",
      "Enterprise security & compliance",
    ],
  },
  {
    icon: CheckCircle2, label:"Quality", badge:"QA/QE",
    title:"Quality engineering & automation — AI-assisted testing & CI/CD.",
    desc:"Modern QA isn't an afterthought — it's built into the pipeline. AI-assisted testing, automation frameworks and continuous delivery that ships with confidence.",
    tags:["AI Testing","Mobile QA","API Testing","CI/CD","Performance"],
    items:[
      "AI-assisted & quality assurance for AI",
      "Mobile & API test automation",
      "Cross-browser & performance testing",
      "CI/CD pipeline automation",
    ],
  },
];

// ── Blinking code cursor (hero accent) ────────────────────────────────────────
function CodeCursor() {
  return (
    <motion.span
      aria-hidden
      className="inline-block align-middle ml-2 rounded-[2px]"
      style={{
        width: "0.5ch",
        height: "0.82em",
        background: "linear-gradient(180deg, #439FF7 0%, #1A73E8 100%)",
        boxShadow: "0 0 12px rgba(26,115,232,0.55)",
        verticalAlign: "-0.08em",
      }}
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1.05, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }}
    />
  );
}

// ── Code canvas ───────────────────────────────────────────────────────────────
function CodeCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas=ref.current;if(!canvas)return;
    const ctx=canvas.getContext("2d")!;let id:number;
    const LINES=["const integration = connect(erp, wms);","await pipeline.deploy({ env: 'prod' });","function transform(data: EDIMessage) {","  return normalize(data.segments);","const health = monitor.uptime();   // 99.98%","export class IntegrationHub {","  private readonly partners: Map<>;","  async onboard(partner: Partner) {","dispatch({ type: 'SYNC_COMPLETE' });","const schema = validate(payload, x12);"];
    type Stream={x:number;y:number;lineIdx:number;charIdx:number;speed:number;alpha:number;phase:number};let streams:Stream[]=[];
    const resize=()=>{canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;streams=Array.from({length:8},(_,i)=>({x:(canvas.width/8)*i+Math.random()*40,y:Math.random()*canvas.height,lineIdx:Math.floor(Math.random()*LINES.length),charIdx:0,speed:.5+Math.random()*.8,alpha:.05+Math.random()*.06,phase:Math.random()*Math.PI*2}));};
    resize();window.addEventListener("resize",resize);
    let t=0,last=0;
    const draw=(ts:number)=>{const W=canvas.width,H=canvas.height;ctx.clearRect(0,0,W,H);t++;const delta=ts-last;last=ts;streams.forEach(s=>{const line=LINES[s.lineIdx];const visible=line.slice(0,Math.floor(s.charIdx));const pulse=.6+Math.sin(t*.02+s.phase)*.4;ctx.globalAlpha=s.alpha*pulse;ctx.fillStyle="#1A73E8";ctx.font="11px 'Courier New', monospace";ctx.textAlign="left";ctx.fillText(visible,s.x,s.y);if(Math.floor(t/18)%2===0){const w=ctx.measureText(visible).width;ctx.fillRect(s.x+w,s.y-11,1,13);}ctx.globalAlpha=1;s.charIdx+=s.speed*(delta/60);if(s.charIdx>line.length+20){s.charIdx=0;s.lineIdx=Math.floor(Math.random()*LINES.length);s.y+=28;if(s.y>H+20)s.y=-20;}});id=requestAnimationFrame(draw);};
    id=requestAnimationFrame(draw);return()=>{cancelAnimationFrame(id);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:0}} />;
}

// ── Build metrics bar ─────────────────────────────────────────────────────────
function BuildMetricsBar() {
  const [commits,setCommits]=useState(1247);const [deploy,setDeploy]=useState("2m 14s");
  useEffect(()=>{const t1=setInterval(()=>setCommits(c=>c+Math.floor(Math.random()*2)+1),3500);const t2=setInterval(()=>{const mins=Math.floor(Math.random()*2)+1;const secs=Math.floor(Math.random()*59).toString().padStart(2,"0");setDeploy(`${mins}m ${secs}s`);},4000);return()=>{clearInterval(t1);clearInterval(t2);};},[]);
  return (
    <motion.div className="inline-flex items-center gap-5 border border-[#0B1F3A]/10 rounded-lg px-5 py-3"
      initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.7,duration:.4}}>
      {[{val:commits.toLocaleString(),lbl:"Commits shipped"},{val:"94%",lbl:"Test coverage"},{val:deploy,lbl:"Avg deploy time"}].map((m,i)=>(
        <div key={m.lbl} className="flex items-center gap-4">
          {i>0&&<div className="w-px h-6 bg-[#0B1F3A]/10" />}
          <div>
            <div className="text-base font-medium text-[#0B1F3A] tabular-nums">{m.val}</div>
            <div className="text-[9px] text-[#0B1F3A]/38 uppercase tracking-wide mt-0.5">{m.lbl}</div>
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

// ── Engineering lifecycle diagram ─────────────────────────────────────────────
function EngineeringLifecycle() {
  const STEPS=["Assess","Architect","Build","Test","Deploy","Own"];
  const [active,setActive]=useState(0);
  const trackRef=useRef<HTMLDivElement>(null);const canvasRef=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{const id=setInterval(()=>setActive(s=>(s+1)%STEPS.length),1300);return()=>clearInterval(id);},[]);
  useEffect(()=>{const canvas=canvasRef.current;if(!canvas)return;const ctx=canvas.getContext("2d")!;let id:number;type Pkt={p:number;spd:number};let pkts:Pkt[]=[{p:0,spd:.007},{p:.4,spd:.009},{p:.75,spd:.006}];const resize=()=>{canvas.width=(trackRef.current?.offsetWidth??500)*2;canvas.height=6;canvas.style.height="3px";canvas.style.width=(trackRef.current?.offsetWidth??500)+"px";};resize();const draw=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);pkts=pkts.map(pk=>{pk.p+=pk.spd;if(pk.p>1)pk.p=0;const x=pk.p*canvas.width;const fade=pk.p<.06?pk.p/.06:pk.p>.88?(1-pk.p)/.12:1;ctx.globalAlpha=fade*.75;ctx.fillStyle="#1A73E8";ctx.shadowColor="#1A73E8";ctx.shadowBlur=5;ctx.beginPath();ctx.arc(x,canvas.height/2,3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1;return pk;});id=requestAnimationFrame(draw);};draw();return()=>cancelAnimationFrame(id);},[]);
  return (
    <div className="mt-8 bg-white border border-[#0B1F3A]/10 rounded-lg px-7 py-6">
      <p className="text-[9px] text-[#1A73E8] uppercase tracking-widest mb-6">Engineering lifecycle</p>
      <div className="relative flex items-start justify-between">
        {STEPS.map((s,i)=>(
          <div key={s} className="flex flex-col items-center gap-2" style={{flex:1,position:"relative",zIndex:2}}>
            <motion.div className="w-9 h-9 rounded-full border flex items-center justify-center text-[9px] font-medium"
              animate={{background:active===i?"#1A73E8":"#fff",borderColor:active===i?"#1A73E8":"rgba(11,31,58,0.14)",color:active===i?"#fff":"rgba(11,31,58,0.45)",boxShadow:active===i?"0 0 0 5px rgba(26,115,232,0.1)":"none"}}
              transition={{duration:.32}}>{i+1}</motion.div>
            <motion.span className="text-[9px] text-center leading-tight"
              animate={{color:active===i?"#1A73E8":"rgba(11,31,58,0.38)",fontWeight:active===i?600:400}}
              transition={{duration:.25}}>{s}</motion.span>
          </div>
        ))}
        <div ref={trackRef} className="absolute" style={{top:17,left:"4%",right:"4%",height:2,background:"rgba(11,31,58,0.07)",zIndex:1}}>
          <motion.div className="absolute top-0 left-0 h-full bg-[#1A73E8]/30" animate={{width:`${(active/(STEPS.length-1))*100}%`}} transition={{duration:.5,ease:"easeInOut"}} />
          <canvas ref={canvasRef} className="absolute" style={{top:-1}} />
        </div>
      </div>
    </div>
  );
}

// ── Value card ────────────────────────────────────────────────────────────────
function ValueCard({item,index}:{item:typeof valueProps[0];index:number}) {
  const [hovered,setHovered]=useState(false);
  const glowX=useMotionValue(50),glowY=useMotionValue(50),glowOp=useMotionValue(0);
  const glowBg=useTransform([glowX,glowY],([x,y])=>`radial-gradient(ellipse at ${x}% ${y}%, rgba(26,115,232,0.05) 0%, transparent 65%)`);
  const shimX=useMotionValue(-100);const shimT=useTransform(shimX,v=>`${v}%`);
  const onMove=(e:React.MouseEvent<HTMLDivElement>)=>{const r=e.currentTarget.getBoundingClientRect();glowX.set(((e.clientX-r.left)/r.width)*100);glowY.set(((e.clientY-r.top)/r.height)*100);animate(glowOp,1,{duration:.25});};
  const onEnter=useCallback(()=>{setHovered(true);shimX.set(-100);animate(shimX,200,{duration:.5,ease:"easeInOut"});},[shimX]);
  const onLeave=()=>{setHovered(false);animate(glowOp,0,{duration:.3});};
  return (
    <motion.div variants={staggerItem}
      className="border border-[#0B1F3A]/10 rounded-lg p-6 bg-white relative overflow-hidden cursor-default"
      whileHover={{y:-3,borderColor:"rgba(26,115,232,0.3)",boxShadow:"0 8px 28px rgba(26,115,232,0.1)",transition:{duration:.18,ease:EASE}}}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{opacity:glowOp,background:glowBg}} />
      <motion.div className="absolute top-0 pointer-events-none" style={{left:0,width:"55%",height:1,background:"linear-gradient(90deg,transparent,rgba(26,115,232,0.4),transparent)",x:shimT}} />
      <motion.div className="absolute top-0 left-0 right-0 h-px" style={{background:"linear-gradient(90deg,transparent,rgba(26,115,232,0.35),transparent)"}} animate={{opacity:hovered?1:0}} transition={{duration:.2}} />
      <div className="relative">
        <motion.div className="text-2xl font-medium text-[#1A73E8] tabular-nums mb-0.5" animate={{scale:hovered?1.04:1}} transition={{duration:.2}}>{item.metric}</motion.div>
        <div className="text-[9px] text-[#0B1F3A]/35 uppercase tracking-wide mb-3">{item.unit}</div>
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
  useEffect(()=>{const canvas=canvasRef.current;if(!canvas)return;const ctx=canvas.getContext("2d")!;let id:number;type Pkt={p:number;spd:number};let pkts:Pkt[]=[{p:index*.33,spd:.006+index*.001}];const resize=()=>{canvas.width=(rowRef.current?.offsetWidth??600)*2;canvas.height=4;canvas.style.height="2px";canvas.style.width=(rowRef.current?.offsetWidth??600)+"px";};resize();const draw=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);pkts=pkts.map(pk=>{pk.p+=pk.spd;if(pk.p>1)pk.p=0;const x=pk.p*canvas.width;const fade=pk.p<.05?pk.p/.05:pk.p>.9?(1-pk.p)/.1:1;ctx.globalAlpha=fade*.55;ctx.fillStyle="#1A73E8";ctx.shadowColor="#1A73E8";ctx.shadowBlur=4;ctx.beginPath();ctx.arc(x,canvas.height/2,2.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1;return pk;});id=requestAnimationFrame(draw);};draw();return()=>cancelAnimationFrame(id);},[index]);
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

// ── Digital Offerings — same style as EDI/AI/Data ─────────────────────────────
function DigitalOfferings() {
  const [active, setActive] = useState(0);
  const current = digitalOfferings[active];
  return (
    <section className="py-24 px-4 bg-[#1A73E8]/[0.02] border-t border-b border-[#0B1F3A]/10">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Digital — The Doing Layer
          </motion.p>
          <motion.h2 className="text-4xl md:text-5xl font-normal text-[#0B1F3A] tracking-tight leading-tight"
            variants={fadeUp} custom={.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Digital engineering <span className="text-[#1A73E8]">capabilities.</span>
          </motion.h2>
          <motion.p className="mt-4 text-base text-[#475569] leading-relaxed"
            variants={fadeUpLarge} custom={.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Five specialised engineering capabilities. Senior engineers on every engagement.
          </motion.p>
        </div>

        <motion.div className="grid md:grid-cols-[220px_1fr] border border-[#0B1F3A]/10 rounded-xl overflow-hidden"
          initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={VIEWPORT} transition={{duration:.6,delay:.15}}>

          {/* LEFT nav */}
          <div className="border-r border-[#0B1F3A]/10 py-2 bg-[#1A73E8]/[0.02]">
            {digitalOfferings.map((o,i)=>{
              const NavIcon=o.icon;const isActive=active===i;
              return (
                <button key={o.label} onClick={()=>setActive(i)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200"
                  style={{background:isActive?"#0B1F3A":"transparent"}}>
                  <NavIcon size={15} strokeWidth={1.75} color={isActive?"#fff":"rgba(26,115,232,0.55)"} style={{flexShrink:0,transition:"color .18s"}} />
                  <span style={{fontSize:13,fontWeight:isActive?500:400,color:isActive?"#fff":"rgba(11,31,58,0.6)",transition:"color .18s",lineHeight:1.3,flex:1}}>{o.label}</span>
                  {isActive && (
                    <motion.span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:"#439FF7" }}
                      initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ duration:0.25, ease:EASE }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* RIGHT detail */}
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}}
              transition={{duration:.25,ease:EASE}} className="p-8 md:p-10">
              {/* badge — solid brand blue with green live dot */}
              <div style={{display:"inline-flex",alignItems:"center",gap:7,fontSize:10,fontWeight:600,letterSpacing:".12em",textTransform:"uppercase",padding:"4px 12px 4px 10px",borderRadius:999,background:"#1A73E8",color:"#fff",marginBottom:20}}>
                <motion.span className="rounded-full flex-shrink-0" style={{ width:6, height:6, background:"#10B981" }}
                  animate={{ boxShadow:["0 0 0 0px rgba(16,185,129,.6)","0 0 0 4px rgba(16,185,129,0)","0 0 0 0px rgba(16,185,129,.6)"] }}
                  transition={{ duration:1.8, repeat:Infinity }} />
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
                <span className="text-xs text-[#0B1F3A]/30 tabular-nums">{active+1} of {digitalOfferings.length}</span>
                <div className="flex items-center gap-3">
                  {active < digitalOfferings.length-1 && (
                    <motion.span className="text-[11px] text-[#1A73E8]/70 font-medium hidden sm:inline"
                      animate={{ opacity:[0.45,1,0.45] }} transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}>
                      Click to explore next →
                    </motion.span>
                  )}
                  <button type="button" aria-label="Previous offering"
                    disabled={active===0}
                    onClick={()=>setActive(a=>Math.max(0, a-1))}
                    className="flex items-center justify-center"
                    style={{width:38,height:38,borderRadius:"50%",background:"transparent",border:"1px solid rgba(26,115,232,0.3)",cursor:active===0?"not-allowed":"pointer",opacity:active===0?0.35:1,transition:"background .18s, transform .18s, opacity .18s"}}
                    onMouseEnter={e=>{ if(active===0) return; const t=e.currentTarget as HTMLElement;t.style.background="rgba(26,115,232,0.06)";t.style.transform="scale(1.06)";}}
                    onMouseLeave={e=>{const t=e.currentTarget as HTMLElement;t.style.background="transparent";t.style.transform="scale(1)";}}>
                    <ArrowRight size={16} strokeWidth={2} color="#1A73E8" style={{transform:"rotate(180deg)"}} />
                  </button>
                  <button type="button" aria-label="Next offering"
                    disabled={active===digitalOfferings.length-1}
                    onClick={()=>setActive(a=>Math.min(digitalOfferings.length-1, a+1))}
                    className="flex items-center justify-center"
                    style={{width:38,height:38,borderRadius:"50%",background:"#1A73E8",border:"none",cursor:active===digitalOfferings.length-1?"not-allowed":"pointer",opacity:active===digitalOfferings.length-1?0.35:1,transition:"background .18s, transform .18s, box-shadow .18s, opacity .18s"}}
                    onMouseEnter={e=>{ if(active===digitalOfferings.length-1) return; const t=e.currentTarget as HTMLElement;t.style.background="#155CC0";t.style.transform="scale(1.06)";t.style.boxShadow="0 6px 18px rgba(26,115,232,0.35)";}}
                    onMouseLeave={e=>{const t=e.currentTarget as HTMLElement;t.style.background="#1A73E8";t.style.transform="scale(1)";t.style.boxShadow="none";}}>
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
export function DigitalEngineeringPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-24 px-4 relative overflow-hidden bg-white">
        <CodeCanvas />
        <div className="max-w-6xl mx-auto relative" style={{zIndex:1}}>
          <div className="max-w-3xl space-y-6">
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide"
              initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.4,ease:EASE,delay:.05}}>
              Digital Engineering
            </motion.p>
            <motion.h1 className="text-5xl md:text-[64px] font-normal text-[#0B1F3A] leading-[1.06] tracking-tight"
              initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.55,ease:EASE,delay:.15}}>
              Senior engineers, <span className="text-[#1A73E8]">building what moves your business forward.</span><CodeCursor />
            </motion.h1>
            <motion.p className="text-lg text-[#475569] leading-relaxed max-w-2xl"
              initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.5,ease:EASE,delay:.3}}>
              When off-the-shelf software cannot do the job, we build the custom applications and modern systems that can — engineered properly, for the long term.
            </motion.p>
            <BuildMetricsBar />
            <motion.div className="flex flex-wrap gap-3 pt-2"
              initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.45,ease:EASE,delay:.45}}>
              <motion.div whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
                <Link to="/contact" className="block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors"
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(26,115,232,0.28)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
                  Talk to an architect about engineering
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-24 px-4 bg-[#1A73E8]/[0.02] border-t border-b border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Our Approach
            </motion.p>
            <motion.h2 className="text-4xl md:text-5xl font-normal text-[#0B1F3A] leading-tight tracking-tight mb-6"
              variants={fadeUp} custom={.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Everything we build is <span className="text-[#1A73E8]">designed to connect.</span>
            </motion.h2>
            <motion.p className="text-base text-[#475569] leading-relaxed"
              variants={fadeUpLarge} custom={.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Custom applications that can't talk to the rest of your enterprise create new integration debt the moment they go live. We build with connectivity as a first principle — not an afterthought.
            </motion.p>
            <motion.p className="text-base text-[#475569] leading-relaxed mt-4"
              variants={fadeUpLarge} custom={.18} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Because connected systems are what we do, the applications we engineer are designed to integrate cleanly with the rest of your estate from day one.
            </motion.p>
            <motion.div variants={fadeUp} custom={.24} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              <EngineeringLifecycle />
            </motion.div>
          </div>
          <motion.div className="space-y-4" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {valueProps.map((item,i)=><ValueCard key={item.label} item={item} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* Digital Offerings */}
      <DigitalOfferings />

      {/* Services */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              What We Build
            </motion.p>
            <motion.h2 className="text-4xl md:text-5xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
              variants={fadeUp} custom={.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Custom, modern, <span className="text-[#1A73E8]">built to last.</span>
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
            Ready to build <span className="text-[#1A73E8]">something that lasts?</span>
          </motion.h2>
          <motion.p className="text-base text-[#475569] max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Talk to an architect about the application or system you need to build — and what it needs to connect to.
          </motion.p>
          <motion.div variants={fadeUp} custom={.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}
            whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
            <Link to="/contact" className="inline-block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-md hover:bg-[#155CC0] transition-colors"
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(26,115,232,0.28)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
              Talk to an architect about engineering
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}