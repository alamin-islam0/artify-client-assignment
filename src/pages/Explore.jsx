// src/pages/Explore.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/* Avatar helper copied from FeaturedArtworks.jsx */
function Avatar({ name = "Artist", photoURL }) {
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={name}
        className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20"
      />
    );
  }
  const initials = name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="h-8 w-8 rounded-full grid place-items-center bg-primary text-white text-xs font-bold ring-2 ring-primary/20">
      {initials}
    </div>
  );
}

/* Card component EXACTLY like FeaturedArtworks */
function ArtworkCard({ a, loading }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative">
        {loading && <div className="absolute inset-0 animate-pulse bg-base-200" />}

        <img
          src={a?.image}
          alt={a?.title || "Artwork"}
          className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        {!loading && (
          <div className="absolute left-3 top-3 flex gap-2">
            <span className="badge badge-primary font-semibold">
              {a?.category || "Artwork"}
            </span>
            {a?.medium && (
              <span className="badge bg-base-100/80 backdrop-blur text-xs">
                {a.medium}
              </span>
            )}
          </div>
        )}

        {/* Title gradient */}
        {!loading && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-bold inter-font line-clamp-1">
          {loading ? (
            <span className="inline-block h-5 w-2/3 animate-pulse rounded bg-base-200" />
          ) : (
            a?.title
          )}
        </h3>

        {/* Artist */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {loading ? (
              <span className="h-8 w-8 animate-pulse rounded-full bg-base-200" />
            ) : (
              <Avatar name={a?.artist?.name} photoURL={a?.artist?.photoURL} />
            )}

            <div className="leading-tight">
              <p className="text-sm font-semibold inter-font">
                {loading ? (
                  <span className="inline-block h-4 w-28 animate-pulse rounded bg-base-200" />
                ) : (
                  a?.artist?.name || "Unknown Artist"
                )}
              </p>
              <p className="text-xs opacity-60 montserrat-font">
                {loading ? (
                  <span className="inline-block h-3 w-20 animate-pulse rounded bg-base-200" />
                ) : a?.visibility === "private" ? (
                  "Private"
                ) : (
                  "Public"
                )}
              </p>
            </div>
          </div>

          {!loading && typeof a?.likes === "number" && (
            <div className="badge bg-base-200 text-xs font-semibold">
              ♥ {a.likes}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <Link
            to={`/art/${a?._id}`}
            className="btn btn-primary btn-sm montserrat-font"
          >
            View Details
          </Link>

          <span className="text-sm font-semibold text-primary montserrat-font">
            {a?.category}
          </span>
        </div>
      </div>

      {/* Hover ring */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-primary/0 group-hover:ring-2 group-hover:ring-primary/20 transition-all" />
    </div>
  );
}

async function getExplore({ search = "", category = "", page = 1, limit = 12 } = {}) {
  try {
    const url = new URL("https://artify-server-assignment.onrender.com/arts");
    url.searchParams.set("page", page);
    url.searchParams.set("limit", limit);
    if (search) url.searchParams.set("search", search);
    if (category) url.searchParams.set("category", category);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!res.ok) {
      // you can throw to be handled by caller; here we return empty array for resilience
      console.error("getExplore failed:", res.status, res.statusText);
      return { data: [], total: 0, page: Number(page), limit: Number(limit) };
    }

    const json = await res.json();

    // backend returns { total, page, limit, data }
    // adapt if your backend returns plain array
    if (Array.isArray(json)) {
      return { data: json, total: json.length, page: Number(page), limit: Number(limit) };
    }

    return { data: json.data || json, total: json.total || 0, page: json.page || Number(page), limit: json.limit || Number(limit) };
  } catch (err) {
    console.error("getExplore error:", err);
    return { data: [], total: 0, page: Number(page), limit: Number(limit) };
  }
}

export default function Explore() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const r = await getExplore({ search: q, category: cat });
    setList(r.data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* HEADER */}
      <header className="mb-6">
        <h2 className="text-3xl font-extrabold inter-font">Explore Artworks</h2>
        <p className="mt-1 text-sm opacity-70 montserrat-font">
          Search, filter, and discover more artworks.
        </p>
      </header>

      {/* SEARCH AREA (unchanged logic, updated styling) */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title or artist"
          className="input input-bordered w-full montserrat-font"
        />

        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="select select-bordered montserrat-font w-full sm:w-48"
        >
          <option value="">All</option>
          <option>Painting</option>
          <option>Digital</option>
          <option>Sculpture</option>
        </select>

        <button onClick={load} className="btn btn-primary montserrat-font w-full sm:w-auto">
          Search
        </button>
      </div>

      {/* GRID (exact same design as FeaturedArtworks) */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(loading ? Array.from({ length: 6 }) : list).map((a, idx) => (
          <ArtworkCard key={a?._id ?? idx} a={a} loading={loading} />
        ))}
      </div>

      {/* EMPTY STATE */}
      {!loading && list.length === 0 && (
        <div className="mt-10 text-center border border-dashed border-base-300 p-10 rounded-xl">
          <h3 className="text-lg font-semibold inter-font">No artworks found</h3>
          <p className="opacity-70 montserrat-font">
            Try another search or category.
          </p>
        </div>
      )}
    </section>
  );
}