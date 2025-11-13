// src/pages/Favorites.jsx
import { useEffect, useState } from "react";
import { myFavorites, removeFavorite } from "../api/artworks";
import Swal from "sweetalert2";

export default function Favorites() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const r = await myFavorites();
      setList(r.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRemove = async (id) => {
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

    try {
      setBusyId(id);
      await removeFavorite(id);
      await Swal.fire({
        icon: "success",
        title: "Removed",
        timer: 1200,
        showConfirmButton: false,
      });
      load();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err?.response?.data?.message || err?.message || "Try again.",
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* Heading */}
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold inter-font">My Favorites</h1>
        <p className="mt-1 text-sm opacity-70 montserrat-font">
          Your saved artworks in one place.
        </p>
      </header>

      {/* Table wrapper */}
      <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
          <p className="text-sm montserrat-font">
            Total items: <span className="font-semibold">{list.length}</span>
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra-zebra w-full">
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
              {/* Loading skeletons */}
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

              {/* Data rows */}
              {!loading &&
                list.map((f, idx) => {
                  const art = f.art;
                  return (
                    <tr key={art._id} className="hover">
                      {/* Serial */}
                      <td className="font-semibold">{idx + 1}</td>

                      {/* Artwork preview */}
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
                              {art.title}
                            </div>
                            <div className="text-xs opacity-70 montserrat-font line-clamp-1">
                              {art.medium || "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span className="badge badge-primary font-semibold">
                          {art.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="text-right montserrat-font">
                        {art.price
                          ? `$${Number(art.price).toLocaleString()}`
                          : "—"}
                      </td>

                      {/* Remove button */}
                      <td className="text-right">
                        <button
                          onClick={() => handleRemove(art._id)}
                          className={`btn btn-outline btn-sm montserrat-font ${
                            busyId === art._id
                              ? "pointer-events-none opacity-60"
                              : ""
                          }`}
                        >
                          {busyId === art._id ? (
                            <>
                              <span className="loading loading-spinner loading-xs"></span>
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

        {/* Empty state */}
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
