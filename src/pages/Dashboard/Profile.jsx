// src/pages/Dashboard/Profile.jsx
import React, { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import useAdmin from "../../hooks/useAdmin";
import Swal from "sweetalert2";
import {
  User,
  Mail,
  Camera,
  Save,
  Zap,
  Sparkles,
  ShieldCheck,
  Calendar,
  Image as ImageIcon,
  Heart,
  Edit3,
} from "lucide-react";
import { updateProfile } from "firebase/auth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { uploadImageCurrent } from "../../utils/imageUpload";

const Profile = () => {
  const { user } = useAuth();
  const [isAdmin] = useAdmin();
  const axiosSecure = useAxiosSecure();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  React.useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  // ... (Queries remain same)
  const { data: artworks = [] } = useQuery({
    queryKey: ["my-arts", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-arts?email=${user.email}`);
      return res.data;
    },
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ["my-favorites", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/favorites?email=${user.email}`);
      return res.data;
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalPhotoURL = photoURL;

      if (selectedImage) {
        const uploadedUrl = await uploadImageCurrent(selectedImage);
        if (uploadedUrl) {
          finalPhotoURL = uploadedUrl;
          setPhotoURL(uploadedUrl); // Update state as well
        }
      }

      await updateProfile(user, { displayName, photoURL: finalPhotoURL });
      Swal.fire({
        title: "Success",
        text: "Profile updated successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setIsEditing(false);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ... (Stats vars)
  // ... (JSX start)

  // ... (Replace only the form inputs part effectively)
  // Logic: I need to replace from imports down to `handleUpdateProfile` end or `return` start if I am confident.
  // Actually, I can just replace the variable declarations and `handleUpdateProfile`.
  // Wait, I can't easily replace disjoint blocks.
  // I will replace valid chunks.

  // Let's replace the top part including imports and component logic setup.

  // Actually, `replace_file_content` is better with chunks.

  // CHUNK 1: Imports
  // CHUNK 2: Component logic (state + handler)
  // CHUNK 3: The Form JSX

  // I will try to do it in one large chunk if possible or step by step.
  // The instruction said "Enable image upload in Profile update".
  // I'll replace the form JSX first to include file input.

  // WAIT, I need to add imports first.

  // ...

  const joinedDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-8 animate-fade-in-up">
      {/* Profile Header Card */}
      <div className="card bg-base-100 shadow-xl overflow-hidden border border-base-200 mb-8">
        {/* Banner */}
        <div
          className={`h-64 relative bg-gradient-to-r ${
            isAdmin
              ? "from-slate-800 to-slate-900"
              : "from-indigo-600 to-purple-700"
          }`}
        >
          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

          <div className="absolute bottom-6 right-8 text-white/90 flex items-center gap-2 font-medium backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full border border-white/10">
            {isAdmin ? (
              <>
                <ShieldCheck size={18} /> Admin Console
              </>
            ) : (
              <>
                <Sparkles size={18} /> Artist Dashboard
              </>
            )}
          </div>
        </div>

        {/* Profile Info Area */}
        <div className="card-body pt-0 relative">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-end -mt-20 px-2">
            {/* User Avatar & Info */}
            <div className="flex flex-col md:flex-row gap-6 items-end md:items-end">
              <div className="avatar">
                <div className="w-40 h-40 rounded-3xl ring-4 ring-base-100 shadow-2xl bg-base-200">
                  <img
                    src={photoURL}
                    alt="Profile"
                    onError={(e) =>
                      (e.target.src =
                        "https://ui-avatars.com/api/?name=" + displayName)
                    }
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="mb-2 text-center md:text-left space-y-1">
                <h1 className="text-3xl text-base-content capitalize lg:text-4xl font-extrabold font-inter flex items-center gap-3">
                  {displayName}
                  {isAdmin && (
                    <span
                      className="tooltip tooltip-right"
                      data-tip="Verified Admin"
                    >
                      <ShieldCheck className="text-primary" size={24} />
                    </span>
                  )}
                </h1>
                <p className="text-base-content/70 font-medium flex items-center justify-center md:justify-start gap-2">
                  <Mail size={16} /> {user?.email}
                </p>
                <div className="flex gap-2 justify-center md:justify-start mt-2">
                  {isAdmin ? (
                    <span className="badge badge-lg badge-primary badge-outline font-bold">
                      Administrator
                    </span>
                  ) : (
                    <span className="badge badge-lg badge-secondary badge-outline font-bold">
                      Art Enthusiast
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-primary shadow-lg gap-2 mb-2 w-full md:w-auto rounded-full"
            >
              {isEditing ? (
                "Cancel Editing"
              ) : (
                <>
                  <Edit3 size={18} /> Edit Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="card bg-base-100 shadow-lg border border-base-200 max-w-3xl mx-auto">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6 border-b pb-4">
              Edit Profile Details
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <User size={18} /> Display Name
                  </span>
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="input input-bordered input-lg w-full focus:input-primary bg-base-50"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <Camera size={18} /> Profile Image
                  </span>
                </label>

                {/* File Upload */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input file-input-bordered file-input-primary w-full mb-3"
                />

                <label className="label pt-0 pb-1">
                  <span className="label-text-alt text-base-content/50">
                    Or use a direct URL
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="input input-bordered input-lg w-full focus:input-primary bg-base-50"
                />
              </div>

              <div className="card-actions justify-end mt-8">
                <button
                  type="submit"
                  className={`btn btn-primary btn-lg rounded-xl min-w-[150px] ${
                    loading ? "loading" : ""
                  }`}
                  disabled={loading}
                >
                  <Save size={20} />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Stats */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat Card 1 */}
            <div className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow border border-base-200">
              <div className="card-body flex-row items-center justify-between">
                <div>
                  <h3 className="stat-title text-base-content/60 font-semibold uppercase tracking-wider text-xs">
                    My Artworks
                  </h3>
                  <div className="stat-value text-primary mt-1">
                    {artworks.length}
                  </div>
                  <div className="stat-desc mt-1">Total published</div>
                </div>
                <div className="p-4 bg-primary/10 rounded-full text-primary">
                  <ImageIcon size={32} />
                </div>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow border border-base-200">
              <div className="card-body flex-row items-center justify-between">
                <div>
                  <h3 className="stat-title text-base-content/60 font-semibold uppercase tracking-wider text-xs">
                    My Favorites
                  </h3>
                  <div className="stat-value text-secondary mt-1">
                    {favorites.length}
                  </div>
                  <div className="stat-desc mt-1">Saved items</div>
                </div>
                <div className="p-4 bg-secondary/10 rounded-full text-secondary">
                  <Heart size={32} />
                </div>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow border border-base-200">
              <div className="card-body flex-row items-center justify-between">
                <div>
                  <h3 className="stat-title text-base-content/60 font-semibold uppercase tracking-wider text-xs">
                    Member Since
                  </h3>
                  <div className="stat-value text-accent text-2xl mt-2">
                    {joinedDate}
                  </div>
                  <div className="stat-desc mt-1">Joined the community</div>
                </div>
                <div className="p-4 bg-accent/10 rounded-full text-accent">
                  <Calendar size={32} />
                </div>
              </div>
            </div>
          </div>

          {/* Details Section can be added here if needed, or kept simple as above */}
          {/* Currently the stats + header cover most needs. You could add a "Recent Activity" or "Bio" here later. */}
        </div>
      )}
    </div>
  );
};

export default Profile;
