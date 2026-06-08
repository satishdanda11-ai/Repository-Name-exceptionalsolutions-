import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export function LoadingScreen({ onComplete, duration = 1800 }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // After logo hold, start exit
    const t1 = setTimeout(() => setExiting(true), 700 + duration);
    // After exit animation, remove component
    const t2 = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 700 + duration + 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [duration, onComplete]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: "#fff", overflow: "hidden",
        opacity: exiting ? 0 : 1,
        transform: exiting ? "scale(1.01)" : "scale(1)",
        transition: exiting ? "opacity 0.5s ease, transform 0.5s ease" : "none",
        pointerEvents: exiting ? "none" : "auto",
      }}>

      {/* Logo lockup */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>

        {/* Icon bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
          {[36, 52, 36].map((w, i) => (
            <motion.div
              key={i}
              style={{ height: 5, width: w, borderRadius: 99, background: "#111", originX: 0 }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.08 + i * 0.07 }}
            />
          ))}
        </div>

        {/* Wordmark */}
        <div style={{ overflow: "hidden" }}>
          <motion.div
            style={{ display: "flex", alignItems: "baseline", gap: "0.35em" }}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}>
            <span style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 400, color: "#111", letterSpacing: "-0.02em" }}>
              Exceptional
            </span>
            <span style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 400, color: "rgba(0,0,0,0.45)", letterSpacing: "-0.02em" }}>
              Solutions
            </span>
          </motion.div>
        </div>

        {/* Tagline */}
        <motion.p
          style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(0,0,0,0.3)", margin: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}>
          EDI & B2B Integration Specialists
        </motion.p>

        {/* Progress bar */}
        <div style={{ width: 128, height: 1, background: "rgba(0,0,0,0.1)", borderRadius: 99, overflow: "hidden" }}>
          <motion.div
            style={{ height: "100%", background: "#111", borderRadius: 99, originX: 0 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: duration / 1000, ease: "easeInOut", delay: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}