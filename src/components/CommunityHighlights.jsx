// src/components/CommunityHighlights.jsx
import React, { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Link } from "react-router-dom";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

function Excerpt({ text = "", len = 120 }) {
  if (!text) return null;
  return <p className="text-sm opacity-80 mt-2 line-clamp-3">{text.length > len ? text.slice(0, len).trim() + "…" : text}</p>;
}

export default function CommunityHighlights() {
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      try {
        const url = `${API_BASE}/arts?limit=6&page=1&sort=recent`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to fetch recent arts");
        const json = await res.json();
        const arr = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];
        if (!alive) return;

        setRecent(arr.slice(0, 6));

        // compute top categories from these (or broader set)
        const catMap = {};
        for (const a of arr) {
          const c = (a.category || "Uncategorized").trim();
          catMap[c] = (catMap[c] || 0) + 1;
        }
        const cats = Object.entries(catMap).sort((a,b)=>b[1]-a[1]).map(([name,count])=>({name,count}));
        setCategories(cats.slice(0, 5));
      } catch (err) {
        console.error("CommunityHighlights load error:", err);
        setRecent([]);
        setCategories([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
      controller.abort();
    };
  }, []);

  return (
    <section className="bg-base-200 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <Fade direction="up" triggerOnce>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-3xl font-extrabold inter-font">Community Highlights</h2>
              <p className="mt-1 text-sm opacity-70 montserrat-font">Fresh uploads and trending categories from the community.</p>
            </div>
            <Link to="/explore" className="btn btn-outline montserrat-font border-primary text-primary hover:bg-primary/5">Explore All</Link>
          </div>
        </Fade>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-4">
            <div className="rounded-xl border border-base-300 bg-base-100 p-4">
              <h3 className="font-semibold">Trending Categories</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => <span key={i} className="inline-block h-6 w-24 rounded bg-base-200 animate-pulse" />)
                ) : categories.length ? (
                  categories.map((c) => (
                    <span key={c.name} className="badge badge-outline">{c.name} <span className="ml-2 text-xs opacity-70">({c.count})</span></span>
                  ))
                ) : (
                  <div className="text-sm opacity-70">No categories yet</div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-base-300 bg-base-100 p-4">
              <h3 className="font-semibold">Quick Tips</h3>
              <ul className="mt-2 space-y-2 text-sm opacity-80">
                <li>Use clear images for best engagement.</li>
                <li>Tag your artwork with an appropriate category and medium.</li>
                <li>Feature your best pieces to get highlighted on Home.</li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-2 grid gap-4">
            {(loading ? Array.from({ length: 3 }) : recent).map((art, i) => (
              <Fade key={art?._id ?? i} direction="up" delay={i * 80} triggerOnce>
                <div className="rounded-xl border border-base-300 bg-base-100 overflow-hidden flex gap-4 p-3 items-center">
                  <img src={art?.image} alt={art?.title} className="h-28 w-28 object-cover rounded-lg" loading="lazy" />
                  <div className="min-w-0">
                    <div className="font-semibold inter-font line-clamp-1">{art?.title || (loading ? null : "Untitled")}</div>
                    <div className="text-xs opacity-70 montserrat-font">{art?.userName || art?.userEmail}</div>
                    <Excerpt text={art?.description} len={140} />
                    <div className="mt-2">
                      <Link to={`/art/${art?._id}`} className="text-sm font-semibold text-primary hover:underline">View Details →</Link>
                    </div>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}