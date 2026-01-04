import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
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
  Legend,
} from "recharts";
import {
  Image as ImageIcon,
  Heart,
  TrendingUp,
  Calendar,
  Loader2,
  PlusCircle,
  ExternalLink,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";

import Loading from "../../components/Loading";

/**
 * User Dashboard Home
 * Displays stats, charts, and a table of the user's added artworks.
 */
const DashboardHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch User's Artworks
  const { data: artworks = [], isLoading: artsLoading } = useQuery({
    queryKey: ["my-arts", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-arts?email=${user.email}`);
      return res.data;
    },
  });

  // Fetch Favorites Count
  const { data: favorites = [], isLoading: favLoading } = useQuery({
    queryKey: ["my-favorites", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/favorites?email=${user.email}`);
      return res.data;
    },
  });

  if (artsLoading || favLoading) {
    return <Loading />;
  }

  // Calculate Stats
  const totalArtworks = artworks.length;
  const totalFavorites = favorites.length;

  // Calculate New Today
  const today = new Date().toDateString();
  const totalNewToday = artworks.filter((art) => {
    const artDate = new Date(
      art.createdAt || art.date || art.processing_time || 0
    ).toDateString();
    return artDate === today;
  }).length;

  const recentArtworks = [...artworks]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || a.processing_time || 0);
      const dateB = new Date(b.createdAt || b.date || b.processing_time || 0);
      return dateB - dateA;
    })
    .slice(0, 5);

  // Prepare Chart Data
  // 1. Bar Chart: Arts by Category
  const categoryCount = artworks.reduce((acc, curr) => {
    const cat =
      curr.subcategory_Name || curr.subcategory || curr.category || "Other";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const barChartData = Object.keys(categoryCount).map((key) => ({
    name: key,
    count: categoryCount[key],
  }));

  // 2. Pie Chart: Price Distribution
  const priceDistribution = artworks.reduce(
    (acc, curr) => {
      const price = parseFloat(curr.price || 0);
      if (price < 50) acc["Budget (< $50)"]++;
      else if (price >= 50 && price <= 200) acc["Mid-Range ($50 - $200)"]++;
      else acc["Premium (> $200)"]++;
      return acc;
    },
    { "Budget (< $50)": 0, "Mid-Range ($50 - $200)": 0, "Premium (> $200)": 0 }
  );

  const pieChartData = Object.keys(priceDistribution)
    .filter((key) => priceDistribution[key] > 0)
    .map((key) => ({
      name: key,
      value: priceDistribution[key],
    }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

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
            Manage your personal gallery and check your impact.
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
          <div className="stat-figure text-primary">
            <div className="p-3 bg-primary/10 rounded-xl">
              <ImageIcon size={32} />
            </div>
          </div>
          <div className="stat-title">My Artworks</div>
          <div className="stat-value text-primary">{totalArtworks}</div>
          <div className="stat-desc">items added to gallery</div>
        </div>

        <div className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
          <div className="stat-figure text-secondary">
            <div className="p-3 bg-secondary/10 rounded-xl">
              <Heart size={32} />
            </div>
          </div>
          <div className="stat-title">My Favorites</div>
          <div className="stat-value text-secondary">{totalFavorites}</div>
          <div className="stat-desc">saved for inspiration</div>
        </div>

        <div className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
          <div className="stat-figure text-accent">
            <div className="p-3 bg-accent/10 rounded-xl">
              <PlusCircle size={32} />
            </div>
          </div>
          <div className="stat-title">New Today</div>
          <div className="stat-value text-accent">{totalNewToday}</div>
          <div className="stat-desc">arts added today</div>
        </div>
      </div>

      {/* Charts Section */}
      {artworks.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart: Arts by Category */}
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body p-6">
              <h3 className="card-title text-lg mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-primary" />
                Artworks by Category
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
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
                      tick={{ fill: "#6B7280" }}
                      dy={10}
                    />
                    <YAxis
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#6B7280" }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(0,0,0,0.05)" }}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#570DF8" // Primary color
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Pie Chart: Price Distribution */}
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body p-6">
              <h3 className="card-title text-lg mb-4 flex items-center gap-2">
                <PieChartIcon size={20} className="text-secondary" />
                Price Distribution
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
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
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area: Table replacing Charts */}
      <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
        <div className="card-body p-0">
          <div className="p-6 border-b border-base-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                <ImageIcon size={20} className="text-primary" />
                My Recent Artworks
              </h3>
              <p className="text-sm text-base-content/60">
                A list of your recently added contributions to the community.
              </p>
            </div>
            <Link
              to="/dashboard/add-artwork"
              className="btn btn-primary btn-sm gap-2"
            >
              <PlusCircle size={16} />
              Add New Art
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-lg w-full">
              {/* head */}
              <thead className="bg-base-200/50 text-base-content/70">
                <tr>
                  <th>Artwork Details</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentArtworks.length > 0 ? (
                  recentArtworks.map((art) => (
                    <tr
                      key={art._id}
                      className="hover:bg-base-200/30 transition-colors"
                    >
                      <td>
                        <div className="flex items-center gap-4">
                          <div className="avatar">
                            <div className="mask mask-squircle w-14 h-14 bg-base-200">
                              <img
                                src={
                                  art.photo ||
                                  art.imageUrl ||
                                  art.image ||
                                  "https://placehold.co/100x100?text=No+Image"
                                }
                                alt={art.title}
                                className="object-cover"
                                onError={(e) =>
                                  (e.target.src =
                                    "https://placehold.co/100x100?text=No+Image")
                                }
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold truncate max-w-[150px] sm:max-w-xs">
                              {art.item_name || art.title}
                            </div>
                            <div className="text-xs opacity-50 flex items-center gap-1">
                              <Calendar size={12} />
                              {art.processing_time ||
                              art.createdAt ||
                              art.date ? (
                                <span>
                                  {/* customized date or just display value */}
                                  {art.processing_time ||
                                    new Date(
                                      art.createdAt || art.date
                                    ).toLocaleDateString()}
                                </span>
                              ) : (
                                <span>Recently added</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-ghost badge-sm">
                          {art.subcategory_Name ||
                            art.subcategory ||
                            art.category ||
                            "N/A"}
                        </span>
                      </td>
                      <td className="font-medium font-mono text-success">
                        ${art.price || 0}
                      </td>
                      <td>
                        <div className="flex items-center gap-1 text-warning font-medium">
                          <span>★</span>
                          <span>{art.rating || "0.0"}</span>
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-success badge-outline gap-1 pl-1 pr-2">
                          <div className="w-2 h-2 rounded-full bg-success"></div>
                          {art.customization === "Yes"
                            ? "Customizable"
                            : "Standard"}
                        </div>
                      </td>
                      <td>
                        <Link
                          to={`/art/${art._id}`}
                          className=" btn-square btn-ghost btn-sm text-base-content/60 hover:text-primary tooltip"
                        >
                          <ExternalLink size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
                          <ImageIcon
                            size={32}
                            className="text-base-content/20"
                          />
                        </div>
                        <h3 className="text-lg font-bold text-base-content/70">
                          No Artworks Found
                        </h3>
                        <p className="max-w-xs text-base-content/50 mt-1 mb-6">
                          You haven't uploaded any masterpieces yet. Start
                          sharing your creativity with the world!
                        </p>
                        <Link
                          to="/dashboard/add-artwork"
                          className="btn btn-primary"
                        >
                          Upload Your First Art
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {recentArtworks.length > 0 && (
            <div className="p-4 border-t border-base-200 bg-base-100 text-center">
              <Link
                to="/dashboard/gallery"
                className="btn btn-ghost btn-sm text-primary"
              >
                View All My Artworks
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
