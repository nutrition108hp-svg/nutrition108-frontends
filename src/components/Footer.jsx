import { Link } from "react-router-dom";
import { Youtube, Instagram, MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "../lib/api";

const COLS = [
  { title: "Platform", links: [["Explore Certified", "/explore"], ["Compare Products", "/compare"], ["Brand Database", "/brands"], ["Research Library", "/research"]] },
  { title: "Company", links: [["Transparency Center", "/transparency"], ["Nutrition Passport", "/passport"], ["108 Organics", "/organics"], ["About Mission", "/transparency"]] },
];

export default function Footer({ variant = "certified" }) {
  const dark = variant === "certified";
  return (
    <footer className="relative overflow-hidden" style={{ background: dark ? "#050505" : "var(--surface)", borderTop: "1px solid var(--border)" }}>
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="grid place-items-center w-10 h-10 rounded-lg font-head font-extrabold" style={{ background: "var(--accent)", color: "#fff" }}>108</span>
              <span className="font-head font-bold text-lg" style={{ color: "var(--text)" }}>Nutrition 108 India</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: "var(--text2)" }}>
              India's first independent nutrition discovery, testing & certification platform. We help athletes discover the world's best nutrition through research, transparency and science — not marketing.
            </p>
            <div className="flex items-center gap-3 mt-8">
              {[[Youtube, "YouTube", "#"], [Instagram, "Instagram", "#"], [MessageCircle, "WhatsApp", `https://wa.me/${WHATSAPP_NUMBER}`]].map(([Icon, label, href]) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} data-testid={`footer-${label.toLowerCase()}`} className="grid place-items-center w-10 h-10 rounded-full hover-lift" style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>
          {COLS.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] mb-5" style={{ color: "var(--text2)" }}>{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(([label, to]) => (
                  <li key={label}><Link to={to} className="text-sm link-underline" style={{ color: "var(--text)" }}>{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div className="lg:col-span-3">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] mb-5" style={{ color: "var(--text2)" }}>The 108 Standard</h4>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text2)" }}>
              Every product is discovered, purchased anonymously, lab-tested and scientifically reviewed before earning certification. No brand pays for a score.
            </p>
          </div>
        </div>
        <div className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-xs font-mono" style={{ color: "var(--text2)" }}>© {new Date().getFullYear()} Nutrition 108 India. Independent & unbiased.</p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" className="text-xs link-underline" style={{ color: "var(--text2)" }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
