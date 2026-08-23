import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "file:./dev.db";
process.env.JWT_SECRET = "test-secret";
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
  const agent = request.agent(app);

  beforeAll(async () => {
    const response = await agent.post("/api/auth/login").send({ email: "admin@example.com", password: "change-me-before-production" });
    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeUndefined();
    expect(response.body.data.user).toMatchObject({ email: "admin@example.com", role: "admin" });
    expect(response.headers["set-cookie"]?.[0]).toContain("tb_session=");
    expect(response.headers["set-cookie"]?.[0]).toContain("HttpOnly");
  });

  it("protects admin routes and authenticates via the session cookie", async () => {
    expect((await request(app).get("/api/admin/packages")).status).toBe(401);
    expect((await agent.get("/api/admin/packages")).status).toBe(200);
  });

  it("returns the current user only for an authenticated session", async () => {
    expect((await request(app).get("/api/auth/me")).status).toBe(401);
    const response = await agent.get("/api/auth/me");
    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({ email: "admin@example.com", role: "admin" });
  });

  it("clears the session on logout", async () => {
    const response = await agent.post("/api/auth/logout");
    expect(response.status).toBe(204);
    expect(response.headers["set-cookie"]?.[0]).toContain("tb_session=;");
    expect((await agent.get("/api/auth/me")).status).toBe(401);
  });
});
