// src/pages/Gallery.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../providers/AuthProvider";
import { uploadImageCurrent } from "../utils/imageUpload";
import Loading from "../components/Loading";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

export default function Gallery() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const filteredList = list.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.medium?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter ? item.category === filter : true;
    return matchesSearch && matchesFilter;
  });

  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    image: "",
    title: "",
    category: "Painting",
    medium: "",
    description: "",
    dimensions: "",
    price: "",
    visibility: "Public",
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const [editBusy, setEditBusy] = useState(false);

  const fetchMyArts = async (email, signal) => {
    if (!email) return [];
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
    try {
      const url2 = `${API_BASE}/arts?artistEmail=${encodeURIComponent(
        email
      )}&page=1&limit=100`;
      const r2 = await fetch(url2, { method: "GET", signal });
      if (r2.ok) {
        const json = await r2.json();
        if (Array.isArray(json)) return json;
        if (Array.isArray(json.data)) return json.data;
      }
    } catch (e) {
      if (e.name !== "AbortError")
        console.warn("arts?artistEmail fetch failed", e);
    }
    try {
      const url3 = `${API_BASE}/arts?userEmail=${encodeURIComponent(
        email
      )}&page=1&limit=100`;
      const r3 = await fetch(url3, { method: "GET", signal });
      if (r3.ok) {
        const json = await r3.json();
        if (Array.isArray(json)) return json;
        if (Array.isArray(json.data)) return json.data;
      }
    } catch (e) {
      if (e.name !== "AbortError")
        console.warn("arts?userEmail fetch failed", e);
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
    if (!authLoading) {
      load(controller.signal);
    }
    return () => controller.abort();
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

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Delete failed", err);
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

  const openEdit = (art) => {
    setEditId(art._id);
    setEditForm({
      image: art.image || "",
      title: art.title || "",
      category: art.category || "Painting",
      medium: art.medium || "",
      description: art.description || "",
      dimensions: art.dimensions || "",
      price: art.price ?? "",
      visibility: art.visibility || "Public",
    });
    setEditing(true);
  };

  const closeEdit = () => {
    setEditing(false);
    setEditId(null);
    setEditImageFile(null);
    setEditForm({
      image: "",
      title: "",
      category: "Painting",
      medium: "",
      description: "",
      dimensions: "",
      price: "",
      visibility: "Public",
    });
  };

  useEffect(() => {
    if (editing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [editing]);

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editId) return;

    if (!editForm.title || (!editForm.image && !editImageFile)) {
      return Swal.fire({
        icon: "error",
        title: "Missing",
        text: "Title and Image are required.",
      });
    }

    setEditBusy(true);

    try {
      let finalImage = editForm.image;
      if (editImageFile) {
        const uploaded = await uploadImageCurrent(editImageFile);
        if (!uploaded) throw new Error("Image upload failed");
        finalImage = uploaded;
      }

      const patch = {
        title: editForm.title,
        image: finalImage,
        category: editForm.category,
        medium: editForm.medium,
        description: editForm.description,
        dimensions: editForm.dimensions,
        price: editForm.price === "" ? "" : Number(editForm.price),
        visibility:
          String(editForm.visibility).toLowerCase() === "private"
            ? "Private"
            : "Public",
        updatedAt: new Date(),
      };

      const previous = list;
      setList((s) => s.map((a) => (a._id === editId ? { ...a, ...patch } : a)));

      const url = `${API_BASE}/arts/${encodeURIComponent(editId)}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || `Server responded ${res.status}`);
      }

      Swal.fire({
        icon: "success",
        title: "Updated",
        timer: 1000,
        showConfirmButton: false,
      });
      closeEdit();
    } catch (err) {
      console.error("Update failed", err);
      //   setList(previous);
      Swal.fire({
        icon: "error",
        title: "Failed to update",
        text: err?.message || "Try again.",
      });
    } finally {
      setEditBusy(false);
    }
  };

  if (authLoading) {
    return <Loading />;
  }

  if (!user?.email) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-10 text-center">
        <h2 className="text-2xl font-bold mb-3">You are not logged in</h2>
        <p className="opacity-70 mb-6">
          Please log in to view and manage your artworks.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="btn btn-primary"
          >
            Go to Login
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold inter-font">My Gallery</h1>
        <p className="mt-1 text-sm opacity-70 montserrat-font">
          Manage artworks uploaded by{" "}
          <span className="font-semibold">{user.email}</span>
        </p>
      </header>

      <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4 px-4 py-3 border-b border-base-300">
          <div className="form-control flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search artworks..."
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
                <th className="w-40 text-right">Actions</th>
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
                      <span className="inline-block h-9 w-32 rounded bg-base-200 animate-pulse" />
                    </td>
                  </tr>
                ))}

              {!loading &&
                filteredList.map((a, idx) => (
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
                      <span className="badge badge-primary font-semibold">
                        {a.category || "—"}
                      </span>
                    </td>
                    <td className="text-right montserrat-font">
                      {a.price ? `$${Number(a.price).toLocaleString()}` : "—"}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2 h-full">
                        <button
                          onClick={() => openEdit(a)}
                          className="btn btn-sm btn-outline"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(a._id)}
                          className={`btn btn-outline btn-sm montserrat-font ${
                            busyId === a._id
                              ? "pointer-events-none opacity-60"
                              : ""
                          }`}
                        >
                          {busyId === a._id ? (
                            <>
                              <span className="loading loading-spinner loading-xs" />{" "}
                              Deleting…
                            </>
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {!loading && list.length === 0 && (
          <div className="p-10 text-center">
            <h3 className="text-lg font-semibold inter-font">
              No artworks yet
            </h3>
            <p className="opacity-70 montserrat-font">
              Add your first piece from the “Add Artwork” page.
            </p>
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-2xl bg-base-100 rounded-2xl p-6 shadow-lg max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Edit Artwork</h3>
              <button className="btn btn-ghost" onClick={closeEdit}>
                Close
              </button>
            </div>

            <form onSubmit={submitEdit} className="grid gap-4">
              <div>
                <label className="font-semibold text-sm">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImageFile(e.target.files[0])}
                  className="file-input file-input-bordered file-input-sm w-full mb-2"
                />
              </div>

              <div>
                <label className="font-semibold text-sm">Title</label>
                <input
                  className="input input-bordered w-full"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, title: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-sm">Category</label>
                  <select
                    className="select select-bordered w-full"
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm((s) => ({ ...s, category: e.target.value }))
                    }
                  >
                    <option>Painting</option>
                    <option>Digital</option>
                    <option>Sculpture</option>
                    <option>Uncategorized</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-sm">Medium</label>
                  <input
                    className="input input-bordered w-full"
                    value={editForm.medium}
                    onChange={(e) =>
                      setEditForm((s) => ({ ...s, medium: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-sm">Description</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  rows={4}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, description: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-sm">Dimensions</label>
                  <input
                    className="input input-bordered w-full"
                    value={editForm.dimensions}
                    onChange={(e) =>
                      setEditForm((s) => ({ ...s, dimensions: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="font-semibold text-sm">Price</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm((s) => ({ ...s, price: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="font-semibold text-sm">Visibility</label>
                <select
                  className="select select-bordered w-48"
                  value={editForm.visibility}
                  onChange={(e) =>
                    setEditForm((s) => ({ ...s, visibility: e.target.value }))
                  }
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  disabled={editBusy}
                  type="submit"
                  className="btn btn-primary"
                >
                  {editBusy ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
