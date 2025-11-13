// src/pages/AddArtwork.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddArtwork() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    image: "",
    title: "",
    category: "Painting",
    medium: "Acrylic",
    description: "",
    dimensions: "",
    price: "",
    visibility: "public",
    featured: true,
  });

  const [loading, setLoading] = useState(false);

  // Dummy auth values (you can replace with real auth)
  const userName = localStorage.getItem("userName") || "Guest";
  const userEmail = localStorage.getItem("userEmail") || "guest@example.com";
  const artistPhoto = localStorage.getItem("userPhoto") || "";

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // build payload; keep visibility lowercase or let server normalize — server will normalize
    const payload = {
      ...form,
      // Ensure server receives user info
      userName,
      userEmail,
      artistPhoto,
      // featured is boolean already
    };

    try {
      const res = await fetch("http://localhost:3000/arts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Server error:", data);
        alert(data.error || `Failed to add artwork (status ${res.status})`);
        return;
      }

      // Success — server returns created document with _id
      alert("Artwork added successfully!");
      console.log("Created artwork:", data);

      // Reset form (optional)
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

      // navigate to explore page so user can see it (or to detail page)
      // if you prefer detail page: navigate(`/art/${data._id}`)
      navigate("/explore");
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Artwork</h1>

      <form onSubmit={onSubmit} className="grid gap-6 bg-base-100 border p-6 rounded-xl">

        {/* IMAGE URL */}
        <div>
          <label className="block font-semibold mb-1">Image URL</label>
          <input
            className="input input-bordered w-full"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="https://example.com/art.jpg"
            required
          />
        </div>

        {/* TITLE */}
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            className="input input-bordered w-full"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Artwork title"
            required
          />
        </div>

        {/* CATEGORY + MEDIUM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Category</label>
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
            <label className="block font-semibold mb-1">Medium</label>
            <input
              className="input input-bordered w-full"
              value={form.medium}
              onChange={(e) => setForm({ ...form, medium: e.target.value })}
              placeholder="e.g., Acrylic, Oil, Clay"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            className="textarea textarea-bordered w-full h-28"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe your artwork"
          />
        </div>

        {/* DIMENSIONS + PRICE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Dimensions</label>
            <input
              className="input input-bordered w-full"
              value={form.dimensions}
              onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
              placeholder="20x30 inches"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Price</label>
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
            <label className="block font-semibold mb-1">Visibility</label>
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
              className="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            <label htmlFor="featured" className="font-semibold">Feature this artwork</label>
          </div>
        </div>

        <button disabled={loading} className="btn btn-primary w-full mt-2">
          {loading ? "Adding..." : "Add Artwork"}
        </button>
      </form>
    </section>
  );
}