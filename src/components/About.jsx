import { Palette, Heart, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutSection() {
  return (
    <section className="bg-base-100 text-base-content">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
        <div className="grid items-center gap-10 md:gap-12 lg:grid-cols-[1.05fr_1fr]">
          {/* Text */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" /> About Artify
            </span>

            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
              A home for creative expression—<span className="text-primary">discover</span>,{" "}
              <span className="text-primary">share</span>, and{" "}
              <span className="text-primary">celebrate</span> art.
            </h2>

            <p className="mt-4 text-base md:text-lg opacity-80">
              Artify helps artists showcase their work with beautiful galleries,
              connect with a global audience, and grow through appreciation and interaction.
              Explore curated collections, follow your favorite artists, and build your own.
            </p>

            {/* Feature bullets */}
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              <li className="flex items-start gap-3">
                <div className="mt-1 shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                  <Palette className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Beautiful Galleries</h3>
                  <p className="text-sm opacity-70">
                    Upload artworks with categories, mediums, and rich descriptions.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="mt-1 shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Likes & Favorites</h3>
                  <p className="text-sm opacity-70">
                    Earn appreciation and curate your personal favorites.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="mt-1 shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Community First</h3>
                  <p className="text-sm opacity-70">
                    Discover artists worldwide and connect through art.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="mt-1 shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Modern UI</h3>
                  <p className="text-sm opacity-70">
                    Clean, fast and responsive—dark/light ready.
                  </p>
                </div>
              </li>
            </ul>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/explore" className="btn btn-primary">
                Explore Artworks
              </Link>
              <Link
                to="/add-artwork"
                className="btn btn-outline border-primary text-primary hover:bg-primary/10"
              >
                Become an Artist
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <div className="rounded-xl border border-base-300/60 bg-base-200 p-4 text-center">
                <div className="text-2xl font-extrabold">12k+</div>
                <div className="text-xs opacity-70">Artworks</div>
              </div>
              <div className="rounded-xl border border-base-300/60 bg-base-200 p-4 text-center">
                <div className="text-2xl font-extrabold">3.2k</div>
                <div className="text-xs opacity-70">Artists</div>
              </div>
              <div className="rounded-xl border border-base-300/60 bg-base-200 p-4 text-center">
                <div className="text-2xl font-extrabold">27</div>
                <div className="text-xs opacity-70">Categories</div>
              </div>
            </div>
          </div>

          {/* Images (collage) */}
          <div className="relative">
            {/* Back glow */}
            <div className="absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-b from-primary/20 to-transparent blur-2xl" />

            <div className="grid grid-cols-2 gap-4">
              <div className="group rounded-2xl overflow-hidden border border-base-300/60 bg-base-200">
                <img
                  src="https://images.unsplash.com/photo-1517697471339-4aa32003c11a?q=80&w=1200&auto=format&fit=crop"
                  alt="Studio painting"
                  className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="group rounded-2xl overflow-hidden border border-base-300/60 bg-base-200">
                <img
                  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
                  alt="Abstract colours"
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="group col-span-2 rounded-2xl overflow-hidden border border-base-300/60 bg-base-200">
                <img
                  src="https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1600&auto=format&fit=crop"
                  alt="Gallery wall"
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Floating like card */}
            <div className="absolute right-3 -bottom-4 md:-right-4 md:-bottom-6">
              <div className="rounded-2xl border border-primary/30 bg-base-100/90 backdrop-blur p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">7,540 likes today</span>
                </div>
                <p className="text-xs opacity-70 mt-1">Artists thriving with Artify.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}