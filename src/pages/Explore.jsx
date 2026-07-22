import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { api, GOALS, INGREDIENTS } from "../lib/api";
import { stagger } from "../lib/motion";
import CertifiedNav from "../components/certified/CertifiedNav";
import Footer from "../components/Footer";
import ProductCard from "../components/certified/ProductCard";
import Reveal from "../components/Reveal";

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const goal = params.get("goal") || "";
  const ingredient = params.get("ingredient") || "";
  const country = params.get("country") || "";
  const sort = params.get("sort") || "score";

  useEffect(() => {
    api.countries().then((c) => setCountries(c.filter((x) => x.code !== "IN"))).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api.products({ ...(goal && { goal }), ...(ingredient && { ingredient }), ...(country && { country }), sort })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [goal, ingredient, country, sort]);

  const setP = (key, val) => {
    const next = new URLSearchParams(params);
    if (val) next.set(key, val);
    else next.delete(key);
    setParams(next);
  };

  return (
    <div className="theme-certified min-h-screen">
      <CertifiedNav />
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 pt-32 pb-24">
        <Reveal className="mb-12">
          <div className="text-xs font-mono uppercase tracking-[0.25em] mb-4" style={{ color: "var(--accent)" }}>Explore · 108 Certified</div>
          <h1 className="font-head font-extrabold text-5xl md:text-7xl tracking-tighter" style={{ color: "var(--text)" }}>The Certified Index</h1>
          <p className="mt-4 text-lg max-w-2xl" style={{ color: "var(--text2)" }}>Every product below has passed independent lab testing and scientific review. Filter by goal, ingredient or country of origin.</p>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Filters */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-8">
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--text)" }}>
                <SlidersHorizontal size={16} /> Filters
              </div>
              <FilterGroup title="Sort by">
                {[["score", "108 Score"], ["rating", "Community Rating"]].map(([v, l]) => (
                  <Pill key={v} active={sort === v} onClick={() => setP("sort", v)} testid={`sort-${v}`}>{l}</Pill>
                ))}
              </FilterGroup>
              <FilterGroup title="Goal">
                <Pill active={!goal} onClick={() => setP("goal", "")} testid="goal-filter-all">All</Pill>
                {GOALS.map((g) => <Pill key={g.key} active={goal === g.key} onClick={() => setP("goal", g.key)} testid={`goal-filter-${g.key}`}>{g.label}</Pill>)}
              </FilterGroup>
              <FilterGroup title="Ingredient">
                <Pill active={!ingredient} onClick={() => setP("ingredient", "")} testid="ing-filter-all">All</Pill>
                {INGREDIENTS.map((g) => <Pill key={g.key} active={ingredient === g.key} onClick={() => setP("ingredient", g.key)} testid={`ing-filter-${g.key}`}>{g.label}</Pill>)}
              </FilterGroup>
              <FilterGroup title="Country">
                <Pill active={!country} onClick={() => setP("country", "")} testid="country-filter-all">All</Pill>
                {countries.map((c) => <Pill key={c.code} active={country === c.code} onClick={() => setP("country", c.code)} testid={`country-filter-${c.code}`}>{c.flag} {c.name}</Pill>)}
              </FilterGroup>
            </div>
          </aside>

          {/* Grid */}
          <div className="lg:col-span-9">
            <div className="text-sm font-mono mb-6" style={{ color: "var(--text2)" }} data-testid="results-count">{products.length} products</div>
            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[3/4] rounded-2xl animate-pulse" style={{ background: "var(--surface)" }} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="py-24 text-center" style={{ color: "var(--text2)" }}>No products match these filters.</div>
            ) : (
              <motion.div key={`${goal}${ingredient}${country}${sort}`} variants={stagger(0.06)} initial="hidden" animate="show" className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer variant="certified" />
    </div>
  );
}

const FilterGroup = ({ title, children }) => (
  <div>
    <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: "var(--text2)" }}>{title}</div>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

const Pill = ({ children, active, onClick, testid }) => (
  <button
    onClick={onClick}
    data-testid={testid}
    className="text-xs px-3 py-1.5 rounded-full transition-colors"
    style={{ border: "1px solid var(--border)", background: active ? "var(--accent)" : "transparent", color: active ? "#fff" : "var(--text2)" }}
  >
    {children}
  </button>
);
