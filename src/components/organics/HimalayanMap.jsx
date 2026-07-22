import { useState } from "react";
import { motion } from "framer-motion";

// Stylised map of the Indian Himalayan belt. x,y are 0..100 positions from backend.
export default function HimalayanMap({ regions = [], active, onSelect }) {
  const [hover, setHover] = useState(null);

  return (
    <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }} data-testid="himalayan-map">
      {/* mountain silhouette */}
      <svg viewBox="0 0 100 75" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="ridge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3A4F39" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#8B5A2B" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d="M0 55 L12 38 L22 48 L34 26 L46 44 L58 22 L70 40 L82 28 L92 46 L100 34 L100 75 L0 75 Z" fill="url(#ridge)" />
        <path d="M0 62 L16 48 L30 58 L44 40 L58 56 L72 44 L86 58 L100 48 L100 75 L0 75 Z" fill="url(#ridge)" />
        {/* connecting dotted paths */}
        {regions.map((r) => (
          <circle key={`d-${r.code}`} cx={r.x} cy={r.y * 0.75} r="0.4" fill="var(--accent)" opacity="0.3" />
        ))}
      </svg>

      {/* region nodes */}
      {regions.map((r, i) => {
        const isActive = active === r.code || hover === r.code;
        return (
          <motion.button
            key={r.code}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
            onClick={() => onSelect?.(r.code === active ? null : r.code)}
            onMouseEnter={() => setHover(r.code)}
            onMouseLeave={() => setHover(null)}
            data-testid={`region-node-${r.code}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
            style={{ left: `${r.x}%`, top: `${r.y * 0.75}%` }}
          >
            <span className="relative grid place-items-center">
              <span className="absolute w-8 h-8 rounded-full" style={{ background: "var(--accent)", opacity: isActive ? 0.18 : 0, transition: "opacity 0.3s" }} />
              <span className="w-3 h-3 rounded-full ring-2 ring-white" style={{ background: isActive ? "var(--accent)" : "var(--wood)", transition: "background 0.3s" }} />
            </span>
            <span className="mt-2 whitespace-nowrap text-[11px] font-medium px-2 py-0.5 rounded-full transition-all" style={{ background: isActive ? "var(--accent)" : "rgba(249,246,240,0.9)", color: isActive ? "#fff" : "var(--text)", border: "1px solid var(--border)" }}>
              {r.name}
            </span>
          </motion.button>
        );
      })}

      {hover && (
        <div className="absolute bottom-4 left-4 right-4 rounded-xl p-4 glass-light pointer-events-none">
          {(() => { const r = regions.find((x) => x.code === hover); return (
            <div>
              <div className="flex items-center justify-between">
                <span className="font-head text-xl" style={{ color: "var(--text)" }}>{r.name}</span>
                <span className="text-xs font-mono" style={{ color: "var(--accent)" }}>{r.altitude}</span>
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--text2)" }}>{r.blurb}</p>
            </div>
          ); })()}
        </div>
      )}
    </div>
  );
}
