// src/pages/Details.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, BookmarkPlus, Shield, Palette, Ruler } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../providers/AuthProvider";

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

/** Safely parse date string/obj to readable date */
function fmtDate(d) {
  try {
    if (!d) return "-";
    const dt = typeof d === "string" ? new Date(d) : d;
    if (Number.isNaN(dt.getTime())) return "-";
    return dt.toLocaleDateString();
  } catch {
    return "-";
  }
}

// Use Vite env var; fallback to localhost
const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

export default function Details() {
  const { id } = useParams();
  const { user } = useAuth();

  const [art, setArt] = useState(null);
  const [busyLike, setBusyLike] = useState(false);
  const [busyFav, setBusyFav] = useState(false);

  // fetch one artwork by id
  const fetchOne = async (artId) => {
    const url = `${API_BASE}/arts/${encodeURIComponent(artId)}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to fetch (${res.status})`);
    }
    const json = await res.json();
    return json;
  };

  // toggle like (PATCH) and return likes number
  const doToggleLike = async (artId) => {
    const url = `${API_BASE}/arts/${encodeURIComponent(artId)}/like`;
    const res = await fetch(url, { method: "PATCH" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to like (${res.status})`);
    }
    const json = await res.json();
    return json;
  };

  // add favorite: POST /favorites  body { artId, userEmail }
  const doAddFavorite = async (artId) => {
    if (!user?.email) throw new Error("You must be logged in to add favorites");
    const url = `${API_BASE}/favorites`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artId, userEmail: user.email }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to favorite (${res.status})`);
    }
    const json = await res.json();
    return json;
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const json = await fetchOne(id);
        // normalize payload
        let payload = json?.data ?? json;
        if (payload && payload.art) {
          // shape: { art, artist }
          const merged = { ...payload.art, artist: payload.artist || {} };
          if (alive) setArt(merged);
        } else if (payload && payload._id) {
          // direct art document
          const normalized = {
            ...payload,
            // provide an artist object for UI convenience
            artist: payload.artist || { name: payload.userName, photoURL: payload.artistPhoto },
          };
          if (alive) setArt(normalized);
        } else {
          // unexpected shape - report and bail
          if (alive) {
            setArt(null);
            Swal.fire({ icon: "error", title: "Invalid response", text: "Server returned unexpected data." });
          }
        }
      } catch (e) {
        if (alive) {
          setArt(null);
          Swal.fire({ icon: "error", title: "Failed to load", text: e?.message || "Try again." });
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

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
      const r = await doToggleLike(id);
      const newLikes = r?.data?.likes ?? r?.likes ?? null;
      if (typeof newLikes === "number") {
        setArt((prev) => ({ ...prev, likes: newLikes }));
      } else {
        // fallback: refetch full item
        const refreshed = await fetchOne(id);
        const payload = refreshed?.data ?? refreshed;
        const artObj = payload?.art ?? payload;
        if (artObj) setArt((prev) => ({ ...prev, likes: artObj.likes ?? prev.likes }));
      }
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
      await doAddFavorite(id);
      Swal.fire({ icon: "success", title: "Added to favorites", timer: 1200, showConfirmButton: false });
    } catch (e) {
      // if not logged in, prompt to login
      if (e.message && e.message.toLowerCase().includes("logged in")) {
        Swal.fire({ icon: "warning", title: "Login required", text: "Please log in to add favorites." });
      } else {
        Swal.fire({ icon: "error", title: "Couldn’t favorite", text: e?.message || "Try again." });
      }
    } finally {
      setBusyFav(false);
    }
  };

  const createdAt = art.createdAt ?? art.createdAt;
  const updatedAt = art.updatedAt ?? art.updatedAt ?? art.createdAt;
  const priceIsNumber = typeof art.price === "number" && !Number.isNaN(art.price);

  return (
    <section className="max-w-6xl mx-auto px-4 pt-36 pb-8">
      <div
        className="
          grid lg:grid-cols-2 gap-6
          rounded-2xl border border-base-300 bg-base-100 shadow-sm
          p-3 md:p-4 lg:p-5
        "
      >
        {/* IMAGE */}
        <div className="relative">
          <img src={art.image} alt={art.title} className="w-full aspect-[4/3] object-cover rounded-xl" />

          {/* Category + Medium badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <span className="badge badge-primary font-semibold">{art.category || "Artwork"}</span>
            {art.medium && <span className="badge bg-base-100/80 backdrop-blur text-xs">{art.medium}</span>}
            {String(art.visibility || "").toLowerCase() === "private" && (
              <span className="badge badge-outline gap-1">
                <Shield size={14} /> Private
              </span>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-extrabold inter-font">{art.title}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm opacity-80 montserrat-font">
            <span className="inline-flex items-center gap-2">
              <Palette size={16} /> {art.category || "-"}
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
            {priceIsNumber && <span className="font-semibold text-primary">${Number(art.price).toLocaleString()}</span>}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <Avatar name={art.artist?.name ?? art.userName ?? "Artist"} photoURL={art.artist?.photoURL ?? art.artistPhoto} />
            <div className="leading-tight">
              <p className="inter-font font-semibold">{art.artist?.name ?? art.userName ?? "Unknown Artist"}</p>
              <p className="text-xs opacity-60 montserrat-font">
                {String(art.visibility || "").toLowerCase() === "private" ? "Private" : "Public"} artwork
              </p>
            </div>
          </div>

          {art.description && <p className="mt-5 montserrat-font leading-relaxed">{art.description}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button onClick={onLike} className="btn btn-primary gap-2" disabled={busyLike}>
              {busyLike ? <span className="loading loading-spinner loading-sm" /> : <Heart size={18} />}
              Like • {art.likes ?? 0}
            </button>

            <button onClick={onFavorite} className="btn btn-outline gap-2 border-primary text-primary hover:bg-primary/5" disabled={busyFav}>
              {busyFav ? <span className="loading loading-spinner loading-sm" /> : <BookmarkPlus size={18} />}
              Add to Favorites
            </button>
          </div>

          <div className="mt-6 text-xs opacity-60 montserrat-font">
            Created on {fmtDate(createdAt)} • Updated {fmtDate(updatedAt)}
          </div>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
          <p className="text-2xl font-extrabold inter-font">{art.likes ?? 0}</p>
          <p className="text-xs opacity-70 montserrat-font">Total Likes</p>
        </div>

        <div className="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
          <p className="text-2xl font-extrabold inter-font">{String(art.visibility || "").toLowerCase() === "private" ? "Private" : "Public"}</p>
          <p className="text-xs opacity-70 montserrat-font">Visibility</p>
        </div>

        <div className="rounded-xl border border-base-300 bg-base-100 p-4 text-center">
          <p className="text-2xl font-extrabold inter-font">{art.category || "-"}</p>
          <p className="text-xs opacity-70 montserrat-font">Category</p>
        </div>
      </div>
    </section>
  );
}