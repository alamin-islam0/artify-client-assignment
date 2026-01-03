import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSign,
  Image as ImageIcon,
  Heart,
  TrendingUp,
  Loader2,
  Calendar,
} from "lucide-react";

/**
 * MOCKED DATA
 * In a real scenario, this would come from an API call like /api/dashboard/stats
 */
const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DashboardHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalArtworks: 0,
    totalFavorites: 0,
    recentArtworks: [],
    loading: true,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user?.email) return;

        // Fetch My Artworks using the endpoint seen in Gallery.jsx
        // Try the most likely one first
        let artworks = [];
        try {
          const artRes = await fetch(
            `${API_BASE}/my-arts?email=${encodeURIComponent(user.email)}`
          );
          if (artRes.ok) {
            const json = await artRes.json();
            artworks = Array.isArray(json) ? json : [];
          } else {
            // Fallback to /arts?artistEmail query
            const artRes2 = await fetch(
              `${API_BASE}/arts?artistEmail=${encodeURIComponent(user.email)}`
            );
            if (artRes2.ok) {
              const json = await artRes2.json();
              artworks = Array.isArray(json) ? json : json.data || [];
            }
          }
        } catch (e) {
          console.warn("Error fetching artworks:", e);
        }

        // Fetch Favorites - assuming standard favorites endpoint often matches pattern
        // Example: /favorites/:email
        let favorites = [];
        try {
          const favRes = await fetch(
            `${API_BASE}/favorites?email=${encodeURIComponent(user.email)}`
          );
          if (favRes.ok) {
            favorites = await favRes.json();
          }
        } catch (e) {
          console.warn("Error fetching favorites:", e);
        }

        setStats({
          totalArtworks: artworks.length || 0,
          totalFavorites: favorites.length || 0,
          recentArtworks: artworks.slice(0, 5) || [],
          loading: false,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, [user]);

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Derived data for charts
  const ratingData = stats.recentArtworks.map((art) => ({
    name: art.title?.substring(0, 10) + "...",
    rating: parseFloat(art.rating || 0),
    price: parseFloat(art.price || 0),
  }));

  // Example distribution data (e.g., By Customization)
  const customizationData = [
    {
      name: "Customizable",
      value: stats.recentArtworks.filter((a) => a.customization === "Yes")
        .length,
    },
    {
      name: "Non-Custom",
      value: stats.recentArtworks.filter((a) => a.customization !== "Yes")
        .length,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-montserrat">
            Welcome back,{" "}
            <span className="text-primary">
              {user?.displayName?.split(" ")[0]}!
            </span>
          </h1>
          <p className="text-base-content/60 mt-1">
            Here's what's happening with your art collection today.
          </p>
        </div>
        <div className="bg-base-100 px-4 py-2 rounded-lg shadow-sm font-medium flex items-center gap-2 border border-base-300">
          <Calendar size={18} className="text-primary" />
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="stat-figure text-primary">
            <div className="p-3 bg-white/50 rounded-full group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
              <ImageIcon size={32} />
            </div>
          </div>
          <div className="stat-title font-medium text-primary-content/70">
            Total Artworks
          </div>
          <div className="stat-value text-primary text-4xl mt-1">
            {stats.totalArtworks}
          </div>
          <div className="stat-desc font-medium">Items in your gallery</div>
        </div>

        <div className="stat bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="stat-figure text-secondary">
            <div className="p-3 bg-white/50 rounded-full group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
              <Heart size={32} />
            </div>
          </div>
          <div className="stat-title font-medium text-secondary-content/70">
            Total Favorites
          </div>
          <div className="stat-value text-secondary text-4xl mt-1">
            {stats.totalFavorites}
          </div>
          <div className="stat-desc font-medium">Items you loved</div>
        </div>

        <div className="stat bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="stat-figure text-accent">
            <div className="p-3 bg-white/50 rounded-full group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
              <TrendingUp size={32} />
            </div>
          </div>
          <div className="stat-title font-medium text-accent-content/70">
            Engagement
          </div>
          <div className="stat-value text-accent text-4xl mt-1">High</div>
          <div className="stat-desc font-medium">Based on activity</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body p-6">
            <h3 className="card-title text-lg mb-4">
              Artwork Pricing Overview
            </h3>
            <div className="h-64 w-full">
              {ratingData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis
                      dataKey="name"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: "rgba(0,0,0,0.05)" }}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="price"
                      fill="oklch(var(--p))"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-base-content/40">
                  No data to display
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body p-6">
            <h3 className="card-title text-lg mb-4">
              Collection Customization
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customizationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {customizationData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 text-sm">
                {customizationData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span>{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Artworks Table */}
      <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
        <div className="card-body p-0">
          <div className="p-6 border-b border-base-200 flex justify-between items-center">
            <h3 className="font-bold text-lg">Recent Uploads</h3>
            <Link
              to="/dashboard/gallery"
              className="btn btn-sm btn-ghost text-primary"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-lg">
              {/* head */}
              <thead className="bg-base-200/50">
                <tr>
                  <th className="font-semibold text-base-content/70">
                    Artwork
                  </th>
                  <th className="font-semibold text-base-content/70">
                    Category
                  </th>
                  <th className="font-semibold text-base-content/70">Price</th>
                  <th className="font-semibold text-base-content/70">Rating</th>
                  <th className="font-semibold text-base-content/70">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentArtworks.length > 0 ? (
                  stats.recentArtworks.map((art) => (
                    <tr
                      key={art._id}
                      className="hover:bg-base-200/30 transition-colors"
                    >
                      <td>
                        <div className="flex items-center gap-4">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img
                                src={art.photo}
                                alt={art.title}
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{art.title}</div>
                            <div className="text-sm opacity-50">
                              {new Date().toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-ghost badge-sm">
                          {art.subcategory}
                        </div>
                      </td>
                      <td className="font-medium text-success">${art.price}</td>
                      <td>
                        <div className="flex items-center gap-1 text-warning">
                          <span>★</span>
                          <span>{art.rating}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-success badge-outline badge-sm">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-8 text-base-content/50"
                    >
                      No recent artworks found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
