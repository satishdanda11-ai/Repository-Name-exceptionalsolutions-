import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Link } from "react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { EASE } from "../lib/animations";

const GRAD = "linear-gradient(135deg, #057DCD 0%, #43B0F1 100%)";

const B = {
  primary500: "#43B0F1",
  primary400: "#6BC3F5",
  navy:       "#0B1F3A",
  slate400:   "#64748B",
  slate500:   "#475569",
  success:    "#10B981",
  white:      "#ffffff",
};

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
    const draw=()=>{
      ctx.clearRect(0,0,W,H);t+=.007;
      nodes.forEach(n=>{n.x+=n.vx;n.y+=n.vy;if(n.x<n.r||n.x>W-n.r)n.vx*=-1;if(n.y<n.r||n.y>H-n.r)n.vy*=-1;});
      ctx.setLineDash([3,9]);
      nodes.forEach((n,i)=>n.conns.forEach(j=>{const m=nodes[j];ctx.globalAlpha=.055+Math.sin(t+i*.8)*.015;ctx.strokeStyle="#057DCD";ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(m.x,m.y);ctx.stroke();}));
      ctx.setLineDash([]);ctx.globalAlpha=1;
      packets=packets.filter(p=>{p.t+=p.spd;if(p.t>1)return false;const x=p.sx+(p.dx-p.sx)*p.t,y=p.sy+(p.dy-p.sy)*p.t;const fade=p.t<.08?p.t/.08:p.t>.88?(1-p.t)/.12:1;
        for(let i=1;i<=5;i++){const tt=Math.max(0,p.t-i*.018);ctx.globalAlpha=((5-i)/10)*.32*fade;ctx.fillStyle="#43B0F1";ctx.beginPath();ctx.arc(p.sx+(p.dx-p.sx)*tt,p.sy+(p.dy-p.sy)*tt,Math.max(.4,2-i*.3),0,Math.PI*2);ctx.fill();}
        ctx.globalAlpha=fade*.85;ctx.fillStyle="#057DCD";ctx.shadowColor="#43B0F1";ctx.shadowBlur=8;ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1;return true;});
      nodes.forEach(n=>{const b=Math.sin(t*1.1+n.phase)*1.5;
        ctx.globalAlpha=.06+Math.sin(t+n.phase)*.018;ctx.strokeStyle="#43B0F1";ctx.lineWidth=1;ctx.beginPath();ctx.arc(n.x,n.y,n.r+7+b,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
        ctx.fillStyle="#ffffff";ctx.strokeStyle="#057DCD";ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fill();ctx.stroke();
        ctx.fillStyle="#0B1F3A";ctx.font="600 8.5px system-ui";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(n.label,n.x,n.y);});
      ctx.globalAlpha=1;frame++;if(frame%55===0)spawn();id=requestAnimationFrame(draw);
    };
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
      <motion.span className="inline-block" initial={{y:"105%",opacity:0}} animate={{y:"0%",opacity:1}}
        transition={{duration:.65,ease:EASE,delay:baseDelay+i*.05}}>{word}</motion.span>
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

const metricSets = [
  [
    { val: <LiveTx />, label:"Transactions today",  sub:"Live",             live:true  },
    { val: "99.1%",    label:"Transaction success",  sub:"YTD average",      live:true  },
    { val: "45 days",  label:"Sterling upgrade",     sub:"Norm: 90–120d",    live:false },
    { val: "90+",      label:"Client NPS",           sub:"Active since 2019", live:false },
  ],
  [
    { val: "24×7",   label:"Support Coverage",    sub:"Always on",         live:false },
    { val: "99.80%", label:"Processing Accuracy", sub:"Validated daily",   live:false },
    { val: "99.97%", label:"Uptime SLA Achieved", sub:"Enterprise grade",  live:false },
    { val: "5+ yrs", label:"Longest engagement",  sub:"Active since 2019", live:false },
  ],
];

function CyclingMetrics() {
  const [setIdx,setSetIdx]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setSetIdx(s=>(s+1)%metricSets.length),3500);return()=>clearInterval(id);},[]);
  const current=metricSets[setIdx];
  return (
    <motion.div className="max-w-4xl mx-auto rounded-xl overflow-hidden mb-6"
      style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1px",background:"rgba(5,125,205,0.15)",border:"1px solid rgba(5,125,205,0.2)",boxShadow:"0 4px 24px rgba(5,125,205,0.08)"}}
      initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.7,ease:EASE,delay:1.2}}>
      {current.map((m,i)=>(
        <div key={i} style={{background:"#ffffff",padding:"16px"}}>
          <motion.div key={`${setIdx}-${i}`} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:.4,ease:[.16,1,.3,1],delay:i*0.055}}>
            <div style={{fontSize:22,fontWeight:300,background:GRAD,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",letterSpacing:"-0.02em",lineHeight:1,display:"flex",alignItems:"center",gap:6,fontVariantNumeric:"tabular-nums"}}>
              {m.val}
              {m.live && (<motion.span style={{width:5,height:5,borderRadius:"50%",background:B.success,flexShrink:0,display:"inline-block"}} animate={{boxShadow:[`0 0 0 0px rgba(16,185,129,.5)`,`0 0 0 5px rgba(16,185,129,0)`,`0 0 0 0px rgba(16,185,129,.5)`]}} transition={{duration:1.8,repeat:Infinity}} />)}
            </div>
            <div style={{fontSize:9.5,color:B.slate400,textTransform:"uppercase",letterSpacing:".14em",marginTop:5}}>{m.label}</div>
            {m.sub && <div style={{fontSize:9,color:B.slate400,marginTop:3}}>{m.sub}</div>}
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}

function DisplayTag({item,delay=0}:{item:string;delay?:number}) {
  const [hov,setHov]=useState(false);
  return (
    <motion.div className="cursor-default select-none"
      style={{display:"inline-flex",alignItems:"center",gap:0,padding:"8px 18px 8px 14px",border:`1px solid ${hov?"#057DCD":"rgba(5,125,205,0.25)"}`,borderRadius:999,background:hov?GRAD:"rgba(5,125,205,0.05)",overflow:"hidden",transition:"border-color .2s, background .22s"}}
      initial={{opacity:0,y:10,scale:.9}} animate={{opacity:1,y:0,scale:1}} transition={{duration:.45,ease:[.16,1,.3,1],delay}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      whileHover={{y:-3,boxShadow:"0 8px 24px rgba(5,125,205,0.18)",transition:{duration:.2,ease:EASE}}}>
      <motion.span style={{fontSize:13,color:"#fff",lineHeight:1,display:"inline-block",overflow:"hidden"}} animate={{width:hov?18:0,opacity:hov?1:0,marginRight:hov?2:0}} transition={{duration:.22,ease:[.16,1,.3,1]}}>→</motion.span>
      <motion.span style={{fontSize:13,lineHeight:1,whiteSpace:"nowrap"}} animate={{color:hov?"#fff":"#0B1F3A"}} transition={{duration:.18}}>{item}</motion.span>
    </motion.div>
  );
}

function PillTag({item,delay=0}:{item:string;delay?:number}) {
  const [hov,setHov]=useState(false);
  return (
    <motion.div className="relative overflow-hidden cursor-default select-none"
      style={{padding:"6px 14px",border:`1px solid ${hov?"#057DCD":"rgba(5,125,205,0.2)"}`,borderRadius:999,background:hov?GRAD:"rgba(5,125,205,0.04)",transition:"border-color .2s, background .22s"}}
      initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}} transition={{duration:.4,ease:[.16,1,.3,1],delay}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      whileHover={{y:-2,boxShadow:"0 6px 18px rgba(5,125,205,0.12)",transition:{duration:.18,ease:EASE}}}>
      <motion.span style={{display:"block",fontSize:13,position:"relative",zIndex:1}} animate={{color:hov?"#fff":B.slate500}} transition={{duration:.16}}>{item}</motion.span>
    </motion.div>
  );
}

export function Hero() {
  const whatBrings  = ["Modernize EDI","Improve supply chain","Faster Onboarding","Reduce Errors","Automate Processes","Managed Services","Lower Costs","Enable AI"];
  const responsible = ["Enterprise Integration","Supply Chain Operations","Procurement","Data & Analytics","Digital Transformation","CIO / CTO"];
  const industries  = ["Logistics & Transportation","Retail & Consumer Goods","Manufacturing","Distribution & Wholesale","Healthcare","Others"];

  const glowX=useMotionValue(50),glowY=useMotionValue(50),glowOp=useMotionValue(0);
  const glowBg=useTransform([glowX,glowY],([x,y])=>`radial-gradient(ellipse at ${x}% ${y}%, rgba(5,125,205,0.06) 0%, transparent 65%)`);
  const onMove=useCallback((e:React.MouseEvent<HTMLDivElement>)=>{const r=e.currentTarget.getBoundingClientRect();glowX.set(((e.clientX-r.left)/r.width)*100);glowY.set(((e.clientY-r.top)/r.height)*100);animate(glowOp,1,{duration:.3});},[glowX,glowY,glowOp]);
  const onLeave=useCallback(()=>animate(glowOp,0,{duration:.4}),[glowOp]);
  const shimmerX=useShimmer(2400,2800);

  return (
    <section className="relative overflow-hidden" style={{background:"#ffffff",paddingTop:112,paddingBottom:112,paddingLeft:16,paddingRight:16}}>
      <div style={{position:"absolute",top:"8%",right:"6%",width:420,height:420,borderRadius:"50%",background:"radial-gradient(circle, rgba(67,176,241,0.07) 0%, transparent 70%)",filter:"blur(50px)",pointerEvents:"none"}} />
      <div style={{position:"absolute",bottom:"10%",left:"4%",width:320,height:320,borderRadius:"50%",background:"radial-gradient(circle, rgba(5,125,205,0.05) 0%, transparent 70%)",filter:"blur(40px)",pointerEvents:"none"}} />
      <IntegrationNetwork />

      <div className="max-w-6xl mx-auto relative" style={{zIndex:1}}>
        <div className="max-w-4xl mx-auto text-center mb-10">

          {/* Badge */}
          <motion.div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",marginBottom:28,background:"rgba(5,125,205,0.08)",border:"1px solid rgba(5,125,205,0.25)",borderRadius:999}} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} transition={{duration:.5,delay:.05}}>
            <motion.span style={{width:6,height:6,borderRadius:"50%",background:"#057DCD",display:"inline-block",flexShrink:0}} animate={{boxShadow:["0 0 0 0px rgba(5,125,205,.4)","0 0 0 5px rgba(5,125,205,0)","0 0 0 0px rgba(5,125,205,.4)"]}} transition={{duration:2,repeat:Infinity}} />
            <span style={{fontSize:10,letterSpacing:".18em",textTransform:"uppercase",color:"#057DCD",fontWeight:600}}>EDI & B2B Integration Specialists</span>
          </motion.div>

          {/* Headline — gradient */}
          <h1 style={{fontSize:"clamp(40px,5.5vw,64px)",fontWeight:300,background:GRAD,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",lineHeight:1.06,letterSpacing:"-0.03em",marginBottom:20}}>
            <WordReveal text="The connected enterprise, engineered to run without friction." baseDelay={0.14} />
          </h1>

          {/* Underline */}
          <motion.div style={{height:3,background:GRAD,originX:0,maxWidth:180,margin:"-6px auto 20px",borderRadius:999}} initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:.6,ease:[.16,1,.3,1],delay:1.4}} />

          {/* Description */}
          <motion.p style={{fontSize:17,color:"#64748B",maxWidth:520,margin:"0 auto 36px",lineHeight:1.65}} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.5,ease:EASE,delay:.88}}>
            From EDI and B2B integration to AI, digital and data — Exceptional Solutions connects what matters most - systems, data and people.
          </motion.p>

          {/* CTAs */}
          <motion.div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center",marginBottom:12}} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.45,ease:EASE,delay:1.02}}>
            <motion.div whileHover={{y:-2}} transition={{duration:.18,ease:EASE}}>
              <Link to="/contact" style={{display:"block",background:GRAD,color:"#fff",padding:"12px 24px",fontSize:14,borderRadius:8,textDecoration:"none",boxShadow:"0 4px 16px rgba(5,125,205,0.3)",transition:"box-shadow .2s"}}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 8px 28px rgba(5,125,205,0.45)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 4px 16px rgba(5,125,205,0.3)";}}>
                Book an EDI health assessment
              </Link>
            </motion.div>
            <motion.div whileHover={{y:-2}} transition={{duration:.18,ease:EASE}}>
              <Link to="/contact" style={{display:"block",border:"1.5px solid rgba(5,125,205,0.35)",color:"#057DCD",padding:"12px 24px",fontSize:14,borderRadius:8,textDecoration:"none",background:"rgba(5,125,205,0.04)",transition:"border-color .2s, background .2s"}}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="#057DCD";el.style.background="rgba(5,125,205,0.08)";}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="rgba(5,125,205,0.35)";el.style.background="rgba(5,125,205,0.04)";}}>
                Talk to an integration architect
              </Link>
            </motion.div>
          </motion.div>

          <motion.p style={{fontSize:11,color:"#94A3B8"}} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.4,delay:1.15}}>
            No obligation — a senior architect reviews your estate and shares what they find.
          </motion.p>
        </div>

        <CyclingMetrics />

        {/* Selector card */}
        <motion.div className="max-w-4xl mx-auto" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.8,ease:EASE,delay:1.35}}>
          <div style={{background:"#fff",border:"1px solid rgba(5,125,205,0.15)",borderRadius:16,padding:28,position:"relative",overflow:"hidden",boxShadow:"0 1px 3px rgba(5,125,205,0.04), 0 8px 32px rgba(5,125,205,0.07)"}} onMouseMove={onMove} onMouseLeave={onLeave}>
            <motion.div style={{position:"absolute",inset:0,pointerEvents:"none",borderRadius:16,opacity:glowOp,background:glowBg}} />
            <motion.div style={{position:"absolute",top:0,left:0,pointerEvents:"none",width:"40%",height:2,background:"linear-gradient(90deg,transparent,rgba(67,176,241,0.4),transparent)",x:shimmerX}} />
            <div style={{position:"relative",display:"flex",flexDirection:"column",gap:28}}>
              <div>
                <p style={{fontSize:9,textTransform:"uppercase",letterSpacing:".16em",color:"#057DCD",fontWeight:600,marginBottom:16}}>What brings you here — I want to...</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:10}}>{whatBrings.map((item,i)=><DisplayTag key={item} item={item} delay={1.45+i*0.07} />)}</div>
              </div>
              <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(5,125,205,0.2),transparent)"}} />
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:32}}>
                <div>
                  <p style={{fontSize:9,textTransform:"uppercase",letterSpacing:".16em",color:"#94A3B8",fontWeight:600,marginBottom:14}}>I'm responsible for</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{responsible.map((item,i)=><PillTag key={item} item={item} delay={1.6+i*0.06} />)}</div>
                </div>
                <div>
                  <p style={{fontSize:9,textTransform:"uppercase",letterSpacing:".16em",color:"#94A3B8",fontWeight:600,marginBottom:14}}>Industry</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{industries.map((item,i)=><PillTag key={item} item={item} delay={1.65+i*0.06} />)}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}