import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");
const PLACEHOLDER =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop";

export default function Slider() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/arts/featured`, {
          signal: ctrl.signal,
        });
        if (!res.ok) {
          setItems([]);
          return;
        }
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") console.error("Slider load error:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    load();
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);

    return () => {
      ctrl.abort();
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const slides =
    loading || items.length === 0
      ? [
          {
            _id: "placeholder",
            title: "Discover, Share, and Celebrate Creative Artworks",
            description:
              "Artify is a platform for artists to showcase their best creations, explore inspiring galleries, and connect with a global creative community.",
            image: PLACEHOLDER,
          },
        ]
      : items;

  return (
    <div className="w-full">
      <Swiper
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Pagination, Autoplay]}
        className="h-[520px]"
      >
        {slides.map((a) => {
          const bg =
            a?.image && typeof a.image === "string" && a.image.trim() !== ""
              ? a.image
              : PLACEHOLDER;
          const title = a?.title || "Untitled";
          const desc =
            a?.description ||
            a?.medium ||
            a?.category ||
            "View this artwork on Artify.";
          return (
            <SwiperSlide key={a._id}>
              <div className="relative h-full w-full">
                <img
                  src={bg}
                  alt={title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-black/40 flex items-center">
                  <div className="max-w-6xl mx-auto px-4 text-white space-y-5">
                    <h1 className="text-4xl md:text-5xl font-bold text-center">
                      {title}
                    </h1>

                    <p className="text-lg text-center md:text-xl max-w-2xl">
                      {desc}
                    </p>

                    <div className="flex gap-4 mt-4 flex justify-center">
                      <Link to="/explore" className="btn btn-primary">
                        Explore Artworks
                      </Link>

                      {a._id !== "placeholder" ? (
                        <Link
                          to={`/art/${a._id}`}
                          className="btn btn-outline text-white border-white hover:bg-white hover:text-black"
                        >
                          View Artwork
                        </Link>
                      ) : (
                        <button
                          className="btn btn-outline text-white border-white"
                          disabled
                        >
                          View Artwork
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
