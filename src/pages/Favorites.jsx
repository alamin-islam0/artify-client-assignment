import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import Swal from "sweetalert2";
import Loading from "../components/Loading";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

export default function Favorites() {
  const { user, loading: authLoading } = useAuth();
  const [list, setList] = useState([]); // normalized: { favoriteId, createdAt, art }
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const filteredList = list.filter((item) => {
    const title = item.art?.title || "";
    const medium = item.art?.medium || "";
    const category = item.art?.category || "";

    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      medium.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? category === filter : true;

    return matchesSearch && matchesFilter;
  });

  // Try multiple endpoints to maximize compatibility
  const fetchFavoritesFor = async (email, signal) => {
    if (!email) return [];

    // 1) /favorites?email=
    try {
      const url = `${API_BASE}/favorites?email=${encodeURIComponent(email)}`;
      const res = await fetch(url, { method: "GET", signal });
      if (res.ok) {
        const json = await res.json();
        // server might return array of favorites or { favorites: [...], arts: [...] } or { data: [...] }
        if (Array.isArray(json)) {
          // might be normalized already: each item could be { favoriteId, createdAt, art }
          return json.map((f) => {
            // If shape is { favoriteId, createdAt, art } keep; if it's { _id, artId, userEmail } adapt
            if (f.favoriteId || f._id) {
              return {
                favoriteId: f.favoriteId ?? f._id,
                createdAt: f.createdAt ?? f.createdAt,
                art: f.art ?? f.artId ?? null,
              };
            }
            // fallback: if server returned art docs directly
            return { favoriteId: null, createdAt: null, art: f };
          });
        }
        // maybe server returned { favorites: [...], arts: [...] }
        if (Array.isArray(json.favorites) && Array.isArray(json.arts)) {
          const favs = json.favorites;
          const arts = json.arts;
          return favs.map((f) => {
            const art = arts.find(
              (a) =>
                String(a._id) === String(f.artId) ||
                String(a._id) === String(f.artId?._id)
            );
            return {
              favoriteId: f._id,
              createdAt: f.createdAt,
              art: art || null,
            };
          });
        }
        // maybe server returned { data: [...] }
        if (Array.isArray(json.data)) {
          return json.data.map((f) => {
            if (f.art)
              return {
                favoriteId: f.favoriteId ?? f._id ?? null,
                createdAt: f.createdAt,
                art: f.art,
              };
            // assume direct art docs
            return { favoriteId: null, createdAt: null, art: f };
          });
        }
      }
    } catch (e) {
      if (e.name !== "AbortError")
        console.warn("fetch /favorites?email failed", e);
    }

    // 2) /favorites?userEmail=
    try {
      const url = `${API_BASE}/favorites?userEmail=${encodeURIComponent(
        email
      )}`;
      const res = await fetch(url, { method: "GET", signal });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) {
          return json.map((f) => {
            if (f.favoriteId || f._id) {
              return {
                favoriteId: f.favoriteId ?? f._id,
                createdAt: f.createdAt ?? f.createdAt,
                art: f.art ?? null,
              };
            }
            return { favoriteId: null, createdAt: null, art: f };
          });
        }
        if (Array.isArray(json.data)) {
          return json.data.map((f) => ({
            favoriteId: f.favoriteId ?? f._id ?? null,
            createdAt: f.createdAt,
            art: f.art ?? f,
          }));
        }
      }
    } catch (e) {
      if (e.name !== "AbortError")
        console.warn("fetch /favorites?userEmail failed", e);
    }

    // 3) Some servers return favorites by POST or different shape — return empty fallback
    return [];
  };

  const load = async (signal) => {
    setLoading(true);
    try {
      if (!user?.email) {
        setList([]);
        return;
      }
      const data = await fetchFavoritesFor(user.email, signal);
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("Failed to load favorites:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to load",
        text: err?.message || "Could not fetch favorites",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    if (!authLoading) load(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, authLoading]);

  const handleRemove = async (artOrFavoriteId) => {
    // artOrFavoriteId could be art._id (from UI) or favoriteId; detect from list
    // find matching favorite record
    const found = list.find(
      (f) =>
        String(f.favoriteId) === String(artOrFavoriteId) ||
        String(f.art?._id) === String(artOrFavoriteId)
    );
    const favoriteId = found?.favoriteId ?? null;
    const artId = found?.art?._id ?? artOrFavoriteId;

    const ok = await Swal.fire({
      title: "Remove from Favorites?",
      text: "Are you sure you want to remove this artwork?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    }).then((r) => r.isConfirmed);

    if (!ok) return;

    setBusyId(artId);

    // optimistic update: remove from UI
    const previous = list;
    setList((s) =>
      s.filter(
        (f) =>
          String(f.art?._id) !== String(artId) &&
          String(f.favoriteId) !== String(favoriteId)
      )
    );

    try {
      // 1) if we have favoriteId, try DELETE /favorites/:id
      if (favoriteId) {
        const url = `${API_BASE}/favorites/${encodeURIComponent(favoriteId)}`;
        const res = await fetch(url, { method: "DELETE" });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Server responded ${res.status}`);
        }
      } else {
        // 2) fallback: DELETE /favorites?userEmail=...&artId=...
        if (!user?.email) throw new Error("Not authenticated");
        const url = `${API_BASE}/favorites?userEmail=${encodeURIComponent(
          user.email
        )}&artId=${encodeURIComponent(artId)}`;
        const res = await fetch(url, { method: "DELETE" });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Server responded ${res.status}`);
        }
      }

      await Swal.fire({
        icon: "success",
        title: "Removed",
        timer: 1000,
        showConfirmButton: false,
      });
      // reload to ensure consistent state
      const controller = new AbortController();
      const fresh = await fetchFavoritesFor(user.email, controller.signal);
      setList(Array.isArray(fresh) ? fresh : []);
    } catch (err) {
      console.error("Failed to remove favorite:", err);
      // rollback
      setList(previous);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err?.message || "Try again.",
      });
    } finally {
      setBusyId(null);
    }
  };

  if (authLoading) {
    return <Loading />;
  }

  if (!user?.email) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-bold mb-3">You are not logged in</h2>
        <p className="opacity-70 mb-6">Please log in to view your favorites.</p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* Heading */}
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold inter-font">My Favorites</h1>
        <p className="mt-1 text-sm opacity-70 montserrat-font">
          Your saved artworks in one place.
        </p>
      </header>

      <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4 px-4 py-3 border-b border-base-300">
          <div className="form-control flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search favorites..."
                className="input input-bordered w-full pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <select
            className="select select-bordered w-full sm:w-auto"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Painting">Painting</option>
            <option value="Digital">Digital</option>
            <option value="Sculpture">Sculpture</option>
            <option value="Uncategorized">Uncategorized</option>
          </select>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-b border-base-300 bg-base-50/50">
          <p className="text-sm montserrat-font">
            Showing <span className="font-semibold">{filteredList.length}</span>{" "}
            of <span className="font-semibold">{list.length}</span> items
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="w-16">#</th>
                <th>Artwork</th>
                <th className="w-40">Category</th>
                <th className="w-32 text-right">Price</th>
                <th className="w-36 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`sk-${i}`}>
                    <td>
                      <span className="inline-block h-4 w-6 rounded bg-base-200 animate-pulse" />
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-20 rounded-lg bg-base-200 animate-pulse" />
                        <div>
                          <div className="h-4 w-40 rounded bg-base-200 animate-pulse mb-2" />
                          <div className="h-3 w-24 rounded bg-base-200 animate-pulse" />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="inline-block h-4 w-24 rounded bg-base-200 animate-pulse" />
                    </td>
                    <td className="text-right">
                      <span className="inline-block h-4 w-12 rounded bg-base-200 animate-pulse" />
                    </td>
                    <td className="text-right">
                      <span className="inline-block h-9 w-24 rounded bg-base-200 animate-pulse" />
                    </td>
                  </tr>
                ))}

              {!loading &&
                filteredList.map((f, idx) => {
                  const art = f.art || {};
                  return (
                    <tr key={art._id ?? f.favoriteId ?? idx} className="hover">
                      <td className="font-semibold">{idx + 1}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <img
                            src={art.image}
                            alt={art.title}
                            className="h-14 w-20 rounded-lg object-cover ring-1 ring-base-300"
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <div className="inter-font font-semibold line-clamp-1">
                              {art.title || "Untitled"}
                            </div>
                            <div className="text-xs opacity-70 montserrat-font line-clamp-1">
                              {art.medium || "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-primary font-semibold">
                          {art.category || "—"}
                        </span>
                      </td>
                      <td className="text-right montserrat-font">
                        {art.price
                          ? `$${Number(art.price).toLocaleString()}`
                          : "—"}
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => handleRemove(f.favoriteId ?? art._id)}
                          className={`btn btn-outline btn-sm montserrat-font ${
                            busyId === (art._id ?? f.favoriteId)
                              ? "pointer-events-none opacity-60"
                              : ""
                          }`}
                        >
                          {busyId === (art._id ?? f.favoriteId) ? (
                            <>
                              <span className="loading loading-spinner loading-xs" />{" "}
                              Removing…
                            </>
                          ) : (
                            "Remove"
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {!loading && list.length === 0 && (
          <div className="p-10 text-center">
            <h3 className="text-lg font-semibold inter-font">
              No favorites yet
            </h3>
            <p className="opacity-70 montserrat-font">
              Explore artworks and add some to your favorites.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
