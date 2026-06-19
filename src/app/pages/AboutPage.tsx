import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE, VIEWPORT, fadeUp, fadeUpLarge, staggerContainer, staggerItem } from "../lib/animations";

const journey = [
  { year: "2019", tag: "Foundation",       headline: "Built the practice on IBM Sterling — deep, not wide.",              bullets: ["IBM Sterling B2B Integrator — core platform expertise from day one", "ANSI X12 transaction sets — 204, 210, 214, 850, 856, 997", "Managed services contracts launched with shift-based EDI monitoring", "Operational SOPs authored — incident management and partner onboarding"],   outcome: "Foundation year — zero-defect delivery from first engagement. Relationships from this year are still active today." },
  { year: "2020", tag: "Endurance",        headline: "COVID fractured supply chains. Our clients' EDI didn't miss a beat.", bullets: ["24/7 production EDI support through peak pandemic disruption", "Emergency trading partner onboarding — accelerated, no quality compromise", "Formal SOP library launched — change request, incident escalation, partner testing", "Sterling FileGateway administration — SFTP/AS2 partner channel management at scale"],  outcome: "Zero critical production outages attributed to our team across all active accounts through FY2020." },
  { year: "2021", tag: "Expansion",        headline: "Clients diversified their stacks. So did we — deliberately.",        bullets: ["Cleo Integration Cloud — Harmony, Clarify, Cloud Studio practices added", "MuleSoft Anypoint Platform — API-led integration delivery added", "Boomi AtomSphere — cloud-native EDI connector expertise formalised", "Automotive LLP ecosystem — first OEM Tier-1 logistics partner network engagements"],                          outcome: "Platform-agnostic positioning achieved. Clients could upgrade, migrate, or diversify — we moved with them." },
  { year: "2022", tag: "Enterprise Scale", headline: "A 5-year global freight partnership. Sterling + OIC, fully managed.",  bullets: ["Sterling EDI migration projects — legacy map conversion, zero data loss", "OIC production support launched — 32 Oracle Fusion integrations monitored", "SFTP infrastructure management — escalation workflows, alert triage", "99.04% EDI satisfaction YTD — validated across multiple business units"],                                      outcome: "5-year client retention in global freight. Consistent 9/10 ratings across multiple business units." },
  { year: "2023", tag: "US Market",        headline: "US delivery began. Customs EDI. Schema conversion. 45-day upgrade.",  bullets: ["Customs brokerage EDI mapping — CBP/ACE filing, 70-field spec", "DDF → XSD schema conversion — 197 element declarations, SOAP envelope", "Sterling B2B Integrator upgrade completed in 45 days (industry norm: 90–120)", "Cross-border trade flows — WCO data elements, CBP ACE response mapping"],               outcome: "45-day Sterling upgrade. 99.8% document processing baseline maintained throughout." },
  { year: "2024", tag: "Intelligence",     headline: "Automotive EDI operations. Cleo migration scoped. AI tooling built.",  bullets: ["Automotive TMS EDI support — 204/214 flows, GM Load Manager, STARS workflows", "EDI 214 status updates — 15-minute interval transmission across automotive OEMs", "Proprietary X12 parser built — in-house EDI parsing and map/transform engine", "AI / BI / RPA practices formalised — embedded in live client delivery"],                outcome: "Proprietary EDI engine operating at 99.1% transaction success. Cleo Phase 2 migration fully scoped." },
  { year: "2025–26", tag: "Scale",         headline: "Managed staffing. US delivery model. The capability clients can't build.", bullets: ["EDI Analyst staffing model — dedicated EST night-shift, day-one productivity", "Phase 2 Cleo migration — Kleinschmidt → Cleo, full cutover ownership", "Bundled resource delivery — Cloud Engineer + Developer + EDI Analyst packages", "BD market intelligence activated — Sterling ~1,700 on-premise accounts targeted"],     outcome: "Operational across 5 verticals. Staffing model live. Cleo migration underway. US client pipeline active." },
];

