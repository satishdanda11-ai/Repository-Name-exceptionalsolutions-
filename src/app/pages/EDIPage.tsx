import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

import imgIBMSterling from "../../imports/sm_img_28.png";
import imgCleo        from "../../imports/sm_img_25.png";
import imgMuleSoft    from "../../imports/sm_img_20.png";
import imgBoomi       from "../../imports/sm_img_15.png";
import imgApigee      from "../../imports/sm_img_21.png";
import imgAxway       from "../../imports/sm_img_27.png";
import {
  FileCode2, Users, FolderSync, Headphones, Plug,
  Cloud, Lightbulb, Building2, Activity, Workflow,
  ArrowRight, Check
} from "lucide-react";

const lifecycle = [
  { phase:"Assess & Modernize",    desc:"We audit your EDI estate, reduce risk and cost, and migrate ageing platforms — without disrupting live trading." },
  { phase:"Implement & Integrate", desc:"We stand up EDI and B2B integration and connect it cleanly to your ERP, WMS, and trading-partner systems." },
  { phase:"Onboard Partners",      desc:"We run managed trading-partner onboarding, turning a process that takes weeks into one that takes days." },
  { phase:"Operate & Monitor",     desc:"We run managed EDI operations, monitoring and exception handling — so your internal team is never paged at 2am for a failed transaction." },
  { phase:"Optimise",              desc:"We apply analytics and AI to your integration data to predict and prevent failures before they affect an order." },
];

const platforms = [
  { name:"IBM Sterling", logo:imgIBMSterling },
  { name:"Cleo",         logo:imgCleo        },
  { name:"MuleSoft",     logo:imgMuleSoft    },
  { name:"Boomi",        logo:imgBoomi       },
  { name:"Apigee",       logo:imgApigee      },
  { name:"Axway B2B",    logo:imgAxway       },
];

const outcomes = [
  { label:"Revenue Protection",  desc:"Fewer failed transactions means fewer delayed and lost orders. Your revenue stops depending on integration that might break.",  metric:"99.98%" },
  { label:"Lower Cost-to-Serve", desc:"Automated exception handling removes the quiet, recurring labour cost of fixing EDI errors by hand.",                            metric:"40%"    },
  { label:"Risk & Compliance",   desc:"Full audit trails, secure data exchange, and reliable conformance to trading-partner mandates.",                                 metric:"100%"   },
  { label:"Scalability",         desc:"Onboard your next hundred trading partners without adding a hundred partners' worth of cost or headcount.",                      metric:"10×"    },
];

const differentiators = [
  { heading:"Platform-agnostic expertise. Not resellers.",        desc:"We are fluent across all six major platforms and vendor-neutral in our advice. You will never be pushed toward a platform because it suits us." },
  { heading:"Senior engineers. No junior handoffs.",              desc:"The people who scope your project are the people who deliver it. There is no handoff to a team you haven't met." },
  { heading:"Faster, leaner, and more accountable than global firms.", desc:"More disciplined and certified than a typical offshore vendor. You get both — challenger speed and enterprise rigour." },
];

