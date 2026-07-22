import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { api } from "../lib/api";
import { stagger, fadeUp } from "../lib/motion";
import CertifiedNav from "../components/certified/CertifiedNav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import { flag } from "../components/certified/ProductCard";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  useEffect(() => { api.brands().then(setBrands).catch(() => {}); }, []);

  return (
    <div className="theme-certified min-h-screen">
      <CertifiedNav />
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 pt-32 pb-24">
        <Reveal className="mb-12">
          <div className="text-xs font-mono uppercase tracking-[0.25em] mb-4" style={{ color: "var(--accent)" }}>Brand Database</div>
          <h1 className="font-head font-extrabold text-5xl md:text-7xl tracking-tighter" style={{ color: "var(--text)" }}>The brands we trust.</h1>
          <p className="mt-4 text-lg max-w-2xl" style={{ color: "var(--text2)" }}>Deep-dive dossiers on every brand — history, founders, manufacturing, certifications and global presence.</p>
        </Reveal>
        <motion.div variants={stagger(0.05)} initial="hidden" animate="show" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {brands.map((b) => (
            <motion.div key={b.id} variants={fadeUp}>
              <Link to={`/brands/${b.id}`} data-testid={`brand-card-${b.id}`} className="group block rounded-2xl p-7 h-full hover-lift" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="grid place-items-center w-14 h-14 rounded-xl font-head font-extrabold text-lg" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}>{b.logo_letter}</div>
                  <span className="text-2xl">{flag(b.country_code)}</span>
                </div>
                <h3 className="font-head font-bold text-2xl mb-1" style={{ color: "var(--text)" }}>{b.name}</h3>
                <div className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "var(--text2)" }}>Est. {b.founded} · {b.country}</div>
                <p className="text-sm leading-relaxed mb-5 line-clamp-3" style={{ color: "var(--text2)" }}>{b.history}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">{b.certifications?.slice(0, 2).map((c) => <span key={c} className="text-[10px] px-2 py-1 rounded" style={{ background: "rgba(0,71,255,0.1)", color: "var(--accent)" }}>{c}</span>)}</div>
                  <ArrowUpRight size={18} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" style={{ color: "var(--accent)" }} />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer variant="certified" />
    </div>
  );
}
