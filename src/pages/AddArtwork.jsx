// src/pages/AddArtwork.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AddArtwork() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Firebase Auth user

  const [form, setForm] = useState({
    image: "",
    title: "",
    category: "Painting",
    medium: "Acrylic",
    description: "",
    dimensions: "",
    price: "",
    visibility: "public",
    featured: false, // <-- added featured flag
  });

  const [busy, setBusy] = useState(false);

  // VALIDATION
  const validate = () => {
    if (!form.image) return "Image URL is required";
    if (!form.title) return "Title is required";
    if (!user?.email) return "You must be logged in to add artwork";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return Swal.fire({ icon: "error", title: "Missing", text: err });

    setBusy(true);

    // Payload to server
    const payload = {
      image: form.image,
      title: form.title,
      category: form.category,
      medium: form.medium,
      description: form.description,
      dimensions: form.dimensions,
      price: form.price === "" ? "" : Number(form.price),
      visibility: form.visibility === "public" ? "Public" : "Private",
      featured: !!form.featured, // <-- send featured boolean
      // Firebase Auth user
      userName: user.displayName || "Unknown",
      userEmail: user.email,
      artistPhoto: user.photoURL || "",
    };

    try {
      const res = await fetch(`${API_BASE.replace(/\/$/, "")}/arts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data.error || "Failed to add artwork");

      Swal.fire({
        icon: "success",
        title: "Artwork Added Successfully!",
        timer: 1200,
        showConfirmButton: false,
      });

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
        featured: false,
      });

      // Navigate to explore so user can see featured/new item
      navigate("/explore");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message || "Try again" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6 text-center">Add Artwork</h1>

      <form onSubmit={onSubmit} className="grid gap-6 bg-base-100 p-6 rounded-xl">

        {/* IMAGE URL */}
        <div>
          <label className="font-semibold">Image URL</label>
          <input
            className="input input-bordered w-full"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="https://example.com/art.jpg"
          />
        </div>

        {/* TITLE */}
        <div>
          <label className="font-semibold">Title</label>
          <input
            className="input input-bordered w-full"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Artwork title"
          />
        </div>

        {/* CATEGORY + MEDIUM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Category</label>
            <select
              className="select select-bordered w-full"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option>Painting</option>
              <option>Digital</option>
              <option>Sculpture</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Medium</label>
            <input
              className="input input-bordered w-full"
              value={form.medium}
              onChange={(e) => setForm({ ...form, medium: e.target.value })}
              placeholder="Acrylic, Oil, Clay etc."
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="font-semibold">Description</label>
          <textarea
            className="textarea textarea-bordered w-full h-28"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* DIMENSIONS + PRICE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Dimensions</label>
            <input
              className="input input-bordered w-full"
              value={form.dimensions}
              onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
              placeholder="20x30 inches"
            />
          </div>

          <div>
            <label className="font-semibold">Price</label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0"
            />
          </div>
        </div>

        {/* VISIBILITY + FEATURED */}
        <div className="grid sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="font-semibold">Visibility</label>
            <select
              className="select select-bordered w-full"
              value={form.visibility}
              onChange={(e) => setForm({ ...form, visibility: e.target.value })}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="featured"
              type="checkbox"
              className="checkbox tex-white"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            <label htmlFor="featured" className="font-semibold">Feature this artwork</label>
          </div>
        </div>

        <button disabled={busy} className="btn btn-primary w-full">
          {busy ? "Adding…" : "Add Artwork"}
        </button>

      </form>
    </section>
  );
}