const offerings = [
  { icon:FileCode2, label:"EDI Implementation",    badge:"Core",       title:"EDI setup, mapping & development",                         desc:"We configure, map and test EDI environments from scratch — or take over what you have. Every major standard, every document type.",                                                                       tags:["ANSI X12","EDIFACT","OFTP","HL7","HIPAA","SWIFT","XML"],         items:["EDI setup, mapping & configuration","PO (850), Invoice (810), ASN (856), FA (997) and 50+ document types","Translation & format transformation across any standard"] },
  { icon:Users,     label:"Partner Onboarding",    badge:"Growth",     title:"Onboard trading partners in days, not weeks",               desc:"Self-service portals, pre-built templates and a proven process that removes the bottleneck of partner onboarding from your revenue pipeline.",                                                             tags:["AS2","SFTP","FTPS","HTTP/S","SMTP"],                             items:["Rapid partner onboarding with self-service portals","Pre-built trading partner templates for major retailers & carriers","Partner self-certification & code migration support"] },
  { icon:FolderSync,label:"Managed File Transfer", badge:"Security",   title:"Secure, compliant file transfer at scale",                  desc:"End-to-end encrypted MFT with SLA monitoring, audit logging and high-availability architecture built to meet HIPAA and GDPR requirements.",                                                             tags:["SSL","SSH","PGP","HIPAA","GDPR"],                                items:["Secure MFT: SFTP, FTPS, HTTPS, AS2 with full encryption","SLA monitoring, real-time alerts & audit logging","High-availability & active/active replication"] },
  { icon:Headphones,label:"Managed EDI Services",  badge:"24/7",       title:"Full-lifecycle EDI operations, fully managed",              desc:"We run your EDI environment end to end — monitoring, exception handling, compliance and production support — so your team never has to.",                                                            tags:["24/7 Ops","SLA","Compliance","Audit"],                           items:["24/7 monitoring, error detection & resolution","SLA reporting, performance tracking & audit support","Production environment maintenance & ongoing support"] },
  { icon:Plug,      label:"API & Hybrid B2B",      badge:"Modern",     title:"EDI and API, co-existing seamlessly",                       desc:"Modern enterprises need both. We design and build hybrid architectures that let EDI and API-led integration work together without conflict.",                                                           tags:["REST","SOAP","iPaaS","ESB","Event streaming"],                   items:["API development, management & governance","iPaaS & cloud-native integration platforms","Real-time data exchange & event streaming"] },
  { icon:Cloud,     label:"Cloud & Hybrid EDI",    badge:"Flexible",   title:"EDI delivered from cloud, on-prem, or both",                desc:"We deploy across SaaS, on-premise and hybrid environments — including VAN connectivity and EDI-as-a-service for teams moving off legacy infrastructure.",                                                tags:["SaaS","On-prem","Hybrid","VAN","Multi-cloud"],                   items:["Cloud EDI: SaaS, on-prem & hybrid delivery models","VAN (Value-Added Network) connectivity","Multi-cloud integration & deployment flexibility"] },
  { icon:Lightbulb, label:"Strategy & Advisory",   badge:"Advisory",   title:"Integration readiness, strategy & architecture",            desc:"Before you build, we assess. We map your estate, identify risk, and design the architecture — so every decision is grounded in your actual environment.",                                                tags:["Assessment","Architecture","ROI","Governance"],                  items:["Integration readiness assessment & gap analysis","Architecture design: sync, async & hybrid patterns","Technology selection & ROI planning"] },
  { icon:Building2, label:"ERP Integration",        badge:"Enterprise", title:"Connect your ERP to every system it touches",               desc:"We integrate SAP, Oracle and Dynamics 365 with WMS, TMS, OMS and e-commerce systems — and modernize legacy connections through APIs.",                                                                    tags:["SAP","Oracle","Dynamics 365","WMS","TMS"],                       items:["SAP, Oracle, Dynamics 365 integration","WMS, TMS, OMS & e-commerce connectivity","Real-time data sync across all business systems"] },
  { icon:Activity,  label:"Visibility & Analytics", badge:"Insight",    title:"See every transaction. Fix issues before they escalate.",   desc:"End-to-end tracking, anomaly detection and supply chain visibility portals — so you always know where data is and why it failed.",                                                                       tags:["Dashboards","Alerting","Replay","Reporting"],                    items:["End-to-end transaction tracking & performance dashboards","Anomaly detection & proactive alerting","Record & replay for failed transactions"] },
  { icon:Workflow,  label:"Supply Chain Automation",badge:"AI",         title:"Automate the workflows EDI used to require people for",     desc:"From order-to-cash to AI-driven supply chain intelligence — we eliminate the manual work that accumulates around B2B processes over time.",                                                         tags:["RPA","AI","O2C","P2P","ASN"],                                   items:["Order-to-cash & procure-to-pay automation","AI-driven supply chain intelligence","RPA-augmented B2B workflows"] },
];



