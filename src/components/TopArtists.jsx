// src/components/TopArtists.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Fade } from "react-awesome-reveal";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

function Avatar({ name = "Artist", photoURL, size = 56 }) {
  const [err, setErr] = useState(false);
  const initials = (name || "U")
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (photoURL && !err) {
    return (
      <img
        src={photoURL}
        alt={name}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setErr(true)}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full grid place-items-center bg-primary text-white font-semibold"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
}

export default function TopArtists({ limit = 8 }) {
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      try {
        const url = `${API_BASE}/arts?limit=1000&page=1`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to load artworks");
        const json = await res.json();
        // normalize array
        const arts = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];
        if (!alive) return;

        // group by userEmail
        const map = new Map();
        for (const a of arts) {
          const email = String(a.userEmail || a.artistEmail || "").toLowerCase();
          if (!email) continue;
          const entry = map.get(email) || { email, name: a.userName || "Unknown", photo: a.artistPhoto || "", artworks: 0, totalLikes: 0 };
          entry.artworks += 1;
          entry.totalLikes += Number(a.likes || 0);
          // prefer the earliest photo if empty
          if (!entry.photo && (a.artistPhoto || a.artistPhotoUrl || a.photoURL)) {
            entry.photo = a.artistPhoto || a.artistPhotoUrl || a.photoURL;
          }
          map.set(email, entry);
        }

        const arr = Array.from(map.values())
          .sort((x, y) => (y.totalLikes || 0) - (x.totalLikes || 0))
          .slice(0, limit);

        setArtists(arr);
      } catch (err) {
        console.error("TopArtists load error:", err);
        setArtists([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
      controller.abort();
    };
  }, [limit]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <Fade direction="up" triggerOnce>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl font-extrabold inter-font">Top Artists of the Week</h2>
            <p className="mt-1 text-sm opacity-70 montserrat-font">Artists with highest recent engagement (by likes).</p>
          </div>
        </div>
      </Fade>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-base-300 bg-base-100 p-5 animate-pulse" />
            ))
          : artists.map((a, idx) => (
              <Fade key={a.email} direction="up" delay={idx * 80} triggerOnce>
                <div className="rounded-xl border border-base-300 bg-base-100 p-5 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-4">
                    <Avatar name={a.name} photoURL={a.photo} size={64} />
                    <div className="min-w-0">
                      <div className="font-semibold inter-font text-lg line-clamp-1">{a.name}</div>
                      <div className="text-xs opacity-70 montserrat-font">{a.artworks} artworks</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-lg font-extrabold inter-font">{(a.totalLikes || 0).toLocaleString()}</div>
                      <div className="text-xs opacity-70 montserrat-font">Likes</div>
                    </div>
                  </div>
                </div>
              </Fade>
            ))}
      </div>
    </section>
  );
}