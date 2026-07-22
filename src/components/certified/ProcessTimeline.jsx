import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, FlaskConical, ShoppingBag, Microscope, ListChecks, Fingerprint, BookOpenCheck, Video, BadgeCheck } from "lucide-react";

const STEPS = [
  { n: "01", title: "Discover", desc: "We scan the globe for the products athletes actually trust and talk about.", Icon: Search },
  { n: "02", title: "Research", desc: "We read the studies, the labels and the fine print — so you don't have to.", Icon: BookOpenCheck },
  { n: "03", title: "Purchase", desc: "We buy anonymously from the open market. No free samples. No bias.", Icon: ShoppingBag },
  { n: "04", title: "Lab Testing", desc: "Independent labs test for heavy metals, protein content and contaminants.", Icon: FlaskConical },
  { n: "05", title: "Ingredient Verification", desc: "We verify every claim on the label against what's actually inside.", Icon: ListChecks },
  { n: "06", title: "Authenticity Check", desc: "We confirm the product is genuine and free of amino spiking.", Icon: Fingerprint },
  { n: "07", title: "Scientific Review", desc: "A scientific panel reviews efficacy, dosing and evidence quality.", Icon: Microscope },
  { n: "08", title: "Video Research", desc: "We document our findings transparently on film for the community.", Icon: Video },
  { n: "09", title: "108 Certified", desc: "Only products that pass every stage earn the 108 Certified mark.", Icon: BadgeCheck },
];

export default function ProcessTimeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative max-w-4xl mx-auto">
      <div className="absolute left-[27px] md:left-1/2 top-2 bottom-2 w-px md:-translate-x-1/2" style={{ background: "var(--border)" }} />
      <motion.div className="absolute left-[27px] md:left-1/2 top-2 w-px md:-translate-x-1/2 origin-top" style={{ height, background: "var(--accent)" }} />

      <div className="space-y-10 md:space-y-16">
        {STEPS.map((s, i) => {
          const right = i % 2 === 1;
          return (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex items-start gap-6 md:gap-0 ${right ? "md:flex-row-reverse" : ""}`}
              data-testid={`timeline-step-${s.n}`}
            >
              <div className={`hidden md:block md:w-1/2 ${right ? "md:pl-16 md:text-left" : "md:pr-16 md:text-right"}`}>
                <StepCard s={s} align={right ? "left" : "right"} />
              </div>
              <div className="relative z-10 grid place-items-center w-14 h-14 rounded-full shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2" style={{ background: "var(--surface)", border: "1px solid var(--accent)" }}>
                <s.Icon size={20} style={{ color: "var(--accent)" }} />
              </div>
              <div className="md:hidden flex-1">
                <StepCard s={s} align="left" />
              </div>
              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const StepCard = ({ s, align }) => (
  <div className={align === "right" ? "md:ml-auto" : ""} style={{ maxWidth: 340 }}>
    <div className="font-mono text-xs tracking-[0.3em] mb-2" style={{ color: "var(--accent)" }}>STAGE {s.n}</div>
    <h3 className="font-head font-bold text-2xl mb-2" style={{ color: "var(--text)" }}>{s.title}</h3>
    <p className="text-sm leading-relaxed" style={{ color: "var(--text2)" }}>{s.desc}</p>
  </div>
);