// ── Type scale (consistent with homepage) ────────────────────────────────────
// h1: text-5xl md:text-6xl  font-normal  tracking-tight
// h2: text-4xl md:text-5xl  font-normal  tracking-tight
// h3: text-base             font-medium
// body-lg: text-lg          text-black/60  leading-relaxed
// body: text-sm             text-black/60  leading-relaxed
// label: text-xs            text-black/40  uppercase tracking-wide

function WaveBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas=ref.current; if(!canvas) return;
    const ctx=canvas.getContext("2d")!;
    let id:number,t=0;
    const resize=()=>{canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;};
    resize(); window.addEventListener("resize",resize);
    const WAVES=[{amp:18,freq:.012,spd:.018,y:.42,a:.07,lw:1.8},{amp:12,freq:.018,spd:.024,y:.52,a:.05,lw:1.2},{amp:22,freq:.009,spd:.013,y:.60,a:.04,lw:2.2},{amp:9,freq:.025,spd:.031,y:.35,a:.03,lw:1.0},{amp:15,freq:.014,spd:.020,y:.70,a:.03,lw:1.5}];
    const draw=()=>{const W=canvas.width,H=canvas.height;ctx.clearRect(0,0,W,H);t++;WAVES.forEach(w=>{ctx.beginPath();ctx.moveTo(0,H*w.y);for(let x=0;x<=W;x+=2){const y=H*w.y+Math.sin(x*w.freq+t*w.spd)*w.amp+Math.sin(x*w.freq*1.6+t*w.spd*.7)*w.amp*.4;ctx.lineTo(x,y);}ctx.strokeStyle=`rgba(0,0,0,${w.a})`;ctx.lineWidth=w.lw;ctx.stroke();});id=requestAnimationFrame(draw);};
    draw(); return()=>{cancelAnimationFrame(id);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:0}} />;
}

function DataParticles() {
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{const canvas=ref.current;if(!canvas)return;const ctx=canvas.getContext("2d")!;let id:number;type P={x:number;y:number;vx:number;vy:number;a:number;r:number};let pts:P[]=[];const resize=()=>{canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;pts=Array.from({length:28},()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,vx:(Math.random()-.5)*.35,vy:-Math.random()*.4-.1,a:Math.random()*.09+.03,r:Math.random()*2+1}));};resize();window.addEventListener("resize",resize);const draw=()=>{const W=canvas.width,H=canvas.height;ctx.clearRect(0,0,W,H);for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<120){ctx.globalAlpha=((120-d)/120)*.05;ctx.strokeStyle="#111";ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();}}pts.forEach(p=>{ctx.globalAlpha=p.a;ctx.fillStyle="#111";ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();p.x+=p.vx;p.y+=p.vy;if(p.y<-4){p.y=H+4;p.x=Math.random()*W;}if(p.x<0||p.x>W)p.vx*=-1;});ctx.globalAlpha=1;id=requestAnimationFrame(draw);};draw();return()=>{cancelAnimationFrame(id);window.removeEventListener("resize",resize);};},[]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:0}} />;
}

function LiveCounter() {
  const [count,setCount]=useState(14382);
  useEffect(()=>{const id=setInterval(()=>setCount(c=>c+Math.floor(Math.random()*4)+1),1600);return()=>clearInterval(id);},[]);
  return (
    <motion.div className="inline-flex items-center gap-2 text-[11px] text-black/50 border border-black/10 rounded-full px-3 py-1.5"
      initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.7,duration:.4}}>
      <motion.span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"
        animate={{boxShadow:["0 0 0 0px rgba(34,197,94,.5)","0 0 0 4px rgba(34,197,94,0)","0 0 0 0px rgba(34,197,94,.5)"]}}
        transition={{duration:1.8,repeat:Infinity}} />
      {count.toLocaleString()} EDI transactions processed today
    </motion.div>
  );
}

