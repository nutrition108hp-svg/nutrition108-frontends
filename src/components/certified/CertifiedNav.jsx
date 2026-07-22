import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, Bookmark, GitCompareArrows, Leaf } from "lucide-react";
import SearchDialog from "../SearchDialog";
import { usePassport } from "../../lib/store";

const LINKS = [
  { label: "Explore", to: "/explore" },
  { label: "Countries", to: "/#countries" },
  { label: "Brands", to: "/brands" },
  { label: "Research", to: "/research" },
  { label: "Compare", to: "/compare" },
  { label: "Transparency", to: "/transparency" },
];

export default function CertifiedNav() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { saved, compare } = usePassport();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div
          className={`transition-all duration-500 ${scrolled ? "glass-dark" : ""}`}
          style={{ borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent" }}
        >
          <div className="max-w-[1400px] mx-auto px-5 lg:px-10 h-16 flex items-center justify-between">
            <Link to="/" data-testid="nav-logo" className="flex items-center gap-2.5 group">
              <span className="grid place-items-center w-9 h-9 rounded-lg font-head font-extrabold text-sm" style={{ background: "var(--accent)", color: "#fff" }}>
                108
              </span>
              <span className="font-head font-bold text-[15px] tracking-tight leading-none hidden sm:block" style={{ color: "var(--text)" }}>
                Nutrition 108
                <span className="block text-[9px] font-mono uppercase tracking-[0.25em] mt-0.5" style={{ color: "var(--text2)" }}>Certified</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  data-testid={`nav-${l.label.toLowerCase()}`}
                  className="link-underline text-[13px] font-medium tracking-wide"
                  style={{ color: "var(--text2)" }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={() => setSearchOpen(true)} data-testid="nav-search-btn" className="grid place-items-center w-9 h-9 rounded-lg hover:bg-white/5 transition-colors" style={{ color: "var(--text)" }}>
                <Search size={18} />
              </button>
              <Link to="/compare" data-testid="nav-compare-icon" className="relative grid place-items-center w-9 h-9 rounded-lg hover:bg-white/5 transition-colors" style={{ color: "var(--text)" }}>
                <GitCompareArrows size={18} />
                {compare.length > 0 && <Badge n={compare.length} />}
              </Link>
              <Link to="/passport" data-testid="nav-passport-icon" className="relative grid place-items-center w-9 h-9 rounded-lg hover:bg-white/5 transition-colors" style={{ color: "var(--text)" }}>
                <Bookmark size={18} />
                {saved.length > 0 && <Badge n={saved.length} />}
              </Link>
              <button
                onClick={() => navigate("/organics")}
                data-testid="nav-organics-switch"
                className="hidden md:flex items-center gap-1.5 h-9 px-3.5 rounded-full text-[12px] font-semibold transition-colors"
                style={{ border: "1px solid var(--border)", color: "var(--text)" }}
              >
                <Leaf size={14} /> 108 Organics
              </button>
              <button onClick={() => setMenuOpen(true)} data-testid="nav-menu-btn" className="lg:hidden grid place-items-center w-9 h-9 rounded-lg" style={{ color: "var(--text)" }}>
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] lg:hidden">
            <div className="absolute inset-0" style={{ background: "var(--bg)" }} />
            <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 40, opacity: 0 }} className="relative h-full flex flex-col p-8 pt-20">
              <button onClick={() => setMenuOpen(false)} className="absolute top-5 right-5 w-9 h-9 grid place-items-center" style={{ color: "var(--text)" }}><X /></button>
              {LINKS.map((l, i) => (
                <motion.div key={l.to} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <Link to={l.to} onClick={() => setMenuOpen(false)} className="block py-4 text-3xl font-head font-bold" style={{ color: "var(--text)" }}>{l.label}</Link>
                </motion.div>
              ))}
              <Link to="/organics" onClick={() => setMenuOpen(false)} className="mt-6 flex items-center gap-2 py-4 text-3xl font-head font-bold" style={{ color: "var(--accent)" }}>
                <Leaf /> 108 Organics
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} variant="certified" />
    </>
  );
}

const Badge = ({ n }) => (
  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 grid place-items-center rounded-full text-[10px] font-bold" style={{ background: "var(--accent)", color: "#fff" }}>{n}</span>
);
