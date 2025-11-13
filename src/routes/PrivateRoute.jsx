import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  return user ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: loc }} replace />
  );
}