function LifecycleRow({item,index}:{item:typeof lifecycle[0];index:number}) {
  const [hovered,setHovered]=useState(false);
  const [counted,setCounted]=useState(false);
  const [num,setNum]=useState(0);
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{const el=ref.current;if(!el)return;const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting&&!counted){setCounted(true);let cur=0;const target=index+1;const steps=target*4;const id=setInterval(()=>{cur++;setNum(Math.min(cur,target));if(cur>=steps)clearInterval(id);},30);}},{threshold:.4});obs.observe(el);return()=>obs.disconnect();},[counted,index]);
  return (
    <motion.div ref={ref} variants={staggerItem}
      className="grid md:grid-cols-12 gap-6 py-7 border-b border-black/10 items-start relative overflow-hidden cursor-default"
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
      <motion.div className="absolute inset-0 bg-black/[0.015]" initial={{scaleX:0,originX:0}} animate={{scaleX:hovered?1:0}} transition={{duration:.35,ease:[.16,1,.3,1]}} />
      <div className="md:col-span-1 relative">
        <motion.span className="text-xs font-medium tabular-nums" animate={{color:hovered?"#111827":"rgba(0,0,0,0.2)"}} transition={{duration:.2}}>{String(num).padStart(2,"0")}</motion.span>
      </div>
      <div className="md:col-span-3 relative">
        <motion.h3 className="text-sm font-medium" animate={{color:hovered?"#000":"#111827"}} transition={{duration:.2}}>{item.phase}</motion.h3>
        <div className="mt-2 h-px w-full bg-black/[0.08] overflow-hidden">
          <motion.div className="h-full bg-black origin-left" animate={{scaleX:hovered?1:0}} transition={{duration:.5,ease:[.16,1,.3,1]}} />
        </div>
      </div>
      <div className="md:col-span-8 relative">
        <p className="text-sm text-black/55 leading-relaxed">{item.desc}</p>
      </div>
    </motion.div>
  );
}

function PlatformCard({name,logo}:{name:string;logo:string}) {
  const glowX=useMotionValue(50),glowY=useMotionValue(50),glowOp=useMotionValue(0);
  const glowBg=useTransform([glowX,glowY],([x,y])=>`radial-gradient(ellipse at ${x}% ${y}%, rgba(0,0,0,0.04) 0%, transparent 65%)`);
  const shimX=useMotionValue(-100);
  const shimT=useTransform(shimX,v=>`${v}%`);
  const onMove=(e:React.MouseEvent<HTMLDivElement>)=>{const r=e.currentTarget.getBoundingClientRect();glowX.set(((e.clientX-r.left)/r.width)*100);glowY.set(((e.clientY-r.top)/r.height)*100);animate(glowOp,1,{duration:.25});};
  const onEnter=useCallback(()=>{shimX.set(-100);animate(shimX,200,{duration:.55,ease:"easeInOut"});},[shimX]);
  const onLeave=()=>{animate(glowOp,0,{duration:.3});};
  return (
    <motion.div variants={staggerItem}
      className="border border-black/10 rounded-lg py-7 px-6 flex items-center justify-center relative overflow-hidden cursor-pointer"
      whileHover={{y:-3,borderColor:"rgba(0,0,0,0.22)",boxShadow:"0 6px 20px rgba(0,0,0,0.07)",transition:{duration:.18,ease:EASE}}}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{opacity:glowOp,background:glowBg}} />
      <motion.div className="absolute top-0 pointer-events-none" style={{left:0,width:"55%",height:1,background:"linear-gradient(90deg,transparent,rgba(0,0,0,0.28),transparent)",x:shimT}} />
      <img src={logo} alt={name} className="relative z-10"
        style={{maxWidth:110,maxHeight:36,width:"auto",height:"auto",objectFit:"contain",filter:"grayscale(100%)",opacity:.55,transition:"filter .22s,opacity .22s"}}
        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.filter="none";(e.currentTarget as HTMLElement).style.opacity="1";}}
        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.filter="grayscale(100%)";(e.currentTarget as HTMLElement).style.opacity=".55";}} />
    </motion.div>
  );
}