const platforms = [
  { name: "IBM Sterling B2B Integrator", years: "5+", vertical: "Freight & Logistics",  depth: "Maps, BPs, FileGateway, SFGs, DDF→XSD conversion, full platform upgrade" },
  { name: "Cleo Integration Cloud",      years: "3+", vertical: "Transportation / Auto", depth: "Harmony, Clarify, Cloud Studio — active migration from legacy EDI platforms" },
  { name: "Kleinschmidt EDI Platform",   years: "2+", vertical: "Automotive Logistics",  depth: "204/214 transaction support for automotive OEM/LLP partner ecosystems" },
  { name: "Oracle Integration Cloud",    years: "3+", vertical: "Enterprise ERP",        depth: "32 integrations monitored, Oracle Fusion AP/AR/Accruals, L1 production support" },
  { name: "MuleSoft Anypoint Platform",  years: "2+", vertical: "Multi-vertical",        depth: "API-led integration design, runtime management, hybrid connectivity" },
  { name: "Boomi AtomSphere",            years: "2+", vertical: "Retail / Manufacturing",depth: "Cloud-native EDI connectors, process automation, partner onboarding" },
];

const roadmap = [
  { num: "01", label: "Proprietary EDI Platform",            desc: "In-house X12 parser and AI-powered map/transform engine. Eliminates manual mapping errors and accelerates trading partner go-lives." },
  { num: "02", label: "Legacy Platform Migration",           desc: "Full migration delivery from legacy EDI platforms to Cleo Integration Cloud — gap analysis, map rebuild, AS2/SFTP cutover, UAT, zero-disruption go-live." },
  { num: "03", label: "AI-Augmented OIC Managed Services",  desc: "Predictive monitoring across Oracle Fusion integration environments — anomaly detection, auto-triage, SLA forecasting for enterprise ERP clients." },
  { num: "04", label: "US Managed Staffing Model",           desc: "Dedicated EDI Analysts embedded in US clients' operations — EST night-shift, offshore delivery, day-one productivity with no recruitment overhead." },
  { num: "05", label: "Automotive EDI Centre of Excellence", desc: "Reusable EDI assets for 204/214/850/856 flows across OEM and LLP partner ecosystems — proven across automotive logistics engagements." },
];

const values = [
  { heading: "Depth over breadth.", desc: "We would rather be genuinely excellent at integration than average at everything. Specialist credibility takes years to build and one piece of sloppy work to lose." },
  { heading: "Honesty over hype.",  desc: "We tell clients what is true, including what they don't want to hear. If your current setup will cause problems, we say so. If a platform isn't right for your needs, we say that too." },
  { heading: "Accountability.",     desc: "When we take on your work, we own the outcome. Not the deliverable — the outcome. There is a difference, and it matters." },
];

