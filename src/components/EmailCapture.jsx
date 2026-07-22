import { useState } from "react";
import { motion } from "framer-motion";
import { BellRing, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";

// Certification Alerts email capture. variant: "certified" | "organics" | "inverse"
export default function EmailCapture({
  variant = "certified",
  source = "site",
  productId = null,
  title = "Get certification alerts.",
  subtitle = "Be the first to know when a product is certified — or loses its 108 mark. No spam, ever.",
  compact = false,
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | loading | done
  const inverse = variant === "inverse";

  const submit = async () => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) { toast.error("Please enter a valid email address."); return; }
    setState("loading");
    try {
      const res = await api.subscribe({ email, source, product_id: productId });
      setState("done");
      toast.success(res.message || "You're on the list.");
    } catch {
      setState("idle");
      toast.error("Something went wrong. Please try again.");
    }
  };

  const accent = inverse ? "#fff" : "var(--accent)";
  const btnBg = inverse ? "#fff" : "var(--accent)";
  const btnColor = inverse ? "var(--accent)" : "#fff";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl ${compact ? "p-6" : "p-8 md:p-10"}`}
      style={inverse ? { background: "var(--accent)" } : { background: "var(--surface)", border: "1px solid var(--border)" }}
      data-testid="email-capture"
    >
      {!inverse && <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full opacity-25" style={{ background: "radial-gradient(circle, rgba(0,71,255,0.5), transparent 70%)" }} />}
      <div className="relative">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] mb-4" style={{ color: inverse ? "rgba(255,255,255,0.9)" : accent }}>
          <BellRing size={14} /> Certification Alerts
        </div>
        <h3 className={`font-head font-bold ${compact ? "text-xl" : "text-2xl md:text-3xl"} mb-2`} style={{ color: inverse ? "#fff" : "var(--text)" }}>{title}</h3>
        <p className={`text-sm leading-relaxed mb-6 ${compact ? "" : "max-w-md"}`} style={{ color: inverse ? "rgba(255,255,255,0.85)" : "var(--text2)" }}>{subtitle}</p>

        {state === "done" ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: inverse ? "#fff" : "var(--accent)" }} data-testid="email-capture-success">
            <span className="grid place-items-center w-7 h-7 rounded-full" style={{ background: inverse ? "rgba(255,255,255,0.2)" : "rgba(0,71,255,0.12)" }}><Check size={15} /></span>
            You're subscribed.
          </motion.div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="you@email.com"
              data-testid="email-capture-input"
              className="flex-1 h-13 py-3.5 px-5 rounded-xl bg-transparent outline-none text-base"
              style={{ border: `1px solid ${inverse ? "rgba(255,255,255,0.4)" : "var(--border)"}`, color: inverse ? "#fff" : "var(--text)" }}
            />
            <button
              onClick={submit}
              disabled={state === "loading"}
              data-testid="email-capture-submit"
              className="h-13 py-3.5 px-7 rounded-xl font-semibold inline-flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5"
              style={{ background: btnBg, color: btnColor }}
            >
              {state === "loading" ? <Loader2 size={18} className="animate-spin" /> : "Notify me"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
