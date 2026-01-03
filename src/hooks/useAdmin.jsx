import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../providers/AuthProvider";
import useAxiosSecure from "./useAxiosSecure";

const useAdmin = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: isAdmin, isPending: isAdminLoading } = useQuery({
    queryKey: [user?.email, "isAdmin"],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      // Fetch all users and find the current one to check role
      // Ideally backend should have /users/:email or /users/admin/:email
      const res = await axiosSecure.get("/users");
      // Handle different response structures just in case
      const users = Array.isArray(res.data)
        ? res.data
        : res.data.data || res.data.users || [];
      const currentUser = users.find((u) => u.email === user.email);
      return currentUser?.role?.toLowerCase() === "admin";
    },
  });

  return [isAdmin, isAdminLoading];
};

export default useAdmin;
