import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Admin } from "../Admin";
import { ErrorPage } from "../ErrorPage";
import { api } from "../../api";
import { useAuthStore } from "../../stores/authStore";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

export default function AdminRoute() {
  useDocumentMeta({ title: "Admin portal", robots: "noindex, nofollow" });
  const navigate = useNavigate(); const setAnonymous = useAuthStore((state) => state.setAnonymous);
  const packagesQuery = useQuery({ queryKey: ["admin-packages"], queryFn: api.listAdminPackages });
  const bookingsQuery = useQuery({ queryKey: ["admin-bookings"], queryFn: api.listAdminBookings });
  const logout = async () => { await api.logout(); setAnonymous(); navigate("/admin/login", { replace: true }); };
  if (packagesQuery.isError || bookingsQuery.isError) return <ErrorPage error={{ message: "The admin portal could not be loaded." }} resetErrorBoundary={() => window.location.reload()} />;
  return <Admin packages={packagesQuery.data || []} bookings={bookingsQuery.data || []} logout={logout} />;
}
