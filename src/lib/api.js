import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const client = axios.create({ baseURL: API });

export const api = {
  stats: () => client.get("/stats").then((r) => r.data),
  products: (params = {}) => client.get("/products", { params }).then((r) => r.data),
  product: (id) => client.get(`/products/${id}`).then((r) => r.data),
  compare: (ids) => client.get("/compare", { params: { ids: ids.join(",") } }).then((r) => r.data),
  brands: () => client.get("/brands").then((r) => r.data),
  brand: (id) => client.get(`/brands/${id}`).then((r) => r.data),
  countries: () => client.get("/countries").then((r) => r.data),
  country: (code) => client.get(`/countries/${code}`).then((r) => r.data),
  articles: (category) => client.get("/articles", { params: category ? { category } : {} }).then((r) => r.data),
  article: (id) => client.get(`/articles/${id}`).then((r) => r.data),
  reviews: (productId, sort = "helpful") =>
    client.get("/reviews", { params: { ...(productId ? { product_id: productId } : {}), sort } }).then((r) => r.data),
  createReview: (payload) => client.post("/reviews", payload).then((r) => r.data),
  markHelpful: (id) => client.post(`/reviews/${id}/helpful`).then((r) => r.data),
  search: (q) => client.get("/search", { params: { q } }).then((r) => r.data),
  recommend: (query) => client.post("/ai/recommend", { query }).then((r) => r.data),
  organics: (region) => client.get("/organics/products", { params: region ? { region } : {} }).then((r) => r.data),
  organic: (id) => client.get(`/organics/products/${id}`).then((r) => r.data),
  organicsRegions: () => client.get("/organics/regions").then((r) => r.data),
  subscribe: (payload) => client.post("/subscribe", payload).then((r) => r.data),
};

export const GOALS = [
  { key: "muscle", label: "Muscle Building" },
  { key: "fat-loss", label: "Fat Loss" },
  { key: "recovery", label: "Recovery" },
  { key: "strength", label: "Strength" },
  { key: "gut-health", label: "Gut Health" },
  { key: "women", label: "Women" },
  { key: "longevity", label: "Longevity" },
  { key: "sleep", label: "Sleep" },
  { key: "general", label: "General Wellness" },
];

export const INGREDIENTS = [
  { key: "whey-protein", label: "Whey Protein" },
  { key: "creatine", label: "Creatine" },
  { key: "omega-3", label: "Omega 3" },
  { key: "vitamin-d", label: "Vitamin D" },
  { key: "magnesium", label: "Magnesium" },
  { key: "electrolytes", label: "Electrolytes" },
  { key: "collagen", label: "Collagen" },
  { key: "greens", label: "Greens" },
  { key: "pre-workout", label: "Pre Workout" },
];

export const WHATSAPP_NUMBER = "919999999999";
export const waLink = (product) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Nutrition 108, I'd like to buy ${product?.name || "a certified product"}. Please share details.`
  )}`;
