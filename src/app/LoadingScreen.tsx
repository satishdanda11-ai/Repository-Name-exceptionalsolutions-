import { motion } from "motion/react";
import { useEffect, useState } from "react";
import logoSrc from "../imports/Group_6417.png";

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export function LoadingScreen({ onComplete, duration = 1800 }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 700 + duration);
    const t2 = setTimeout(() => { setVisible(false); onComplete?.(); }, 700 + duration + 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [duration, onComplete]);

  if (!visible) return null;

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9999,
      display:"flex", alignItems:"center", justifyContent:"center",
      backgroundColor:"#fff", overflow:"hidden",
      opacity: exiting ? 0 : 1,
      transform: exiting ? "scale(1.01)" : "scale(1)",
      transition: exiting ? "opacity 0.5s ease, transform 0.5s ease" : "none",
      pointerEvents: exiting ? "none" : "auto",
    }}>

      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:32 }}>

        {/* Logo — scale + fade in */}
        <motion.img
          src={logoSrc}
          alt="Exceptional Solutions"
          style={{ width:"clamp(160px,22vw,280px)", height:"auto", display:"block", maxWidth:"70vw" }}
          initial={{ opacity:0, scale:0.92, y:16 }}
          animate={{ opacity:1, scale:1, y:0 }}
          transition={{ duration:0.65, ease:[0.16,1,0.3,1], delay:0.08 }}
        />

        {/* Progress bar */}
        <div style={{ width:128, height:1, background:"rgba(0,0,0,0.1)", borderRadius:99, overflow:"hidden" }}>
          <motion.div
            style={{ height:"100%", background:"#111", borderRadius:99, originX:0 }}
            initial={{ scaleX:0 }}
            animate={{ scaleX:1 }}
            transition={{ duration: duration / 1000, ease:"easeInOut", delay:0.4 }}
          />
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;