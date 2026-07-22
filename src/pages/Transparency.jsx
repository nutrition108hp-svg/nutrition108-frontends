import { motion } from "framer-motion";
import { ShieldCheck, Eye, Ban, FlaskConical, Award, XCircle, FileText } from "lucide-react";
import CertifiedNav from "../components/certified/CertifiedNav";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import EmailCapture from "../components/EmailCapture";

const CHAPTERS = [
  { n: "01", icon: Eye, title: "How products are selected", body: "We monitor what athletes actually buy and discuss — across forums, gyms and social platforms. Brands cannot apply or pay to be reviewed. We choose. Always." },
  { n: "02", icon: FlaskConical, title: "The testing process", body: "Products are purchased anonymously from the open market, then sent to accredited third-party laboratories. Labs test for heavy metals, protein content, microbiology and authenticity — blind to the brand." },
  { n: "03", icon: Award, title: "The 108 scoring system", body: "Seven weighted dimensions produce a single 0–100 score: Transparency, Ingredients, Scientific Evidence, Testing, Manufacturing, Brand Reputation and Value. The weighting is public." },
  { n: "04", icon: Ban, title: "Conflict of interest policy", body: "We accept no payment, sponsorship or free product from any brand in exchange for a score. Our WhatsApp purchase links are for user convenience — they never influence a rating." },
  { n: "05", icon: ShieldCheck, title: "How certification is awarded", body: "Only products that pass every stage of testing and score above our threshold earn the 108 Certified mark. Certification is time-stamped to the tested batch." },
  { n: "06", icon: XCircle, title: "How certification is removed", body: "If a product fails re-testing, changes its formula without disclosure, or is found counterfeit, its certification is revoked immediately and the change is logged publicly." },
];

export default function Transparency() {
  return (
    <div className="theme-certified min-h-screen">
      <CertifiedNav />
      <section className="relative pt-36 pb-20 grain overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,71,255,0.15), transparent 60%)" }} />
        <div className="relative max-w-[1400px] mx-auto px-5 lg:px-10 text-center">
          <div className="text-xs font-mono uppercase tracking-[0.25em] mb-6" style={{ color: "var(--accent)" }}>Transparency Center</div>
          <h1 className="font-head font-extrabold text-5xl md:text-8xl tracking-tighter leading-[0.9] mb-6 max-w-4xl mx-auto text-balance" style={{ color: "var(--text)" }}>Trust is earned in the open.</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text2)" }}>Everything about how we work — how we select, test, score and certify. No hidden methodology. No paid placements. Ever.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 lg:px-10 pb-24">
        <div className="space-y-4">
          {CHAPTERS.map((c, i) => (
            <Reveal key={c.n} delay={i * 0.05}>
              <div className="group relative rounded-3xl p-8 md:p-10 hover-lift" style={{ background: "var(--surface)", border: "1px solid var(--border)" }} data-testid={`transparency-chapter-${c.n}`}>
                <div className="flex items-start gap-6">
                  <div className="font-head font-extrabold text-5xl md:text-6xl leading-none opacity-20" style={{ color: "var(--accent)" }}>{c.n}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <c.icon size={20} style={{ color: "var(--accent)" }} />
                      <h3 className="font-head font-bold text-2xl" style={{ color: "var(--text)" }}>{c.title}</h3>
                    </div>
                    <p className="text-base leading-relaxed" style={{ color: "var(--text2)" }}>{c.body}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <div className="rounded-3xl p-10 text-center" style={{ background: "var(--accent)" }}>
            <FileText size={28} className="mx-auto mb-4 text-white" />
            <h3 className="font-head font-extrabold text-3xl mb-3 text-white">Annual Transparency Report</h3>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">Every year we publish the full record: products tested, certifications awarded, certifications revoked and lab partners used.</p>
            <button data-testid="download-transparency-report" className="h-12 px-7 rounded-full font-semibold bg-white" style={{ color: "var(--accent)" }}>Download 2025 report</button>
          </div>
        </Reveal>

        <Reveal className="mt-6">
          <EmailCapture source="transparency" title="Never miss a certification change." subtitle="Get an alert the moment a product earns — or loses — its 108 Certified mark. Independent, transparent, spam-free." />
        </Reveal>
      </section>
      <Footer variant="certified" />
    </div>
  );
}
