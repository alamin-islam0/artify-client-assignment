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
  Activity,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { updateProfile } from "firebase/auth";

const Profile = () => {
  const { user } = useAuth();
  const [isAdmin] = useAdmin();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync state if user reloads
  React.useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL,
      });
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

  // Mock stats - in a real app, you'd fetch these
  const adminStats = {
    artsModerated: 124,
    reportsResolved: 45,
    joinedDate: user?.metadata?.creationTime
      ? new Date(user.metadata.creationTime).toLocaleDateString()
      : "N/A",
  };

  const userStats = {
    joinedDate: user?.metadata?.creationTime
      ? new Date(user.metadata.creationTime).toLocaleDateString()
      : "N/A",
  };

  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto space-y-8">
      <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
        {/* Header Cover */}
        <div
          className={`h-48 bg-gradient-to-r relative ${
            isAdmin ? "from-primary to-secondary" : "from-primary to-accent"
          }`}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute bottom-4 right-6 text-white/80 font-medium flex items-center gap-2">
            {isAdmin ? (
              <>
                <ShieldCheck size={20} /> Admin Dashboard
              </>
            ) : (
              <>
                <Sparkles size={20} /> User Dashboard
              </>
            )}
          </div>
        </div>

        <div className="card-body pt-0 relative">
          {/* Avatar Overlay */}
          <div className="-mt-16 mb-6 flex flex-col sm:flex-row justify-between items-end gap-4">
            <div className="flex items-end gap-4">
              <div className="avatar online">
                <div className="w-32 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-4 shadow-xl">
                  <img
                    src={photoURL}
                    alt="Profile"
                    onError={(e) =>
                      (e.target.src = "https://ui-avatars.com/api/?name=User")
                    }
                    className="bg-base-200 object-cover"
                  />
                </div>
              </div>
              <div className="mb-2 hidden sm:block">
                <h2 className="text-3xl font-bold font-montserrat flex items-center gap-2">
                  {displayName}
                  {isAdmin ? (
                    <span className="badge badge-primary badge-lg gap-1 text-xs">
                      <ShieldCheck size={12} /> Administrator
                    </span>
                  ) : (
                    <span className="badge badge-accent badge-lg gap-1 text-xs text-white">
                      <Zap size={12} fill="currentColor" /> Art Enthusiast
                    </span>
                  )}
                </h2>
                <p className="text-base-content/60 flex items-center gap-2 mt-1">
                  <Mail size={16} />
                  {user?.email}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`btn ${
                isEditing ? "btn-ghost" : "btn-primary"
              } shadow-lg`}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* Mobile Name View */}
          <div className="sm:hidden mb-6">
            <h2 className="text-2xl font-bold font-montserrat flex flex-col gap-2">
              {displayName}
              {isAdmin ? (
                <span className="badge badge-primary badge-lg gap-1 w-fit">
                  <ShieldCheck size={12} /> Administrator
                </span>
              ) : (
                <span className="badge badge-accent badge-lg gap-1 w-fit text-white">
                  <Zap size={12} fill="currentColor" /> Art Enthusiast
                </span>
              )}
            </h2>
            <p className="text-base-content/60 flex items-center gap-2 mt-2">
              <Mail size={16} />
              {user?.email}
            </p>
          </div>

          <div className="divider"></div>

          {isEditing ? (
            <form
              onSubmit={handleUpdateProfile}
              className="grid gap-6 max-w-2xl"
            >
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <User size={16} /> Full Name
                  </span>
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="input input-bordered w-full focus:input-primary transition-all"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <Camera size={16} /> Photo URL
                  </span>
                </label>
                <input
                  type="text"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="input input-bordered w-full focus:input-primary transition-all"
                  required
                />
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className={`btn btn-primary gap-2 ${
                    loading ? "loading" : ""
                  }`}
                  disabled={loading}
                >
                  <Save size={18} />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              {/* Stats Grid - Role Based */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isAdmin ? (
                  <>
                    <div className="stats shadow border border-base-200 bg-base-100/50">
                      <div className="stat">
                        <div className="stat-figure text-primary">
                          <Activity size={24} />
                        </div>
                        <div className="stat-title">Arts Moderated</div>
                        <div className="stat-value text-primary text-2xl">
                          {adminStats.artsModerated}
                        </div>
                        <div className="stat-desc">Lifetime Actions</div>
                      </div>
                    </div>

                    <div className="stats shadow border border-base-200 bg-base-100/50">
                      <div className="stat">
                        <div className="stat-figure text-secondary">
                          <CheckCircle size={24} />
                        </div>
                        <div className="stat-title">Reports Resolved</div>
                        <div className="stat-value text-secondary text-2xl">
                          {adminStats.reportsResolved}
                        </div>
                        <div className="stat-desc">Community Safety</div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* User Specific Stats Placeholder - maybe 'Favorites Added' or similar later */
                  <div className="hidden md:block"></div>
                )}

                {/* Common Stat */}
                <div className="stats shadow border border-base-200 bg-base-100/50 md:col-start-3">
                  <div className="stat">
                    <div className="stat-figure text-accent">
                      <Calendar size={24} />
                    </div>
                    <div className="stat-title">Member Since</div>
                    <div className="stat-value text-accent text-lg">
                      {userStats.joinedDate}
                    </div>
                    <div className="stat-desc">Community Member</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-base-200/50 rounded-2xl border border-base-200">
                  <h3 className="font-semibold text-lg mb-4 text-primary">
                    {isAdmin ? "Administrator" : "Personal"} Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-base-content/60">
                        Full Name
                      </span>
                      <span className="text-lg font-medium">{displayName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-base-content/60">
                        Email Address
                      </span>
                      <span className="text-lg font-medium">{user?.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
