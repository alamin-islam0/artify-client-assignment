import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  Trash2,
  CheckCircle,
  Star,
  Filter,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";

const ManageArts = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [filterCategory, setFilterCategory] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState("all"); // all, public, private
  const [filterStatus, setFilterStatus] = useState("all"); // all, reported

  const { data: arts = [], isLoading } = useQuery({
    queryKey: ["admin-arts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/arts");
      return Array.isArray(res.data)
        ? res.data
        : res.data.data || res.data.arts || [];
    },
  });

  // Calculate stats from the fetched arts (since endpoint returns all arts for moderation)
  const stats = {
    totalPublic: arts.filter((a) => a.visibility === "public" || a.isPublic)
      .length,
    totalPrivate: arts.filter((a) => a.visibility === "private" || !a.isPublic)
      .length,
    totalFlagged: arts.filter((a) => a.isReported || a.status === "flagged")
      .length,
  };

  const deleteArtMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/arts/${id}`); // Assumes standard delete
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-arts"]);
      Swal.fire("Deleted!", "Art has been removed.", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to delete art.", "error");
    },
  });

  const updateArtMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      // Assumes PATCH /arts/:id
      return await axiosSecure.patch(`/arts/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-arts"]);
      // Swal.fire("Updated!", "Art status updated.", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to update art.", "error");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Permanent removal. This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteArtMutation.mutate(id);
      }
    });
  };

  const handleFeature = (id, currentStatus) => {
    updateArtMutation.mutate({ id, updates: { featured: !currentStatus } });
  };

  const handleReview = (id) => {
    updateArtMutation.mutate({ id, updates: { isReviewed: true } });
  };

  const filteredArts = arts.filter((art) => {
    if (filterCategory !== "all" && art.category !== filterCategory)
      return false;
    if (filterVisibility !== "all") {
      const isPub = art.visibility === "public" || art.isPublic === true;
      if (filterVisibility === "public" && !isPub) return false;
      if (filterVisibility === "private" && isPub) return false;
    }
    if (
      filterStatus === "reported" &&
      !(art.isReported || art.status === "flagged")
    )
      return false;
    return true;
  });

  // Extract unique categories
  const categories = [...new Set(arts.map((a) => a.category).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-montserrat">Manage Arts</h2>
        <p className="text-base-content/60">
          Moderate and curate platform content
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stats shadow border border-base-200">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <Eye size={24} />
            </div>
            <div className="stat-title">Public Arts</div>
            <div className="stat-value text-secondary text-2xl">
              {stats.totalPublic}
            </div>
          </div>
        </div>
        <div className="stats shadow border border-base-200">
          <div className="stat">
            <div className="stat-figure text-base-content/50">
              <EyeOff size={24} />
            </div>
            <div className="stat-title">Private Arts</div>
            <div className="stat-value text-base-content/70 text-2xl">
              {stats.totalPrivate}
            </div>
          </div>
        </div>
        <div className="stats shadow border border-base-200">
          <div className="stat">
            <div className="stat-figure text-error">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-title">Flagged</div>
            <div className="stat-value text-error text-2xl">
              {stats.totalFlagged}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-base-100 p-4 rounded-xl shadow-sm border border-base-200 items-center">
        <div className="flex items-center gap-2 text-base-content/70">
          <Filter size={18} />
          <span className="font-medium">Filters:</span>
        </div>

        <select
          className="select select-bordered select-sm"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered select-sm"
          value={filterVisibility}
          onChange={(e) => setFilterVisibility(e.target.value)}
        >
          <option value="all">All Visibility</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <select
          className="select select-bordered select-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="reported">Reported / Flagged</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-xl border border-base-200">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Art</th>
              <th>Artist</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredArts.map((art) => (
              <tr key={art._id} className="hover">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={
                            art.imageUrl ||
                            art.image ||
                            "https://via.placeholder.com/150"
                          }
                          alt={art.title}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{art.title}</div>
                      <div className="text-xs opacity-50">{art.category}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-sm font-medium">
                    {art.userName || art.artistName || "Unknown"}
                  </div>
                  <div className="text-xs opacity-50">
                    {art.userEmail || art.artistEmail}
                  </div>
                </td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {art.featured && (
                      <span className="badge badge-warning badge-xs">
                        Featured
                      </span>
                    )}
                    {art.isReviewed && (
                      <span className="badge badge-success badge-xs">
                        Reviewed
                      </span>
                    )}
                    {art.visibility === "public" || art.isPublic ? (
                      <span className="badge badge-ghost badge-xs">Public</span>
                    ) : (
                      <span className="badge badge-neutral badge-xs">
                        Private
                      </span>
                    )}
                    {(art.isReported || art.status === "flagged") && (
                      <span className="badge badge-error badge-xs">
                        Flagged
                      </span>
                    )}
                  </div>
                </td>
                <td className="text-sm text-base-content/70">
                  {new Date(art.createdAt || art.date).toLocaleDateString()}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleFeature(art._id, art.featured)}
                      className={`btn btn-square btn-sm ${
                        art.featured
                          ? "btn-warning"
                          : "btn-ghost text-base-content/30"
                      }`}
                      title={art.featured ? "Remove Featured" : "Mark Featured"}
                    >
                      <Star
                        size={16}
                        fill={art.featured ? "currentColor" : "none"}
                      />
                    </button>
                    {!art.isReviewed && (
                      <button
                        onClick={() => handleReview(art._id)}
                        className="btn btn-square btn-sm btn-ghost text-success"
                        title="Mark as Reviewed"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(art._id)}
                      className="btn btn-square btn-sm btn-ghost text-error"
                      title="Delete Art"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredArts.length === 0 && (
          <div className="p-8 text-center text-base-content/50">
            No arts found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageArts;
