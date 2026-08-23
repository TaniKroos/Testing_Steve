import { randomUUID } from "node:crypto";
import { Router } from "express";
import sanitizeHtml from "sanitize-html";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { verifyOrigin } from "../config/security.js";
import { validate } from "../middleware/validate.js";
import { packageStore } from "../store/packageStore.js";
import { bookingSchema, bookingStatusSchema, createPackageSchema, patchPackageSchema, updatePackageSchema } from "../validators/schemas.js";

export const packageRouter = Router();
const allowedSorts = new Set(["price", "rating", "createdAt", "updatedAt", "title"]);
const stringFields = new Set(["title", "location", "country", "duration", "description", "category", "difficulty", "groupSize", "availability", "notes", "name"]);

function sanitise(value) {
  if (Array.isArray(value)) return value.map(sanitise);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, sanitise(entry)]));
  return typeof value === "string" ? sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim() : value;
}
function packageWhere(query, publishedOnly) {
  const where = publishedOnly ? { status: "published" } : {};
  if (query.category) where.category = String(query.category);
  if (query.country) where.country = String(query.country);
  if (query.search) where.OR = ["title", "location", "description"].map((field) => ({ [field]: { contains: String(query.search) } }));
  return where;
}
function pagination(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 20));
  const rawSort = String(query.sort || "-featured");
  const key = rawSort.replace(/^-/, "");
  const orderBy = allowedSorts.has(key) ? { [key]: rawSort.startsWith("-") ? "desc" : "asc" } : { featured: "desc" };
  return { page, limit, orderBy };
}
async function listPackages(req, res, next, includeUnpublished = false) {
  try {
    const { page, limit, orderBy } = pagination(req.query);
    const where = packageWhere(req.query, !includeUnpublished);
    const [data, total] = await Promise.all([packageStore.list({ includeUnpublished, where, skip: (page - 1) * limit, take: limit, orderBy }), packageStore.count(where)]);
    return res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { return next(error); }
}

packageRouter.get("/packages", (req, res, next) => listPackages(req, res, next));
packageRouter.get("/packages/:id", async (req, res, next) => {
  try {
    const item = await packageStore.get(req.params.id);
    if (!item || item.status !== "published") return res.status(404).json({ success: false, error: { code: "PACKAGE_NOT_FOUND", message: "Package not found" } });
    return res.json({ success: true, data: item });
  } catch (error) { return next(error); }
});

packageRouter.use("/admin", authenticate, requireAdmin);
packageRouter.use("/admin", (req, res, next) => ["POST", "PUT", "PATCH", "DELETE"].includes(req.method) ? verifyOrigin(req, res, next) : next());
packageRouter.get("/admin/packages", (req, res, next) => listPackages(req, res, next, true));
packageRouter.post("/admin/packages", validate(createPackageSchema), async (req, res, next) => {
  try { return res.status(201).json({ success: true, data: await packageStore.create(sanitise(req.body)) }); } catch (error) { return next(error); }
});
packageRouter.put("/admin/packages/:id", validate(updatePackageSchema), async (req, res, next) => {
  try {
    const item = await packageStore.update(req.params.id, sanitise(req.body));
    return item ? res.json({ success: true, data: item }) : res.status(404).json({ success: false, error: { code: "PACKAGE_NOT_FOUND", message: "Package not found" } });
  } catch (error) { return next(error); }
});
packageRouter.patch("/admin/packages/:id", validate(patchPackageSchema), async (req, res, next) => {
  try {
    const item = await packageStore.update(req.params.id, sanitise(req.body));
    return item ? res.json({ success: true, data: item }) : res.status(404).json({ success: false, error: { code: "PACKAGE_NOT_FOUND", message: "Package not found" } });
  } catch (error) { return next(error); }
});
packageRouter.delete("/admin/packages/:id", async (req, res, next) => {
  try {
    const item = await packageStore.remove(req.params.id);
    return item ? res.status(204).end() : res.status(404).json({ success: false, error: { code: "PACKAGE_NOT_FOUND", message: "Package not found" } });
  } catch (error) { return next(error); }
});
packageRouter.get("/admin/booking-requests", async (_req, res, next) => {
  try { return res.json({ success: true, data: await packageStore.listBookings() }); } catch (error) { return next(error); }
});
packageRouter.patch("/admin/booking-requests/:id", validate(bookingStatusSchema), async (req, res, next) => {
  try {
    const item = await packageStore.updateBooking(req.params.id, req.body);
    return item ? res.json({ success: true, data: item }) : res.status(404).json({ success: false, error: { code: "BOOKING_NOT_FOUND", message: "Booking request not found" } });
  } catch (error) { return next(error); }
});

packageRouter.post("/booking-requests", validate(bookingSchema), async (req, res, next) => {
  try {
    const booking = { ...sanitise(req.body), id: `booking-${randomUUID()}`, status: "new" };
    return res.status(201).json({ success: true, data: await packageStore.createBooking(booking) });
  } catch (error) { return next(error); }
});
