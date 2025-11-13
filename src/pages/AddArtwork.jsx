import React, { useState } from "react";
import Swal from "sweetalert2";

// API base (set REACT_APP_API_URL in env or it will use relative path)
const API_BASE = process.env.REACT_APP_API_URL || "";

export default function AddArtwork() {
  const [form, setForm] = useState({
    image: "",
    title: "",
    category: "Painting",
    medium: "Acrylic",
    description: "",
    dimensions: "",
    price: "",
    visibility: "public",
  });
  const [busy, setBusy] = useState(false);

  // Replace these with your auth provider or context if available
  const userName = localStorage.getItem("userName") || "";
  const userEmail = localStorage.getItem("userEmail") || "";
  const artistPhoto = localStorage.getItem("userPhoto") || "";

  const validate = () => {
    if (!form.image) return "Image URL is required";
    if (!form.title) return "Title is required";
    if (!userEmail || !userName) return "You must be logged in to add artwork";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return Swal.fire({ icon: "error", title: "Missing", text: err });

    setBusy(true);
    try {
      // server expects capitalized visibility values (Public/Private)
      const payload = {
        ...form,
        visibility: form.visibility === "public" ? "Public" : "Private",
        userName,
        userEmail,
        artistPhoto,
      };

      const res = await fetch(`${API_BASE}/arts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Server responded ${res.status}`);

      Swal.fire({ icon: "success", title: "Artwork Added", timer: 1200, showConfirmButton: false });

      // Reset form
      setForm({
        image: "",
        title: "",
        category: "Painting",
        medium: "Acrylic",
        description: "",
        dimensions: "",
        price: "",
        visibility: "public",
      });
    } catch (err) {
      console.error("createArt error", err);
      Swal.fire({ icon: "error", title: "Failed to Add", text: err.message || "Try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold inter-font">Add New Artwork</h1>
        <p className="mt-2 text-sm opacity-70 montserrat-font">Upload your creation with essential details.</p>
      </header>

      <form onSubmit={onSubmit} className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-6 md:p-8 grid gap-6">
        {/* IMAGE URL */}
        <div className="grid gap-1">
          <label className="font-semibold text-sm inter-font">Image URL</label>
          <input className="input input-bordered w-full montserrat-font" placeholder="https://example.com/art.jpg" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        </div>

        {/* TITLE */}
        <div className="grid gap-1">
          <label className="font-semibold text-sm inter-font">Title</label>
          <input className="input input-bordered w-full montserrat-font" placeholder="Artwork title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>

        {/* CATEGORY + MEDIUM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-1">
            <label className="font-semibold text-sm inter-font">Category</label>
            <select className="select select-bordered w-full montserrat-font" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option>Painting</option>
              <option>Digital</option>
              <option>Sculpture</option>
            </select>
          </div>

          <div className="grid gap-1">
            <label className="font-semibold text-sm inter-font">Medium</label>
            <input className="input input-bordered w-full montserrat-font" placeholder="Acrylic, Oil, Clay etc." value={form.medium} onChange={(e) => setForm({ ...form, medium: e.target.value })} />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="grid gap-1">
          <label className="font-semibold text-sm inter-font">Description</label>
          <textarea className="textarea textarea-bordered h-28 montserrat-font" placeholder="Describe your artwork..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        {/* DIMENSIONS + PRICE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-1">
            <label className="font-semibold text-sm inter-font">Dimensions</label>
            <input className="input input-bordered montserrat-font" placeholder="eg. 20x30 inches" value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} />
          </div>

          <div className="grid gap-1">
            <label className="font-semibold text-sm inter-font">Price</label>
            <input className="input input-bordered montserrat-font" type="number" placeholder="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
        </div>

        {/* VISIBILITY */}
        <div className="grid gap-1">
          <label className="font-semibold text-sm inter-font">Visibility</label>
          <select className="select select-bordered montserrat-font" value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* SUBMIT BUTTON */}
        <button disabled={busy} className="btn btn-primary w-full mt-4 text-base font-semibold">{busy ? "Adding…" : "Add Artwork"}</button>
      </form>
    </section>
  );
}
