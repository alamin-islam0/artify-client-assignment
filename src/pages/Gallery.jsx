import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

// Set your API base URL via environment variable
const API_BASE = process.env.REACT_APP_API_URL || "";

export default function Gallery() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  // try to obtain the logged-in user's email. Many apps store this in localStorage after login.
  // If you use an auth context, replace this with the appropriate value.
  const userEmail = localStorage.getItem("userEmail") || "";

  // Fetch user's artworks from server
  const load = async (signal) => {
    setLoading(true);
    try {
      if (!userEmail) {
        setList([]);
        return;
      }

      const url = `${API_BASE}/my-arts?email=${encodeURIComponent(userEmail)}`;
      const res = await fetch(url, { method: "GET", signal });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server responded ${res.status}`);
      }

      const data = await res.json();
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.name === "AbortError") return; // expected on unmount
      console.error("Failed to load my arts:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to load",
        text: err?.message || "Could not fetch artworks",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  // Delete artwork by id
  const handleDelete = async (id) => {
    const ok = await Swal.fire({
      title: "Delete this artwork?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    }).then((r) => r.isConfirmed);

    if (!ok) return;

    setBusyId(id);

    // optimistic UI: remove item immediately, keep a copy to restore on failure
    const previous = list;
    setList((s) => s.filter((a) => a._id !== id));

    try {
      const url = `${API_BASE}/arts/${encodeURIComponent(id)}`;
      const res = await fetch(url, { method: "DELETE" });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server responded ${res.status}`);
      }

      await Swal.fire({ icon: "success", title: "Deleted", timer: 1000, showConfirmButton: false });
    } catch (err) {
      console.error("Delete failed", err);
      // rollback
      setList(previous);
      Swal.fire({
        icon: "error",
        title: "Failed to delete",
        text: err?.message || "Try again.",
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold inter-font">My Gallery</h1>
        <p className="mt-1 text-sm opacity-70 montserrat-font">
          Manage your uploaded artworks in one place.
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
              {/* Loading skeleton rows */}
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
                list.map((a, idx) => (
                  <tr key={a._id} className="hover">
                    <td className="font-semibold">{idx + 1}</td>

                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={a.image}
                          alt={a.title}
                          className="h-14 w-20 rounded-lg object-cover ring-1 ring-base-300"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <div className="inter-font font-semibold line-clamp-1">
                            {a.title || "Untitled"}
                          </div>
                          <div className="text-xs opacity-70 montserrat-font line-clamp-1">
                            {a.userName || "You"} • {a.medium || "—"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-primary font-semibold">{a.category || "—"}</span>
                    </td>

                    <td className="text-right montserrat-font">
                      {a.price ? `$${Number(a.price).toLocaleString()}` : "—"}
                    </td>

                    <td className="text-right">
                      <button
                        onClick={() => handleDelete(a._id)}
                        className={`btn btn-outline btn-sm montserrat-font ${
                          busyId === a._id ? "pointer-events-none opacity-60" : ""
                        }`}
                      >
                        {busyId === a._id ? (
                          <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Deleting…
                          </>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {!loading && list.length === 0 && (
          <div className="p-10 text-center">
            <h3 className="text-lg font-semibold inter-font">No artworks yet</h3>
            <p className="opacity-70 montserrat-font">Add your first piece from the “Add Artwork” page.</p>
          </div>
        )}
      </div>
    </section>
  );
}
