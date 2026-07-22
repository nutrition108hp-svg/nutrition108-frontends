import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, X, Package, Building2, BookOpen, CornerDownLeft } from "lucide-react";
import { api } from "../lib/api";

export default function SearchDialog({ open, onClose, variant = "certified" }) {
  const [q, setQ] = useState("");
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const dark = variant === "certified";

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
    else {
      setQ("");
      setRes(null);
    }
  }, [open]);

  useEffect(() => {
    if (!q.trim()) {
      setRes(null);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        setRes(await api.search(q.trim()));
      } catch {
        setRes({ products: [], brands: [], articles: [] });
      }
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const go = (path) => {
    onClose();
    navigate(path);
  };

  const rowCls = dark
    ? "hover:bg-white/5 border-white/5"
    : "hover:bg-black/5 border-black/5";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-testid="search-dialog"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full max-w-2xl rounded-2xl overflow-hidden ${dark ? "glass-dark" : "glass-light"}`}
            style={{ backgroundColor: dark ? "rgba(15,15,15,0.9)" : "rgba(249,246,240,0.95)" }}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <Search size={20} style={{ color: "var(--text2)" }} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products, brands, ingredients, research…"
                data-testid="search-input"
                className="flex-1 bg-transparent outline-none text-lg font-body"
                style={{ color: "var(--text)" }}
              />
              <button onClick={onClose} data-testid="search-close" className="opacity-60 hover:opacity-100">
                <X size={20} style={{ color: "var(--text)" }} />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto no-scrollbar">
              {!q.trim() && (
                <div className="px-5 py-8 text-sm font-mono uppercase tracking-widest" style={{ color: "var(--text2)" }}>
                  Universal AI Search · try "whey", "creatine", "Germany"
                </div>
              )}
              {loading && (
                <div className="px-5 py-6 text-sm" style={{ color: "var(--text2)" }}>Searching…</div>
              )}
              {res && (
                <div className="py-2">
                  {res.products?.length > 0 && (
                    <Section title="Products">
                      {res.products.map((p) => (
                        <Row key={p.id} cls={rowCls} onClick={() => go(`/product/${p.id}`)} icon={<Package size={16} />} title={p.title} sub={p.subtitle} tag={p.score ? `${p.score}` : null} />
                      ))}
                    </Section>
                  )}
                  {res.brands?.length > 0 && (
                    <Section title="Brands">
                      {res.brands.map((b) => (
                        <Row key={b.id} cls={rowCls} onClick={() => go(`/brands/${b.id}`)} icon={<Building2 size={16} />} title={b.title} sub={b.subtitle} />
                      ))}
                    </Section>
                  )}
                  {res.articles?.length > 0 && (
                    <Section title="Research">
                      {res.articles.map((a) => (
                        <Row key={a.id} cls={rowCls} onClick={() => go(`/research/${a.id}`)} icon={<BookOpen size={16} />} title={a.title} sub={a.subtitle} />
                      ))}
                    </Section>
                  )}
                  {res.products?.length === 0 && res.brands?.length === 0 && res.articles?.length === 0 && (
                    <div className="px-5 py-8 text-sm" style={{ color: "var(--text2)" }}>No results for "{q}".</div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const Section = ({ title, children }) => (
  <div className="px-2 py-1">
    <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: "var(--text2)" }}>{title}</div>
    {children}
  </div>
);

const Row = ({ onClick, icon, title, sub, tag, cls }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-transparent text-left transition-colors ${cls}`}
    style={{ color: "var(--text)" }}
  >
    <span style={{ color: "var(--accent)" }}>{icon}</span>
    <span className="flex-1 min-w-0">
      <span className="block truncate text-sm font-medium">{title}</span>
      <span className="block truncate text-xs" style={{ color: "var(--text2)" }}>{sub}</span>
    </span>
    {tag && <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: "var(--accent)", color: "#fff" }}>{tag}</span>}
    <CornerDownLeft size={14} style={{ color: "var(--text2)" }} className="opacity-0 group-hover:opacity-100" />
  </button>
);
