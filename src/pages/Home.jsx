import { useEffect, useState } from "react";
import { getFeatured } from "../api/artworks";
import Slider from "../components/Slider";
import AboutSection from "../components/About";
import FeaturedArtworks from "../components/FeaturedArtworks";

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
    return () => { alive = false; };
  }, []);

  return (
    <div>
      <Slider />
      <AboutSection />
      <FeaturedArtworks items={items} loading={busy} />
    </div>
  );
}