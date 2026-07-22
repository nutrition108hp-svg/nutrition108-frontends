import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, Trophy, GitCompareArrows, BadgeCheck } from "lucide-react";
import { api } from "../lib/api";
import { stagger } from "../lib/motion";
import CertifiedNav from "../components/certified/CertifiedNav";
import Footer from "../components/Footer";
import ProductCard from "../components/certified/ProductCard";
import { usePassport } from "../lib/store";

export default function Passport() {
  const { saved, compare } = usePassport();
  const [all, setAll] = useState([]);
  useEffect(() => { api.products().then(setAll).catch(() => {}); }, []);

  const savedProducts = all.filter((p) => saved.includes(p.id));
  const badges = [
    { label: "Explorer", earned: true, desc: "Joined the platform" },
    { label: "Curator", earned: saved.length >= 3, desc: "Saved 3+ products" },
    { label: "Analyst", earned: compare.length >= 2, desc: "Compared products" },
    { label: "Scientist", earned: saved.length >= 6, desc: "Saved 6+ products" },
  ];

  return (
    <div className="theme-certified min-h-screen">
      <CertifiedNav />
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 pt-32 pb-24">
        <div className="flex items-center gap-4 mb-12">
          <div className="grid place-items-center w-16 h-16 rounded-2xl" style={{ background: "var(--accent)" }}><Bookmark size={26} className="text-white" /></div>
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.25em] mb-1" style={{ color: "var(--accent)" }}>Nutrition Passport</div>
            <h1 className="font-head font-extrabold text-4xl md:text-6xl tracking-tighter" style={{ color: "var(--text)" }}>Your research vault.</h1>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {badges.map((b) => (
            <div key={b.label} className="rounded-2xl p-6 text-center" style={{ background: "var(--surface)", border: `1px solid ${b.earned ? "var(--accent)" : "var(--border)"}`, opacity: b.earned ? 1 : 0.5 }} data-testid={`badge-${b.label.toLowerCase()}`}>
              <Trophy size={22} className="mx-auto mb-3" style={{ color: b.earned ? "var(--accent)" : "var(--text2)" }} />
              <div className="font-head font-bold" style={{ color: "var(--text)" }}>{b.label}</div>
              <div className="text-[11px] mt-1" style={{ color: "var(--text2)" }}>{b.desc}</div>
              {b.earned && <BadgeCheck size={14} className="mx-auto mt-2" style={{ color: "var(--accent)" }} />}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-8">
          <h2 className="font-head font-bold text-2xl" style={{ color: "var(--text)" }}>Saved products</h2>
          {compare.length > 0 && <Link to="/compare" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--accent)" }}><GitCompareArrows size={16} /> Compare ({compare.length})</Link>}
        </div>

        {savedProducts.length ? (
          <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {savedProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </motion.div>
        ) : (
          <div className="rounded-3xl py-24 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <Bookmark size={40} className="mx-auto mb-4" style={{ color: "var(--accent)" }} />
            <p className="text-lg mb-2" style={{ color: "var(--text)" }}>No saved products yet.</p>
            <p className="text-sm mb-6" style={{ color: "var(--text2)" }}>Bookmark products to build your personal research vault.</p>
            <Link to="/explore" className="inline-flex h-12 px-6 items-center rounded-full font-semibold" style={{ background: "var(--accent)", color: "#fff" }}>Explore products</Link>
          </div>
        )}
      </div>
      <Footer variant="certified" />
    </div>
  );
}
