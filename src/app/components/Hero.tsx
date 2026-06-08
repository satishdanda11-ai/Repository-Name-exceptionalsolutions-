import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE } from "../lib/animations";

interface Node { x:number;y:number;vx:number;vy:number;label:string;r:number;phase:number;conns:number[] }
interface Packet { sx:number;sy:number;dx:number;dy:number;t:number;spd:number }

// ─── Full-viewport integration network ───────────────────────────────────────
function IntegrationNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const LABELS = ["SAP","EDI","ERP","API","B2B","MFT","Cloud","Oracle","AWS","Partners"];
    const POS: [number,number][] = [
      [0.06,0.12],[0.90,0.09],[0.04,0.52],[0.93,0.48],[0.12,0.88],
      [0.85,0.85],[0.48,0.04],[0.28,0.80],[0.70,0.10],[0.75,0.72],
    ];
    const CONNS: [number,number][] = [
      [0,2],[0,6],[1,3],[1,8],[2,7],[3,9],[4,7],[5,9],[6,8],[0,8],[1,6],[4,9],
    ];
    let W=0,H=0,nodes:Node[]=[],packets:Packet[]=[],id:number,frame=0,t=0;
    const build = () => {
      W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight;
      nodes=POS.map((p,i)=>({ x:p[0]*W,y:p[1]*H,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.2,
        label:LABELS[i],r:17,phase:Math.random()*Math.PI*2,conns:[] }));
      CONNS.forEach(([a,b])=>nodes[a].conns.push(b));
    };
    const spawn = () => {
      const s=nodes[Math.floor(Math.random()*nodes.length)];
      if(!s.conns.length) return;
      const d=nodes[s.conns[Math.floor(Math.random()*s.conns.length)]];
      packets.push({sx:s.x,sy:s.y,dx:d.x,dy:d.y,t:0,spd:.007+Math.random()*.008});
    };
    const draw = () => {
      ctx.clearRect(0,0,W,H); t+=.007;
      nodes.forEach(n=>{ n.x+=n.vx; n.y+=n.vy;
        if(n.x<n.r||n.x>W-n.r) n.vx*=-1; if(n.y<n.r||n.y>H-n.r) n.vy*=-1; });
      ctx.setLineDash([3,9]);
      nodes.forEach((n,i)=>n.conns.forEach(j=>{
        const m=nodes[j];
        ctx.globalAlpha=.045+Math.sin(t+i*.8)*.015;
        ctx.strokeStyle="#111"; ctx.lineWidth=.8;
        ctx.beginPath(); ctx.moveTo(n.x,n.y); ctx.lineTo(m.x,m.y); ctx.stroke();
      }));
      ctx.setLineDash([]); ctx.globalAlpha=1;
      packets=packets.filter(p=>{
        p.t+=p.spd; if(p.t>1) return false;
        const x=p.sx+(p.dx-p.sx)*p.t, y=p.sy+(p.dy-p.sy)*p.t;
        const fade=p.t<.08?p.t/.08:p.t>.88?(1-p.t)/.12:1;
        for(let i=1;i<=5;i++){
          const tt=Math.max(0,p.t-i*.018);
          ctx.globalAlpha=((5-i)/10)*.35*fade; ctx.fillStyle="#111";
          ctx.beginPath(); ctx.arc(p.sx+(p.dx-p.sx)*tt,p.sy+(p.dy-p.sy)*tt,Math.max(.4,2-i*.3),0,Math.PI*2); ctx.fill();
        }
        ctx.globalAlpha=fade*.8; ctx.fillStyle="#111";
        ctx.shadowColor="#111"; ctx.shadowBlur=5;
        ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0; ctx.globalAlpha=1; return true;
      });
      nodes.forEach(n=>{
        const b=Math.sin(t*1.1+n.phase)*1.5;
        ctx.globalAlpha=.055+Math.sin(t+n.phase)*.015; ctx.strokeStyle="#111"; ctx.lineWidth=1;
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r+7+b,0,Math.PI*2); ctx.stroke();
        ctx.globalAlpha=1; ctx.fillStyle="#fff"; ctx.strokeStyle="rgba(17,24,39,.16)"; ctx.lineWidth=1;
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle="rgba(17,24,39,.65)"; ctx.font="500 8.5px system-ui";
        ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText(n.label,n.x,n.y);
      });
      ctx.globalAlpha=1; frame++; if(frame%55===0) spawn();
      id=requestAnimationFrame(draw);
    };
    build(); window.addEventListener("resize",build);
    for(let i=0;i<4;i++) setTimeout(spawn,i*400);
    draw();
    return ()=>{ cancelAnimationFrame(id); window.removeEventListener("resize",build); };
  },[]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:0}} />;
}

