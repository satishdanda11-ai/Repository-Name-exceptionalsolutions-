import { motion, useTransform, useScroll, useSpring } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
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

const roadmap = [
  { num: "01", label: "Proprietary EDI Platform",            desc: "In-house X12 parser and AI-powered map/transform engine. Eliminates manual mapping errors and accelerates trading partner go-lives." },
  { num: "02", label: "Legacy Platform Migration",           desc: "Full migration delivery from legacy EDI platforms to Cleo Integration Cloud — gap analysis, map rebuild, AS2/SFTP cutover, UAT, zero-disruption go-live." },
  { num: "03", label: "AI-Augmented OIC Managed Services",  desc: "Predictive monitoring across Oracle Fusion integration environments — anomaly detection, auto-triage, SLA forecasting for enterprise ERP clients." },
  { num: "04", label: "US Managed Staffing Model",           desc: "Dedicated EDI Analysts embedded in US clients' operations — EST night-shift, offshore delivery, day-one productivity with no recruitment overhead." },
  { num: "05", label: "Automotive EDI Centre of Excellence", desc: "Reusable EDI assets for 204/214/850/856 flows across OEM and LLP partner ecosystems — proven across automotive logistics engagements." },
];

// ─── Hero integration network ─────────────────────────────────────────────────
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

// ─── Live transaction counter ─────────────────────────────────────────────────
function LiveTx() {
  const [n, setN] = useState(14382);
  useEffect(()=>{const id=setInterval(()=>setN(c=>c+Math.floor(Math.random()*4)+1),1500);return()=>clearInterval(id);},[]);
  return <>{n.toLocaleString()}</>;
}

// ─── Journey card (shared by left/right/mobile) ───────────────────────────────
function JourneyCard({ item, hovered, setHovered, expanded, setExpanded, tagColors, align }: {
  item: typeof journey[0];
  hovered: boolean; setHovered: (v: boolean) => void;
  expanded: boolean; setExpanded: (fn: (v: boolean) => boolean) => void;
  tagColors: Record<string, string>; align: "left" | "right";
}) {
  return (
    <motion.div
      className="bg-white border rounded-2xl overflow-hidden my-5 cursor-pointer"
      style={{ borderColor: hovered || expanded ? "rgba(26,115,232,0.3)" : "rgba(11,31,58,0.1)" }}
      animate={{
        boxShadow: hovered || expanded ? "0 14px 44px rgba(26,115,232,0.12)" : "0 1px 3px rgba(11,31,58,0.04)",
        y: hovered ? -3 : 0,
      }}
      transition={{ duration: 0.22, ease: EASE }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => setExpanded(e => !e)}>

      {/* top accent bar */}
      <div className="h-0.5 w-full bg-[#0B1F3A]/[0.05] overflow-hidden">
        <motion.div className="h-full bg-[#1A73E8] origin-left"
          animate={{ scaleX: hovered || expanded ? 1 : 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} />
      </div>

      <div className="p-6" style={{ textAlign: align === "right" ? "right" : "left" }}>
        <div className={`flex items-center gap-3 mb-3 ${align === "right" ? "justify-end" : ""}`}>
          <span className="text-2xl font-light tracking-tight"
            style={{ color: hovered || expanded ? "#1A73E8" : "#0B1F3A", letterSpacing: "-.02em" }}>
            {item.year}
          </span>
          <span className="inline-block text-[8.5px] uppercase tracking-wide px-2.5 py-1 rounded-full"
            style={{ background: tagColors[item.tag] || "rgba(26,115,232,0.06)", color: "#1A73E8" }}>
            {item.tag}
          </span>
        </div>

        <motion.h3 className="text-base font-medium leading-snug"
          animate={{ color: hovered || expanded ? "#1A73E8" : "#0B1F3A" }}>
          {item.headline}
        </motion.h3>

        <motion.div initial={false}
          animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: "hidden" }}>
          <div className="pt-4 space-y-2" style={{ textAlign: "left" }}>
            {item.bullets.map((b, i) => (
              <motion.div key={i} className="flex items-start gap-2 text-xs text-[#475569]"
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: expanded ? 1 : 0, x: expanded ? 0 : -8 }}
                transition={{ duration: 0.28, delay: i * 0.06 }}>
                <span className="text-[#1A73E8]/40 mt-0.5 flex-shrink-0">▸</span>{b}
              </motion.div>
            ))}
          </div>
          <div className="mt-4 bg-[#1A73E8]/[0.03] border border-[#1A73E8]/[0.1] rounded-xl p-4" style={{ textAlign: "left" }}>
            <p className="text-[8.5px] uppercase tracking-wide text-[#1A73E8] mb-2">Outcome</p>
            <p className="text-xs text-[#475569] leading-relaxed italic">{item.outcome}</p>
          </div>
        </motion.div>

        <div className={`flex items-center gap-1.5 mt-3 ${align === "right" ? "justify-end" : ""}`}>
          <span className="text-[10px] text-[#1A73E8]/60">{expanded ? "Show less" : "Read more"}</span>
          <motion.span className="text-[#1A73E8]/60 text-xs inline-flex"
            animate={{ rotate: expanded ? 45 : 0 }} transition={{ duration: 0.2 }}>+</motion.span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Journey row — scroll-reveal + alternating sides ──────────────────────────
