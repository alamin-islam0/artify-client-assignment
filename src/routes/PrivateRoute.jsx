import Loading from "../components/Loading";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <Loading />;
  return user ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: loc }} replace />
  );
}
