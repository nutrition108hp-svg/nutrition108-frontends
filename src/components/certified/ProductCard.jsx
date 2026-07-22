import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FlaskConical, Video, ShieldCheck, Star, Bookmark, GitCompareArrows, ArrowUpRight } from "lucide-react";
import { usePassport } from "../../lib/store";
import { fadeUp } from "../../lib/motion";

export default function ProductCard({ product, index = 0 }) {
  const { isSaved, inCompare, toggleSave, toggleCompare } = usePassport();
  const saved = isSaved(product.id);
  const comparing = inCompare(product.id);

  return (
    <motion.div variants={fadeUp} className="group relative">
      <div
        className="relative rounded-2xl overflow-hidden hover-lift h-full flex flex-col"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* image */}
        <Link to={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden" data-testid={`product-card-${product.id}`}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 30%, rgba(0,71,255,0.18), transparent 60%)" }} />
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:scale-105 transition-transform duration-[900ms]"
            style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
          />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="text-xl leading-none">{flag(product.country_code)}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded glass-dark" style={{ color: "#fff" }}>
              {product.country}
            </span>
          </div>
          <div className="absolute top-3 right-3 grid place-items-center w-12 h-12 rounded-full font-head font-extrabold text-lg" style={{ background: "var(--accent)", color: "#fff", boxShadow: "0 8px 24px rgba(0,71,255,0.4)" }}>
            {product.score}
          </div>
        </Link>

        {/* body */}
        <div className="p-5 flex flex-col flex-1">
          <div className="text-[11px] font-mono uppercase tracking-widest mb-1.5" style={{ color: "var(--text2)" }}>{product.brand_name}</div>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-head font-bold text-lg leading-tight mb-3 pr-2" style={{ color: "var(--text)" }}>{product.name}</h3>
          </Link>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.lab_verified && <Chip icon={<FlaskConical size={11} />} label="Lab Verified" />}
            {product.research_completed && <Chip icon={<ShieldCheck size={11} />} label="Researched" />}
            {product.video_id && <Chip icon={<Video size={11} />} label="Video" />}
          </div>

          <div className="mt-auto flex items-center justify-between pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="flex items-center gap-1.5">
              <Star size={13} fill="var(--accent)" style={{ color: "var(--accent)" }} />
              <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>{product.community_rating}</span>
              <span className="text-xs" style={{ color: "var(--text2)" }}>community</span>
            </div>
            <div className="flex items-center gap-1.5">
              <IconBtn active={comparing} onClick={() => toggleCompare(product.id)} testid={`compare-toggle-${product.id}`}><GitCompareArrows size={15} /></IconBtn>
              <IconBtn active={saved} onClick={() => toggleSave(product.id)} testid={`save-toggle-${product.id}`}><Bookmark size={15} fill={saved ? "var(--accent)" : "none"} /></IconBtn>
            </div>
          </div>

          <Link
            to={`/product/${product.id}`}
            data-testid={`view-research-${product.id}`}
            className="mt-4 flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-semibold transition-colors"
            style={{ border: "1px solid var(--border)", color: "var(--text)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            View Research <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

const Chip = ({ icon, label }) => (
  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md" style={{ background: "rgba(0,71,255,0.1)", color: "var(--accent)" }}>
    {icon} {label}
  </span>
);

const IconBtn = ({ children, active, onClick, testid }) => (
  <button
    onClick={onClick}
    data-testid={testid}
    className="grid place-items-center w-9 h-9 rounded-lg transition-colors"
    style={{ border: "1px solid var(--border)", color: active ? "var(--accent)" : "var(--text2)", background: active ? "rgba(0,71,255,0.1)" : "transparent" }}
  >
    {children}
  </button>
);

const FLAGS = { US: "🇺🇸", CA: "🇨🇦", DE: "🇩🇪", GB: "🇬🇧", AU: "🇦🇺", NZ: "🇳🇿", JP: "🇯🇵", KR: "🇰🇷", IN: "🇮🇳" };
export const flag = (code) => FLAGS[code] || "🌐";
