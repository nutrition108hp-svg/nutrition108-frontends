import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Marquee from "react-fast-marquee";
import { ArrowRight, Play, FlaskConical, ShieldCheck, ArrowUpRight, Leaf } from "lucide-react";
import { api, GOALS, INGREDIENTS } from "../lib/api";
import { ease, fadeUp, stagger } from "../lib/motion";
import Reveal from "../components/Reveal";
import CertifiedNav from "../components/certified/CertifiedNav";
import Footer from "../components/Footer";
import WorldMap from "../components/certified/WorldMap";
import ProcessTimeline from "../components/certified/ProcessTimeline";
import ProductCard from "../components/certified/ProductCard";
import ScoreGauge from "../components/certified/ScoreGauge";
import StatCounter from "../components/certified/StatCounter";
import AIRecommender from "../components/certified/AIRecommender";

const HERO_LINES = ["The World's Best", "Nutrition.", "Verified for India."];

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [stats, setStats] = useState(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    api.countries().then(setCountries).catch(() => {});
    api.products({ featured: true }).then(setFeatured).catch(() => {});
    api.stats().then(setStats).catch(() => {});
  }, []);

  return (
    <div className="theme-certified relative min-h-screen overflow-clip">
      <CertifiedNav />

      {/* ---------------- HERO ---------------- */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[640px] flex items-center grain">
        <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 90% 70% at 60% 30%, rgba(0,71,255,0.16), transparent 60%)" }} />
          <div className="absolute inset-0 flex items-center justify-center opacity-60">
            <div className="w-[140%] md:w-[80%] max-w-[1100px]">
              <WorldMap countries={countries} />
            </div>
          </div>
        </motion.div>

        <motion.div style={{ opacity: heroFade }} className="relative z-10 max-w-[1400px] mx-auto px-5 lg:px-10 w-full pt-20">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] px-3 py-1.5 rounded-full mb-8 glass-dark">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
            India's First Independent Nutrition Authority
          </motion.div>

          <h1 className="font-head font-extrabold tracking-tighter leading-[0.9] text-5xl sm:text-7xl lg:text-8xl max-w-5xl">
            {HERO_LINES.map((line, i) => (
              <span key={i} className="block overflow-hidden py-1">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1, ease, delay: 0.2 + i * 0.13 }}
                  style={{ color: i === 2 ? "var(--accent)" : "var(--text)" }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.8, ease }} className="mt-8 max-w-xl text-base sm:text-lg leading-relaxed" style={{ color: "var(--text2)" }}>
            Discover internationally trusted nutrition products — researched, tested and certified before being recommended to Indian athletes.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8, ease }} className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link to="/explore" data-testid="hero-explore-btn" className="group inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full font-semibold transition-transform hover:-translate-y-0.5" style={{ background: "var(--accent)", color: "#fff" }}>
              Explore Certified Products <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#research" data-testid="hero-watch-btn" className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full font-semibold transition-colors" style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
              <Play size={16} /> Watch Research
            </a>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-6 left-0 right-0 z-10">
          <Marquee gradient={false} speed={30} className="opacity-40">
            {["DISCOVER", "TEST", "CERTIFY", "TRANSPARENCY", "SCIENCE OVER MARKETING", "LAB VERIFIED", "108 CERTIFIED"].map((t, i) => (
              <span key={i} className="mx-8 font-mono text-xs tracking-[0.3em]" style={{ color: "var(--text2)" }}>{t} <span style={{ color: "var(--accent)" }}>·</span></span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      {stats && (
        <section className="relative z-10 border-y" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
          <div className="max-w-[1400px] mx-auto px-5 lg:px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              [stats.products_certified, "Products Certified"],
              [stats.tests_conducted, "Lab Tests Conducted"],
              [stats.countries, "Countries Researched"],
              [stats.brands, "Brands Analysed"],
            ].map(([n, label]) => (
              <Reveal key={label} className="text-center md:text-left">
                <div className="font-head font-extrabold text-4xl md:text-5xl tracking-tight" style={{ color: "var(--text)" }}>
                  <StatCounter to={n} suffix="+" />
                </div>
                <div className="text-xs font-mono uppercase tracking-[0.15em] mt-2" style={{ color: "var(--text2)" }}>{label}</div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- WHAT IS 108 CERTIFIED ---------------- */}
      <section id="research" className="relative py-24 md:py-36">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal className="max-w-3xl mb-20">
            <div className="text-xs font-mono uppercase tracking-[0.25em] mb-4" style={{ color: "var(--accent)" }}>What is 108 Certified</div>
            <h2 className="font-head font-extrabold text-4xl md:text-6xl tracking-tighter leading-[0.95]" style={{ color: "var(--text)" }}>
              A product doesn't earn our mark<br />by paying for it.
            </h2>
            <p className="mt-6 text-lg leading-relaxed" style={{ color: "var(--text2)" }}>
              It earns it by surviving nine stages of independent scrutiny. This is the 108 process — the same journey every certified product must complete.
            </p>
          </Reveal>
          <ProcessTimeline />
        </div>
      </section>

      {/* ---------------- LIVE WORLD MAP ---------------- */}
      <section id="countries" className="relative py-24 md:py-32" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <Reveal className="lg:col-span-4">
              <div className="text-xs font-mono uppercase tracking-[0.25em] mb-4" style={{ color: "var(--accent)" }}>Live Discovery Map</div>
              <h2 className="font-head font-extrabold text-4xl md:text-5xl tracking-tighter leading-[0.95] mb-5" style={{ color: "var(--text)" }}>Nutrition travels the world to reach India.</h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text2)" }}>
                Every certified product originates somewhere. Click a country to explore its top brands, certified products, lab reports and research.
              </p>
              <div className="flex flex-wrap gap-2">
                {countries.filter((c) => c.code !== "IN").map((c) => (
                  <Link key={c.code} to={`/country/${c.code}`} data-testid={`country-chip-${c.code}`} className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-full transition-colors hover:bg-white/5" style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
                    <span>{c.flag}</span> {c.name}
                  </Link>
                ))}
              </div>
            </Reveal>
            <Reveal className="lg:col-span-8" delay={0.15}>
              <div className="relative rounded-3xl p-6 md:p-10 grain overflow-hidden" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                <WorldMap countries={countries} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- EXPLORE BY GOAL ---------------- */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.25em] mb-4" style={{ color: "var(--accent)" }}>Explore by Goal</div>
              <h2 className="font-head font-extrabold text-4xl md:text-5xl tracking-tighter" style={{ color: "var(--text)" }}>What are you training for?</h2>
            </div>
            <Link to="/explore" className="inline-flex items-center gap-2 text-sm font-semibold link-underline" style={{ color: "var(--text)" }}>View all products <ArrowUpRight size={16} /></Link>
          </Reveal>
          <motion.div variants={stagger(0.05)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {GOALS.map((g, i) => (
              <motion.div key={g.key} variants={fadeUp}>
                <Link to={`/explore?goal=${g.key}`} data-testid={`goal-${g.key}`} className="group relative flex items-center justify-between overflow-hidden rounded-2xl p-6 md:p-7 hover-lift" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                  <span className="font-head font-bold text-lg md:text-xl" style={{ color: "var(--text)" }}>{g.label}</span>
                  <ArrowUpRight size={20} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" style={{ color: "var(--accent)" }} />
                  <span className="absolute left-0 bottom-0 h-0.5 w-0 group-hover:w-full transition-all duration-500" style={{ background: "var(--accent)" }} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------------- FEATURED PRODUCTS ---------------- */}
      <section className="relative py-24 md:py-32" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.25em] mb-4" style={{ color: "var(--accent)" }}>Featured · 108 Certified</div>
              <h2 className="font-head font-extrabold text-4xl md:text-5xl tracking-tighter" style={{ color: "var(--text)" }}>Research, not advertising.</h2>
            </div>
          </Reveal>
          <motion.div variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ---------------- SCORE SYSTEM ---------------- */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="text-xs font-mono uppercase tracking-[0.25em] mb-4" style={{ color: "var(--accent)" }}>The 108 Scoring System</div>
            <h2 className="font-head font-extrabold text-4xl md:text-5xl tracking-tighter leading-[0.95] mb-6" style={{ color: "var(--text)" }}>One score. Seven dimensions. Zero bias.</h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text2)" }}>Every product receives a transparent 108 Score from 0–100, calculated across seven independent dimensions — weighted by scientific evidence and lab results.</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {["Transparency", "Ingredients", "Scientific Evidence", "Testing", "Manufacturing", "Brand Reputation", "Value"].map((d) => (
                <div key={d} className="flex items-center gap-2 text-sm" style={{ color: "var(--text)" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} /> {d}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15} className="grid place-items-center">
            <div className="relative rounded-3xl p-12 grain" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <ScoreGauge score={94} size={240} stroke={14} />
              <div className="text-center mt-6 font-mono text-xs tracking-widest" style={{ color: "var(--text2)" }}>SAMPLE CERTIFIED PRODUCT</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- EDITORIAL MARQUEE ---------------- */}
      <section className="py-10 overflow-hidden" style={{ background: "var(--accent)" }}>
        <Marquee gradient={false} speed={45}>
          {["Science over marketing", "Independently tested", "No brand pays for a score", "Verified for India", "Discover. Test. Certify."].map((t, i) => (
            <span key={i} className="mx-16 font-head font-extrabold text-3xl md:text-5xl tracking-tight" style={{ color: "#fff" }}>{t}</span>
          ))}
        </Marquee>
      </section>

      {/* ---------------- INGREDIENT + AI ---------------- */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10">
          <Reveal className="mb-12">
            <div className="text-xs font-mono uppercase tracking-[0.25em] mb-4" style={{ color: "var(--accent)" }}>Explore by Ingredient</div>
            <h2 className="font-head font-extrabold text-4xl md:text-5xl tracking-tighter" style={{ color: "var(--text)" }}>Know exactly what you're taking.</h2>
          </Reveal>
          <div className="flex flex-wrap gap-3 mb-20">
            {INGREDIENTS.map((ing) => (
              <Link key={ing.key} to={`/explore?ingredient=${ing.key}`} data-testid={`ingredient-${ing.key}`} className="px-5 py-3 rounded-full text-sm font-medium transition-colors hover:bg-white/5" style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
                {ing.label}
              </Link>
            ))}
          </div>
          <Reveal><AIRecommender /></Reveal>
        </div>
      </section>

      {/* ---------------- ORGANICS TEASER ---------------- */}
      <section className="relative">
        <div className="theme-organics grain relative overflow-hidden py-24 md:py-36" style={{ background: "var(--bg)" }}>
          <div className="max-w-[1400px] mx-auto px-5 lg:px-10 grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] mb-6" style={{ color: "var(--accent)" }}>
                <Leaf size={14} /> Our Second Platform
              </div>
              <h2 className="font-head font-normal text-5xl md:text-7xl leading-[0.95] mb-6" style={{ color: "var(--text)" }}>
                From the Himalayas.<br /><em>To your home.</em>
              </h2>
              <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: "var(--text2)" }}>
                108 Organics brings you pure, traceable produce harvested by hand from the high orchards and forests of the Indian Himalayas.
              </p>
              <Link to="/organics" data-testid="organics-teaser-btn" className="inline-flex items-center gap-2 h-14 px-8 rounded-full font-semibold transition-transform hover:-translate-y-0.5" style={{ background: "var(--accent)", color: "#fff" }}>
                Enter 108 Organics <ArrowRight size={18} />
              </Link>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                <img src="https://images.pexels.com/photos/32261635/pexels-photo-32261635.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720" alt="Himalayan orchards" className="w-full h-full object-cover" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer variant="certified" />
    </div>
  );
}
