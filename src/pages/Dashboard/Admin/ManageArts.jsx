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
  Globe,
  Lock,
  Search,
} from "lucide-react";

import Loading from "../../../components/Loading";

const ManageArts = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("all"); // all, public, private, reported
  const [searchQuery, setSearchQuery] = useState("");

  const { data: arts = [], isLoading } = useQuery({
    queryKey: ["admin-arts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/arts");
      return Array.isArray(res.data)
        ? res.data
        : res.data.data || res.data.arts || [];
    },
  });

  const deleteArtMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/arts/${id}`);
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
      return await axiosSecure.patch(`/arts/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-arts"]);
      Swal.fire({
        title: "Updated!",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });
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

  const handleVisibility = (id, currentVisibility, isPublicBool) => {
    // Check if using 'visibility' string or 'isPublic' boolean
    // We will standardize to updates
    const isCurrentlyPublic =
      currentVisibility === "public" || isPublicBool === true;
    const newUpdates = {
      visibility: isCurrentlyPublic ? "private" : "public",
      isPublic: !isCurrentlyPublic,
    };
    updateArtMutation.mutate({ id, updates: newUpdates });
  };

  const filteredArts = arts.filter((art) => {
    // Text Search
    if (
      searchQuery &&
      !art.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !art.userName?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Tabs
    if (activeTab === "public") {
      return art.visibility === "public" || art.isPublic;
    }
    if (activeTab === "private") {
      return (
        art.visibility === "private" ||
        (art.visibility !== "public" && !art.isPublic)
      );
    }
    if (activeTab === "reported") {
      return art.isReported || art.status === "flagged";
    }
    if (activeTab === "featured") {
      return art.featured === true;
    }
    return true;
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-montserrat">Manage Arts</h2>
        <p className="text-base-content/60">
          Moderate and curate platform content
        </p>
      </div>

      {/* Modern Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-base-100 p-2 rounded-2xl shadow-sm border border-base-200">
        {/* Tabs */}
        <div className="tabs tabs-boxed bg-transparent p-0 gap-2">
          <a
            className={`tab h-10 px-6 rounded-xl transition-all duration-300 ${
              activeTab === "all"
                ? "bg-primary text-white shadow-md shadow-primary/30"
                : "hover:bg-base-200"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Arts
          </a>
          <a
            className={`tab h-10 px-6 rounded-xl transition-all duration-300 ${
              activeTab === "public"
                ? "bg-secondary text-white shadow-md shadow-secondary/30"
                : "hover:bg-base-200"
            }`}
            onClick={() => setActiveTab("public")}
          >
            Public
          </a>
          <a
            className={`tab h-10 px-6 rounded-xl transition-all duration-300 ${
              activeTab === "private"
                ? "bg-neutral text-neutral-content shadow-md"
                : "hover:bg-base-200"
            }`}
            onClick={() => setActiveTab("private")}
          >
            Private
          </a>
          <a
            className={`tab h-10 px-6 rounded-xl transition-all duration-300 ${
              activeTab === "featured"
                ? "bg-warning text-warning-content shadow-md"
                : "hover:bg-base-200"
            }`}
            onClick={() => setActiveTab("featured")}
          >
            Featured
          </a>
          <a
            className={`tab h-10 px-6 rounded-xl transition-all duration-300 ${
              activeTab === "reported"
                ? "bg-error text-white shadow-md shadow-error/30"
                : "hover:bg-base-200"
            }`}
            onClick={() => setActiveTab("reported")}
          >
            Reported
          </a>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-auto">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50"
          />
          <input
            type="text"
            placeholder="Search arts..."
            className="input input-sm input-bordered pl-10 w-full md:w-64 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-xl border border-base-200">
        <table className="table w-full">
          <thead className="bg-base-200/50">
            <tr>
              <th>Art</th>
              <th>Artist</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-right pr-6">Actions</th>
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
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{art.title}</div>
                      <div className="text-xs opacity-50 badge badge-ghost badge-sm mt-1">
                        {art.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {art.userName || art.artistName || "Unknown"}
                    </span>
                    <span className="text-xs opacity-50">
                      {art.userEmail || art.artistEmail}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    {art.visibility === "public" || art.isPublic ? (
                      <div className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-full">
                        <Globe size={12} /> Public
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs font-bold text-base-content/50 bg-base-200 px-2 py-1 rounded-full">
                        <Lock size={12} /> Private
                      </div>
                    )}

                    {art.featured && (
                      <div className="flex items-center gap-1 text-xs font-bold text-warning bg-warning/10 px-2 py-1 rounded-full">
                        <Star size={12} fill="currentColor" /> Featured
                      </div>
                    )}
                  </div>
                </td>
                <td className="text-sm opacity-70">
                  {new Date(art.createdAt || art.date).toLocaleDateString()}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Feature Toggle */}
                    <button
                      onClick={() => handleFeature(art._id, art.featured)}
                      className={` btn-circle p-[6px] ${
                        art.featured
                          ? "bg-warning text-white hover:bg-warning/80"
                          : "bg-base-200 hover:bg-warning hover:text-white"
                      }`}
                      title={art.featured ? "Unmark Featured" : "Mark Featured"}
                    >
                      <Star size={20} />
                    </button>

                    {/* Visibility Toggle */}
                    <button
                      onClick={() =>
                        handleVisibility(art._id, art.visibility, art.isPublic)
                      }
                      className={`btn-circle p-[6px] ${
                        art.visibility === "public" || art.isPublic
                          ? "bg-primary text-white hover:bg-primary/80"
                          : "bg-base-200 hover:bg-primary hover:text-white"
                      }`}
                      title={
                        art.visibility === "public" || art.isPublic
                          ? "Make Private"
                          : "Make Public"
                      }
                    >
                      {art.visibility === "public" || art.isPublic ? (
                        <Globe size={20} />
                      ) : (
                        <Lock size={20} />
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(art._id)}
                      className="btn-circle p-[6px] bg-red-100 text-red-600 hover:bg-red-600 hover:text-white border-0"
                      title="Delete Art"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredArts.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
              <Filter className="text-base-content/30" size={32} />
            </div>
            <h3 className="text-lg font-bold opacity-70">No artworks found</h3>
            <p className="text-sm opacity-50">
              Try adjusting your filters or search query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageArts;
