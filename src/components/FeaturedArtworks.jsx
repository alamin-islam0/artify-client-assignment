// src/components/FeaturedArtworks.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Avatar({ name = "Artist", photoURL }) {
  const [imgError, setImgError] = useState(false);

  const getInitials = (n) => {
    if (!n) return "U";
    const parts = String(n).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  if (photoURL && !imgError) {
    return (
      <img
        src={photoURL}
        alt={name}
        className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20"
        onError={() => setImgError(true)}
        referrerPolicy="no-referrer"
        loading="lazy"
      />
    );
  }

  return (
    <div className="h-8 w-8 rounded-full grid place-items-center bg-primary text-white text-xs font-bold ring-2 ring-primary/20">
      {getInitials(name)}
    </div>
  );
}

export default function FeaturedArtworks({ items = [], loading = false }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-extrabold inter-font">Featured Artworks</h2>
          <p className="mt-1 text-sm opacity-70 montserrat-font">
            Hand-picked, most recent public submissions.
          </p>
        </div>

        <Link to="/explore" className="btn btn-outline montserrat-font border-primary text-primary hover:bg-primary/5">
          Explore All
        </Link>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(loading ? Array.from({ length: 6 }) : items).map((a, idx) => {
          // NORMALIZE artist data: check multiple possible shapes
          const artistName = a?.artist?.name || a?.userName || a?.artistName || a?.user || a?.user_name || "Unknown Artist";
          // possible photo fields
          const artistPhoto =
            a?.artist?.photoURL ||
            a?.artistPhoto ||
            a?.artistPhotoUrl ||
            a?.photoURL ||
            a?.userPhoto ||
            "";

          return (
            <div
              key={a?._id ?? idx}
              className="group relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative">
                {loading && <div className="absolute inset-0 animate-pulse bg-base-200" />}

                <img
                  src={a?.image}
                  alt={a?.title || "Artwork"}
                  className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {!loading && (
                  <div className="absolute left-3 top-3 flex gap-2">
                    <span className="badge badge-primary font-semibold">{a?.category || "Artwork"}</span>
                    {a?.medium && <span className="badge bg-base-100/80 backdrop-blur text-xs">{a.medium}</span>}
                  </div>
                )}

                {!loading && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold inter-font line-clamp-1">
                  {loading ? <span className="inline-block h-5 w-2/3 animate-pulse rounded bg-base-200" /> : a?.title}
                </h3>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {loading ? (
                      <span className="h-8 w-8 animate-pulse rounded-full bg-base-200" />
                    ) : (
                      <Avatar name={artistName} photoURL={artistPhoto} />
                    )}

                    <div className="leading-tight">
                      <p className="text-sm font-semibold inter-font">
                        {loading ? <span className="inline-block h-4 w-28 animate-pulse rounded bg-base-200" /> : artistName}
                      </p>
                      <p className="text-xs opacity-60 montserrat-font">
                        {loading ? <span className="inline-block h-3 w-20 animate-pulse rounded bg-base-200" /> : (String(a?.visibility || "").toLowerCase() === "private" ? "Private" : "Public")}
                      </p>
                    </div>
                  </div>

                  {!loading && typeof a?.likes === "number" && (
                    <div className="badge bg-base-200 text-xs font-semibold">♥ {a.likes}</div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Link to={`/art/${a?._id}`} className="btn btn-primary btn-sm montserrat-font">View Details</Link>
                  <Link to="/explore" className="text-sm font-semibold text-primary hover:underline montserrat-font">More like this →</Link>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-primary/0 group-hover:ring-2 group-hover:ring-primary/20 transition-all" />
            </div>
          );
        })}
      </div>

      {!loading && items.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-base-300 p-10 text-center">
          <p className="inter-font text-lg font-semibold">No featured items yet</p>
          <p className="montserrat-font opacity-70">Try adding an artwork or check again later.</p>
        </div>
      )}
    </section>
  );
}