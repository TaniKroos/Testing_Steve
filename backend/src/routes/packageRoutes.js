import { Router } from "express";
import { packageStore } from "../store/packageStore.js";

export const packageRouter = Router();
const requiredFields = ["location", "country", "title", "duration", "price", "image", "description"];
const textFields = ["category", "groupSize", "availability", "difficulty", "status"];
const validStatuses = ["draft", "published", "archived"];

const splitList = (value) => Array.isArray(value) ? value.filter(Boolean) : String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
function validatePackage(body) { const missing = requiredFields.filter((field) => body[field] === undefined || body[field] === ""); if (missing.length) return `Missing required fields: ${missing.join(", ")}`; if (!Number.isFinite(Number(body.price)) || Number(body.price) < 0 || Number(body.discount || 0) < 0 || Number(body.discount || 0) > 100) return "Price must be positive and discount must be between 0 and 100."; if (body.status && !validStatuses.includes(body.status)) return "Status must be draft, published, or archived."; return null; }
function normalisePackage(body) { return { ...body, price: Number(body.price), discount: Number(body.discount || 0), rating: Number(body.rating || 4.8), reviews: Number(body.reviews || 0), featured: Boolean(body.featured), highlights: splitList(body.highlights), inclusions: splitList(body.inclusions), itinerary: Array.isArray(body.itinerary) ? body.itinerary.filter((item) => item?.title) : [], departures: Array.isArray(body.departures) ? body.departures.filter((item) => item?.date).map((item) => ({ id: item.id || `dep-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, date: item.date, seats: Math.max(0, Number(item.seats || 0)) })) : [], ...Object.fromEntries(textFields.map((field) => [field, String(body[field] || (field === "status" ? "draft" : "")).trim()])) }; }

packageRouter.get("/packages", (_req, res) => res.json(packageStore.list()));
packageRouter.get("/packages/:id", (req, res) => { const item = packageStore.get(req.params.id); if (!item || item.status !== "published") return res.status(404).json({ message: "Package not found" }); return res.json(item); });
packageRouter.get("/admin/packages", (_req, res) => res.json(packageStore.list({ includeUnpublished: true })));
packageRouter.post("/admin/packages", (req, res) => { const error = validatePackage(req.body); if (error) return res.status(400).json({ message: error }); const item = { ...normalisePackage(req.body), id: `pkg-${Date.now()}` }; return res.status(201).json(packageStore.create(item)); });
packageRouter.put("/admin/packages/:id", (req, res) => { const error = validatePackage(req.body); if (error) return res.status(400).json({ message: error }); const updated = packageStore.update(req.params.id, normalisePackage(req.body)); if (!updated) return res.status(404).json({ message: "Package not found" }); return res.json(updated); });
packageRouter.delete("/admin/packages/:id", (req, res) => { const deleted = packageStore.remove(req.params.id); if (!deleted) return res.status(404).json({ message: "Package not found" }); return res.status(204).end(); });
packageRouter.post("/booking-requests", (req, res) => { const { name, email, travellers, items } = req.body; if (!name || !email || !Array.isArray(items) || !items.length || Number(travellers) < 1) return res.status(400).json({ message: "Name, email, at least one traveller, and a basket item are required." }); const booking = { id: `booking-${Date.now()}`, name: String(name).trim(), email: String(email).trim(), travellers: Number(travellers), notes: String(req.body.notes || "").trim(), items, createdAt: new Date().toISOString(), status: "new" }; return res.status(201).json(packageStore.createBooking(booking)); });
packageRouter.get("/admin/booking-requests", (_req, res) => res.json(packageStore.listBookings()));
