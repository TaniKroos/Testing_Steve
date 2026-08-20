import jwt from "jsonwebtoken";

const secret = () => process.env.JWT_SECRET || "development-secret-not-for-production";

export function authenticate(req, res, next) {
  const token = req.headers.authorization?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) return res.status(401).json({ success: false, error: { code: "AUTH_REQUIRED", message: "Authentication required" } });

  try {
    req.user = jwt.verify(token, secret());
    return next();
  } catch {
    return res.status(401).json({ success: false, error: { code: "INVALID_TOKEN", message: "Invalid or expired token" } });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ success: false, error: { code: "ADMIN_REQUIRED", message: "Admin access required" } });
  return next();
}

export function createToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, secret(), { expiresIn: "8h" });
}
