import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, ArrowLeft } from "lucide-react";
import SearchDialog from "../SearchDialog";

const LINKS = [
  { label: "The Harvest", to: "/organics#products" },
  { label: "Our Regions", to: "/organics#regions" },
  { label: "Our Story", to: "/organics#story" },
];

export default function OrganicsNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500" style={{ background: scrolled ? "rgba(249,246,240,0.85)" : "transparent", backdropFilter: scrolled ? "blur(18px)" : "none", borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent" }}>
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 h-20 flex items-center justify-between">
          <Link to="/organics" data-testid="organics-logo" className="flex items-center gap-3">
            <span className="font-head italic text-2xl leading-none" style={{ color: "var(--text)" }}>108</span>
            <span className="font-head text-xl tracking-tight leading-none" style={{ color: "var(--text)" }}>Organics</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {LINKS.map((l) => (
              <a key={l.to} href={l.to} className="link-underline text-sm tracking-wide" style={{ color: "var(--text)" }}>{l.label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(true)} data-testid="organics-search-btn" className="grid place-items-center w-10 h-10 rounded-full" style={{ color: "var(--text)" }}><Search size={18} /></button>
            <button onClick={() => navigate("/")} data-testid="back-to-certified" className="hidden md:inline-flex items-center gap-2 h-10 px-4 rounded-full text-xs font-semibold" style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
              <ArrowLeft size={13} /> 108 Certified
            </button>
            <button onClick={() => setMenuOpen(true)} className="lg:hidden grid place-items-center w-10 h-10" style={{ color: "var(--text)" }}><Menu size={20} /></button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] lg:hidden" style={{ background: "var(--bg)" }}>
            <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6 w-10 h-10 grid place-items-center" style={{ color: "var(--text)" }}><X /></button>
            <div className="flex flex-col p-8 pt-24">
              {LINKS.map((l) => <a key={l.to} href={l.to} onClick={() => setMenuOpen(false)} className="py-4 font-head text-4xl" style={{ color: "var(--text)" }}>{l.label}</a>)}
              <Link to="/" onClick={() => setMenuOpen(false)} className="py-4 font-head text-4xl" style={{ color: "var(--accent)" }}>108 Certified</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} variant="organics" />
    </>
  );
}
