import "dotenv/config";
import { randomUUID } from "node:crypto";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import pinoHttp from "pino-http";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { authRouter, loginRouter } from "./routes/authRoutes.js";
import { allowedOrigins } from "./config/security.js";
import { jwtSecret } from "./middleware/auth.js";
import { packageRouter } from "./routes/packageRoutes.js";
import { logger } from "./utils/logger.js";

export const app = express();
const port = Number(process.env.PORT || 3001);
jwtSecret();
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: "draft-8", legacyHeaders: false, message: { success: false, error: { code: "RATE_LIMITED", message: "Too many requests, please try again later" } } });
const bookingLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false, message: { success: false, error: { code: "BOOKING_RATE_LIMITED", message: "Too many booking attempts, please try again later" } } });
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: "draft-8", legacyHeaders: false, message: { success: false, error: { code: "LOGIN_RATE_LIMITED", message: "Too many login attempts, please try again later" } } });
const swagger = swaggerJSDoc({ definition: { openapi: "3.0.3", info: { title: "Travel Basket API", version: "1.1.0" }, components: { securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } } } }, apis: [] });

app.disable("x-powered-by");
app.use((req, res, next) => { req.id = randomUUID(); res.setHeader("X-Request-Id", req.id); next(); });
app.use(pinoHttp({ logger, genReqId: (req) => req.id }));
app.use(helmet());
app.use(cors({ origin(origin, callback) { return !origin || allowedOrigins.includes(origin) ? callback(null, true) : callback(new Error("Origin not allowed by CORS")); }, methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], allowedHeaders: ["Content-Type"], credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use("/api", apiLimiter);
app.use("/api/booking-requests", bookingLimiter);
app.get("/api/health", (_req, res) => res.json({ success: true, data: { status: "ok", service: "travel-basket-api", version: "1.1.0", uptime: process.uptime(), timestamp: new Date().toISOString() } }));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swagger));
app.use("/api/auth/login", loginLimiter, loginRouter);
app.use("/api/auth", authRouter);
app.use("/api", packageRouter);
app.use(notFound);
app.use(errorHandler);

let server;
export function startServer() {
  server = app.listen(port, () => logger.info({ port }, "Travel Basket API listening"));
  return server;
}
async function shutdown(signal) {
  logger.info({ signal }, "Shutting down gracefully");
  if (server) await new Promise((resolve) => server.close(resolve));
  process.exit(0);
}
if (process.env.NODE_ENV !== "test") {
  startServer();
  process.once("SIGTERM", () => shutdown("SIGTERM"));
  process.once("SIGINT", () => shutdown("SIGINT"));
}
