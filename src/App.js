import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";
import SmoothScroll from "@/components/SmoothScroll";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Product from "@/pages/Product";
import Compare from "@/pages/Compare";
import Brands from "@/pages/Brands";
import BrandDetail from "@/pages/BrandDetail";
import Country from "@/pages/Country";
import Research from "@/pages/Research";
import Article from "@/pages/Article";
import Transparency from "@/pages/Transparency";
import Passport from "@/pages/Passport";
import OrganicsHome from "@/pages/organics/OrganicsHome";
import OrganicsProduct from "@/pages/organics/OrganicsProduct";

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) { el.scrollIntoView({ behavior: "smooth" }); return; }
    }
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <SmoothScroll>
          <ScrollManager />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/brands/:id" element={<BrandDetail />} />
            <Route path="/country/:code" element={<Country />} />
            <Route path="/research" element={<Research />} />
            <Route path="/research/:id" element={<Article />} />
            <Route path="/transparency" element={<Transparency />} />
            <Route path="/passport" element={<Passport />} />
            <Route path="/organics" element={<OrganicsHome />} />
            <Route path="/organics/product/:id" element={<OrganicsProduct />} />
          </Routes>
          <Toaster position="bottom-right" theme="dark" richColors />
        </SmoothScroll>
      </BrowserRouter>
    </div>
  );
}

export default App;