// ─── Live ticking transaction counter ────────────────────────────────────────
function LiveTx() {
  const [count, setCount] = useState(14382);
  useEffect(()=>{
    const id=setInterval(()=>setCount(c=>c+Math.floor(Math.random()*4)+1),1500);
    return ()=>clearInterval(id);
  },[]);
  return <>{count.toLocaleString()}</>;
}

// ─── Animated word-by-word headline ──────────────────────────────────────────
function WordReveal({ text, baseDelay=0 }: { text:string; baseDelay?:number }) {
  return <>
    {text.split(" ").map((word,i)=>(
      <span key={i} className="inline-block overflow-hidden mr-[0.22em] last:mr-0">
        <motion.span className="inline-block"
          initial={{ y:"105%", opacity:0 }}
          animate={{ y:"0%", opacity:1 }}
          transition={{ duration:0.65, ease:EASE, delay:baseDelay+i*0.05 }}>
          {word}
        </motion.span>
      </span>
    ))}
  </>;
}

// ─── Underline-on-hover tag pill ──────────────────────────────────────────────
function Tag({ item }: { item:string }) {
  return (
    <motion.button
      className="relative px-4 py-2 text-sm overflow-hidden rounded-full cursor-pointer"
      style={{ color:"#374151", background:"#f9fafb", border:"1px solid #e5e7eb" }}
      whileHover="hovered" whileTap={{ scale:0.96 }}>
      <motion.span className="absolute inset-0 rounded-full"
        style={{ background:"#111827", originX:0 }}
        variants={{ initial:{scaleX:0}, hovered:{scaleX:1} }}
        initial="initial"
        transition={{ duration:0.26, ease:[0.16,1,0.3,1] }} />
      <motion.span className="relative" style={{ zIndex:1 }}
        variants={{ initial:{color:"#374151"}, hovered:{color:"#ffffff"} }}
        initial="initial" transition={{ duration:0.2 }}>
        {item}
      </motion.span>
    </motion.button>
  );
}

// ─── Repeating shimmer on selector card top edge ──────────────────────────────
function useShimmer() {
  const x = useMotionValue(-100);
  useEffect(()=>{
    const loop=()=>{ x.set(-100); animate(x,200,{duration:3,ease:"easeInOut",onComplete:()=>setTimeout(loop,2600)}); };
    const id=setTimeout(loop,2400);
    return ()=>clearTimeout(id);
  },[x]);
  return useTransform(x,v=>`${v}%`);
}

