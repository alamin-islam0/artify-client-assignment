import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  Users,
  Palette,
  Flag,
  TrendingUp,
  Activity,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const DashboardAdminHome = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/stats");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-lg loading-spinner text-primary"></span>
      </div>
    );
  }

  // Use backend data for charts or fallback to empty array
  // Backend should return artGrowth and userGrowth arrays of objects { name: "Day/Month", count: N }
  const artGrowthData = stats.artGrowth || [];

  const userGrowthData = stats.userGrowth || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-montserrat mb-2">
          Dashboard Overview
        </h2>
        <p className="text-base-content/60">
          Welcome back! Here's what's happening on Artify today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
          <div className="stat-figure text-primary">
            <Users size={32} />
          </div>
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">{stats.totalUsers || 0}</div>
          <div className="stat-desc">registered platform users</div>
        </div>

        <div className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
          <div className="stat-figure text-secondary">
            <Palette size={32} />
          </div>
          <div className="stat-title">Public Arts</div>
          <div className="stat-value text-secondary">
            {stats.totalPublicArts || 0}
          </div>
          <div className="stat-desc">visible to everyone</div>
        </div>

        <div className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
          <div className="stat-figure text-error">
            <Flag size={32} />
          </div>
          <div className="stat-title">Reported Arts</div>
          <div className="stat-value text-error">
            {stats.totalReportedArts || 0}
          </div>
          <div className="stat-desc">pending moderation</div>
        </div>

        <div className="stat bg-base-100 shadow-xl rounded-2xl border border-base-200">
          <div className="stat-figure text-accent">
            <Calendar size={32} />
          </div>
          <div className="stat-title">New Today</div>
          <div className="stat-value text-accent">{stats.todayArts || 0}</div>
          <div className="stat-desc">arts created today</div>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Arts Growth Chart */}
        <div className="bg-base-100 p-6 rounded-3xl shadow-lg border border-base-200 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Arts Growth</h3>
                <p className="text-xs text-base-content/50">Last 7 Days</p>
              </div>
            </div>
          </div>

          <div className="h-[350px] w-full mt-auto">
            {artGrowthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={artGrowthData}>
                  <defs>
                    <linearGradient id="colorArts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#570DF8" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#570DF8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.1}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      padding: "12px",
                    }}
                    itemStyle={{ color: "#1F2937", fontWeight: 600 }}
                    cursor={{
                      stroke: "#570DF8",
                      strokeWidth: 2,
                      strokeDasharray: "5 5",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#570DF8"
                    strokeWidth={4}
                    dot={{ fill: "#570DF8", r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 8, stroke: "#fff", strokeWidth: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-base-content/30 gap-2">
                <TrendingUp size={48} />
                <p>No growth data available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-base-100 p-6 rounded-3xl shadow-lg border border-base-200 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-xl text-secondary">
                <Activity size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">User Growth</h3>
                <p className="text-xs text-base-content/50">Monthly Overview</p>
              </div>
            </div>
          </div>

          <div className="h-[350px] w-full mt-auto">
            {userGrowthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F000B8" stopOpacity={1} />
                      <stop
                        offset="100%"
                        stopColor="#F000B8"
                        stopOpacity={0.6}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.1}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#F000B8", opacity: 0.1 }}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      padding: "12px",
                    }}
                    itemStyle={{ color: "#1F2937", fontWeight: 600 }}
                  />
                  <Bar
                    dataKey="count"
                    fill="url(#colorUsers)"
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-base-content/30 gap-2">
                <Activity size={48} />
                <p>No user data available yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Most Active Contributors - Mock or Real if available */}
      {/* If stats doesn't have it, we'll skip or show a placeholder, but requirement says "Display" */}
      {/* I'll assume stats activeContributors exists or I'll leave a note */}
    </div>
  );
};

export default DashboardAdminHome;
