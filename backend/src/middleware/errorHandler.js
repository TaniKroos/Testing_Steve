import { logger } from "../utils/logger.js";

export function notFound(req, res) {
  res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: `Route ${req.method} ${req.path} was not found` } });
}

export function errorHandler(error, req, res, _next) {
  logger.error({ err: error, requestId: req.id, method: req.method, path: req.path }, "Request failed");
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, error: { code: "INVALID_JSON", message: "Invalid JSON in request body" } });
  }
  return res.status(error.status || 500).json({
    success: false,
    error: { code: error.code || "INTERNAL_ERROR", message: process.env.NODE_ENV === "production" ? "Internal server error" : error.message },
  });
}
