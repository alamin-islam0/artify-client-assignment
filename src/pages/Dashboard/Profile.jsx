import React, { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { User, Mail, Camera, Save } from "lucide-react";

const Profile = () => {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    photoURL: user?.photoURL || "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Sync user data when loading finishes
  React.useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would implement updateProfile from firebase
    // For now we will just toggle edit mode as "Mock Success" or log it.
    console.log("Updating profile with:", formData);
    setIsEditing(false);
  };

  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto">
      <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
        {/* Header Cover */}
        <div className="h-48 bg-gradient-to-r from-primary to-accent relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="card-body pt-0 relative">
          {/* Avatar Overlay */}
          <div className="-mt-16 mb-6 flex justify-between items-end">
            <div className="avatar online">
              <div className="w-32 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-4 shadow-xl">
                <img
                  src={formData.photoURL}
                  alt="Profile"
                  className="bg-base-200 object-cover"
                  onError={(e) =>
                    (e.target.src = "https://ui-avatars.com/api/?name=User")
                  }
                />
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

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold font-montserrat">
                {formData.displayName}
              </h2>
              <p className="text-base-content/60 flex items-center gap-2 mt-1">
                <Mail size={16} />
                {user?.email}
              </p>
            </div>

            <div className="divider"></div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="grid gap-6 max-w-2xl">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <User size={16} /> Full Name
                    </span>
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="input input-bordered w-full focus:input-primary transition-all"
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
                    name="photoURL"
                    value={formData.photoURL}
                    onChange={handleChange}
                    className="input input-bordered w-full focus:input-primary transition-all"
                  />
                </div>

                <div className="flex justify-end mt-4">
                  <button className="btn btn-primary gap-2">
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-base-200/50 rounded-2xl border border-base-200">
                  <h3 className="font-semibold text-lg mb-4 text-primary">
                    Personal Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-base-content/60">
                        Full Name
                      </span>
                      <span className="text-lg font-medium">
                        {formData.displayName}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-base-content/60">
                        Email Address
                      </span>
                      <span className="text-lg font-medium">{user?.email}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-base-content/60">
                        Member Since
                      </span>
                      <span className="text-lg font-medium">
                        {user?.metadata?.creationTime
                          ? new Date(
                              user.metadata.creationTime
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
