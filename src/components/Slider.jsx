import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Slider() {
  return (
    <div className="w-full">
      <Swiper
        pagination={{ clickable: true }}
        loop={true}
        className="h-[520px]"
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="relative h-full w-full">
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
              className="h-full w-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center">
              <div className="max-w-6xl mx-auto px-4 text-white space-y-5">
                <h1 className="text-4xl md:text-5xl font-bold">
                  Discover, Share, and Celebrate Creative Artworks
                </h1>

                <p className="text-lg md:text-xl max-w-2xl">
                  Artify is a platform for artists to showcase their best
                  creations, explore inspiring galleries, and connect with a
                  global creative community. Elevate your artistic journey today.
                </p>

                <div className="flex gap-4 mt-4">
                  <button className="btn btn-primary">Explore Artworks</button>
                  <button className="btn btn-outline text-white border-white hover:bg-white hover:text-black">
                    Become an Artist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
