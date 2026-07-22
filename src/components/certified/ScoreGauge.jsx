import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

// Animated circular 108 score gauge
export default function ScoreGauge({ score = 90, size = 180, stroke = 10, label = "108 SCORE", accent = "var(--accent)" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [val, setVal] = useState(0);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const dur = 1400;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * score));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, score]);

  const offset = circ - (val / 100) * circ;

  return (
    <div ref={ref} className="relative grid place-items-center" style={{ width: size, height: size }} data-testid="score-gauge">
      <svg width={size} height={size} className="gauge-glow -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={accent} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-head font-extrabold leading-none" style={{ fontSize: size * 0.28, color: "var(--text)" }}>{val}</div>
          <div className="font-mono text-[10px] tracking-[0.2em] mt-1" style={{ color: "var(--text2)" }}>{label}</div>
        </div>
      </div>
    </div>
  );
}
