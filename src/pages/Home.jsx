// src/pages/Home.jsx
import { useEffect, useState, useCallback } from "react";
import Slider from "../components/Slider";
import AboutSection from "../components/About";
import FeaturedArtworks from "../components/FeaturedArtworks";
import TopArtists from "../components/TopArtists";
import CommunityHighlights from "../components/CommunityHighlights";
import Categories from "../components/Categories";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function getFeatured(signal) {
  const url = `${API_BASE.replace(/\/$/, "")}/arts/featured`;
  const res = await fetch(url, { method: "GET", signal, cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch featured artworks");
  const data = await res.json();
  return { data };
}

export default function Home() {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(true);

  const loadFeatured = useCallback(async (signal) => {
    setBusy(true);
    try {
      const r = await getFeatured(signal);
      setItems(r.data || []);
    } catch (err) {
      if (err.name === "AbortError") return;
      // keep UX simple: log error and show empty state
      console.error("getFeatured error:", err);
      setItems([]);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadFeatured(controller.signal);

    // re-fetch when window/tab regains focus (helps reflect newly added artworks)
    const onFocus = () => {
      // don't create a new controller here — use a quick fetch without cancellation
      loadFeatured();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      controller.abort();
      window.removeEventListener("focus", onFocus);
    };
  }, [loadFeatured]);

  return (
    <div className="">
      <Slider />
      <Categories />
      <AboutSection />
      <FeaturedArtworks items={items} loading={busy} />
      <CommunityHighlights />
      <TopArtists />
    </div>
  );
}