function OutcomeCard({label,desc,metric,index}:{label:string;desc:string;metric:string;index:number}) {
  const [hovered,setHovered]=useState(false);
  const [shown,setShown]=useState(false);
  const ref=useRef<HTMLDivElement>(null);
  const glowX=useMotionValue(50),glowY=useMotionValue(50),glowOp=useMotionValue(0);
  const glowBg=useTransform([glowX,glowY],([x,y])=>`radial-gradient(ellipse at ${x}% ${y}%, rgba(0,0,0,0.04) 0%, transparent 65%)`);
  const shimX=useMotionValue(-100);
  const shimT=useTransform(shimX,v=>`${v}%`);
  const onMove=(e:React.MouseEvent<HTMLDivElement>)=>{const r=e.currentTarget.getBoundingClientRect();glowX.set(((e.clientX-r.left)/r.width)*100);glowY.set(((e.clientY-r.top)/r.height)*100);animate(glowOp,1,{duration:.25});};
  const onEnter=useCallback(()=>{setHovered(true);shimX.set(-100);animate(shimX,200,{duration:.5,ease:"easeInOut"});},[shimX]);
  const onLeave=()=>{setHovered(false);animate(glowOp,0,{duration:.3});};
  useEffect(()=>{const el=ref.current;if(!el)return;const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setShown(true);},{threshold:.4});obs.observe(el);return()=>obs.disconnect();},[]);
  return (
    <motion.div ref={ref} variants={staggerItem}
      className="bg-white border border-black/10 rounded-lg p-8 space-y-3 relative overflow-hidden cursor-default"
      whileHover={{y:-4,borderColor:"rgba(0,0,0,0.22)",boxShadow:"0 10px 36px rgba(0,0,0,0.07)",transition:{duration:.2,ease:EASE}}}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="absolute inset-0 pointer-events-none rounded-lg" style={{opacity:glowOp,background:glowBg}} />
      <motion.div className="absolute top-0 pointer-events-none" style={{left:0,width:"55%",height:1,background:"linear-gradient(90deg,transparent,rgba(0,0,0,0.28),transparent)",x:shimT}} />
      <motion.div className="absolute top-0 left-0 right-0 h-px" style={{background:"linear-gradient(90deg,transparent,rgba(0,0,0,0.18),transparent)"}} animate={{opacity:hovered?1:0}} transition={{duration:.2}} />
      {/* metric number — same weight as homepage stats */}
      <motion.div className="text-3xl font-light tabular-nums text-black tracking-tight"
        initial={{opacity:0,y:8}} animate={{opacity:shown?1:0,y:shown?0:8}} transition={{duration:.5,delay:index*.1}}>
        {metric}
      </motion.div>
      <h3 className="text-base font-medium text-black relative z-10">{label}</h3>
      <p className="text-sm text-black/55 leading-relaxed relative z-10">{desc}</p>
      <motion.div className="h-px bg-black origin-left relative z-10" animate={{scaleX:hovered?1:0}} transition={{duration:.4,ease:[.16,1,.3,1]}} />
    </motion.div>
  );
}

function DiffRow({heading,desc}:{heading:string;desc:string}) {
  const [hovered,setHovered]=useState(false);
  return (
    <motion.div variants={staggerItem}
      className="py-7 border-b border-black/10 grid md:grid-cols-2 gap-6 relative overflow-hidden cursor-default"
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
      <motion.div className="absolute inset-0 bg-black/[0.015]" initial={{scaleX:0,originX:0}} animate={{scaleX:hovered?1:0}} transition={{duration:.35,ease:[.16,1,.3,1]}} />
      <h3 className="text-sm font-medium text-black relative flex items-start gap-2 leading-snug">
        <motion.span className="text-black/25 mt-0.5 flex-shrink-0" animate={{x:hovered?3:0,color:hovered?"#111827":"rgba(0,0,0,0.25)"}} transition={{duration:.2}}>→</motion.span>
        {heading}
      </h3>
      <p className="text-sm text-black/55 leading-relaxed relative">{desc}</p>
    </motion.div>
  );
}

