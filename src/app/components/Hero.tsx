import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE } from "../lib/animations";

interface Node { x:number;y:number;vx:number;vy:number;label:string;r:number;phase:number;conns:number[] }
interface Packet { sx:number;sy:number;dx:number;dy:number;t:number;spd:number }

function IntegrationNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const LABELS = ["SAP","EDI","ERP","API","B2B","MFT","Cloud","Oracle","AWS","Partners"];
    const POS:[number,number][] = [[.06,.12],[.9,.09],[.04,.52],[.93,.48],[.12,.88],[.85,.85],[.48,.04],[.28,.8],[.7,.1],[.75,.72]];
    const CONNS:[number,number][] = [[0,2],[0,6],[1,3],[1,8],[2,7],[3,9],[4,7],[5,9],[6,8],[0,8],[1,6],[4,9]];
    let W=0,H=0,nodes:Node[]=[],packets:Packet[]=[],id:number,frame=0,t=0;
    const build=()=>{W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;nodes=POS.map((p,i)=>({x:p[0]*W,y:p[1]*H,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.2,label:LABELS[i],r:17,phase:Math.random()*Math.PI*2,conns:[]}));CONNS.forEach(([a,b])=>nodes[a].conns.push(b));};
    const spawn=()=>{const s=nodes[Math.floor(Math.random()*nodes.length)];if(!s.conns.length)return;const d=nodes[s.conns[Math.floor(Math.random()*s.conns.length)]];packets.push({sx:s.x,sy:s.y,dx:d.x,dy:d.y,t:0,spd:.007+Math.random()*.008});};
    const draw=()=>{ctx.clearRect(0,0,W,H);t+=.007;nodes.forEach(n=>{n.x+=n.vx;n.y+=n.vy;if(n.x<n.r||n.x>W-n.r)n.vx*=-1;if(n.y<n.r||n.y>H-n.r)n.vy*=-1;});ctx.setLineDash([3,9]);nodes.forEach((n,i)=>n.conns.forEach(j=>{const m=nodes[j];ctx.globalAlpha=.045+Math.sin(t+i*.8)*.015;ctx.strokeStyle="#111";ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(m.x,m.y);ctx.stroke();}));ctx.setLineDash([]);ctx.globalAlpha=1;packets=packets.filter(p=>{p.t+=p.spd;if(p.t>1)return false;const x=p.sx+(p.dx-p.sx)*p.t,y=p.sy+(p.dy-p.sy)*p.t;const fade=p.t<.08?p.t/.08:p.t>.88?(1-p.t)/.12:1;for(let i=1;i<=5;i++){const tt=Math.max(0,p.t-i*.018);ctx.globalAlpha=((5-i)/10)*.35*fade;ctx.fillStyle="#111";ctx.beginPath();ctx.arc(p.sx+(p.dx-p.sx)*tt,p.sy+(p.dy-p.sy)*tt,Math.max(.4,2-i*.3),0,Math.PI*2);ctx.fill();}ctx.globalAlpha=fade*.8;ctx.fillStyle="#111";ctx.shadowColor="#111";ctx.shadowBlur=5;ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1;return true;});nodes.forEach(n=>{const b=Math.sin(t*1.1+n.phase)*1.5;ctx.globalAlpha=.055+Math.sin(t+n.phase)*.015;ctx.strokeStyle="#111";ctx.lineWidth=1;ctx.beginPath();ctx.arc(n.x,n.y,n.r+7+b,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;ctx.fillStyle="#fff";ctx.strokeStyle="rgba(17,24,39,.16)";ctx.lineWidth=1;ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle="rgba(17,24,39,.65)";ctx.font="500 8.5px system-ui";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(n.label,n.x,n.y);});ctx.globalAlpha=1;frame++;if(frame%55===0)spawn();id=requestAnimationFrame(draw);};
    build();window.addEventListener("resize",build);for(let i=0;i<4;i++)setTimeout(spawn,i*400);draw();
    return()=>{cancelAnimationFrame(id);window.removeEventListener("resize",build);};
  },[]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:0}} />;
}

function LiveTx() {
  const [count,setCount]=useState(14382);
  useEffect(()=>{const id=setInterval(()=>setCount(c=>c+Math.floor(Math.random()*4)+1),1500);return()=>clearInterval(id);},[]);
  return <>{count.toLocaleString()}</>;
}

