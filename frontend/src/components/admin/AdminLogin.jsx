import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import { useAuthStore } from "../../stores/authStore";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

export default function AdminLogin() {
  useDocumentMeta({ title: "Admin sign in", robots: "noindex, nofollow" });
  const navigate = useNavigate();
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { user } = await api.login(credentials);
      if (user.role !== "admin") throw new Error("Admin access is required");
      setAuthenticated(user);
      navigate("/admin", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return <main className="admin-login" id="main-content"><form className="package-form" onSubmit={submit}><p className="kicker">STAFF ACCESS</p><h1>Admin sign in</h1><p>Use your staff credentials to manage Travel Basket journeys.</p><label>Email<input type="email" autoComplete="email" value={credentials.email} onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} required /></label><label>Password<input type="password" autoComplete="current-password" minLength="8" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} required /></label>{error && <p className="notice" role="alert">{error}</p>}<button className="primary-button" disabled={submitting}>{submitting ? "Signing in…" : "Sign in"}</button></form></main>;
}
