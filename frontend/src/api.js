const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, { ...options, credentials: "include", headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers } });
  const body = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(body?.error?.message || body?.message || "Request failed");
  return body?.data ?? body;
}
export const api = {
  login: (credentials) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  me: () => request("/auth/me"),
  logout: () => request("/auth/logout", { method: "POST" }),
  listPackages: () => request("/packages?limit=100"), listAdminPackages: () => request("/admin/packages?limit=100"),
  savePackage: (item, id) => request(`/admin/packages${id ? `/${id}` : ""}`, { method: id ? "PUT" : "POST", body: JSON.stringify(item) }),
  deletePackage: (id) => request(`/admin/packages/${id}`, { method: "DELETE" }),
  submitBooking: (booking) => request("/booking-requests", { method: "POST", body: JSON.stringify(booking) }),
};