function WordReveal({text,baseDelay=0}:{text:string;baseDelay?:number}) {
  return <>{text.split(" ").map((word,i)=>(
    <span key={i} className="inline-block overflow-hidden mr-[0.22em] last:mr-0">
      <motion.span className="inline-block" initial={{y:"105%",opacity:0}} animate={{y:"0%",opacity:1}} transition={{duration:.65,ease:EASE,delay:baseDelay+i*.05}}>{word}</motion.span>
    </span>
  ))}</>;
}

function useShimmer(delay=2400, hold=2600) {
  const x=useMotionValue(-100);
  useEffect(()=>{
    const loop=()=>{x.set(-100);animate(x,200,{duration:3,ease:"easeInOut",onComplete:()=>setTimeout(loop,hold)});};
    const id=setTimeout(loop,delay);
    return()=>clearTimeout(id);
  },[x,delay,hold]);
  return useTransform(x,v=>`${v}%`);
}

// ── Static metric card ────────────────────────────────────────────────────────
function MetricCard({val,label,sub,live=false}:{val:React.ReactNode;label:string;sub?:string;live?:boolean}) {
  return (
    <div className="bg-white p-4 flex flex-col gap-1">
      <div className="text-2xl font-light text-black tracking-tight tabular-nums leading-none flex items-center gap-1.5">
        {val}
        {live && (
          <motion.span className="w-[5px] h-[5px] rounded-full bg-green-500 flex-shrink-0"
            animate={{boxShadow:["0 0 0 0px rgba(34,197,94,.5)","0 0 0 4px rgba(34,197,94,0)","0 0 0 0px rgba(34,197,94,.5)"]}}
            transition={{duration:1.8,repeat:Infinity}} />
        )}
      </div>
      <div className="text-[9.5px] text-black/38 uppercase tracking-wide">{label}</div>
      {sub && <div className="text-[9px] text-black/30 mt-1">{sub}</div>}
    </div>
  );
}

// ── 4 cards cycling between 2 sets every 3.5s ────────────────────────────────
const metricSets = [
  [
    { val: <LiveTx />, label:"Transactions today",  sub:"Live",            live:true  },
    { val: "99.1%",    label:"Transaction success", sub:"YTD average",     live:true  },
    { val: "45 days",  label:"Sterling upgrade",    sub:"Norm: 90–120d",   live:false },
    { val: "90+",      label:"Client NPS",          sub:"Active since 2019",live:false },
  ],
  [
    { val: "24×7",    label:"Support Coverage",    sub:"Always on",        live:false },
    { val: "99.80%",  label:"Processing Accuracy", sub:"Validated daily",  live:false },
    { val: "99.97%",  label:"Uptime SLA Achieved", sub:"Enterprise grade", live:false },
    { val: "5+ yrs",  label:"Longest engagement",  sub:"Active since 2019",live:false },
  ],
];