// ─── Hero integration network (same as home hero, subtle) ─────────────────────
function HeroNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const LABELS = ["SAP","EDI","ERP","API","B2B","MFT","Cloud","Oracle","AWS","Partners"];
    const POS: [number,number][] = [[.06,.12],[.9,.09],[.04,.52],[.93,.48],[.12,.88],[.85,.85],[.48,.04],[.28,.8],[.7,.1],[.75,.72]];
    const CONNS: [number,number][] = [[0,2],[0,6],[1,3],[1,8],[2,7],[3,9],[4,7],[5,9],[6,8],[0,8],[1,6],[4,9]];
    type N={x:number;y:number;vx:number;vy:number;label:string;r:number;phase:number;conns:number[]};
    type P={sx:number;sy:number;dx:number;dy:number;t:number;spd:number};
    let W=0,H=0,nodes:N[]=[],packets:P[]=[],id:number,frame=0,t=0;
    const build=()=>{
      W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight;
      nodes=POS.map((p,i)=>({x:p[0]*W,y:p[1]*H,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,
        label:LABELS[i],r:16,phase:Math.random()*Math.PI*2,conns:[]}));
      CONNS.forEach(([a,b])=>nodes[a].conns.push(b));
    };
    const spawn=()=>{
      const s=nodes[Math.floor(Math.random()*nodes.length)];
      if(!s.conns.length)return;
      const d=nodes[s.conns[Math.floor(Math.random()*s.conns.length)]];
      packets.push({sx:s.x,sy:s.y,dx:d.x,dy:d.y,t:0,spd:.007+Math.random()*.007});
    };
    const draw=()=>{
      ctx.clearRect(0,0,W,H); t+=.007;
      nodes.forEach(n=>{n.x+=n.vx;n.y+=n.vy;if(n.x<n.r||n.x>W-n.r)n.vx*=-1;if(n.y<n.r||n.y>H-n.r)n.vy*=-1;});
      ctx.setLineDash([3,9]);
      nodes.forEach((n,i)=>n.conns.forEach(j=>{
        const m=nodes[j];
        ctx.globalAlpha=.045+Math.sin(t+i*.8)*.015;ctx.strokeStyle="#1A73E8";ctx.lineWidth=.7;
        ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(m.x,m.y);ctx.stroke();
      }));
      ctx.setLineDash([]);ctx.globalAlpha=1;
      packets=packets.filter(p=>{
        p.t+=p.spd;if(p.t>1)return false;
        const x=p.sx+(p.dx-p.sx)*p.t,y=p.sy+(p.dy-p.sy)*p.t;
        const fade=p.t<.08?p.t/.08:p.t>.88?(1-p.t)/.12:1;
        for(let i=1;i<=4;i++){const tt=Math.max(0,p.t-i*.018);ctx.globalAlpha=((4-i)/8)*.3*fade;ctx.fillStyle="#1A73E8";ctx.beginPath();ctx.arc(p.sx+(p.dx-p.sx)*tt,p.sy+(p.dy-p.sy)*tt,Math.max(.4,1.8-i*.25),0,Math.PI*2);ctx.fill();}
        ctx.globalAlpha=fade*.8;ctx.fillStyle="#1A73E8";ctx.shadowColor="#1A73E8";ctx.shadowBlur=4;
        ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1;
        return true;
      });
      nodes.forEach(n=>{
        const b=Math.sin(t*1.1+n.phase)*1.5;
        ctx.globalAlpha=.045+Math.sin(t+n.phase)*.012;ctx.strokeStyle="#1A73E8";ctx.lineWidth=.8;
        ctx.beginPath();ctx.arc(n.x,n.y,n.r+6+b,0,Math.PI*2);ctx.stroke();
        ctx.globalAlpha=1;ctx.fillStyle="#fff";ctx.strokeStyle="rgba(11,31,58,.16)";ctx.lineWidth=.8;
        ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fill();ctx.stroke();
        ctx.fillStyle="rgba(11,31,58,.55)";ctx.font="500 8px system-ui";
        ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(n.label,n.x,n.y);
      });
      ctx.globalAlpha=1;frame++;if(frame%65===0)spawn();id=requestAnimationFrame(draw);
    };
    build();window.addEventListener("resize",build);
    for(let i=0;i<4;i++)setTimeout(spawn,i*450);draw();
    return()=>{cancelAnimationFrame(id);window.removeEventListener("resize",build);};
  },[]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:0}} />;
}

// ─── Scroll-count number ──────────────────────────────────────────────────────
function CountUp({ to, suffix="" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting&&!done){setDone(true);}},{threshold:.5});
    obs.observe(el);return()=>obs.disconnect();
  },[done]);
  useEffect(()=>{
    if(!done)return;
    let cur=0;const steps=40;const inc=to/steps;
    const id=setInterval(()=>{cur++;setVal(Math.min(parseFloat((cur*inc).toFixed(to<10?1:0)),to));if(cur>=steps)clearInterval(id);},28);
    return()=>clearInterval(id);
  },[done,to]);
  return <div ref={ref} className="tabular-nums">{val}{suffix}</div>;
}

// ─── Hero stat card ───────────────────────────────────────────────────────────
function HeroStat({ val, label, sub, isLive=false }: { val: React.ReactNode; label: string; sub?: string; isLive?: boolean }) {
  return (
    <div className="bg-white/80 border border-[#0B1F3A]/[0.09] rounded-xl p-5 backdrop-blur-sm">
      <div className="text-2xl font-light text-[#0B1F3A] tracking-tight mb-1 tabular-nums">{val}</div>
      <div className="text-[9.5px] text-[#0B1F3A]/45 uppercase tracking-wide">{label}</div>
      {sub && (
        <div className="flex items-center gap-1.5 mt-2">
          {isLive && (
            <motion.span className="w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0"
              animate={{boxShadow:["0 0 0 0px rgba(16,185,129,.5)","0 0 0 4px rgba(16,185,129,0)","0 0 0 0px rgba(16,185,129,.5)"]}}
              transition={{duration:1.8,repeat:Infinity}} />
          )}
          <span className="text-[9px] text-[#0B1F3A]/30">{sub}</span>
        </div>
      )}
    </div>
  );
}

