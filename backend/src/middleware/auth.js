import jwt from "jsonwebtoken";

const developmentSecret = "development-secret-not-for-production";

export function jwtSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === "development") return developmentSecret;
  throw new Error("JWT_SECRET must be configured outside development");
}

export function authenticate(req, res, next) {
  const token = req.cookies?.tb_session;
  if (!token) return res.status(401).json({ success: false, error: { code: "AUTH_REQUIRED", message: "Authentication required" } });

  try {
    req.user = jwt.verify(token, jwtSecret());
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
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, jwtSecret(), { expiresIn: "8h" });
}
