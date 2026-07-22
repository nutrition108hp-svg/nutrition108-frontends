import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import { api } from "../lib/api";
import CertifiedNav from "../components/certified/CertifiedNav";
import Footer from "../components/Footer";

export default function Article() {
  const { id } = useParams();
  const [a, setA] = useState(null);
  useEffect(() => { window.scrollTo(0, 0); api.article(id).then(setA).catch(() => {}); }, [id]);
  if (!a) return <div className="theme-certified min-h-screen" style={{ background: "var(--bg)" }}><CertifiedNav /></div>;

  return (
    <div className="theme-certified min-h-screen">
      <CertifiedNav />
      <article className="max-w-3xl mx-auto px-5 lg:px-10 pt-32 pb-24">
        <Link to="/research" className="inline-flex items-center gap-2 text-sm mb-10 link-underline" style={{ color: "var(--text2)" }}><ArrowLeft size={15} /> Research Library</Link>
        <div className="text-xs font-mono uppercase tracking-[0.25em] mb-4" style={{ color: "var(--accent)" }}>{a.category}</div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-head font-extrabold text-4xl md:text-6xl tracking-tighter leading-[0.95] mb-6" style={{ color: "var(--text)" }}>{a.title}</motion.h1>
        <div className="flex items-center gap-2 text-sm mb-10" style={{ color: "var(--text2)" }}><Clock size={14} /> {a.read_time} read</div>
        <div className="rounded-3xl overflow-hidden aspect-[16/9] mb-12">
          <img src={a.cover} alt={a.title} className="w-full h-full object-cover" />
        </div>
        <p className="text-xl leading-relaxed mb-6" style={{ color: "var(--text)" }}>{a.excerpt}</p>
        <p className="text-lg leading-relaxed" style={{ color: "var(--text2)" }}>{a.body}</p>
        <div className="flex flex-wrap gap-2 mt-12">
          {a.tags?.map((t) => <span key={t} className="text-xs px-3 py-1.5 rounded-full" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text2)" }}>#{t}</span>)}
        </div>
      </article>
      <Footer variant="certified" />
    </div>
  );
}
