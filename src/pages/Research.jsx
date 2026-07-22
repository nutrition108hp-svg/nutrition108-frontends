import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowUpRight } from "lucide-react";
import { api } from "../lib/api";
import { stagger, fadeUp } from "../lib/motion";
import CertifiedNav from "../components/certified/CertifiedNav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";

export default function Research() {
  const [articles, setArticles] = useState([]);
  const [cat, setCat] = useState("");
  useEffect(() => { api.articles(cat).then(setArticles).catch(() => {}); }, [cat]);

  const cats = ["Ingredient Database", "Protein Database", "Scientific Studies", "Beginner Guides", "Fake vs Original"];

  return (
    <div className="theme-certified min-h-screen">
      <CertifiedNav />
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 pt-32 pb-24">
        <Reveal className="mb-10">
          <div className="text-xs font-mono uppercase tracking-[0.25em] mb-4" style={{ color: "var(--accent)" }}>Research Library</div>
          <h1 className="font-head font-extrabold text-5xl md:text-7xl tracking-tighter" style={{ color: "var(--text)" }}>Where curiosity<br />meets evidence.</h1>
          <p className="mt-4 text-lg max-w-2xl" style={{ color: "var(--text2)" }}>Wikipedia depth, Netflix presentation. Ingredient databases, scientific studies and honest guides — free, forever.</p>
        </Reveal>

        <div className="flex flex-wrap gap-2 mb-12">
          <Pill active={!cat} onClick={() => setCat("")} testid="research-cat-all">All</Pill>
          {cats.map((c) => <Pill key={c} active={cat === c} onClick={() => setCat(c)} testid={`research-cat-${c.replace(/\s+/g, "-").toLowerCase()}`}>{c}</Pill>)}
        </div>

        <motion.div variants={stagger(0.06)} initial="hidden" animate="show" className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((a, i) => (
            <motion.div key={a.id} variants={fadeUp}>
              <Link to={`/research/${a.id}`} data-testid={`article-card-${a.id}`} className="group block rounded-2xl overflow-hidden h-full hover-lift" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,20,20,0.9), transparent)" }} />
                  <img src={a.cover} alt={a.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" />
                  <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded glass-dark text-white">{a.category}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-head font-bold text-xl leading-tight mb-2" style={{ color: "var(--text)" }}>{a.title}</h3>
                  <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "var(--text2)" }}>{a.excerpt}</p>
                  <div className="flex items-center justify-between text-xs" style={{ color: "var(--text2)" }}>
                    <span className="inline-flex items-center gap-1.5"><Clock size={12} /> {a.read_time}</span>
                    <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" style={{ color: "var(--accent)" }} />
                  </div>
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

const Pill = ({ children, active, onClick, testid }) => (
  <button onClick={onClick} data-testid={testid} className="text-sm px-4 py-2 rounded-full transition-colors" style={{ border: "1px solid var(--border)", background: active ? "var(--accent)" : "transparent", color: active ? "#fff" : "var(--text2)" }}>{children}</button>
);
