import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Equirectangular positions (x,y in 0..100) supplied by backend.
export default function WorldMap({ countries = [], onSelect, compact = false }) {
  const [hover, setHover] = useState(null);
  const navigate = useNavigate();
  const india = countries.find((c) => c.code === "IN");
  const others = countries.filter((c) => c.code !== "IN");

  const VB_W = 100;
  const VB_H = 62;
  const sy = (y) => y * 0.62; // scale 0..100 domain into viewBox height

  const arcPath = (c) => {
    if (!india) return "";
    const x1 = c.x, y1 = sy(c.y), x2 = india.x, y2 = sy(india.y);
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.28;
    return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  };

  const handle = (c) => {
    if (onSelect) onSelect(c);
    else navigate(`/country/${c.code}`);
  };

  return (
    <div className="relative w-full" data-testid="world-map">
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
          maskImage: "radial-gradient(ellipse 70% 60% at 55% 45%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 55% 45%, black, transparent 75%)",
        }}
      />
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="relative w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0047FF" stopOpacity="0.05" />
            <stop offset="60%" stopColor="#4d7cff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
          </linearGradient>
          <radialGradient id="indiaGlow">
            <stop offset="0%" stopColor="#0047FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0047FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {others.map((c, i) => (
          <g key={c.code}>
            <path id={`arc-${c.code}`} d={arcPath(c)} fill="none" stroke="url(#arcGrad)" strokeWidth="0.35" strokeLinecap="round">
              <animate attributeName="stroke-dashoffset" from="0" to="0" dur="0.1s" />
            </path>
            <motion.path
              d={arcPath(c)} fill="none" stroke="url(#arcGrad)" strokeWidth="0.4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* traveling product particle */}
            <circle r="0.7" fill="#ffffff">
              <animateMotion dur={`${3 + (i % 4)}s`} repeatCount="indefinite" begin={`${i * 0.4}s`} rotate="auto">
                <mpath href={`#arc-${c.code}`} />
              </animateMotion>
              <animate attributeName="opacity" values="0;1;1;0" dur={`${3 + (i % 4)}s`} repeatCount="indefinite" begin={`${i * 0.4}s`} />
            </circle>
          </g>
        ))}

        {/* India destination */}
        {india && (
          <g>
            <circle cx={india.x} cy={sy(india.y)} r="4" fill="url(#indiaGlow)" />
            <circle cx={india.x} cy={sy(india.y)} r="1.1" fill="#0047FF" />
            <circle cx={india.x} cy={sy(india.y)} r="1.1" fill="none" stroke="#0047FF" strokeWidth="0.25">
              <animate attributeName="r" values="1.1;3;1.1" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0;1" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <text x={india.x} y={sy(india.y) + 3.2} textAnchor="middle" fontSize="1.8" fontWeight="700" fill="#fff" className="font-head">INDIA</text>
          </g>
        )}

        {/* origin nodes */}
        {others.map((c) => (
          <g
            key={c.code}
            className="cursor-pointer"
            onClick={() => handle(c)}
            onMouseEnter={() => setHover(c)}
            onMouseLeave={() => setHover(null)}
            data-testid={`map-node-${c.code}`}
          >
            <circle cx={c.x} cy={sy(c.y)} r="2.4" fill="transparent" />
            <circle cx={c.x} cy={sy(c.y)} r={hover?.code === c.code ? 1.1 : 0.8} fill="#fff" style={{ transition: "r 0.3s" }} />
            <circle cx={c.x} cy={sy(c.y)} r="0.8" fill="none" stroke="#fff" strokeWidth="0.15" opacity="0.5" />
          </g>
        ))}
      </svg>

      {hover && (
        <div
          className="absolute z-20 pointer-events-none glass-dark rounded-lg px-3 py-2 -translate-x-1/2 -translate-y-full"
          style={{ left: `${hover.x}%`, top: `${sy(hover.y) / VB_H * 100}%`, marginTop: -8 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">{hover.flag}</span>
            <span className="font-head font-bold text-sm text-white whitespace-nowrap">{hover.name}</span>
          </div>
          <div className="font-mono text-[10px] mt-0.5" style={{ color: "var(--accent)" }}>{hover.products_certified} certified · click to explore</div>
        </div>
      )}
    </div>
  );
}
