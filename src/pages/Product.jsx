import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { FlaskConical, ShieldCheck, Fingerprint, Video, MessageCircle, Bookmark, GitCompareArrows, Download, Factory, Award, TrendingUp, Star, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { api, waLink } from "../lib/api";
import CertifiedNav from "../components/certified/CertifiedNav";
import Footer from "../components/Footer";
import ScoreGauge from "../components/certified/ScoreGauge";
import ReviewsSection from "../components/certified/ReviewsSection";
import EmailCapture from "../components/EmailCapture";
import { flag } from "../components/certified/ProductCard";
import { usePassport } from "../lib/store";

const TABS = ["Overview", "Ingredients", "Scientific Evidence", "Lab Reports", "Manufacturing", "Certifications", "Videos", "Community Reviews", "FAQ"];

export default function Product() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [tab, setTab] = useState("Overview");
  const { isSaved, inCompare, toggleSave, toggleCompare } = usePassport();

  useEffect(() => {
    window.scrollTo(0, 0);
    api.product(id).then(setP).catch(() => setP(false));
  }, [id]);

  if (p === false) return <NotFound />;
  if (!p) return <div className="theme-certified min-h-screen" style={{ background: "var(--bg)" }}><CertifiedNav /></div>;

  const saved = isSaved(p.id);
  const comparing = inCompare(p.id);

  return (
    <div className="theme-certified min-h-screen">
      <CertifiedNav />
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 pt-28 pb-24">
        {/* breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono mb-8" style={{ color: "var(--text2)" }}>
          <Link to="/explore" className="link-underline">Explore</Link> <ChevronRight size={12} />
          <Link to={`/country/${p.country_code}`} className="link-underline">{p.country}</Link> <ChevronRight size={12} />
          <span style={{ color: "var(--text)" }}>{p.name}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Sticky sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="relative rounded-3xl overflow-hidden aspect-square grain" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 35%, rgba(0,71,255,0.25), transparent 60%)" }} />
                <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-90" />
                <div className="absolute top-4 left-4 flex items-center gap-2 glass-dark px-3 py-1.5 rounded-full">
                  <span>{flag(p.country_code)}</span><span className="text-xs font-mono text-white">{p.country}</span>
                </div>
              </div>

              <div className="rounded-3xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-widest mb-1" style={{ color: "var(--text2)" }}>{p.brand_name}</div>
                    <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text)" }}><Star size={13} fill="var(--accent)" style={{ color: "var(--accent)" }} /> {p.community_rating} · Global #{p.global_ranking}</div>
                  </div>
                  <ScoreGauge score={p.score} size={92} stroke={7} label="108" />
                </div>
                <a href={waLink(p)} target="_blank" rel="noreferrer" data-testid="buy-whatsapp-btn" className="flex items-center justify-center gap-2 h-13 py-4 rounded-xl font-semibold w-full mb-2" style={{ background: "#25D366", color: "#062e15" }}>
                  <MessageCircle size={18} /> Buy on WhatsApp
                </a>
                <div className="text-center text-xs mb-4" style={{ color: "var(--text2)" }}>{p.price} · Contact expert for guidance</div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => { toggleSave(p.id); toast.success(saved ? "Removed from Passport" : "Saved to Passport"); }} data-testid="product-save-btn" className="flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-medium" style={{ border: "1px solid var(--border)", color: saved ? "var(--accent)" : "var(--text)" }}>
                    <Bookmark size={15} fill={saved ? "var(--accent)" : "none"} /> {saved ? "Saved" : "Save"}
                  </button>
                  <button onClick={() => { toggleCompare(p.id); toast.success(comparing ? "Removed from compare" : "Added to compare"); }} data-testid="product-compare-btn" className="flex items-center justify-center gap-2 h-11 rounded-lg text-sm font-medium" style={{ border: "1px solid var(--border)", color: comparing ? "var(--accent)" : "var(--text)" }}>
                    <GitCompareArrows size={15} /> Compare
                  </button>
                </div>
              </div>

              <EmailCapture compact source="product" productId={p.id} title="Track this product." subtitle={`Get alerts if ${p.name}'s certification or lab results change.`} />
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="font-head font-extrabold text-4xl md:text-6xl tracking-tighter leading-[0.95] mb-4" style={{ color: "var(--text)" }}>{p.name}</h1>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge icon={<FlaskConical size={13} />} label="Lab Verified" />
                <Badge icon={<Fingerprint size={13} />} label="Authenticity Verified" />
                <Badge icon={<ShieldCheck size={13} />} label="Research Completed" />
                <Badge icon={<Video size={13} />} label="Video Available" />
              </div>
              <p className="text-lg leading-relaxed" style={{ color: "var(--text2)" }}>{p.summary}</p>
            </motion.div>

            {/* Tabs */}
            <div className="sticky top-16 z-30 -mx-5 px-5 mt-10 py-3 glass-dark" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {TABS.map((t) => (
                  <button key={t} onClick={() => setTab(t)} data-testid={`tab-${t.replace(/\s+/g, "-").toLowerCase()}`} className="whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ color: tab === t ? "#fff" : "var(--text2)", background: tab === t ? "var(--accent)" : "transparent" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10 min-h-[300px]">
              <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {tab === "Overview" && <Overview p={p} />}
                {tab === "Ingredients" && <Ingredients p={p} />}
                {tab === "Scientific Evidence" && <Evidence p={p} />}
                {tab === "Lab Reports" && <LabReports p={p} />}
                {tab === "Manufacturing" && <Manufacturing p={p} />}
                {tab === "Certifications" && <Certifications p={p} />}
                {tab === "Videos" && <Videos p={p} />}
                {tab === "Community Reviews" && <ReviewsSection productId={p.id} />}
                {tab === "FAQ" && <FAQ p={p} />}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer variant="certified" />
    </div>
  );
}

const Badge = ({ icon, label }) => (
  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: "rgba(0,71,255,0.1)", color: "var(--accent)" }}>{icon} {label}</span>
);
const H = ({ children }) => <h3 className="font-head font-bold text-2xl mb-5" style={{ color: "var(--text)" }}>{children}</h3>;
const Card = ({ children, className = "" }) => <div className={`rounded-2xl p-6 ${className}`} style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>{children}</div>;

function Overview({ p }) {
  const data = Object.entries(p.score_breakdown || {}).map(([k, v]) => ({ name: k, value: v }));
  return (
    <div className="space-y-8">
      <div>
        <H>108 Score Breakdown</H>
        <Card>
          <div className="space-y-4">
            {data.map((d) => (
              <div key={d.name}>
                <div className="flex justify-between text-sm mb-1.5"><span style={{ color: "var(--text)" }}>{d.name}</span><span className="font-mono" style={{ color: "var(--accent)" }}>{d.value}</span></div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg)" }}>
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${d.value}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full" style={{ background: "var(--accent)" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat icon={<TrendingUp size={18} />} label="Global Ranking" value={`#${p.global_ranking}`} />
        <Stat icon={<Star size={18} />} label="Community Rating" value={p.community_rating} />
        <Stat icon={<Factory size={18} />} label="Manufactured in" value={p.country} />
      </div>
    </div>
  );
}
const Stat = ({ icon, label, value }) => (
  <Card><div style={{ color: "var(--accent)" }}>{icon}</div><div className="font-head font-extrabold text-3xl mt-3" style={{ color: "var(--text)" }}>{value}</div><div className="text-xs font-mono uppercase tracking-widest mt-1" style={{ color: "var(--text2)" }}>{label}</div></Card>
);

function Ingredients({ p }) {
  return (
    <div><H>Ingredient Breakdown</H>
      <div className="space-y-3">
        {p.ingredients_list?.map((ing, i) => (
          <Card key={i} className="flex items-center justify-between">
            <div><div className="font-semibold" style={{ color: "var(--text)" }}>{ing.name}</div><div className="text-xs mt-0.5" style={{ color: "var(--text2)" }}>{ing.note}</div></div>
            <div className="font-mono text-lg" style={{ color: "var(--accent)" }}>{ing.amount}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Evidence({ p }) {
  return (
    <div><H>Scientific Evidence</H>
      <div className="space-y-4">
        {p.evidence?.map((e, i) => (
          <Card key={i}>
            <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>{e.claim}</div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text)" }}>{e.finding}</p>
            <div className="text-xs font-mono" style={{ color: "var(--text2)" }}>Reference · {e.ref}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LabReports({ p }) {
  const labs = p.labs || {};
  const hm = labs.heavy_metals || [];
  const chartData = hm.map((m) => ({ name: m.metal, result: m.result, limit: m.limit }));
  const proteinData = [{ name: "Measured", value: labs.protein_measured, fill: "#0047FF" }];
  return (
    <div className="space-y-8">
      <H>Independent Lab Reports</H>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-4"><div className="font-semibold" style={{ color: "var(--text)" }}>Heavy Metals</div><span className="text-xs font-mono px-2 py-1 rounded" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>PASS</span></div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={70} tick={{ fill: "#A1A1AA", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Bar dataKey="result" radius={[0, 6, 6, 0]} barSize={14}>{chartData.map((_, i) => <Cell key={i} fill="#0047FF" />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="text-xs mt-2" style={{ color: "var(--text2)" }}>All results far below safety limits (ppm). Lower is better.</div>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-4"><div className="font-semibold" style={{ color: "var(--text)" }}>Protein Content</div><span className="text-xs font-mono px-2 py-1 rounded" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>VERIFIED</span></div>
          <div className="grid grid-cols-2 gap-4 text-center py-4">
            <div><div className="font-head font-extrabold text-4xl" style={{ color: "var(--text2)" }}>{labs.protein_claim}g</div><div className="text-xs font-mono mt-1" style={{ color: "var(--text2)" }}>CLAIMED</div></div>
            <div><div className="font-head font-extrabold text-4xl" style={{ color: "var(--accent)" }}>{labs.protein_measured}g</div><div className="text-xs font-mono mt-1" style={{ color: "var(--accent)" }}>MEASURED</div></div>
          </div>
          <div className="text-xs mt-2 text-center" style={{ color: "var(--text2)" }}>Amino spiking: {labs.amino_spiking || "None detected"}</div>
        </Card>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[["Microbiology", labs.microbiology], ["Authenticity", labs.authenticity], ["Heavy Metals", "PASS"], ["Label Accuracy", "PASS"]].map(([l, v]) => (
          <Card key={l} className="text-center"><div className="text-2xl mb-1" style={{ color: "#10B981" }}>✓</div><div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{v}</div><div className="text-[10px] font-mono uppercase tracking-widest mt-1" style={{ color: "var(--text2)" }}>{l}</div></Card>
        ))}
      </div>
      <button data-testid="download-lab-report" onClick={() => toast.success("Lab report PDF download started")} className="inline-flex items-center gap-2 h-12 px-6 rounded-lg text-sm font-semibold" style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
        <Download size={16} /> Download full lab report (PDF)
      </button>
    </div>
  );
}

function Manufacturing({ p }) {
  const m = p.manufacturing || {};
  return (
    <div><H>Manufacturing</H>
      <div className="grid sm:grid-cols-2 gap-4">
        <Card><Factory size={20} style={{ color: "var(--accent)" }} /><div className="font-semibold mt-3" style={{ color: "var(--text)" }}>{m.facility}</div><div className="text-sm mt-1" style={{ color: "var(--text2)" }}>Certified facility</div></Card>
        <Card><ShieldCheck size={20} style={{ color: "var(--accent)" }} /><div className="font-semibold mt-3" style={{ color: "var(--text)" }}>{m.process}</div><div className="text-sm mt-1" style={{ color: "var(--text2)" }}>Production process</div></Card>
      </div>
    </div>
  );
}

function Certifications({ p }) {
  return (
    <div><H>Certifications</H>
      <div className="flex flex-wrap gap-3">
        {p.certifications?.map((c) => (
          <div key={c} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <Award size={16} style={{ color: "var(--accent)" }} /><span className="text-sm font-medium" style={{ color: "var(--text)" }}>{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Videos({ p }) {
  return (
    <div className="grid lg:grid-cols-3 gap-6"><div className="lg:col-span-2">
      <div className="rounded-2xl overflow-hidden aspect-video" style={{ border: "1px solid var(--border)" }}>
        <iframe title="research" width="100%" height="100%" src={`https://www.youtube.com/embed/${p.video_id}`} allowFullScreen data-testid="research-video" />
      </div></div>
      <div><H>Key Findings</H>
        <ul className="space-y-3">
          {(p.evidence || []).map((e, i) => <li key={i} className="text-sm leading-relaxed" style={{ color: "var(--text2)" }}><span style={{ color: "var(--accent)" }}>—</span> {e.finding}</li>)}
        </ul>
      </div>
    </div>
  );
}

function FAQ({ p }) {
  const faqs = [
    { q: "Is this product genuine?", a: `Yes. Every ${p.name} batch is purchased anonymously and authenticity-verified for amino spiking and label accuracy.` },
    { q: "Where is it manufactured?", a: `${p.name} is manufactured in ${p.country} at a certified facility.` },
    { q: "How is the 108 Score calculated?", a: "Across seven weighted dimensions — transparency, ingredients, evidence, testing, manufacturing, reputation and value." },
    { q: "How do I buy it in India?", a: "Tap 'Buy on WhatsApp' to connect with a verified expert who will guide your purchase." },
  ];
  return (
    <div><H>Frequently Asked Questions</H>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <Card key={i}><div className="font-semibold mb-2" style={{ color: "var(--text)" }}>{f.q}</div><p className="text-sm leading-relaxed" style={{ color: "var(--text2)" }}>{f.a}</p></Card>
        ))}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="theme-certified min-h-screen grid place-items-center" style={{ background: "var(--bg)" }}>
      <div className="text-center">
        <div className="font-head font-extrabold text-6xl mb-4" style={{ color: "var(--text)" }}>404</div>
        <Link to="/explore" className="link-underline" style={{ color: "var(--accent)" }}>Back to Explore</Link>
      </div>
    </div>
  );
}