// ─── Metric card ──────────────────────────────────────────────────────────────
function MetricCard({ val, label, sub, live=false }: { val:React.ReactNode; label:string; sub:string; live?:boolean }) {
  return (
    <div className="bg-white p-4 flex flex-col gap-1">
      <div className="text-2xl font-light text-black tracking-tight tabular-nums leading-none">{val}</div>
      <div className="text-[9.5px] text-black/38 uppercase tracking-wide">{label}</div>
      <div className="flex items-center gap-1.5 mt-1">
        {live && (
          <motion.span className="w-[5px] h-[5px] rounded-full bg-green-500 flex-shrink-0"
            animate={{ boxShadow:["0 0 0 0px rgba(34,197,94,.5)","0 0 0 4px rgba(34,197,94,0)","0 0 0 0px rgba(34,197,94,.5)"] }}
            transition={{ duration:1.8, repeat:Infinity }} />
        )}
        <span className="text-[9px] text-black/30">{sub}</span>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export function Hero() {
  const whatBrings = ["Assess our integration estate","Modernise our EDI platform","Onboard partners faster","Managed EDI operations","Apply AI to integration data"];
  const responsible = ["CIO / CTO","Supply chain","Integration","Procurement"];
  const industries  = ["Retail & CPG","Logistics","Manufacturing","Healthcare"];

  const glowX=useMotionValue(50), glowY=useMotionValue(50), glowOp=useMotionValue(0);
  const glowBg=useTransform([glowX,glowY],([x,y])=>`radial-gradient(ellipse at ${x}% ${y}%, rgba(0,0,0,0.03) 0%, transparent 60%)`);
  const onMove=useCallback((e:React.MouseEvent<HTMLDivElement>)=>{
    const r=e.currentTarget.getBoundingClientRect();
    glowX.set(((e.clientX-r.left)/r.width)*100);
    glowY.set(((e.clientY-r.top)/r.height)*100);
    animate(glowOp,1,{duration:0.3});
  },[glowX,glowY,glowOp]);
  const onLeave=useCallback(()=>animate(glowOp,0,{duration:0.4}),[glowOp]);
  const shimmerX=useShimmer();

  return (
    <section className="pt-28 pb-28 px-4 relative overflow-hidden bg-white">
      <IntegrationNetwork />

      <div className="max-w-6xl mx-auto relative" style={{zIndex:1}}>

        {/* ── Copy block ── */}
        <div className="max-w-4xl mx-auto text-center mb-10">

          {/* Badge */}
          <motion.p className="flex items-center justify-center gap-2.5 text-[9px] uppercase tracking-[.2em] text-black/35 mb-7"
            initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5,delay:0.05}}>
            <span style={{width:24,height:1,background:"rgba(0,0,0,.15)",display:"inline-block",flexShrink:0}} />
            EDI & B2B Integration Specialists
            <span style={{width:24,height:1,background:"rgba(0,0,0,.15)",display:"inline-block",flexShrink:0}} />
          </motion.p>

          {/* Headline — word reveal */}
          <h1 className="text-5xl md:text-[64px] font-light text-black leading-[1.06] tracking-[-0.03em] mb-5">
            <WordReveal text="The connected enterprise, engineered to run without friction." baseDelay={0.14} />
          </h1>
          {/* underline on "without friction" — animated in after words land */}
          <motion.div style={{height:2,background:"#111",originX:0,maxWidth:180,margin:"-8px auto 20px"}}
            initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:0.6,ease:[0.16,1,0.3,1],delay:1.4}} />

          {/* Description */}
          <motion.p className="text-[17px] text-black/52 max-w-[520px] mx-auto leading-relaxed mb-9"
            initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.5,ease:EASE,delay:0.88}}>
            From EDI and B2B integration to AI, data and cloud — Exceptional Solutions connects the systems, data and people that modern business depends on.
          </motion.p>

          {/* CTAs */}
          <motion.div className="flex flex-col sm:flex-row gap-3 justify-center mb-3"
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.45,ease:EASE,delay:1.02}}>
            <motion.div whileHover={{y:-2}} transition={{duration:0.18,ease:EASE}}>
              <Link to="/contact" className="block bg-black text-white px-6 py-3 text-sm rounded-lg transition-colors"
                style={{boxShadow:"0 1px 2px rgba(0,0,0,.08)"}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(0,0,0,.18)"}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 1px 2px rgba(0,0,0,.08)"}}>
                Book an EDI health assessment
              </Link>
            </motion.div>
            <motion.div whileHover={{y:-2}} transition={{duration:0.18,ease:EASE}}>
              <Link to="/contact" className="block border border-black/20 text-black px-6 py-3 text-sm rounded-lg hover:border-black/40 transition-colors">
                Talk to an integration architect
              </Link>
            </motion.div>
          </motion.div>

          <motion.p className="text-[11px] text-black/30"
            initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.4,delay:1.15}}>
            No obligation — a senior architect reviews your estate and shares what they find.
          </motion.p>
        </div>

        {/* ── Live metrics strip ── */}
        <motion.div
          className="max-w-4xl mx-auto rounded-xl overflow-hidden border border-black/[0.08] mb-6"
          style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1px",background:"rgba(0,0,0,0.08)"}}
          initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:0.7,ease:EASE,delay:1.2}}>
          <MetricCard val={<LiveTx />}   label="Transactions today"   sub="Live"           live />
          <MetricCard val="99.1%"        label="Transaction success"  sub="YTD average"    live />
          <MetricCard val="45 days"      label="Sterling upgrade"     sub="Norm: 90–120d"       />
          <MetricCard val="5+ years"     label="Longest engagement"   sub="Active since 2019"   />
        </motion.div>

        {/* ── Selector card ── */}
        <motion.div className="max-w-4xl mx-auto"
          initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.8,ease:EASE,delay:1.35}}>
          <div className="bg-white border border-black/10 rounded-xl p-7 relative overflow-hidden"
            style={{boxShadow:"0 1px 3px rgba(0,0,0,.04),0 8px 32px rgba(0,0,0,.04)"}}
            onMouseMove={onMove} onMouseLeave={onLeave}>

            {/* cursor glow */}
            <motion.div className="absolute inset-0 pointer-events-none rounded-xl"
              style={{opacity:glowOp,background:glowBg}} />
            {/* repeating shimmer on top edge */}
            <motion.div className="absolute top-0 left-0 pointer-events-none"
              style={{width:"40%",height:1,background:"linear-gradient(90deg,transparent,rgba(17,24,39,.3),transparent)",x:shimmerX}} />

            <div className="space-y-6 relative">
              <div>
                <p className="text-[9px] uppercase tracking-[.16em] text-black/35 mb-3">What brings you here?</p>
                <div className="flex flex-wrap gap-2">
                  {whatBrings.map(t=><Tag key={t} item={t} />)}
                </div>
              </div>
              <div className="h-px bg-black/[0.05]" />
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-[9px] uppercase tracking-[.16em] text-black/35 mb-3">I'm responsible for</p>
                  <div className="flex flex-wrap gap-2">
                    {responsible.map(t=><Tag key={t} item={t} />)}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[.16em] text-black/35 mb-3">Industry</p>
                  <div className="flex flex-wrap gap-2">
                    {industries.map(t=><Tag key={t} item={t} />)}
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