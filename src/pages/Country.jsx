import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { api } from "../lib/api";
import { stagger } from "../lib/motion";
import CertifiedNav from "../components/certified/CertifiedNav";
import Footer from "../components/Footer";
import ProductCard from "../components/certified/ProductCard";
import StatCounter from "../components/certified/StatCounter";

export default function Country() {
  const { code } = useParams();
  const [c, setC] = useState(null);
  useEffect(() => { window.scrollTo(0, 0); api.country(code).then(setC).catch(() => {}); }, [code]);
  if (!c) return <div className="theme-certified min-h-screen" style={{ background: "var(--bg)" }}><CertifiedNav /></div>;

  return (
    <div className="theme-certified min-h-screen">
      <CertifiedNav />
      <section className="relative pt-32 pb-16 grain overflow-hidden" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 60% at 70% 20%, rgba(0,71,255,0.15), transparent 60%)" }} />
        <div className="relative max-w-[1400px] mx-auto px-5 lg:px-10">
          <Link to="/#countries" className="inline-flex items-center gap-2 text-sm mb-8 link-underline" style={{ color: "var(--text2)" }}><ArrowLeft size={15} /> All countries</Link>
          <div className="text-7xl mb-4">{c.flag}</div>
          <h1 className="font-head font-extrabold text-6xl md:text-8xl tracking-tighter" style={{ color: "var(--text)" }}>{c.name}</h1>
          <p className="mt-5 text-lg max-w-2xl" style={{ color: "var(--text2)" }}>{c.blurb}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mt-12 max-w-2xl">
            <Metric value={c.products_certified} label="Products Certified" />
            <Metric value={c.popularity} suffix="%" label="Popularity Index" />
            <Metric value={c.top_brands?.length || 0} label="Top Brands" />
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 py-16">
        {c.top_brands?.length > 0 && (
          <div className="mb-14">
            <div className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>Top Brands</div>
            <div className="flex flex-wrap gap-3">{c.top_brands.map((b) => <span key={b} className="px-5 py-3 rounded-full text-sm font-medium" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}>{b}</span>)}</div>
          </div>
        )}
        <h2 className="font-head font-bold text-3xl mb-8" style={{ color: "var(--text)" }}>Certified from {c.name}</h2>
        {c.products?.length ? (
          <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {c.products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </motion.div>
        ) : (
          <div className="py-16 text-center" style={{ color: "var(--text2)" }}>Research in progress for this country.</div>
        )}
      </div>
      <Footer variant="certified" />
    </div>
  );
}

const Metric = ({ value, suffix, label }) => (
  <div>
    <div className="font-head font-extrabold text-4xl md:text-5xl" style={{ color: "var(--text)" }}><StatCounter to={value} suffix={suffix || ""} /></div>
    <div className="text-xs font-mono uppercase tracking-widest mt-2" style={{ color: "var(--text2)" }}>{label}</div>
  </div>
);
