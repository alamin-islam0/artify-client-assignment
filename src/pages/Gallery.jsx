// src/pages/Gallery.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../providers/AuthProvider";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

export default function Gallery() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  // Fetch user's artworks from server (tries /my-arts first; fallback to /arts queries)
  const fetchMyArts = async (email, signal) => {
    if (!email) return [];

    // 1) try /my-arts?email=
    try {
      const url1 = `${API_BASE}/my-arts?email=${encodeURIComponent(email)}`;
      const r1 = await fetch(url1, { method: "GET", signal });
      if (r1.ok) {
        const json = await r1.json();
        if (Array.isArray(json) && json.length) return json;
      }
    } catch (e) {
      if (e.name !== "AbortError") console.warn("my-arts fetch failed", e);
    }

    // 2) try /arts?artistEmail=
    try {
      const url2 = `${API_BASE}/arts?artistEmail=${encodeURIComponent(email)}&page=1&limit=100`;
      const r2 = await fetch(url2, { method: "GET", signal });
      if (r2.ok) {
        const json = await r2.json();
        if (Array.isArray(json)) return json;
        if (Array.isArray(json.data)) return json.data;
      }
    } catch (e) {
      if (e.name !== "AbortError") console.warn("arts?artistEmail fetch failed", e);
    }

    // 3) try /arts?userEmail=
    try {
      const url3 = `${API_BASE}/arts?userEmail=${encodeURIComponent(email)}&page=1&limit=100`;
      const r3 = await fetch(url3, { method: "GET", signal });
      if (r3.ok) {
        const json = await r3.json();
        if (Array.isArray(json)) return json;
        if (Array.isArray(json.data)) return json.data;
      }
    } catch (e) {
      if (e.name !== "AbortError") console.warn("arts?userEmail fetch failed", e);
    }

    return [];
  };

  const load = async (signal) => {
    setLoading(true);
    try {
      if (!user?.email) {
        setList([]);
        return;
      }
      const data = await fetchMyArts(user.email, signal);
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.name === "AbortError") return;
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
    // wait for auth to settle; if auth still loading, don't call backend yet
    if (!authLoading) {
      load(controller.signal);
    }
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, authLoading]);

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
      setList(previous);
      Swal.fire({ icon: "error", title: "Failed to delete", text: err?.message || "Try again." });
    } finally {
      setBusyId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p>Checking authentication…</p>
      </div>
    );
  }

  if (!user?.email) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-bold mb-3">You are not logged in</h2>
        <p className="opacity-70 mb-6">Please log in to view and manage your artworks.</p>
        <div className="flex justify-center gap-3">
          <button onClick={() => navigate("/login")} className="btn btn-primary">Go to Login</button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold inter-font">My Gallery</h1>
        <p className="mt-1 text-sm opacity-70 montserrat-font">Manage artworks uploaded by <span className="font-semibold">{user.email}</span></p>
      </header>

      {/* Table wrapper */}
      <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
          <p className="text-sm montserrat-font">Total items: <span className="font-semibold">{list.length}</span></p>
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
                    <td><span className="inline-block h-4 w-6 rounded bg-base-200 animate-pulse" /></td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-20 rounded-lg bg-base-200 animate-pulse" />
                        <div>
                          <div className="h-4 w-40 rounded bg-base-200 animate-pulse mb-2" />
                          <div className="h-3 w-24 rounded bg-base-200 animate-pulse" />
                        </div>
                      </div>
                    </td>
                    <td><span className="inline-block h-4 w-24 rounded bg-base-200 animate-pulse" /></td>
                    <td className="text-right"><span className="inline-block h-4 w-12 rounded bg-base-200 animate-pulse" /></td>
                    <td className="text-right"><span className="inline-block h-9 w-24 rounded bg-base-200 animate-pulse" /></td>
                  </tr>
                ))}

              {/* Data rows */}
              {!loading &&
                list.map((a, idx) => (
                  <tr key={a._id} className="hover">
                    <td className="font-semibold">{idx + 1}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <img src={a.image} alt={a.title} className="h-14 w-20 rounded-lg object-cover ring-1 ring-base-300" loading="lazy" />
                        <div className="min-w-0">
                          <div className="inter-font font-semibold line-clamp-1">{a.title || "Untitled"}</div>
                          <div className="text-xs opacity-70 montserrat-font line-clamp-1">{a.userName || "You"} • {a.medium || "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-primary font-semibold">{a.category || "—"}</span></td>
                    <td className="text-right montserrat-font">{a.price ? `$${Number(a.price).toLocaleString()}` : "—"}</td>
                    <td className="text-right">
                      <button onClick={() => handleDelete(a._id)} className={`btn btn-outline btn-sm montserrat-font ${busyId === a._id ? "pointer-events-none opacity-60" : ""}`}>
                        {busyId === a._id ? (<><span className="loading loading-spinner loading-xs" /> Deleting…</>) : "Delete"}
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