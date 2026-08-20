import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "file:./dev.db";
const { app } = await import("../src/server.js");

describe("public API", () => {
  it("returns a health report", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("ok");
    expect(response.headers["x-request-id"]).toBeTruthy();
  });

  it("returns a paginated package list", async () => {
    const response = await request(app).get("/api/packages?limit=2&sort=-rating");
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.pagination.total).toBeGreaterThan(0);
  });

  it("rejects invalid booking data", async () => {
    const response = await request(app).post("/api/booking-requests").send({ name: "x", email: "not-email", travellers: 0, items: [] });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("admin authentication", () => {
  let token;
  beforeAll(async () => {
    const response = await request(app).post("/api/auth/login").send({ email: "admin@example.com", password: "change-me-before-production" });
    token = response.body.data.token;
  });

  it("protects admin routes", async () => {
    expect((await request(app).get("/api/admin/packages")).status).toBe(401);
    expect((await request(app).get("/api/admin/packages").set("Authorization", `Bearer ${token}`)).status).toBe(200);
  });
});
