import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Mountain, Calendar, User, ShieldCheck, MessageCircle, Utensils, Package } from "lucide-react";
import { api, waLink } from "../../lib/api";
import OrganicsNav from "../../components/organics/OrganicsNav";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";

export default function OrganicsProduct() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  useEffect(() => { window.scrollTo(0, 0); api.organic(id).then(setP).catch(() => {}); }, [id]);
  if (!p) return <div className="theme-organics min-h-screen" style={{ background: "var(--bg)" }}><OrganicsNav /></div>;

  return (
    <div className="theme-organics min-h-screen">
      <OrganicsNav />

      {/* Cinematic hero */}
      <section className="relative h-[75svh] min-h-[520px] flex items-end overflow-hidden">
        <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,18,14,0.8), rgba(20,18,14,0.1) 60%)" }} />
        <div className="relative z-10 max-w-[1400px] mx-auto px-5 lg:px-10 w-full pb-16">
          <Link to="/organics" className="inline-flex items-center gap-2 text-sm mb-8 text-white/80 link-underline"><ArrowLeft size={15} /> The Harvest</Link>
          <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full glass-light mb-5"><MapPin size={12} style={{ color: "var(--accent)" }} /> {p.region} · {p.altitude}</div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="font-head text-5xl md:text-8xl leading-[0.95]" style={{ color: "#fff" }}>{p.name}</motion.h1>
          <p className="mt-4 text-xl italic font-head" style={{ color: "rgba(255,255,255,0.85)" }}>{p.tagline}</p>
        </div>
      </section>

      <div className="max-w-[1100px] mx-auto px-5 lg:px-10 py-20">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Story */}
          <div className="lg:col-span-7">
            <Reveal>
              <div className="text-xs font-mono uppercase tracking-[0.25em] mb-5" style={{ color: "var(--accent)" }}>The Story</div>
              <p className="font-head text-2xl md:text-3xl leading-[1.35]" style={{ color: "var(--text)" }}>{p.story}</p>
            </Reveal>

            <Reveal className="mt-14">
              <h3 className="font-head text-3xl mb-6" style={{ color: "var(--text)" }}>Watch the harvest</h3>
              <div className="rounded-2xl overflow-hidden aspect-video" style={{ border: "1px solid var(--border)" }}>
                <iframe title="harvest" width="100%" height="100%" src={`https://www.youtube.com/embed/${p.video_id}`} allowFullScreen data-testid="organic-video" />
              </div>
            </Reveal>

            <Reveal className="mt-14">
              <h3 className="font-head text-3xl mb-6" style={{ color: "var(--text)" }}>Nutrition</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {p.nutrition?.map((n) => (
                  <div key={n.label} className="rounded-xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                    <div className="font-head text-2xl" style={{ color: "var(--wood)" }}>{n.value}</div>
                    <div className="text-xs mt-1" style={{ color: "var(--text2)" }}>{n.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-14">
              <h3 className="font-head text-3xl mb-6 flex items-center gap-3" style={{ color: "var(--text)" }}><Utensils size={22} style={{ color: "var(--accent)" }} /> How to enjoy</h3>
              <ul className="space-y-3">
                {p.recipes?.map((r) => <li key={r} className="flex items-center gap-3 text-base" style={{ color: "var(--text2)" }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--wood)" }} /> {r}</li>)}
              </ul>
              <p className="mt-6 text-sm flex items-start gap-3" style={{ color: "var(--text2)" }}><Package size={16} className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} /> {p.storage}</p>
            </Reveal>
          </div>

          {/* Sticky detail */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 space-y-4">
              <div className="rounded-3xl p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="font-head text-3xl mb-1" style={{ color: "var(--text)" }}>{p.price}</div>
                <div className="text-sm mb-6" style={{ color: "var(--text2)" }}>Harvested {p.harvest_date}</div>
                <a href={waLink(p)} target="_blank" rel="noreferrer" data-testid="organic-whatsapp-btn" className="flex items-center justify-center gap-2 h-14 rounded-full font-medium mb-3" style={{ background: "var(--accent)", color: "#fff" }}>
                  <MessageCircle size={18} /> Order on WhatsApp
                </a>
                <div className="text-center text-xs" style={{ color: "var(--text2)" }}>Direct from the farm · limited seasonal stock</div>
              </div>

              <div className="rounded-3xl p-7 space-y-5" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <Detail icon={<User size={16} />} label="Farmer" value={p.farmer} />
                <Detail icon={<Mountain size={16} />} label="Altitude" value={p.altitude} />
                <Detail icon={<MapPin size={16} />} label="Region" value={p.region} />
                <Detail icon={<Calendar size={16} />} label="Harvest" value={p.harvest_date} />
                <Detail icon={<ShieldCheck size={16} />} label="Purity" value={p.purity} />
              </div>

              <div className="rounded-3xl p-7" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "var(--text2)" }}>Lab Verified</div>
                <div className="space-y-2">
                  {Object.entries(p.labs || {}).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between text-sm">
                      <span className="capitalize" style={{ color: "var(--text2)" }}>{k.replace(/_/g, " ")}</span>
                      <span className="font-medium" style={{ color: "var(--accent)" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer variant="organics" />
    </div>
  );
}

const Detail = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5" style={{ color: "var(--accent)" }}>{icon}</span>
    <div>
      <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--text2)" }}>{label}</div>
      <div className="text-sm font-medium" style={{ color: "var(--text)" }}>{value}</div>
    </div>
  </div>
);
