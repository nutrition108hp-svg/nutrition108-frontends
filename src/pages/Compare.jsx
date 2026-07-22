import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, MessageCircle, GitCompareArrows } from "lucide-react";
import { api, waLink } from "../lib/api";
import CertifiedNav from "../components/certified/CertifiedNav";
import Footer from "../components/Footer";
import { usePassport } from "../lib/store";
import { flag } from "../components/certified/ProductCard";

const ROWS = [
  ["108 Score", (p) => p.score],
  ["Community Rating", (p) => p.community_rating],
  ["Country", (p) => `${flag(p.country_code)} ${p.country}`],
  ["Ingredient", (p) => p.ingredient.replace("-", " ")],
  ["Protein Measured", (p) => (p.labs?.protein_measured ? `${p.labs.protein_measured} g` : "—")],
  ["Lab Verified", (p) => (p.lab_verified ? "Yes" : "No")],
  ["Certifications", (p) => (p.certifications || []).length],
  ["Global Ranking", (p) => `#${p.global_ranking}`],
  ["Price", (p) => p.price],
];

export default function Compare() {
  const { compare, toggleCompare, clearCompare } = usePassport();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (compare.length) api.compare(compare).then(setProducts).catch(() => {});
    else setProducts([]);
  }, [compare]);

  return (
    <div className="theme-certified min-h-screen">
      <CertifiedNav />
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 pt-32 pb-24">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.25em] mb-4" style={{ color: "var(--accent)" }}>Compare</div>
            <h1 className="font-head font-extrabold text-5xl md:text-7xl tracking-tighter" style={{ color: "var(--text)" }}>Head to head.</h1>
          </div>
          {products.length > 0 && <button onClick={clearCompare} data-testid="clear-compare" className="text-sm link-underline" style={{ color: "var(--text2)" }}>Clear all</button>}
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl py-24 text-center" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <GitCompareArrows size={40} className="mx-auto mb-4" style={{ color: "var(--accent)" }} />
            <p className="text-lg mb-2" style={{ color: "var(--text)" }}>No products to compare yet.</p>
            <p className="text-sm mb-6" style={{ color: "var(--text2)" }}>Add products from the Explore page or any product card.</p>
            <Link to="/explore" className="inline-flex h-12 px-6 items-center rounded-full font-semibold" style={{ background: "var(--accent)", color: "#fff" }}>Explore products</Link>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar rounded-3xl" style={{ border: "1px solid var(--border)" }}>
            <table className="w-full border-collapse" data-testid="compare-table">
              <thead>
                <tr>
                  <th className="text-left p-5 align-bottom sticky left-0 z-10" style={{ background: "var(--bg)", minWidth: 140 }}></th>
                  {products.map((p) => (
                    <th key={p.id} className="p-5 align-top" style={{ background: "var(--surface)", minWidth: 200, borderLeft: "1px solid var(--border)" }}>
                      <button onClick={() => toggleCompare(p.id)} data-testid={`compare-remove-${p.id}`} className="absolute mt-1 opacity-60 hover:opacity-100"><X size={16} style={{ color: "var(--text)" }} /></button>
                      <Link to={`/product/${p.id}`}>
                        <div className="aspect-square rounded-xl overflow-hidden mb-3 mx-auto max-w-[120px]" style={{ background: "var(--bg)" }}>
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-luminosity opacity-80" />
                        </div>
                        <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--text2)" }}>{p.brand_name}</div>
                        <div className="font-head font-bold text-sm mt-1" style={{ color: "var(--text)" }}>{p.name}</div>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([label, fn], ri) => (
                  <tr key={label} style={{ background: ri % 2 ? "var(--surface)" : "var(--bg)" }}>
                    <td className="p-5 text-xs font-mono uppercase tracking-widest sticky left-0" style={{ color: "var(--text2)", background: "inherit" }}>{label}</td>
                    {products.map((p) => (
                      <td key={p.id} className="p-5 text-center font-semibold" style={{ color: label === "108 Score" ? "var(--accent)" : "var(--text)", borderLeft: "1px solid var(--border)" }}>
                        {label === "108 Score" ? <span className="font-head text-2xl">{fn(p)}</span> : fn(p)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="p-5 sticky left-0" style={{ background: "var(--bg)" }}></td>
                  {products.map((p) => (
                    <td key={p.id} className="p-5" style={{ borderLeft: "1px solid var(--border)" }}>
                      <a href={waLink(p)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-semibold" style={{ background: "#25D366", color: "#062e15" }}><MessageCircle size={15} /> Buy</a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer variant="certified" />
    </div>
  );
}