function CyclingMetrics() {
  const [setIdx, setSetIdx] = useState(0);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setFlipping(true);
      setTimeout(() => {
        setSetIdx(s => (s + 1) % metricSets.length);
        setFlipping(false);
      }, 320);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const current = metricSets[setIdx];

  return (
    <motion.div className="max-w-4xl mx-auto rounded-xl overflow-hidden border border-black/[0.08] mb-6"
      style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1px", background:"rgba(0,0,0,0.08)" }}
      initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:.7, ease:EASE, delay:1.2 }}>
      {current.map((m, i) => (
        <div key={i} className="bg-white p-4 flex flex-col gap-1">
          <motion.div
            key={`${setIdx}-${i}`}
            initial={{ opacity:0, y:5 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-5 }}
            transition={{ duration:.4, ease:[.16,1,.3,1], delay: i * 0.05 }}>
            <div className="text-2xl font-light text-black tracking-tight tabular-nums leading-none flex items-center gap-1.5">
              {m.val}
              {m.live && (
                <motion.span className="w-[5px] h-[5px] rounded-full bg-green-500 flex-shrink-0"
                  animate={{boxShadow:["0 0 0 0px rgba(34,197,94,.5)","0 0 0 4px rgba(34,197,94,0)","0 0 0 0px rgba(34,197,94,.5)"]}}
                  transition={{duration:1.8,repeat:Infinity}} />
              )}
            </div>
            <div className="text-[9.5px] text-black/38 uppercase tracking-wide mt-1">{m.label}</div>
            {m.sub && <div className="text-[9px] text-black/30 mt-1">{m.sub}</div>}
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}

// ─── Pure display tag ─────────────────────────────────────────────────────────
function DisplayTag({ item, delay=0 }: { item:string; delay?:number }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      className="relative overflow-hidden rounded-full cursor-default select-none"
      style={{ padding:"8px 16px", border:"1px solid #e5e7eb", background:"#f9fafb" }}
      initial={{ opacity:0, y:10, scale:0.9 }}
      animate={{ opacity:1, y:0, scale:1 }}
      transition={{ duration:0.45, ease:[0.16,1,0.3,1], delay }}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      whileHover={{ y:-3, boxShadow:"0 8px 24px rgba(0,0,0,0.12)", borderColor:"rgba(0,0,0,0.35)", transition:{duration:.2,ease:EASE} }}>
      <motion.span className="absolute inset-0 rounded-full" style={{background:"#111827",originX:0}}
        animate={{scaleX:hov?1:0}} transition={{duration:0.26,ease:[0.16,1,0.3,1]}} />
      <motion.span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 text-xs"
        initial={{x:-8,opacity:0}} animate={{x:hov?0:-8,opacity:hov?1:0}} transition={{duration:0.2,ease:EASE}}>
        →
      </motion.span>
      <motion.span className="relative z-10 text-sm block"
        animate={{color:hov?"#fff":"#374151",x:hov?14:0}} transition={{duration:0.22,ease:[0.16,1,0.3,1]}}>
        {item}
      </motion.span>
    </motion.div>
  );
}

function PillTag({ item, delay=0 }: { item:string; delay?:number }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      className="relative overflow-hidden rounded-full cursor-default select-none"
      style={{ padding:"6px 14px", border:"1px solid #e5e7eb", background:"#f9fafb" }}
      initial={{ opacity:0, scale:0.85 }}
      animate={{ opacity:1, scale:1 }}
      transition={{ duration:0.4, ease:[0.16,1,0.3,1], delay }}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      whileHover={{ y:-2, boxShadow:"0 6px 18px rgba(0,0,0,0.1)", borderColor:"rgba(0,0,0,0.3)", transition:{duration:.18,ease:EASE} }}>
      <motion.span className="absolute inset-0 rounded-full" style={{background:"#111827",originX:0}}
        animate={{scaleX:hov?1:0}} transition={{duration:.22,ease:[.16,1,.3,1]}} />
      <motion.span className="relative z-10 text-sm block"
        animate={{color:hov?"#fff":"#374151"}} transition={{duration:.18}}>
        {item}
      </motion.span>
    </motion.div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export function Hero() {
  const whatBrings  = ["Modernize EDI","Improve supply chain","Faster Onboarding","Reduce Errors","Automate Processes","Managed Services","Lower Costs","Enable AI"];
  const responsible = ["Enterprise Integration","Supply Chain Operations","Procurement","Data & Analytics","Digital Transformation","CIO / CTO"];
  const industries  = ["Logistics & Transportation","Retail & Consumer Goods","Manufacturing","Distribution & Wholesale","Healthcare","Others"];

  const glowX=useMotionValue(50),glowY=useMotionValue(50),glowOp=useMotionValue(0);
  const glowBg=useTransform([glowX,glowY],([x,y])=>`radial-gradient(ellipse at ${x}% ${y}%, rgba(0,0,0,0.035) 0%, transparent 60%)`);
  const onMove=useCallback((e:React.MouseEvent<HTMLDivElement>)=>{
    const r=e.currentTarget.getBoundingClientRect();
    glowX.set(((e.clientX-r.left)/r.width)*100);glowY.set(((e.clientY-r.top)/r.height)*100);
    animate(glowOp,1,{duration:.3});
  },[glowX,glowY,glowOp]);
  const onLeave=useCallback(()=>animate(glowOp,0,{duration:.4}),[glowOp]);
  const shimmerX=useShimmer(2400,2800);

  return (
    <section className="pt-28 pb-28 px-4 relative overflow-hidden bg-white">
      <IntegrationNetwork />

      <div className="max-w-6xl mx-auto relative" style={{zIndex:1}}>

        {/* ── Copy ── */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          <motion.p className="flex items-center justify-center gap-2.5 text-[9px] uppercase tracking-[.2em] text-black/35 mb-7"
            initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.5,delay:.05}}>
            <span style={{width:24,height:1,background:"rgba(0,0,0,.15)",display:"inline-block",flexShrink:0}} />
            EDI & B2B Integration Specialists
            <span style={{width:24,height:1,background:"rgba(0,0,0,.15)",display:"inline-block",flexShrink:0}} />
          </motion.p>
          <h1 className="text-5xl md:text-[64px] font-light text-black leading-[1.06] tracking-[-0.03em] mb-5">
            <WordReveal text="The connected enterprise, engineered to run without friction." baseDelay={0.14} />
          </h1>
          <motion.div style={{height:2,background:"#111",originX:0,maxWidth:180,margin:"-8px auto 20px"}}
            initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:.6,ease:[.16,1,.3,1],delay:1.4}} />
          <motion.p className="text-[17px] text-black/52 max-w-[520px] mx-auto leading-relaxed mb-9"
            initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.5,ease:EASE,delay:.88}}>
            From EDI and B2B integration to AI, digital and data — Exceptional Solutions connects what matters most - systems, data and people.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-3 justify-center mb-3"
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.45,ease:EASE,delay:1.02}}>
            <motion.div whileHover={{y:-2}} transition={{duration:.18,ease:EASE}}>
              <Link to="/contact" className="block bg-black text-white px-6 py-3 text-sm rounded-lg"
                style={{boxShadow:"0 1px 2px rgba(0,0,0,.08)"}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(0,0,0,.18)"}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 1px 2px rgba(0,0,0,.08)"}}>
                Book an EDI health assessment
              </Link>
            </motion.div>
            <motion.div whileHover={{y:-2}} transition={{duration:.18,ease:EASE}}>
              <Link to="/contact" className="block border border-black/20 text-black px-6 py-3 text-sm rounded-lg hover:border-black/40 transition-colors">
                Talk to an integration architect
              </Link>
            </motion.div>
          </motion.div>
          <motion.p className="text-[11px] text-black/30"
            initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.4,delay:1.15}}>
            No obligation — a senior architect reviews your estate and shares what they find.
          </motion.p>
        </div>

        {/* ── Metrics grid — 4 cards cycling between 2 sets ── */}
        <CyclingMetrics />

        {/* ── Selector card ── */}
        <motion.div className="max-w-4xl mx-auto"
          initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.8,ease:EASE,delay:1.35}}>
          <div className="bg-white border border-black/10 rounded-xl p-7 relative overflow-hidden"
            style={{boxShadow:"0 1px 3px rgba(0,0,0,.04),0 8px 32px rgba(0,0,0,.04)"}}
            onMouseMove={onMove} onMouseLeave={onLeave}>

            <motion.div className="absolute inset-0 pointer-events-none rounded-xl" style={{opacity:glowOp,background:glowBg}} />
            <motion.div className="absolute top-0 left-0 pointer-events-none"
              style={{width:"40%",height:1,background:"linear-gradient(90deg,transparent,rgba(17,24,39,.3),transparent)",x:shimmerX}} />

            <div className="space-y-7 relative">
              <div>
                <p className="text-[9px] uppercase tracking-[.16em] text-black/35 mb-4">What brings you here-I want to...</p>
                <div className="flex flex-wrap gap-2.5">
                  {whatBrings.map((item,i)=><DisplayTag key={item} item={item} delay={1.45+i*0.07} />)}
                </div>
              </div>
              <div className="h-px bg-black/[0.05]" />
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-[9px] uppercase tracking-[.16em] text-black/35 mb-4">I'm responsible for</p>
                  <div className="flex flex-wrap gap-2">
                    {responsible.map((item,i)=><PillTag key={item} item={item} delay={1.6+i*0.06} />)}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[.16em] text-black/35 mb-4">Industry</p>
                  <div className="flex flex-wrap gap-2">
                    {industries.map((item,i)=><PillTag key={item} item={item} delay={1.65+i*0.06} />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}