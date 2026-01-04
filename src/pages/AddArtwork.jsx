// src/pages/AddArtwork.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import {
  Palette,
  Image as ImageIcon,
  Type,
  AlignLeft,
  DollarSign,
  Ruler,
  Globe,
  Lock,
  Sparkles,
  Layers,
  CheckCircle,
} from "lucide-react";
import { uploadImageCurrent } from "../utils/imageUpload";

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
    featured: false,
  });

  const [busy, setBusy] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // VALIDATION
  const validate = () => {
    // If no image URL and no selected file, error
    if (!form.image && !selectedImage) return "Image is required";
    if (!form.title) return "Title is required";
    if (!user?.email) return "You must be logged in to add artwork";
    return null;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return Swal.fire({ icon: "error", title: "Missing", text: err });

    setBusy(true);

    try {
      let imageUrl = form.image;
      if (selectedImage) {
        const uploaded = await uploadImageCurrent(selectedImage);
        if (!uploaded) throw new Error("Image upload failed");
        imageUrl = uploaded;
      }

      // Payload to server
      const payload = {
        image: imageUrl,
        title: form.title,
        category: form.category,
        medium: form.medium,
        description: form.description,
        dimensions: form.dimensions,
        price: form.price === "" ? "" : Number(form.price),
        visibility: form.visibility === "public" ? "Public" : "Private",
        featured: !!form.featured,
        // Firebase Auth user
        userName: user.displayName || "Unknown",
        userEmail: user.email,
        artistPhoto: user.photoURL || "",
      };

      const res = await fetch(`${API_BASE.replace(/\/$/, "")}/arts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data.error || "Failed to add artwork");

      Swal.fire({
        icon: "success",
        title: "Artwork Added!",
        text: "Your masterpiece has been shared with the world.",
        timer: 2000,
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
      setSelectedImage(null);

      navigate("/explore");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8 font-montserrat">
      <div className="max-w-6xl mx-auto">
        <div className="card lg:card-side bg-base-100 shadow-2xl overflow-hidden rounded-3xl">
          {/* Left Side - Visual & Inspiration */}
          <div className="relative lg:w-5/12 bg-primary text-primary-content overflow-hidden min-h-[400px] lg:min-h-full">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            <div className="relative z-10 p-12 flex flex-col justify-end h-full">
              <div className="mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white shadow-xl">
                  <Palette size={32} />
                </div>
                <h2 className="text-4xl font-bold mb-4 font-inter">
                  Share Your Vision
                </h2>
                <p className="text-lg opacity-90 leading-relaxed">
                  "Art is not what you see, but what you make others see."
                  <br />
                  <span className="text-sm font-semibold mt-2 block opacity-75">
                    — Edgar Degas
                  </span>
                </p>
              </div>

              {/* User Profile Preview */}
              {user && (
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                  <img
                    src={user.photoURL || "https://via.placeholder.com/40"}
                    alt={user.displayName}
                    className="w-12 h-12 rounded-full border-2 border-white/50 object-cover"
                  />
                  <div>
                    <div className="text-xs uppercase tracking-wider opacity-70">
                      Posting as
                    </div>
                    <div className="font-bold text-lg">
                      {user.displayName || "Artist"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:w-7/12 p-8 lg:p-12 bg-base-100">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-base-content mb-2 font-inter">
                Add New Artwork
              </h1>
              <p className="text-base-content/60">
                Fill in the details below to showcase your latest creation.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Title & Image Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control w-full">
                  <label className="label font-semibold text-base-content/80">
                    <span className="flex items-center gap-2">
                      <Type size={16} /> Artwork Title
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:input-primary transition-all"
                    placeholder="e.g. Starry Night"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label font-semibold text-base-content/80">
                    <span className="flex items-center gap-2">
                      <ImageIcon size={16} /> Artwork Image
                    </span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input file-input-bordered file-input-primary w-full mb-2"
                  />
                  <input
                    type="url"
                    className="input input-bordered input-sm w-full focus:input-primary transition-all"
                    placeholder="Or paste image URL"
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Category & Medium Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control w-full">
                  <label className="label font-semibold text-base-content/80">
                    <span className="flex items-center gap-2">
                      <Layers size={16} /> Category
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full focus:select-primary transition-all"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option>Painting</option>
                    <option>Digital</option>
                    <option>Sculpture</option>
                    <option>Photography</option>
                    <option>Sketch</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-control w-full">
                  <label className="label font-semibold text-base-content/80">
                    <span className="flex items-center gap-2">
                      <Palette size={16} /> Medium
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:input-primary transition-all"
                    placeholder="e.g. Oil on Canvas"
                    value={form.medium}
                    onChange={(e) =>
                      setForm({ ...form, medium: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Price & Dimensions Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control w-full">
                  <label className="label font-semibold text-base-content/80">
                    <span className="flex items-center gap-2">
                      <DollarSign size={16} /> Price (USD)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="input input-bordered w-full pl-8 focus:input-primary transition-all"
                      placeholder="0.00"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      $
                    </span>
                  </div>
                </div>

                <div className="form-control w-full">
                  <label className="label font-semibold text-base-content/80">
                    <span className="flex items-center gap-2">
                      <Ruler size={16} /> Dimensions
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full focus:input-primary transition-all"
                    placeholder="e.g. 24 x 36 inches"
                    value={form.dimensions}
                    onChange={(e) =>
                      setForm({ ...form, dimensions: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-control w-full">
                <label className="label font-semibold text-base-content/80">
                  <span className="flex items-center gap-2">
                    <AlignLeft size={16} /> Description
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-32 w-full focus:textarea-primary transition-all text-base"
                  placeholder="Tell the story behind your masterpiece..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="divider opacity-50"></div>

              {/* Footer Actions */}
              {/* Footer Actions */}
              <div className="space-y-6 pt-6 mt-6 border-t border-base-200">
                {/* Row 1: Visibility & Feature */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Visibility Toggle */}
                  <div
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                      form.visibility === "public"
                        ? "bg-primary/5 border-primary/30 shadow-sm"
                        : "bg-base-100 border-base-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl transition-colors ${
                          form.visibility === "public"
                            ? "bg-primary text-primary-content"
                            : "bg-base-200 text-base-content/50"
                        }`}
                      >
                        {form.visibility === "public" ? (
                          <Globe size={20} />
                        ) : (
                          <Lock size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-base-content">
                          Visibility
                        </p>
                        <p className="text-xs text-base-content/60 font-medium">
                          {form.visibility === "public"
                            ? "Visible to everyone"
                            : "Private to you"}
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary bg-primary"
                      checked={form.visibility === "public"}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          visibility: e.target.checked ? "public" : "private",
                        })
                      }
                    />
                  </div>

                  {/* Feature Toggle */}
                  <div
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                      form.featured
                        ? "bg-primary/5 border-primary/30 shadow-sm"
                        : "bg-base-100 border-base-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl transition-colors ${
                          form.featured
                            ? "bg-primary text-primary-content"
                            : "bg-base-200 text-base-content/50"
                        }`}
                      >
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-base-content">
                          Feature Artwork
                        </p>
                        <p className="text-xs text-base-content/60 font-medium">
                          Highlight on home
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary bg-primary rounded-lg"
                      checked={form.featured}
                      onChange={(e) =>
                        setForm({ ...form, featured: e.target.checked })
                      }
                    />
                  </div>
                </div>

                {/* Row 2: Publish Button */}
                <button
                  disabled={busy}
                  className="btn btn-primary w-full btn-lg rounded-2xl font-bold text-lg tracking-wide shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {!busy && <CheckCircle size={24} strokeWidth={2.5} />}
                  {busy ? "Publishing..." : "Publish Artwork"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