// ─── Live transaction counter for hero ───────────────────────────────────────
function LiveTx() {
  const [n, setN] = useState(14382);
  useEffect(()=>{const id=setInterval(()=>setN(c=>c+Math.floor(Math.random()*4)+1),1500);return()=>clearInterval(id);},[]);
  return <>{n.toLocaleString()}</>;
}

// ─── Journey row — expand on click ───────────────────────────────────────────
function JourneyRow({ item, index }: { item: typeof journey[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rowRef    = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d")!;
    let id:number;
    type Pkt={p:number;spd:number};
    let pkts:Pkt[]=[{p:index*.18,spd:.006+index*.001}];
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
        const fade=pk.p<.05?pk.p/.05:pk.p>.9?(1-pk.p)/.1:1;
        ctx.globalAlpha=fade*.55;ctx.fillStyle="#1A73E8";ctx.shadowColor="#1A73E8";ctx.shadowBlur=4;
        ctx.beginPath();ctx.arc(x,canvas.height/2,2.5,0,Math.PI*2);ctx.fill();
        ctx.shadowBlur=0;ctx.globalAlpha=1;return pk;
      });
      id=requestAnimationFrame(draw);
    };
    draw();return()=>cancelAnimationFrame(id);
  },[index]);

  // tag colours by era
  const tagColors: Record<string,string> = {
    Foundation:"rgba(26,115,232,0.06)", Endurance:"rgba(26,115,232,0.06)",
    Expansion:"rgba(26,115,232,0.09)", "Enterprise Scale":"rgba(26,115,232,0.12)",
    "US Market":"rgba(26,115,232,0.12)", Intelligence:"rgba(26,115,232,0.15)", Scale:"rgba(26,115,232,0.18)",
  };

  return (
    <motion.div ref={rowRef} variants={staggerItem}
      className="border-b border-[#0B1F3A]/[0.07] relative overflow-hidden"
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
      <motion.div className="absolute inset-0 bg-[#1A73E8]/[0.02]" initial={{scaleX:0,originX:0}}
        animate={{scaleX:hovered?1:0}} transition={{duration:.32,ease:[.16,1,.3,1]}} />
      <div className="absolute bottom-0 left-0 right-0" style={{height:2,background:"rgba(26,115,232,0.05)",overflow:"hidden"}}>
        <canvas ref={canvasRef} className="absolute top-0 left-0" />
      </div>

      <div className="grid md:grid-cols-12 gap-6 py-7 relative cursor-pointer"
        onClick={()=>setExpanded(e=>!e)}>
        {/* year + era tag */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <motion.span className="text-sm font-medium"
            animate={{color:hovered?"#1A73E8":"rgba(11,31,58,0.85)"}}>
            {item.year}
          </motion.span>
          <span className="inline-block text-[8.5px] uppercase tracking-wide px-2 py-0.5 rounded-full w-fit"
            style={{background:tagColors[item.tag]||"rgba(26,115,232,0.06)",color:"#1A73E8"}}>
            {item.tag}
          </span>
        </div>

        {/* headline + underline */}
        <div className="md:col-span-8">
          <motion.h3 className="text-sm font-medium leading-snug"
            animate={{color:hovered?"#1A73E8":"#0B1F3A"}}>{item.headline}</motion.h3>
          <div className="mt-1.5 h-px w-full bg-[#0B1F3A]/[0.06] overflow-hidden">
            <motion.div className="h-full bg-[#1A73E8] origin-left"
              animate={{scaleX:hovered?1:0}} transition={{duration:.45,ease:[.16,1,.3,1]}} />
          </div>
        </div>

        {/* expand icon */}
        <div className="md:col-span-2 flex justify-end items-start">
          <motion.div
            className="w-7 h-7 rounded-full border border-[#1A73E8]/20 flex items-center justify-center text-[#1A73E8]/50 text-sm"
            animate={{rotate:expanded?45:0,background:hovered?"rgba(26,115,232,0.06)":"#fff",borderColor:hovered?"rgba(26,115,232,0.35)":"rgba(26,115,232,0.2)"}}
            transition={{duration:.2}}>
            +
          </motion.div>
        </div>
      </div>

      {/* expanded body */}
      <motion.div initial={{height:0,opacity:0}}
        animate={{height:expanded?"auto":0,opacity:expanded?1:0}}
        transition={{duration:.38,ease:[.16,1,.3,1]}} style={{overflow:"hidden"}}>
        <div className="grid md:grid-cols-12 gap-6 pb-8 relative">
          <div className="md:col-span-2" />
          <div className="md:col-span-6 space-y-2">
            {item.bullets.map((b,i)=>(
              <motion.div key={i} className="flex items-start gap-2 text-xs text-[#475569]"
                initial={{opacity:0,x:-8}} animate={{opacity:expanded?1:0,x:expanded?0:-8}}
                transition={{duration:.28,delay:i*.06}}>
                <span className="text-[#1A73E8]/40 mt-0.5 flex-shrink-0">▸</span>{b}
              </motion.div>
            ))}
          </div>
          <div className="md:col-span-4">
            <div className="bg-[#1A73E8]/[0.03] border border-[#1A73E8]/[0.1] rounded-xl p-4">
              <p className="text-[8.5px] uppercase tracking-wide text-[#1A73E8] mb-2">Outcome</p>
              <p className="text-xs text-[#475569] leading-relaxed italic">{item.outcome}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Platform row ─────────────────────────────────────────────────────────────
function PlatformRow({ p }: { p: typeof platforms[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div variants={staggerItem}
      className="grid md:grid-cols-12 gap-6 py-5 border-b border-[#0B1F3A]/[0.07] relative overflow-hidden cursor-default"
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
      <motion.div className="absolute inset-0 bg-[#1A73E8]/[0.02]" initial={{scaleX:0,originX:0}}
        animate={{scaleX:hovered?1:0}} transition={{duration:.28,ease:[.16,1,.3,1]}} />
      <div className="md:col-span-4 relative">
        <motion.div className="text-sm font-medium"
          animate={{color:hovered?"#1A73E8":"#0B1F3A"}}>{p.name}</motion.div>
        <div className="mt-1 h-px w-full bg-[#0B1F3A]/[0.06] overflow-hidden">
          <motion.div className="h-full bg-[#1A73E8] origin-left"
            animate={{scaleX:hovered?1:0}} transition={{duration:.4,ease:[.16,1,.3,1]}} />
        </div>
      </div>
      <div className="md:col-span-1 relative">
        <span className="text-xs text-[#1A73E8] font-medium">{p.years}</span>
      </div>
      <div className="md:col-span-3 relative">
        <span className="text-xs text-[#475569]">{p.vertical}</span>
      </div>
      <div className="md:col-span-4 relative">
        <p className="text-xs text-[#475569] leading-relaxed">{p.depth}</p>
      </div>
    </motion.div>
  );
}

// ─── Roadmap card ─────────────────────────────────────────────────────────────
function RoadmapCard({ item }: { item: typeof roadmap[0] }) {
  const [hovered,setHovered]=useState(false);
  const glowX=useMotionValue(50),glowY=useMotionValue(50),glowOp=useMotionValue(0);
  const glowBg=useTransform([glowX,glowY],([x,y])=>`radial-gradient(ellipse at ${x}% ${y}%, rgba(26,115,232,0.06) 0%, transparent 65%)`);
  const shimX=useMotionValue(-100);
  const shimT=useTransform(shimX,v=>`${v}%`);
  const onMove=(e:React.MouseEvent<HTMLDivElement>)=>{
    const r=e.currentTarget.getBoundingClientRect();
    glowX.set(((e.clientX-r.left)/r.width)*100);glowY.set(((e.clientY-r.top)/r.height)*100);
    animate(glowOp,1,{duration:.25});
  };
  const onEnter=useCallback(()=>{setHovered(true);shimX.set(-100);animate(shimX,200,{duration:.5,ease:"easeInOut"});},[shimX]);
  const onLeave=()=>{setHovered(false);animate(glowOp,0,{duration:.3});};
  return (
    <motion.div variants={staggerItem}
      className="border border-[#0B1F3A]/10 rounded-xl p-6 bg-white relative overflow-hidden cursor-default"
      whileHover={{y:-3,borderColor:"rgba(26,115,232,0.3)",boxShadow:"0 8px 28px rgba(26,115,232,0.1)",transition:{duration:.18,ease:EASE}}}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="absolute inset-0 pointer-events-none rounded-xl" style={{opacity:glowOp,background:glowBg}} />
      <motion.div className="absolute top-0 pointer-events-none"
        style={{left:0,width:"55%",height:1,background:"linear-gradient(90deg,transparent,rgba(26,115,232,0.4),transparent)",x:shimT}} />
      <motion.div className="absolute top-0 left-0 right-0 h-px"
        style={{background:"linear-gradient(90deg,transparent,rgba(26,115,232,0.35),transparent)"}}
        animate={{opacity:hovered?1:0}} transition={{duration:.2}} />
      <div className="relative">
        <div className="text-[9px] text-[#1A73E8]/40 mb-3 font-medium tracking-wide">{item.num}</div>
        <h3 className="text-sm font-medium text-[#0B1F3A] mb-2">{item.label}</h3>
        <p className="text-xs text-[#475569] leading-relaxed">{item.desc}</p>
        <motion.div className="h-px bg-[#1A73E8] origin-left mt-4"
          animate={{scaleX:hovered?1:0}} transition={{duration:.4,ease:[.16,1,.3,1]}} />
      </div>
    </motion.div>
  );
}

// ─── Value card ───────────────────────────────────────────────────────────────
function ValueCard({ item }: { item: typeof values[0] }) {
  const [hovered,setHovered]=useState(false);
  const glowX=useMotionValue(50),glowY=useMotionValue(50),glowOp=useMotionValue(0);
  const glowBg=useTransform([glowX,glowY],([x,y])=>`radial-gradient(ellipse at ${x}% ${y}%, rgba(26,115,232,0.06) 0%, transparent 65%)`);
  const shimX=useMotionValue(-100);
  const shimT=useTransform(shimX,v=>`${v}%`);
  const onMove=(e:React.MouseEvent<HTMLDivElement>)=>{
    const r=e.currentTarget.getBoundingClientRect();
    glowX.set(((e.clientX-r.left)/r.width)*100);glowY.set(((e.clientY-r.top)/r.height)*100);
    animate(glowOp,1,{duration:.25});
  };
  const onEnter=useCallback(()=>{setHovered(true);shimX.set(-100);animate(shimX,200,{duration:.5,ease:"easeInOut"});},[shimX]);
  const onLeave=()=>{setHovered(false);animate(glowOp,0,{duration:.3});};
  return (
    <motion.div variants={staggerItem}
      className="border border-[#0B1F3A]/10 rounded-xl p-8 bg-white space-y-3 relative overflow-hidden cursor-default"
      whileHover={{y:-4,borderColor:"rgba(26,115,232,0.3)",boxShadow:"0 10px 36px rgba(26,115,232,0.1)",transition:{duration:.2,ease:EASE}}}
      onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="absolute inset-0 pointer-events-none rounded-xl" style={{opacity:glowOp,background:glowBg}} />
      <motion.div className="absolute top-0 pointer-events-none"
        style={{left:0,width:"55%",height:1,background:"linear-gradient(90deg,transparent,rgba(26,115,232,0.4),transparent)",x:shimT}} />
      <motion.div className="absolute top-0 left-0 right-0 h-px"
        style={{background:"linear-gradient(90deg,transparent,rgba(26,115,232,0.35),transparent)"}}
        animate={{opacity:hovered?1:0}} transition={{duration:.2}} />
      <h3 className="text-base font-medium text-[#0B1F3A] relative">{item.heading}</h3>
      <p className="text-sm text-[#475569] leading-relaxed relative">{item.desc}</p>
      <motion.div className="h-px bg-[#1A73E8] origin-left"
        animate={{scaleX:hovered?1:0}} transition={{duration:.4,ease:[.16,1,.3,1]}} />
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function AboutPage() {
  return (
    <>
      {/* ── Hero — full-width with live network + 4 stat cards ── */}
      <section className="pt-36 pb-20 px-4 relative overflow-hidden bg-white">
        <HeroNetwork />

        {/* radial vignette so text reads over network */}
        <div className="absolute inset-0 pointer-events-none"
          style={{background:"radial-gradient(ellipse 70% 80% at 30% 50%, rgba(255,255,255,0.92) 40%, transparent 100%)",zIndex:1}} />

        <div className="max-w-6xl mx-auto relative" style={{zIndex:2}}>
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* LEFT — copy */}
            <div className="space-y-7">
              <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide"
                initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.4,ease:EASE,delay:.05}}>
                About Us
              </motion.p>
              <motion.h1 className="text-5xl md:text-6xl font-light text-[#0B1F3A] leading-[1.06] tracking-tight"
                style={{letterSpacing:"-.025em"}}
                initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6,ease:EASE,delay:.12}}>
                The integration specialists, <span className="text-[#1A73E8]">evolving into a modern enterprise technology partner.</span>
              </motion.h1>
              <motion.p className="text-lg text-[#475569] leading-relaxed"
                initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.5,ease:EASE,delay:.28}}>
                Founded in 2019. Built on IBM Sterling. Grown across six enterprise platforms, five verticals, and two continents.
              </motion.p>

              {/* year founded / specialists live pill */}
              <motion.div className="flex items-center gap-3 flex-wrap"
                initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.4,delay:.45}}>
                <div className="inline-flex items-center gap-2 text-[11px] text-[#475569] border border-[#0B1F3A]/10 rounded-full px-4 py-2">
                  <span className="font-medium text-[#1A73E8]">2019</span> — founded
                </div>
                <div className="inline-flex items-center gap-2 text-[11px] text-[#475569] border border-[#0B1F3A]/10 rounded-full px-4 py-2">
                  <motion.span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"
                    animate={{boxShadow:["0 0 0 0px rgba(16,185,129,.5)","0 0 0 4px rgba(16,185,129,0)","0 0 0 0px rgba(16,185,129,.5)"]}}
                    transition={{duration:1.8,repeat:Infinity}} />
                  <span className="font-medium text-[#1A73E8]">54</span> specialists
                </div>
                <div className="inline-flex items-center gap-2 text-[11px] text-[#475569] border border-[#0B1F3A]/10 rounded-full px-4 py-2">
                  <span className="font-medium text-[#1A73E8]">6</span> platforms
                </div>
              </motion.div>

              <motion.div className="flex flex-wrap gap-3 pt-1"
                initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.45,ease:EASE,delay:.58}}>
                <motion.div whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
                  <Link to="/contact" className="block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-lg hover:bg-[#155CC0] transition-colors"
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(26,115,232,0.28)";}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
                    Get in touch
                  </Link>
                </motion.div>
                <motion.div whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
                  <Link to="/company/leadership" className="block border border-[#1A73E8]/30 text-[#1A73E8] px-6 py-2.5 text-sm rounded-lg hover:bg-[#1A73E8]/[0.05] transition-colors">
                    Meet the team
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT — 4 stat cards with scroll-count numbers */}
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{opacity:0,x:20}} animate={{opacity:1,x:0}}
              transition={{duration:.7,ease:EASE,delay:.35}}>
              <HeroStat
                val={<LiveTx />}
                label="Transactions today" sub="Live" isLive />
              <HeroStat
                val={<CountUp to={99.1} suffix="%" />}
                label="Transaction success" sub="YTD average" />
              <HeroStat
                val={<CountUp to={45} suffix=" days" />}
                label="Sterling upgrade" sub="Industry norm: 90–120d" />
              <HeroStat
                val={<CountUp to={5} suffix="+ yrs" />}
                label="Longest engagement" sub="Active since 2019" />
              {/* full-width 5th card */}
              <div className="col-span-2 bg-white/80 border border-[#0B1F3A]/[0.09] rounded-xl px-5 py-4 flex items-center justify-between backdrop-blur-sm">
                <div className="text-sm font-medium text-[#0B1F3A]">ISO 27001 / SOC 2-class certified</div>
                <div className="flex items-center gap-1.5 text-[9px] text-[#0B1F3A]/38">
                  <motion.span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"
                    animate={{boxShadow:["0 0 0 0px rgba(16,185,129,.5)","0 0 0 4px rgba(16,185,129,0)","0 0 0 0px rgba(16,185,129,.5)"]}}
                    transition={{duration:1.8,repeat:Infinity}} />
                  Certified
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    

      {/* ── Platform expertise ── */}
      <section className="py-24 px-4 bg-[#1A73E8]/[0.02] border-t border-b border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Platform Expertise
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
              variants={fadeUp} custom={.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              What we have <span className="text-[#1A73E8]">actually delivered on.</span>
            </motion.h2>
          </div>
          <motion.div className="grid md:grid-cols-12 gap-6 pb-3 border-b border-[#0B1F3A]/10"
            variants={fadeUp} custom={.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {["Platform","Years","Vertical","Depth of Delivery"].map((h,i)=>(
              <div key={h} className={`text-[9px] text-[#1A73E8] uppercase tracking-wide ${i===0?"md:col-span-4":i===1?"md:col-span-1":i===2?"md:col-span-3":"md:col-span-4"}`}>{h}</div>
            ))}
          </motion.div>
          <motion.div className="space-y-0"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {platforms.map(p=><PlatformRow key={p.name} p={p} />)}
          </motion.div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              What We Stand For
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
              variants={fadeUp} custom={.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Three things we <span className="text-[#1A73E8]">do not compromise on.</span>
            </motion.h2>
          </div>
          <motion.div className="grid md:grid-cols-3 gap-6"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {values.map(item=><ValueCard key={item.heading} item={item} />)}
          </motion.div>
        </div>
      </section>

      {/* ── The Firm ── */}
      <section className="py-24 px-4 bg-[#1A73E8]/[0.02] border-t border-b border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide mb-4"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              The Firm
            </motion.p>
            <motion.h2 className="text-4xl font-normal text-[#0B1F3A] leading-tight tracking-tight mb-6"
              variants={fadeUp} custom={.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Small enough to care. <span className="text-[#1A73E8]">Disciplined enough to trust.</span>
            </motion.h2>
            <motion.p className="text-base text-[#475569] leading-relaxed"
              variants={fadeUpLarge} custom={.12} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              At 54 specialists, we are the size where senior people are genuinely on your engagement — not managing a team below them. That is a deliberate choice, not a constraint.
            </motion.p>
            <motion.p className="text-base text-[#475569] leading-relaxed mt-4"
              variants={fadeUpLarge} custom={.18} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Our size is our edge: fast to respond, senior throughout, and structurally unable to hide behind a support tier.
            </motion.p>
          </div>
          <motion.div className="space-y-0"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {[
              {label:"Founded",             value:"2019"},
              {label:"Team size",           value:"54 specialists"},
              {label:"Certification",       value:"ISO 27001 / SOC 2-class"},
              {label:"Transaction success", value:"99.1%"},
              {label:"EDI satisfaction YTD",value:"99.04%"},
              {label:"Platforms",           value:"IBM Sterling · Cleo · MuleSoft · Boomi · Apigee · Axway B2Bi"},
              {label:"Contact",             value:"sales@exceptionalsolutions.in  ·  +91 8074960598"},
            ].map((item)=>(
              <motion.div key={item.label} variants={staggerItem}
                className="py-4 border-b border-[#0B1F3A]/10 flex items-start justify-between gap-6">
                <span className="text-sm text-[#0B1F3A]/40 flex-shrink-0">{item.label}</span>
                <span className="text-sm text-[#0B1F3A] text-right">{item.value}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ── CTA ── */}
      <section className="py-24 px-4 border-t border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.h2 className="text-4xl font-normal text-[#0B1F3A] tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Get to know <span className="text-[#1A73E8]">the team.</span>
          </motion.h2>
          <motion.p className="text-base text-[#475569] max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Meet the senior specialists behind our work — and find out what it looks like to engage with us.
          </motion.p>
          <motion.div className="flex flex-wrap justify-center gap-3"
            variants={fadeUp} custom={.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <motion.div whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
              <Link to="/company/leadership" className="block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-lg hover:bg-[#155CC0] transition-colors"
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(26,115,232,0.28)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
                Meet the leadership team
              </Link>
            </motion.div>
            <motion.div whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
              <Link to="/contact" className="block border border-[#1A73E8]/30 text-[#1A73E8] px-6 py-2.5 text-sm rounded-lg hover:bg-[#1A73E8]/[0.05] transition-colors">
                Get in touch
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}