function JourneyRow({ item, index }: { item: typeof journey[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(index === 0);
  const left = index % 2 === 0;

  const tagColors: Record<string,string> = {
    Foundation:"rgba(26,115,232,0.06)", Endurance:"rgba(26,115,232,0.06)",
    Expansion:"rgba(26,115,232,0.09)", "Enterprise Scale":"rgba(26,115,232,0.12)",
    "US Market":"rgba(26,115,232,0.12)", Intelligence:"rgba(26,115,232,0.15)", Scale:"rgba(26,115,232,0.18)",
  };
  const cardProps = { item, hovered, setHovered, expanded, setExpanded, tagColors };

  return (
    <motion.div
      className="relative md:grid md:grid-cols-[1fr_64px_1fr] md:gap-0 md:items-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>

      {/* LEFT slot */}
      <div className="hidden md:block">
        {left && <JourneyCard {...cardProps} align="right" />}
      </div>

      {/* CENTER node */}
      <div className="hidden md:flex justify-center">
        <motion.div
          className="relative z-10 rounded-full flex items-center justify-center"
          style={{ width: 44, height: 44, background: hovered || expanded ? "#1A73E8" : "#fff" }}
          animate={{
            boxShadow: hovered || expanded
              ? "0 0 0 6px rgba(26,115,232,0.12), 0 6px 20px rgba(26,115,232,0.25)"
              : "0 0 0 4px rgba(26,115,232,0.06)",
          }}
          transition={{ duration: 0.3 }}>
          <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: "#1A73E8" }} />
          <span className="text-[11px] font-semibold tabular-nums relative z-10"
            style={{ color: hovered || expanded ? "#fff" : "#1A73E8" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </motion.div>
      </div>

      {/* RIGHT slot */}
      <div className="hidden md:block">
        {!left && <JourneyCard {...cardProps} align="left" />}
      </div>

      {/* MOBILE */}
      <div className="md:hidden">
        <JourneyCard {...cardProps} align="left" />
      </div>
    </motion.div>
  );
}

// ─── Scroll-driven timeline section ───────────────────────────────────────────
function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const spineScale = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const cometTop = useTransform(spineScale, v => `${v * 100}%`);

  return (
    <section id="timeline" className="py-28 px-4 scroll-mt-20 relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.p className="text-xs text-[#1A73E8] uppercase tracking-widest mb-4"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            The Journey — 2019 to 2026
          </motion.p>
          <motion.h2 className="text-4xl md:text-5xl font-light text-[#0B1F3A] leading-[1.08] tracking-tight"
            style={{letterSpacing:"-.02em"}}
            variants={fadeUp} custom={.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Real work. Real years. <span className="text-[#1A73E8]">Real outcomes.</span>
          </motion.h2>
          <motion.p className="text-sm text-[#475569] mt-4"
            variants={fadeUp} custom={.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Seven chapters of deliberate growth. Scroll to follow the path — click any year for the detail.
          </motion.p>
        </div>

        <div ref={ref} className="relative">
          {/* desktop spine */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2" style={{ width: 2, zIndex: 0 }}>
            <div className="absolute inset-0" style={{ background: "rgba(26,115,232,0.1)" }} />
            <motion.div className="absolute left-0 right-0 top-0 bottom-0 origin-top"
              style={{ scaleY: spineScale, background: "linear-gradient(180deg,#1A73E8,#439FF7)" }} />
            <motion.div className="absolute -translate-x-1/2 left-1/2" style={{ top: cometTop }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#1A73E8", boxShadow: "0 0 12px 3px rgba(26,115,232,0.5)" }} />
            </motion.div>
          </div>
          {/* mobile spine */}
          <div className="md:hidden absolute left-0 top-0 bottom-0" style={{ width: 2 }}>
            <div className="absolute inset-0" style={{ background: "rgba(26,115,232,0.1)" }} />
            <motion.div className="absolute left-0 right-0 top-0 bottom-0 origin-top"
              style={{ scaleY: spineScale, background: "linear-gradient(180deg,#1A73E8,#439FF7)" }} />
          </div>

          <div className="relative md:pl-0 pl-6">
            {journey.map((item, i) => <JourneyRow key={item.year} item={item} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Roadmap expanding accordion ──────────────────────────────────────────────
// Stacked full-width rows on the dark band. The active row expands to reveal its
// detail; others collapse to a slim bar. Hover to open, auto-advances on a timer.
function RoadmapAccordion() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    obs.observe(el); return () => obs.disconnect();
  }, []);

  // auto-advance while in view
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setActive(a => (a + 1) % roadmap.length), 3400);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <section ref={ref} className="py-28 px-4 relative overflow-hidden" style={{ background: "#0B1F3A" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 50% 60% at 80% 15%, rgba(26,115,232,0.2) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 10% 90%, rgba(67,159,247,0.13) 0%, transparent 70%)",
      }} />

      <div className="max-w-5xl mx-auto relative" style={{ zIndex: 1 }}>
        <div className="max-w-2xl mb-16">
          <motion.p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#439FF7" }}
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Pipeline & Roadmap
          </motion.p>
          <motion.h2 className="text-4xl md:text-5xl font-light text-white leading-[1.08] tracking-tight"
            style={{letterSpacing:"-.02em"}}
            variants={fadeUp} custom={.05} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Where we are <span style={{ color: "#439FF7" }}>heading next.</span>
          </motion.h2>
          <motion.p className="text-base text-white/55 mt-4 leading-relaxed"
            variants={fadeUpLarge} custom={.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Five initiatives in active development. Hover a row to open it.
          </motion.p>
        </div>

        <motion.div className="space-y-3"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
          {roadmap.map((item, i) => {
            const isActive = active === i;
            return (
              <motion.div key={item.num} variants={staggerItem}
                className="rounded-2xl overflow-hidden cursor-pointer relative"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                animate={{
                  backgroundColor: isActive ? "rgba(67,159,247,0.08)" : "rgba(255,255,255,0.03)",
                  borderColor: isActive ? "rgba(67,159,247,0.4)" : "rgba(255,255,255,0.1)",
                }}
                transition={{ duration: 0.4, ease: EASE }}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}>

                {/* left accent bar that grows when active */}
                <motion.div className="absolute left-0 top-0 bottom-0 origin-top"
                  style={{ width: 3, background: "linear-gradient(180deg,#439FF7,#1A73E8)" }}
                  animate={{ scaleY: isActive ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />

                {/* header row — always visible */}
                <div className="flex items-center gap-5 px-7 py-5">
                  <motion.span className="text-2xl font-light tabular-nums flex-shrink-0"
                    style={{ letterSpacing: "-.02em" }}
                    animate={{ color: isActive ? "#439FF7" : "rgba(67,159,247,0.4)" }}
                    transition={{ duration: 0.3 }}>
                    {item.num}
                  </motion.span>
                  <motion.h3 className="text-base md:text-lg font-medium flex-1 leading-snug"
                    animate={{ color: isActive ? "#fff" : "rgba(255,255,255,0.65)" }}
                    transition={{ duration: 0.3 }}>
                    {item.label}
                  </motion.h3>
                  {/* chevron / plus indicator */}
                  <motion.div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ border: "1px solid rgba(67,159,247,0.3)" }}
                    animate={{
                      rotate: isActive ? 90 : 0,
                      backgroundColor: isActive ? "rgba(67,159,247,0.15)" : "transparent",
                    }}
                    transition={{ duration: 0.3 }}>
                    <span className="text-sm" style={{ color: "#439FF7" }}>›</span>
                  </motion.div>
                </div>

                {/* expanding body */}
                <motion.div initial={false}
                  animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: "hidden" }}>
                  <div className="px-7 pb-6 pl-[68px]">
                    <p className="text-sm text-white/60 leading-relaxed max-w-2xl">{item.desc}</p>
                    {/* progress shimmer line */}
                    <div className="mt-4 h-px max-w-md" style={{ background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                      <motion.div className="h-full origin-left" style={{ background: "#439FF7" }}
                        initial={{ scaleX: 0 }} animate={{ scaleX: isActive ? 1 : 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function OurJourneyPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProg } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const netY = useTransform(heroProg, [0, 1], [0, -80]);
  const netOpacity = useTransform(heroProg, [0, 1], [1, 0.2]);
  const copyY = useTransform(heroProg, [0, 1], [0, 60]);

  return (
    <>
      {/* ── Hero — parallax network + stat cards ── */}
      <section ref={heroRef} className="pt-36 pb-20 px-4 relative overflow-hidden bg-white">
        <motion.div className="absolute inset-0" style={{ y: netY, opacity: netOpacity, zIndex: 0 }}>
          <HeroNetwork />
        </motion.div>

        <div className="absolute inset-0 pointer-events-none"
          style={{background:"radial-gradient(ellipse 70% 80% at 30% 50%, rgba(255,255,255,0.92) 40%, transparent 100%)",zIndex:1}} />

        <motion.div className="max-w-6xl mx-auto relative" style={{zIndex:2, y: copyY}}>
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* LEFT — copy */}
            <div className="space-y-7">
              <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide"
                initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.4,ease:EASE,delay:.05}}>
                Our Journey
              </motion.p>
              <motion.h1 className="text-5xl md:text-6xl font-light text-[#0B1F3A] leading-[1.06] tracking-tight"
                style={{letterSpacing:"-.025em"}}
                initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6,ease:EASE,delay:.12}}>
                Seven years of <span className="text-[#1A73E8]">real work, real outcomes.</span>
              </motion.h1>
              <motion.p className="text-lg text-[#475569] leading-relaxed"
                initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.5,ease:EASE,delay:.28}}>
                From a single-platform integration practice in 2019 to a multi-vertical enterprise technology partner across six platforms and two continents — here's how we got here.
              </motion.p>

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
                  <a href="#timeline" className="block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-lg hover:bg-[#155CC0] transition-colors"
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(26,115,232,0.28)";}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
                    Explore the timeline
                  </a>
                </motion.div>
                <motion.div whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
                  <Link to="/contact" className="block border border-[#1A73E8]/30 text-[#1A73E8] px-6 py-2.5 text-sm rounded-lg hover:bg-[#1A73E8]/[0.05] transition-colors">
                    Get in touch
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT — stat cards */}
            <motion.div className="grid grid-cols-2 gap-3"
              initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{duration:.7,ease:EASE,delay:.35}}>
              <HeroStat val={<LiveTx />} label="Transactions today" sub="Live" isLive />
              <HeroStat val={<CountUp to={99.1} suffix="%" />} label="Transaction success" sub="YTD average" />
              <HeroStat val={<CountUp to={45} suffix=" days" />} label="Sterling upgrade" sub="Industry norm: 90–120d" />
              <HeroStat val={<CountUp to={5} suffix="+ yrs" />} label="Longest engagement" sub="Active since 2019" />
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
        </motion.div>
      </section>

      {/* ── Our Story ── */}
      <section className="py-24 px-4 bg-[#1A73E8]/[0.02] border-t border-b border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div className="space-y-5">
            <motion.p className="text-xs text-[#1A73E8] uppercase tracking-wide"
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Our Story
            </motion.p>
            <motion.h2 className="text-3xl font-normal text-[#0B1F3A] leading-tight tracking-tight"
              variants={fadeUp} custom={.04} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
              Integration specialists, <span className="text-[#1A73E8]">broadening with intent.</span>
            </motion.h2>
            {["Exceptional Solutions was founded in 2019. We built our reputation on deep, dependable integration and technology delivery — the kind of work enterprises trust to specialists.",
              "Today we are 54 specialists, and we are growing that foundation deliberately: bringing modern AI, data and cloud capability to the same enterprise clients who rely on us to keep their systems connected.",
              "We are not a generalist IT shop chasing every trend. We are integration specialists, broadening with intent."
            ].map((txt,i)=>(
              <motion.p key={i} className="text-base text-[#334155] leading-relaxed"
                variants={fadeUpLarge} custom={i*.06} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
                {txt}
              </motion.p>
            ))}
          </div>

          <motion.div className="space-y-3"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            {[
              {metric:"99.04%", label:"EDI satisfaction YTD"},
              {metric:"5+",     label:"Years — longest active partnership"},
              {metric:"54",     label:"Specialists across 5 verticals"},
              {metric:"45d",    label:"Sterling upgrade (industry norm 90–120d)"},
              {metric:"32",     label:"Oracle Fusion integrations monitored"},
              {metric:"9/10",   label:"Client ratings across multiple business units"},
            ].map((item)=>(
              <motion.div key={item.label} variants={staggerItem}
                className="border border-[#0B1F3A]/10 rounded-lg p-5 bg-white flex items-center gap-5 relative overflow-hidden cursor-default"
                whileHover={{y:-2,borderColor:"rgba(26,115,232,0.3)",boxShadow:"0 5px 18px rgba(26,115,232,0.08)",transition:{duration:.18,ease:EASE}}}>
                <motion.div className="absolute inset-0 bg-[#1A73E8]/[0.018] origin-left" style={{scaleX:0}}
                  whileHover={{scaleX:1}} transition={{duration:.3,ease:[.16,1,.3,1]}} />
                <div className="text-xl font-light text-[#1A73E8] w-24 flex-shrink-0 tabular-nums relative">{item.metric}</div>
                <div className="text-sm text-[#475569] relative">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Journey timeline — SHOWPIECE ── */}
      <TimelineSection />

      {/* ── Roadmap — expanding accordion ── */}
      <RoadmapAccordion />

      {/* ── CTA ── */}
      <section className="py-24 px-4 border-t border-[#0B1F3A]/10">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.h2 className="text-4xl font-normal text-[#0B1F3A] tracking-tight"
            variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Want to be part of <span className="text-[#1A73E8]">the next chapter?</span>
          </motion.h2>
          <motion.p className="text-base text-[#475569] max-w-xl mx-auto leading-relaxed"
            variants={fadeUpLarge} custom={.1} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            Whether you're an enterprise looking for a dependable integration partner or a specialist who takes the work seriously — let's talk.
          </motion.p>
          <motion.div className="flex flex-wrap justify-center gap-3"
            variants={fadeUp} custom={.2} initial="hidden" whileInView="visible" viewport={VIEWPORT}>
            <motion.div whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
              <Link to="/contact" className="block bg-[#1A73E8] text-white px-6 py-2.5 text-sm rounded-lg hover:bg-[#155CC0] transition-colors"
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(26,115,232,0.28)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none";}}>
                Get in touch
              </Link>
            </motion.div>
            <motion.div whileHover={{y:-3}} transition={{duration:.18,ease:EASE}}>
              <Link to="/company/careers" className="block border border-[#1A73E8]/30 text-[#1A73E8] px-6 py-2.5 text-sm rounded-lg hover:bg-[#1A73E8]/[0.05] transition-colors">
                View careers
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}