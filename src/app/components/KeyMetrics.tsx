import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { EASE, VIEWPORT, staggerContainer, staggerItem } from "../lib/animations";

interface Metric {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  decimals?: number;
}

const metrics: Metric[] = [
  { value: 18,    suffix: "+ yrs", label: "Avg. team experience"           },
  { value: 85,    suffix: "+",     label: "Enterprise Clients"             },
  { value: 320,   suffix: "+",     label: "Integration Projects"           },
  { value: 4.2,   suffix: "B",  prefix:"$", label: "Revenue Processed Annually", decimals:1 },
  { value: 99.97, suffix: "%",     label: "Uptime SLA Achieved", decimals:2 },
  { value: 99.4,  suffix: "%",     label: "C-SAT Score",         decimals:2 },
];

function useCountUp(target: number, duration: number, active: boolean, decimals = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration, decimals]);
  return count;
}

function MetricCard({ metric, active }: { metric: Metric; active: boolean }) {
  const count = useCountUp(metric.value, 1500, active, metric.decimals);
  const display = metric.decimals ? count.toFixed(metric.decimals) : Math.floor(count);

  return (
    <motion.div
      variants={staggerItem}
      className="flex flex-col justify-center gap-1.5 py-5 px-5 border-r border-black/10 last:border-r-0 group"
      whileHover={{ y:-2, transition:{ duration:0.18, ease:EASE } }}>
      {/* value — all on one line, no wrap */}
      <div className="text-[28px] md:text-[32px] font-light text-black tracking-tight tabular-nums leading-none whitespace-nowrap">
        {metric.prefix ?? ""}{display}{metric.suffix}
      </div>
      <p className="text-[11px] text-black/40 leading-snug">{metric.label}</p>
    </motion.div>
  );
}

export function KeyMetrics() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.section
      ref={ref}
      className="border-t border-b border-black/10"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-3 md:grid-cols-6">
          {metrics.map(m => <MetricCard key={m.label} metric={m} active={active} />)}
        </div>
      </div>
    </motion.section>
  );
}