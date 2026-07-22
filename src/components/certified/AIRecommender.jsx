import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { api } from "../../lib/api";
import { flag } from "./ProductCard";

const SUGGESTIONS = ["I want to gain muscle", "Best for fat loss", "Improve my sleep & recovery", "Something for women's wellness"];

export default function AIRecommender() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const run = async (query) => {
    const text = (query ?? q).trim();
    if (!text) return;
    setQ(text);
    setLoading(true);
    setResult(null);
    try {
      setResult(await api.recommend(text));
    } catch {
      setResult({ intro: "Something went wrong. Please try again.", recommendations: [] });
    }
    setLoading(false);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden p-8 md:p-12" style={{ background: "var(--surface)", border: "1px solid var(--border)" }} data-testid="ai-recommender">
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-30" style={{ background: "radial-gradient(circle, rgba(0,71,255,0.5), transparent 70%)" }} />
      <div className="relative">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-6" style={{ border: "1px solid var(--accent)", color: "var(--accent)" }}>
          <Sparkles size={13} /> AI Recommendation Engine
        </div>
        <h3 className="font-head font-extrabold text-3xl md:text-4xl mb-3 tracking-tight" style={{ color: "var(--text)" }}>Tell us your goal.</h3>
        <p className="text-base mb-8 max-w-lg" style={{ color: "var(--text2)" }}>Describe what you want to achieve and our engine will match you with certified, lab-verified products backed by research.</p>

        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="e.g. I want to gain muscle"
            data-testid="ai-input"
            className="flex-1 h-14 px-5 rounded-xl bg-transparent outline-none text-base"
            style={{ border: "1px solid var(--border)", color: "var(--text)" }}
          />
          <button
            onClick={() => run()}
            disabled={loading}
            data-testid="ai-submit"
            className="h-14 px-7 rounded-xl font-semibold inline-flex items-center justify-center gap-2 transition-colors"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Recommend <ArrowRight size={18} /></>}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => run(s)} className="text-xs px-3 py-1.5 rounded-full transition-colors hover:bg-white/5" style={{ border: "1px solid var(--border)", color: "var(--text2)" }}>
              {s}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8" data-testid="ai-result">
              <p className="text-sm mb-5 italic" style={{ color: "var(--text)" }}>{result.intro}</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {result.recommendations?.map((r, i) => (
                  <motion.div key={r.product.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Link to={`/product/${r.product.id}`} className="block rounded-2xl p-5 h-full hover-lift" style={{ background: "var(--bg)", border: "1px solid var(--border)" }} data-testid={`ai-rec-${r.product.id}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg">{flag(r.product.country_code)}</span>
                        <span className="grid place-items-center w-9 h-9 rounded-full font-head font-bold text-sm" style={{ background: "var(--accent)", color: "#fff" }}>{r.product.score}</span>
                      </div>
                      <div className="font-head font-bold text-base leading-tight mb-1" style={{ color: "var(--text)" }}>{r.product.name}</div>
                      <div className="text-[11px] font-mono uppercase tracking-widest mb-3" style={{ color: "var(--text2)" }}>{r.product.brand_name}</div>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--text2)" }}>{r.reason}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
