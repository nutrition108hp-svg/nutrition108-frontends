import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, BadgeCheck, Plus } from "lucide-react";
import { toast } from "sonner";
import { api } from "../../lib/api";

export default function ReviewsSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [sort, setSort] = useState("helpful");
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(() => {
  return api.reviews(productId, sort).then(setReviews).catch(() => {});
}, [productId, sort]);
  useEffect(() => {
  load();
}, [load]);

  const helpful = async (id) => {
    await api.markHelpful(id);
    load();
  };

  const avg = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : "—";

  return (
    <div data-testid="reviews-section">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="font-head font-extrabold text-5xl" style={{ color: "var(--text)" }}>{avg}</div>
          <div>
            <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} fill={s <= Math.round(avg) ? "var(--accent)" : "transparent"} style={{ color: "var(--accent)" }} />)}</div>
            <div className="text-sm mt-1" style={{ color: "var(--text2)" }}>{reviews.length} verified reviews</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select value={sort} onChange={(e) => setSort(e.target.value)} data-testid="reviews-sort" className="text-sm h-10 px-3 rounded-lg bg-transparent outline-none" style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
            <option value="helpful" style={{ color: "#000" }}>Most helpful</option>
            <option value="recent" style={{ color: "#000" }}>Most recent</option>
            <option value="rating" style={{ color: "#000" }}>Highest rated</option>
          </select>
          <button onClick={() => setShowForm((s) => !s)} data-testid="write-review-btn" className="inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-semibold" style={{ background: "var(--accent)", color: "#fff" }}>
            <Plus size={15} /> Write a review
          </button>
        </div>
      </div>

      {showForm && <ReviewForm productId={productId} onDone={() => { setShowForm(false); load(); }} />}

      <div className="space-y-4">
        {reviews.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="rounded-2xl p-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }} data-testid={`review-${r.id}`}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="grid place-items-center w-10 h-10 rounded-full font-head font-bold text-sm" style={{ background: "var(--accent)", color: "#fff" }}>{r.author[0]}</div>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-sm" style={{ color: "var(--text)" }}>{r.author} {r.verified && <BadgeCheck size={14} style={{ color: "var(--accent)" }} />}</div>
                  <div className="text-xs" style={{ color: "var(--text2)" }}>{r.role}</div>
                </div>
              </div>
              <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map((s) => <Star key={s} size={13} fill={s <= r.rating ? "var(--accent)" : "transparent"} style={{ color: "var(--accent)" }} />)}</div>
            </div>
            <h4 className="font-head font-bold text-lg mb-1.5" style={{ color: "var(--text)" }}>{r.title}</h4>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text2)" }}>{r.body}</p>
            {(r.pros?.length > 0 || r.cons?.length > 0) && (
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {r.pros?.length > 0 && <PC label="Pros" items={r.pros} color="#10B981" />}
                {r.cons?.length > 0 && <PC label="Cons" items={r.cons} color="#A1A1AA" />}
              </div>
            )}
            <button onClick={() => helpful(r.id)} data-testid={`helpful-${r.id}`} className="inline-flex items-center gap-2 text-xs" style={{ color: "var(--text2)" }}>
              <ThumbsUp size={13} /> Helpful ({r.helpful})
            </button>
          </motion.div>
        ))}
        {reviews.length === 0 && <div className="py-12 text-center text-sm" style={{ color: "var(--text2)" }}>No reviews yet. Be the first.</div>}
      </div>
    </div>
  );
}

const PC = ({ label, items, color }) => (
  <div className="rounded-lg p-3" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
    <div className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color }}>{label}</div>
    <ul className="space-y-1">{items.map((it, i) => <li key={i} className="text-xs" style={{ color: "var(--text2)" }}>· {it}</li>)}</ul>
  </div>
);

function ReviewForm({ productId, onDone }) {
  const [form, setForm] = useState({ author: "", role: "Athlete", rating: 5, title: "", body: "" });
  const submit = async () => {
    if (!form.author || !form.title || !form.body) { toast.error("Please fill name, title and review."); return; }
    await api.createReview({ ...form, product_id: productId, pros: [], cons: [] });
    toast.success("Thank you! Your review is published.");
    onDone();
  };
  return (
    <div className="rounded-2xl p-6 mb-6" style={{ background: "var(--surface)", border: "1px solid var(--accent)" }} data-testid="review-form">
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <input placeholder="Your name" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} data-testid="review-name" className="h-11 px-4 rounded-lg bg-transparent outline-none text-sm" style={{ border: "1px solid var(--border)", color: "var(--text)" }} />
        <input placeholder="Role (e.g. Powerlifter)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="h-11 px-4 rounded-lg bg-transparent outline-none text-sm" style={{ border: "1px solid var(--border)", color: "var(--text)" }} />
      </div>
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} onClick={() => setForm({ ...form, rating: s })} data-testid={`rating-star-${s}`}><Star size={22} fill={s <= form.rating ? "var(--accent)" : "transparent"} style={{ color: "var(--accent)" }} /></button>
        ))}
      </div>
      <input placeholder="Review title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="review-title" className="w-full h-11 px-4 rounded-lg bg-transparent outline-none text-sm mb-3" style={{ border: "1px solid var(--border)", color: "var(--text)" }} />
      <textarea placeholder="Share your experience…" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} data-testid="review-body" rows={4} className="w-full p-4 rounded-lg bg-transparent outline-none text-sm mb-3 resize-none" style={{ border: "1px solid var(--border)", color: "var(--text)" }} />
      <button onClick={submit} data-testid="submit-review" className="h-11 px-6 rounded-lg text-sm font-semibold" style={{ background: "var(--accent)", color: "#fff" }}>Publish review</button>
    </div>
  );
}
