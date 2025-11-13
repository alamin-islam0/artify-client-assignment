import { useEffect, useState } from "react";
import Slider from "../components/Slider";
import AboutSection from "../components/About";
import FeaturedArtworks from "../components/FeaturedArtworks";

export async function getFeatured() {
  const res = await fetch("http://localhost:3000/arts/featured");
  if (!res.ok) throw new Error("Failed to fetch featured artworks");
  const data = await res.json();
  return { data };
}

export default function Home() {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const r = await getFeatured();
        if (alive) setItems(r.data || []);
      } finally {
        if (alive) setBusy(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div>
      <Slider/>
      <AboutSection/>
      <FeaturedArtworks items={items} loading = {busy}/>
    </div>
  );
}