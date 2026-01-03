import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import ArtCommunity from "../assets/6067249.jpg";
import {
  Palette,
  Users,
  Grid,
  Globe,
  Heart,
  Sparkles,
  Award,
  ArrowRight,
} from "lucide-react";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const AboutUs = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalArtworks: 0,
    totalLikes: 0,
    totalArtists: 0,
    totalCategories: 0,
  });

  const loadStats = useCallback(async (signal) => {
    setLoading(true);
    try {
      const artsUrl = `${API_BASE}/arts?limit=10000&page=1`;
      const pArts = fetch(artsUrl, { method: "GET", signal }).then(
        async (r) => {
          if (!r.ok) {
            const err = await r.json().catch(() => ({}));
            throw new Error(err.error || `Failed to fetch arts (${r.status})`);
          }
          return r.json();
        }
      );

      const likesUrl = `${API_BASE}/likes/total`;
      const pLikes = fetch(likesUrl, { method: "GET", signal })
        .then(async (r) => {
          if (!r.ok) {
            const err = await r.json().catch(() => ({}));
            throw new Error(err.error || `Failed to fetch likes (${r.status})`);
          }
          return r.json();
        })
        .catch(() => ({ totalLikes: 0 }));

      const [artsJson, likesJson] = await Promise.all([pArts, pLikes]);

      let artsArray = [];
      if (Array.isArray(artsJson)) {
        artsArray = artsJson;
      } else if (Array.isArray(artsJson.data)) {
        artsArray = artsJson.data;
      } else if (Array.isArray(artsJson.results)) {
        artsArray = artsJson.results;
      } else {
        artsArray = [];
      }

      const totalArtworks =
        typeof artsJson.total === "number" ? artsJson.total : artsArray.length;
      const totalLikes =
        typeof likesJson.totalLikes === "number"
          ? likesJson.totalLikes
          : likesJson.total || 0;

      const artistEmails = new Set();
      for (const a of artsArray) {
        const e =
          (a &&
            (a.userEmail || a.artistEmail || a.email || a.user_email || "")) ||
          "";
        if (e) artistEmails.add(String(e).toLowerCase());
      }
      const totalArtists = artistEmails.size;

      const cats = new Set();
      for (const a of artsArray) {
        const c = (a && (a.category || "").toString().trim()) || "";
        if (c) cats.add(c);
      }
      const totalCategories = cats.size;

      setStats({ totalArtworks, totalLikes, totalArtists, totalCategories });
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("loadStats error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadStats(controller.signal);
    return () => controller.abort();
  }, [loadStats]);

  return (
    <div className="bg-base-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2070&auto=format&fit=crop")',
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-primary-content backdrop-blur-md border border-white/20 mb-4 animate-fade-in-up">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-medium text-white">
              Redefining Digital Artistry
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-montserrat text-white leading-tight">
            Where Creativity <br /> Meets{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Community
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Artify is more than a gallery—it's a global movement connecting
            visionary artists with passionate collectors in a boundless digital
            realm.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 order-2 md:order-1">
            <h2 className="text-3xl md:text-5xl font-bold font-montserrat text-base-content">
              Our Mission
            </h2>
            <p className="text-lg text-base-content/70 leading-relaxed">
              We believe that art knows no boundaries. Our platform was built to
              democratize the art world, giving emerging talent a stage to shine
              and providing art enthusiasts with access to unique, inspiring
              masterpieces from every corner of the globe.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: <Palette className="text-primary" />,
                  text: "Celebrating diverse artistic expressions",
                },
                {
                  icon: <Users className="text-secondary" />,
                  text: "Fostering a supportive artist community",
                },
                {
                  icon: <Globe className="text-accent" />,
                  text: "Connecting cultures through visual storytelling",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors duration-300"
                >
                  <div className="p-3 rounded-lg bg-base-100 shadow-sm">
                    {item.icon}
                  </div>
                  <span className="font-medium text-base-content">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 md:order-2 relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
            <img
              src={ArtCommunity}
              alt="Art Community"
              className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-base-200 to-base-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                number: loading ? "..." : stats.totalArtworks,
                label: "Artworks",
                icon: <Palette />,
              },
              {
                number: loading ? "..." : stats.totalArtists,
                label: "Artists",
                icon: <Users />,
              },
              {
                number: loading ? "..." : stats.totalCategories,
                label: "Categories",
                icon: <Grid />,
              },
              {
                number: loading ? "..." : stats.totalLikes,
                label: "Likes",
                icon: <Heart />,
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="text-center space-y-2 p-6 rounded-2xl bg-base-100 shadow-xl hover:-translate-y-2 transition-transform duration-300 border border-base-content/5"
              >
                <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-2">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold font-montserrat text-base-content">
                  {typeof stat.number === "number"
                    ? stat.number.toLocaleString()
                    : stat.number}
                </h3>
                <p className="text-sm font-medium text-base-content/60 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto bg-base-content text-base-100 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10 space-y-8">
            <Award size={48} className="mx-auto text-primary" />
            <h2 className="text-3xl md:text-5xl font-bold font-montserrat">
              Ready to Showcase Your Vision?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of artists who have found their home at Artify.
              Start your journey today and let the world see your creativity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                to="/add-artwork"
                className="btn btn-primary btn-lg rounded-full px-8 hover:scale-105 transition-transform"
              >
                Join Community
              </Link>
              <Link
                to="/explore"
                className="btn btn-outline btn-neutral btn-lg text-white border-white hover:bg-white hover:text-black rounded-full px-8 gap-2 group"
              >
                Explore Gallery
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
