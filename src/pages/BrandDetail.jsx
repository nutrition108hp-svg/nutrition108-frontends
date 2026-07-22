import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Globe, Calendar } from "lucide-react";
import { api } from "../lib/api";
import { stagger } from "../lib/motion";
import CertifiedNav from "../components/certified/CertifiedNav";
import Footer from "../components/Footer";
import ProductCard from "../components/certified/ProductCard";
import { flag } from "../components/certified/ProductCard";

export default function BrandDetail() {
  const { id } = useParams();
  const [b, setB] = useState(null);
  useEffect(() => { window.scrollTo(0, 0); api.brand(id).then(setB).catch(() => {}); }, [id]);
  if (!b) return <div className="theme-certified min-h-screen" style={{ background: "var(--bg)" }}><CertifiedNav /></div>;

  return (
    <div className="theme-certified min-h-screen">
      <CertifiedNav />
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="grid place-items-center w-20 h-20 rounded-2xl font-head font-extrabold text-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}>{b.logo_letter}</div>
              <div>
                <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: "var(--accent)" }}>{flag(b.country_code)} {b.country} · Est. {b.founded}</div>
                <h1 className="font-head font-extrabold text-5xl md:text-6xl tracking-tighter" style={{ color: "var(--text)" }}>{b.name}</h1>
              </div>
            </div>
            <p className="text-lg leading-relaxed max-w-2xl" style={{ color: "var(--text2)" }}>{b.history}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
              <Info icon={<Calendar size={16} />} label="Founder" value={b.founder} />
              <Info icon={<Globe size={16} />} label="Countries" value={`${b.global_presence}+`} />
              <Info icon={<Award size={16} />} label="HQ" value={b.hq} />
            </div>
          </div>
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "var(--text2)" }}>Certifications</div>
              <div className="flex flex-wrap gap-2">{b.certifications?.map((c) => <span key={c} className="text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(0,71,255,0.1)", color: "var(--accent)" }}>{c}</span>)}</div>
            </div>
            <div className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "var(--text2)" }}>Awards</div>
              <ul className="space-y-2">{b.awards?.map((a) => <li key={a} className="text-sm" style={{ color: "var(--text)" }}>· {a}</li>)}</ul>
            </div>
          </div>
        </motion.div>

        {b.timeline?.length > 0 && (
          <div className="mb-16">
            <h2 className="font-head font-bold text-2xl mb-8" style={{ color: "var(--text)" }}>Company Timeline</h2>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {b.timeline.map((t) => (
                <div key={t.year} className="shrink-0 w-64 rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <div className="font-head font-extrabold text-3xl" style={{ color: "var(--accent)" }}>{t.year}</div>
                  <div className="text-sm mt-2" style={{ color: "var(--text2)" }}>{t.event}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {b.products?.length > 0 && (
          <div>
            <h2 className="font-head font-bold text-2xl mb-8" style={{ color: "var(--text)" }}>Certified Products</h2>
            <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {b.products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </motion.div>
          </div>
        )}
      </div>
      <Footer variant="certified" />
    </div>
  );
}

const Info = ({ icon, label, value }) => (
  <div className="rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
    <div style={{ color: "var(--accent)" }}>{icon}</div>
    <div className="text-sm font-semibold mt-2" style={{ color: "var(--text)" }}>{value}</div>
    <div className="text-[10px] font-mono uppercase tracking-widest mt-0.5" style={{ color: "var(--text2)" }}>{label}</div>
  </div>
);
