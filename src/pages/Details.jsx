// src/pages/Details.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOne, toggleLike, addFavorite } from "../api/artworks";
import { Heart, HeartOff, BookmarkPlus, Shield, Palette, Ruler } from "lucide-react";
import Swal from "sweetalert2";

/** Tiny helper for artist avatar/initials */
function Avatar({ name = "Artist", photoURL }) {
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={name}
        className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
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
    <div className="h-10 w-10 rounded-full grid place-items-center bg-primary text-white text-sm font-bold ring-2 ring-primary/20">
      {initials}
    </div>
  );
}

export default function Details() {
  const { id } = useParams();
  const [art, setArt] = useState(null);
  const [busyLike, setBusyLike] = useState(false);
  const [busyFav, setBusyFav] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await getOne(id);
        if (alive) setArt(r.data);
      } catch (e) {
        Swal.fire({ icon: "error", title: "Failed to load", text: e?.message || "Try again." });
      }
    })();
    return () => { alive = false; };
  }, [id]);

  // Skeleton while fetching
  if (!art) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="aspect-[4/3] w-full rounded-2xl bg-base-200 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 bg-base-200 rounded animate-pulse" />
            <div className="h-4 w-40 bg-base-200 rounded animate-pulse" />
            <div className="h-24 w-full bg-base-200 rounded animate-pulse" />
            <div className="h-10 w-56 bg-base-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const onLike = async () => {
    if (busyLike) return;
    try {
      setBusyLike(true);
      // optimistic: no need to flip “liked” state, API returns count
      const r = await toggleLike(id);
      setArt((prev) => ({ ...prev, likes: r.data.likes }));
    } catch (e) {
      Swal.fire({ icon: "error", title: "Couldn’t update like", text: e?.message || "Try again." });
    } finally {
      setBusyLike(false);
    }
  };

  const onFavorite = async () => {
    if (busyFav) return;
    try {
      setBusyFav(true);
      await addFavorite(id);
      Swal.fire({
        icon: "success",
        title: "Added to favorites",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (e) {
      Swal.fire({ icon: "error", title: "Couldn’t favorite", text: e?.message || "Try again." });
    } finally {
      setBusyFav(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div
        className="
          grid lg:grid-cols-2 gap-6
          rounded-2xl border border-base-300 bg-base-100 shadow-sm
          p-3 md:p-4 lg:p-5
        "
      >
        {/* IMAGE */}
        <div className="relative">
          <img
            src={art.image}
            alt={art.title}
            className="w-full aspect-[4/3] object-cover rounded-xl"
          />

          {/* Category + Medium badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <span className="badge badge-primary font-semibold">{art.category}</span>
            {art.medium && (
              <span className="badge bg-base-100/80 backdrop-blur text-xs">
                {art.medium}
              </span>
            )}
            {art.visibility === "private" && (
              <span className="badge badge-outline gap-1">
                <Shield size={14} /> Private
              </span>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold inter-font">
            {art.title}
          </h1>

          {/* Meta row */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm opacity-80 montserrat-font">
            <span className="inline-flex items-center gap-2">
              <Palette size={16} /> {art.category}
            </span>
            {art.medium && (
              <span className="inline-flex items-center gap-2">
                <Ruler size={16} /> {art.medium}
              </span>
            )}
            {art.dimensions && (
              <span className="inline-flex items-center gap-2">
                <Ruler size={16} /> {art.dimensions}
              </span>
            )}
            {typeof art.price === "number" && (
              <span className="font-semibold text-primary">
                ${Number(art.price).toLocaleString()}
              </span>
            )}
          </div>

          {/* Artist */}
          <div className="mt-5 flex items-center gap-3">
            <Avatar name={art.artist?.name} photoURL={art.artist?.photoURL} />
            <div className="leading-tight">
              <p className="inter-font font-semibold">
                {art.artist?.name || "Unknown Artist"}
              </p>
              <p className="text-xs opacity-60 montserrat-font">
                {art.visibility === "private" ? "Private" : "Public"} artwork
              </p>
            </div>
          </div>

          {/* Description */}
          {art.description && (
            <p className="mt-5 montserrat-font leading-relaxed">
              {art.description}
            </p>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onLike}
              className="btn btn-primary gap-2"
              disabled={busyLike}
            >
              {busyLike ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <Heart size={18} />
              )}
              Like • {art.likes ?? 0}
            </button>

            <button
              onClick={onFavorite}
              className="btn btn-outline gap-2 border-primary text-primary hover:bg-primary/5"
              disabled={busyFav}
            >
              {busyFav ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <BookmarkPlus size={18} />
              )}
              Add to Favorites
            </button>
          </div>

          {/* Subtle info line */}
          <div className="mt-6 text-xs opacity-60 montserrat-font">
            Created on {new Date(art.createdAt).toLocaleDateString()} • Updated{" "}
            {new Date(art.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Secondary strip: quick stats */}
      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
          <p className="text-2xl font-extrabold inter-font">{art.likes ?? 0}</p>
          <p className="text-xs opacity-70 montserrat-font">Total Likes</p>
        </div>
        <div className="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
          <p className="text-2xl font-extrabold inter-font">
            {art.visibility === "private" ? "Private" : "Public"}
          </p>
          <p className="text-xs opacity-70 montserrat-font">Visibility</p>
        </div>
        <div className="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
          <p className="text-2xl font-extrabold inter-font">
            {art.category || "-"}
          </p>
          <p className="text-xs opacity-70 montserrat-font">Category</p>
        </div>
      </div>
    </section>
  );
}