function OfferingCard({ icon: Icon, title, items, index }: typeof offerings[0] & { index: number }) {
  const [hov, setHov] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={staggerItem}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      className="border rounded-lg p-6 relative overflow-hidden cursor-pointer"
      style={{ background:hov?"#111827":"#fff", borderColor:hov?"#111827":"rgba(0,0,0,0.1)", transition:"background .28s,border-color .28s,box-shadow .28s", boxShadow:hov?"0 16px 40px rgba(0,0,0,0.18)":"none" }}
      whileHover={{ y:-4, transition:{ duration:.2, ease:EASE } }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, borderRadius:"8px 8px 0 0", background:"#111827", opacity:hov?1:0, transition:"opacity .28s" }} />
      <div className="flex items-start gap-3 mb-4">
        <div style={{ width:38, height:38, borderRadius:9, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:hov?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.05)", border:`1px solid ${hov?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.08)"}`, transition:"background .25s,border-color .25s" }}>
          <Icon size={17} strokeWidth={1.75} color={hov?"#fff":"#111827"} />
        </div>
        <h3 style={{ fontSize:13, fontWeight:500, lineHeight:1.35, color:hov?"#fff":"#111827", transition:"color .22s", flex:1 }}>{title}</h3>
      </div>
      <ul style={{ margin:0, padding:0, listStyle:"none", display:"flex", flexDirection:"column", gap:7 }}>
        {items.slice(0, open ? items.length : 3).map((item, i) => (
          <motion.li key={i} initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}} transition={{duration:.28,delay:i*.04}}
            style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
            <span style={{ width:3, height:3, borderRadius:"50%", flexShrink:0, marginTop:6, background:hov?"rgba(255,255,255,0.3)":"rgba(0,0,0,0.22)", transition:"background .22s" }} />
            <span style={{ fontSize:12, lineHeight:1.6, color:hov?"rgba(255,255,255,0.5)":"rgba(0,0,0,0.52)", transition:"color .22s" }}>{item}</span>
          </motion.li>
        ))}
      </ul>
      {items.length > 3 && (
        <button onClick={e=>{e.stopPropagation();setOpen(o=>!o);}}
          style={{ marginTop:10, fontSize:11, fontWeight:500, color:hov?"rgba(255,255,255,0.38)":"rgba(0,0,0,0.35)", background:"none", border:"none", cursor:"pointer", padding:0, transition:"color .2s" }}>
          {open ? "Show less ↑" : `+${items.length-3} more ↓`}
        </button>
      )}
    </motion.div>
  );
}

function EDIOfferings() {
  const [active, setActive] = useState(0);
  const current = offerings[active];
  const Icon = current.icon;
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4" variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>Service Offerings</motion.p>
          <motion.h2 className="text-4xl md:text-4xl font-normal text-black tracking-tight leading-tight" variants={fadeUp} custom={.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>EDI & B2B Integration offerings 
</motion.h2>
          <motion.p className="mt-4 text-base text-black/55 leading-relaxed" variants={fadeUpLarge} custom={.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>10 specialised capabilities. 1 team. No handoffs between firms.</motion.p>
        </div>
        <motion.div className="grid md:grid-cols-[220px_1fr] border border-black/10 rounded-xl overflow-hidden"
          initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={VIEWPORT} transition={{duration:.6,delay:.15}}>
          {/* LEFT nav */}
          <div className="border-r border-black/10 py-2 bg-black/[0.01]">
            {offerings.map((o,i) => {
              const NavIcon = o.icon;
              const isActive = active===i;
              return (
                <button key={o.label} onClick={()=>setActive(i)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left relative transition-all duration-200"
                  style={{
                    background: isActive ? "#111827" : "transparent",
                    borderRight: "none",
                  }}>
                  <NavIcon size={15} strokeWidth={1.75}
                    color={isActive ? "#fff" : "rgba(0,0,0,0.35)"}
                    style={{flexShrink:0, transition:"color .18s"}} />
                  <span style={{
                    fontSize: 13,
                    fontWeight: isActive ? 500 : 400,
                    color: isActive ? "#fff" : "rgba(0,0,0,0.5)",
                    transition: "color .18s",
                    lineHeight: 1.3,
                  }}>
                    {o.label}
                  </span>
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-12}} transition={{duration:.25,ease:EASE}} className="p-8 md:p-10">
              {/* badge — solid black */}
              <div style={{ display:"inline-block", fontSize:10, fontWeight:600, letterSpacing:".12em", textTransform:"uppercase", padding:"4px 12px", borderRadius:999, background:"#111827", color:"#fff", marginBottom:20 }}>
                {current.badge}
              </div>
              <h3 className="text-xl md:text-2xl font-normal text-black leading-snug mb-3 tracking-tight">{current.title}</h3>
              <p className="text-sm text-black/55 leading-relaxed mb-6 max-w-lg">{current.desc}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {current.tags.map(t=><span key={t} className="text-[11px] font-medium px-3 py-1 rounded-full border border-black/10 text-black/45 bg-black/[0.02]">{t}</span>)}
              </div>
              <div className="space-y-3">
                {current.items.map((item,i)=>(
                  <motion.div key={item} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.3,delay:i*.07,ease:EASE}}
                    className="flex items-start gap-3 p-3 rounded-lg border border-black/[0.07] hover:border-black/15 transition-colors group">
                    <div className="w-5 h-5 rounded-full border border-black/15 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-black/30 transition-colors">
                      <Check size={10} strokeWidth={2.5} color="rgba(0,0,0,0.4)" />
                    </div>
                    <span className="text-sm text-black/60 leading-snug">{item}</span>
                  </motion.div>
                ))}
              </div>
              {/* arrows — larger, more prominent */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-black/[0.06]">
                <span className="text-xs text-black/30">{active+1} of {offerings.length}</span>
                <div className="flex gap-3">
                  <button
                    onClick={()=>setActive(a=>(a-1+offerings.length)%offerings.length)}
                    className="flex items-center justify-center transition-all duration-200 hover:scale-105"
                    style={{ width:38, height:38, borderRadius:"50%", background:"#111827", border:"none", cursor:"pointer" }}>
                    <ArrowRight size={16} strokeWidth={2} color="#fff" style={{transform:"rotate(180deg)"}} />
                  </button>
                  <button
                    onClick={()=>setActive(a=>(a+1)%offerings.length)}
                    className="flex items-center justify-center transition-all duration-200 hover:scale-105"
                    style={{ width:38, height:38, borderRadius:"50%", background:"#111827", border:"none", cursor:"pointer" }}>
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

function CTASection() {
  return (
    <section className="py-24 px-4 border-t border-black/10 relative overflow-hidden">
      <WaveBackground />
      <div className="max-w-6xl mx-auto text-center space-y-6 relative" style={{zIndex:1}}>
        <motion.h2 className="text-4xl md:text-5xl font-normal text-black tracking-tight"
          variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          Find out exactly where your EDI estate stands.
        </motion.h2>
        <motion.p className="text-base text-black/55 max-w-xl mx-auto leading-relaxed"
          variants={fadeUpLarge} custom={0.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          Book a no-obligation EDI health assessment. We review your current setup and give you a clear, honest picture — with no commitment to go further.
        </motion.p>
        <motion.div className="flex flex-wrap justify-center gap-3 pt-2"
          variants={fadeUp} custom={0.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          <motion.div whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
            <Link to="/contact" className="block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors"
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(0,0,0,0.18)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
              Book an EDI health assessment
            </Link>
          </motion.div>
          <motion.div whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
            <Link to="/contact" className="block border border-black/20 text-black px-6 py-2.5 text-sm rounded-md hover:bg-black/[0.03] transition-colors">
              Talk to an architect
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function EDIPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-40 pb-24 px-4 relative overflow-hidden" style={{background:"#fff"}}>
        <WaveBackground /><DataParticles />
        <div className="max-w-6xl mx-auto relative" style={{zIndex:1}}>
          <div className="max-w-3xl space-y-6">
            {/* label */}
            <motion.p className="text-xs text-black/40 uppercase tracking-wide"
              initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.4,ease:EASE,delay:.05}}>
              EDI & B2B Integration
            </motion.p>
            {/* h1 — matches homepage hero */}
            <motion.h1 className="text-5xl md:text-[64px] font-normal text-black leading-[1.06] tracking-tight"
              initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.55,ease:EASE,delay:.15}}>
              EDI is not a legacy problem. It's a competitive advantage — when it's done right.
            </motion.h1>
            {/* body-lg */}
            <motion.p className="text-lg text-black/55 leading-relaxed max-w-2xl"
              initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.5,ease:EASE,delay:.3}}>
              Exceptional Solutions assesses, modernises, runs and de-risks enterprise EDI and B2B integration, across every major platform — so the data your business depends on always flows.
            </motion.p>
            <LiveCounter />
            <motion.div className="flex flex-wrap gap-3 pt-2"
              initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.45,ease:EASE,delay:.45}}>
              <motion.div whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
                <Link to="/contact" className="block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors"
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(0,0,0,0.18)";}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
                  Book an EDI health assessment
                </Link>
              </motion.div>
              <motion.div whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
                <Link to="/contact" className="block border border-black/20 text-black px-6 py-2.5 text-sm rounded-md hover:bg-black/[0.03] transition-colors">
                  Talk to an architect
                </Link>
              </motion.div>
            </motion.div>
            <motion.p className="text-xs text-black/30"
              initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.4,ease:EASE,delay:.6}}>
              No obligation. A senior architect reviews your integration estate and shares what they find.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── Lifecycle ── */}
      <section className="py-24 px-4 bg-black/[0.02] border-t border-b border-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              End-to-End Coverage
            </motion.p>
            <motion.h2 className="text-5xl md:text-5xl font-normal text-black tracking-tight leading-tight"
              variants={fadeUp} custom={.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Everything needed to build, run, and scale EDI.
            </motion.h2>
            <motion.p className="mt-4 text-base text-black/55 leading-relaxed"
              variants={fadeUpLarge} custom={.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              EDI is not a one-time project. We support it end to end, whichever stage you are at.
            </motion.p>
          </div>
          <motion.div className="space-y-0" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {lifecycle.map((item,i)=><LifecycleRow key={item.phase} item={item} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Platforms ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Platform Expertise
            </motion.p>
            <motion.h2 className="text-4xl md:text-5xl font-normal text-black tracking-tight leading-tight"
              variants={fadeUp} custom={.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Connecting every platform. Simplifying every process.
            </motion.h2>
          </div>
          <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {platforms.map(p=><PlatformCard key={p.name} name={p.name} logo={p.logo} />)}
          </motion.div>
          <motion.div className="border border-black/10 rounded-lg px-8 py-6 bg-black/[0.02]"
            variants={fadeUp} custom={.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <p className="text-base text-black leading-relaxed">
              We modernize your stack, not sell you ours. Platform-agnostic by design, we recommend only what's right for your business.
            </p>
            <p className="mt-3 text-sm text-black/40">We support ANSI X12, EDIFACT, AS2, and API-led integration standards.</p>
          </motion.div>
        </div>
      </section>

      {/* ── Outcomes ── */}
      <section className="py-24 px-4 bg-black/[0.02] border-t border-b border-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Business Outcomes
            </motion.p>
            <motion.h2 className="text-4xl md:text-4xl font-normal text-black tracking-tight leading-tight"
              variants={fadeUp} custom={.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              What great EDI looks like in results ?
            </motion.h2>
          </div>
          <motion.div className="grid md:grid-cols-2 gap-6"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {outcomes.map((o,i)=><OutcomeCard key={o.label} label={o.label} desc={o.desc} metric={o.metric} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Why Exceptional ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-black/40 uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Why Exceptional for EDI
            </motion.p>
            <motion.h2 className="text-4xl md:text-5xl font-normal text-black tracking-tight leading-tight"
              variants={fadeUp} custom={.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Built for enterprises that expect more than good enough.
            </motion.h2>
          </div>
          <motion.div className="space-y-0" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {differentiators.map(d=><DiffRow key={d.heading} heading={d.heading} desc={d.desc} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Offerings ── */}
      <EDIOfferings />

      <CTASection />
    </>
  );
}