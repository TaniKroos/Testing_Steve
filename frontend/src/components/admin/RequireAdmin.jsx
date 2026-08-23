import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export function RequireAdmin({ children }) {
  const { status, user } = useAuthStore();

  if (status === "unknown") return null;
  if (status !== "authenticated" || user?.role !== "admin") return <Navigate to="/admin/login" replace />;

  return children;
}
