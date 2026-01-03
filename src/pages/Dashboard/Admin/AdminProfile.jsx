import React, { useState } from "react";
import { useAuth } from "../../../providers/AuthProvider";
import Swal from "sweetalert2";
import { User, Mail, ShieldCheck, Camera, Edit2 } from "lucide-react";
import { updateProfile } from "firebase/auth";

const AdminProfile = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock activity stats since backend might not track "moderation actions" per admin
  const stats = {
    artsModerated: 124,
    reportsResolved: 45,
    joinedDate: new Date(user?.metadata?.creationTime).toLocaleDateString(),
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL,
      });
      Swal.fire("Success", "Profile updated successfully!", "success");
      setIsEditing(false);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-montserrat">Admin Profile</h2>
        <p className="text-base-content/60">Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body items-center text-center">
              <div className="relative group">
                <div className="avatar">
                  <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={user?.photoURL} alt="Profile" />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                  <Camera size={24} />
                </div>
              </div>
              <h2 className="card-title mt-4">{user?.displayName}</h2>
              <div className="badge badge-primary gap-2">
                <ShieldCheck size={14} /> Administrator
              </div>
              <p className="text-sm text-base-content/60 mt-2">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Details & Edit Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
              <div className="flex items-center justify-between mb-6">
                <h3 className="card-title">Profile Information</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn btn-ghost btn-sm gap-2"
                >
                  <Edit2 size={16} /> {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Display Name</span>
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Photo URL</span>
                    </label>
                    <input
                      type="text"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className={`btn btn-primary ${loading ? "loading" : ""}`}
                      disabled={loading}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-base-200/50">
                    <User className="text-primary" />
                    <div>
                      <p className="text-xs text-base-content/60">Full Name</p>
                      <p className="font-semibold">{user?.displayName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-base-200/50">
                    <Mail className="text-secondary" />
                    <div>
                      <p className="text-xs text-base-content/60">
                        Email Address
                      </p>
                      <p className="font-semibold">{user?.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="stats shadow bg-primary/5 border border-primary/20">
              <div className="stat place-items-center">
                <div className="stat-title text-xs">Arts Moderated</div>
                <div className="stat-value text-primary text-2xl">
                  {stats.artsModerated}
                </div>
              </div>
            </div>
            <div className="stats shadow bg-secondary/5 border border-secondary/20">
              <div className="stat place-items-center">
                <div className="stat-title text-xs">Reports Solved</div>
                <div className="stat-value text-secondary text-2xl">
                  {stats.reportsResolved}
                </div>
              </div>
            </div>
            <div className="stats shadow bg-accent/5 border border-accent/20">
              <div className="stat place-items-center">
                <div className="stat-title text-xs">Member Since</div>
                <div className="stat-value text-accent text-lg">
                  {stats.joinedDate}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
