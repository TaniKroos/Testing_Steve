import { Router } from "express";
import { packageStore } from "../store/packageStore.js";

export const packageRouter = Router();
const requiredFields = ["location", "country", "title", "duration", "price", "image", "description"];
const optionalTextFields = ["category", "groupSize", "availability"];

function validatePackage(body) { const missing = requiredFields.filter((field) => body[field] === undefined || body[field] === ""); if (missing.length) return `Missing required fields: ${missing.join(", ")}`; if (Number(body.price) < 0 || Number(body.discount || 0) < 0 || Number(body.discount || 0) > 100) return "Price must be positive and discount must be between 0 and 100."; return null; }
function normalisePackage(body) { return { ...body, price: Number(body.price), discount: Number(body.discount || 0), rating: Number(body.rating || 4.8), reviews: Number(body.reviews || 0), featured: Boolean(body.featured), highlights: Array.isArray(body.highlights) ? body.highlights.filter(Boolean) : String(body.highlights || "").split(",").map((item) => item.trim()).filter(Boolean), ...Object.fromEntries(optionalTextFields.map((field) => [field, String(body[field] || "").trim()])) }; }

packageRouter.get("/packages", (_req, res) => res.json(packageStore.list()));
packageRouter.get("/packages/:id", (req, res) => { const travelPackage = packageStore.get(req.params.id); if (!travelPackage) return res.status(404).json({ message: "Package not found" }); return res.json(travelPackage); });
packageRouter.post("/admin/packages", (req, res) => { const error = validatePackage(req.body); if (error) return res.status(400).json({ message: error }); const travelPackage = { ...normalisePackage(req.body), id: `pkg-${Date.now()}` }; return res.status(201).json(packageStore.create(travelPackage)); });
packageRouter.put("/admin/packages/:id", (req, res) => { const error = validatePackage(req.body); if (error) return res.status(400).json({ message: error }); const updated = packageStore.update(req.params.id, normalisePackage(req.body)); if (!updated) return res.status(404).json({ message: "Package not found" }); return res.json(updated); });
