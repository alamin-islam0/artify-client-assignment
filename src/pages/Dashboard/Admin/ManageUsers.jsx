import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  Trash2,
  ShieldCheck,
  Shield,
  User as UserIcon,
  ShieldAlert,
} from "lucide-react";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      // Handle array or object wrapper
      return Array.isArray(res.data)
        ? res.data
        : res.data.data || res.data.users || [];
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }) => {
      return await axiosSecure.patch(`/users/${userId}/role`, { role });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["users"]);
      Swal.fire(
        "Success",
        `User role updated to ${variables.role} successfully!`,
        "success"
      );
    },
    onError: (err) => {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update role",
        "error"
      );
    },
  });

  const handleUpdateRole = (user) => {
    const newRole = user.role?.toLowerCase() === "admin" ? "user" : "admin";
    const actionText =
      user.role?.toLowerCase() === "admin"
        ? "remove admin rights from"
        : "promote";

    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${actionText} ${user.name || user.displayName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        updateRoleMutation.mutate({
          userId: user._id || user.uid,
          role: newRole,
        });
      }
    });
  };

  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      // User instructions said DELETE user account (optional)
      // I'll try generic DELETE /users/:id
      return await axiosSecure.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      Swal.fire("Deleted!", "User account has been deleted.", "success");
    },
    onError: (err) => {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to delete user",
        "error"
      );
    },
  });

  const handleDeleteUser = (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUserMutation.mutate(user._id || user.uid);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-montserrat">Manage Users</h2>
          <p className="text-base-content/60">Total Users: {users.length}</p>
        </div>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-xl border border-base-200">
        <table className="table w-full">
          {/* head */}
          <thead className="bg-base-200/50">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Role</th>
              <th className="text-center">Arts Created</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id || user.uid || index} className="hover">
                <th>{index + 1}</th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={
                            user.photoURL || "https://via.placeholder.com/150"
                          }
                          alt={user.name}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${
                              user.name || user.email || "Unknown"
                            }&background=random`;
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">
                        {user.name ||
                          user.displayName ||
                          user.email?.split("@")[0] ||
                          "Unknown"}
                      </div>
                      <div className="text-sm opacity-50">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {user.role?.toLowerCase() === "admin" ? (
                    <div className="badge badge-primary gap-2">
                      <ShieldCheck size={14} /> Admin
                    </div>
                  ) : (
                    <div className="badge badge-ghost gap-2">
                      <UserIcon size={14} /> User
                    </div>
                  )}
                </td>
                <td className="text-center font-semibold">
                  {user.artsCount || user.totalArts || 0}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleUpdateRole(user)}
                      className={`btn btn-xs tooltip ${
                        user.role?.toLowerCase() === "admin"
                          ? "btn-warning text-warning-content"
                          : "btn-ghost text-primary"
                      }`}
                      data-tip={
                        user.role?.toLowerCase() === "admin"
                          ? "Remove Admin"
                          : "Make Admin"
                      }
                    >
                      {user.role?.toLowerCase() === "admin" ? (
                        <ShieldAlert size={18} />
                      ) : (
                        <Shield size={18} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="btn btn-ghost btn-xs text-error tooltip"
                      data-tip="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center p-10 text-base-content/50">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
