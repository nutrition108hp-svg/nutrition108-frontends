import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Marquee from "react-fast-marquee";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { api } from "../../lib/api";
import { ease, stagger, fadeUp } from "../../lib/motion";
import OrganicsNav from "../../components/organics/OrganicsNav";
import Footer from "../../components/Footer";
import HimalayanMap from "../../components/organics/HimalayanMap";
import Reveal from "../../components/Reveal";

const HERO_LINES = ["From the", "Himalayas.", "To your home."];
const HERO_IMG = "https://images.pexels.com/photos/32261635/pexels-photo-32261635.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1400&w=1900";

export default function OrganicsHome() {
  const [products, setProducts] = useState([]);
  const [regions, setRegions] = useState([]);
  const [activeRegion, setActiveRegion] = useState(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.28]);

  useEffect(() => { window.scrollTo(0, 0); api.organicsRegions().then(setRegions).catch(() => {}); }, []);
  useEffect(() => { api.organics(activeRegion).then(setProducts).catch(() => {}); }, [activeRegion]);

  return (
    <div className="theme-organics min-h-screen">
      <OrganicsNav />

      {/* HERO */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[620px] flex items-end overflow-hidden">
        <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0">
          <img src={HERO_IMG} alt="Himalayan orchards" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,18,14,0.75) 5%, rgba(20,18,14,0.2) 40%, rgba(20,18,14,0.35))" }} />
        </motion.div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-5 lg:px-10 w-full pb-20">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.3em] mb-6" style={{ color: "rgba(255,255,255,0.85)" }}>
            <span className="w-6 h-px bg-white/60" /> 108 Organics
          </motion.div>
          <h1 className="font-head font-normal tracking-tight leading-[0.92] text-6xl sm:text-7xl lg:text-[8.5rem]" style={{ color: "#fff" }}>
            {HERO_LINES.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span className="block" initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1.1, ease, delay: 0.2 + i * 0.14 }}>
                  {i === 2 ? <em className="italic font-light">{line}</em> : line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9, ease }} className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <p className="max-w-md text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>Pure, traceable produce harvested by hand from the high orchards and forests of the Indian Himalayas.</p>
            <a href="#products" data-testid="organics-explore-btn" className="inline-flex items-center gap-2 h-14 px-8 rounded-full font-medium text-sm shrink-0" style={{ background: "#fff", color: "#2C2A26" }}>
              Discover the harvest <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="py-24 md:py-36">
        <div className="max-w-[1100px] mx-auto px-5 lg:px-10">
          <Reveal className="max-w-3xl">
            <div className="text-xs font-mono uppercase tracking-[0.25em] mb-6" style={{ color: "var(--accent)" }}>Our Philosophy</div>
            <h2 className="font-head text-4xl md:text-6xl leading-[1.05]" style={{ color: "var(--text)" }}>
              We don't sell apples.<br />We tell the story of the tree, the soil, the altitude and the hands that picked them.
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-10 mt-20">
            {[
              ["01", "Grown high", "At altitudes between 1,600 and 3,800 metres, where thin air and cold nights concentrate flavour and nutrition."],
              ["02", "Harvested by hand", "By families and cooperatives who have farmed these slopes for generations — never industrial, never rushed."],
              ["03", "Traced & tested", "Every batch is lab-verified for purity and shipped within days, so nothing is lost between the orchard and you."],
            ].map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 0.1}>
                <div className="font-head text-5xl mb-4" style={{ color: "var(--wood)" }}>{n}</div>
                <h3 className="font-head text-2xl mb-3" style={{ color: "var(--text)" }}>{t}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text2)" }}>{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="py-8 overflow-hidden" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <Marquee gradient={false} speed={40}>
          {["Sea Buckthorn", "Royal Delicious Apples", "Raw Forest Honey", "A2 Bilona Ghee", "Wild Himalayan Herbs"].map((t, i) => (
            <span key={i} className="mx-12 font-head text-3xl md:text-4xl italic" style={{ color: "var(--text2)" }}>{t} <span style={{ color: "var(--wood)" }}>—</span></span>
          ))}
        </Marquee>
      </section>

      {/* REGIONS MAP */}
      <section id="regions" className="py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="text-xs font-mono uppercase tracking-[0.25em] mb-6" style={{ color: "var(--accent)" }}>Interactive Himalayan Map</div>
            <h2 className="font-head text-4xl md:text-6xl leading-[1.02] mb-6" style={{ color: "var(--text)" }}>Every product has a place it calls home.</h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text2)" }}>Tap a region to reveal what grows there. From the apple terraces of Shimla to the wild sea buckthorn of Spiti.</p>
            {activeRegion && (
              <button onClick={() => setActiveRegion(null)} className="text-sm link-underline" style={{ color: "var(--accent)" }}>Clear filter · show all regions</button>
            )}
          </Reveal>
          <Reveal delay={0.15}>
            <HimalayanMap regions={regions} active={activeRegion} onSelect={setActiveRegion} />
          </Reveal>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="py-16 md:py-24" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal className="mb-12">
            <div className="text-xs font-mono uppercase tracking-[0.25em] mb-4" style={{ color: "var(--accent)" }}>The Harvest {activeRegion && `· ${regions.find((r) => r.code === activeRegion)?.name}`}</div>
            <h2 className="font-head text-4xl md:text-6xl" style={{ color: "var(--text)" }}>What the mountains gave.</h2>
          </Reveal>
          <motion.div key={activeRegion} variants={stagger(0.08)} initial="hidden" animate="show" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <motion.div key={p.id} variants={fadeUp}>
                <Link to={`/organics/product/${p.id}`} data-testid={`organic-card-${p.id}`} className="group block hover-lift">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[900ms]" style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }} />
                    <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full glass-light"><MapPin size={12} style={{ color: "var(--accent)" }} /> {p.region}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-head text-2xl leading-tight" style={{ color: "var(--text)" }}>{p.name}</h3>
                      <p className="text-sm italic mt-1" style={{ color: "var(--text2)" }}>{p.tagline}</p>
                    </div>
                    <ArrowUpRight size={20} className="mt-1 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all shrink-0" style={{ color: "var(--accent)" }} />
                  </div>
                  <div className="mt-3 text-sm font-medium" style={{ color: "var(--wood)" }}>{p.price}</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer variant="organics" />
    </div>
  );
}
