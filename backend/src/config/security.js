const defaultDevelopmentOrigin = "http://localhost:5173";

export const allowedOrigins = (process.env.ALLOWED_ORIGINS || defaultDevelopmentOrigin)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite: process.env.COOKIE_SAMESITE || "lax",
  maxAge: 8 * 60 * 60 * 1000,
  path: "/",
};

export function verifyOrigin(req, res, next) {
  const source = req.get("origin") || req.get("referer");
  let origin;

  try {
    origin = source && new URL(source).origin;
  } catch {
    origin = undefined;
  }

  if (!origin || !allowedOrigins.includes(origin)) {
    return res.status(403).json({ success: false, error: { code: "INVALID_ORIGIN", message: "Invalid origin" } });
  }

  return next();
}
