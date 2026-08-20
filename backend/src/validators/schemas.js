import { z } from "zod";

const cleanText = (max) => z.string().trim().min(1).max(max);
const optionalText = (max) => z.string().trim().max(max).default("");
const boolean = z.preprocess((value) => value === "true" ? true : value === "false" ? false : value, z.boolean());
const numeric = (schema) => z.preprocess((value) => value === "" || value === null ? undefined : Number(value), schema);
const number = numeric(z.number());
const nonNegativeInteger = numeric(z.number().int().min(0));
const positiveInteger = numeric(z.number().int().positive());

const itinerary = z.object({ day: positiveInteger, title: cleanText(200), description: cleanText(2000) });
const departure = z.object({ id: optionalText(100).optional(), date: z.string().date(), seats: nonNegativeInteger });

const packageFields = {
  title: cleanText(200), location: cleanText(200), country: cleanText(100), duration: cleanText(50),
  price: numeric(z.number().positive()), discount: numeric(z.number().min(0).max(100)).default(0), image: z.string().trim().url(),
  description: cleanText(5000), category: optionalText(50), difficulty: z.enum(["Easy", "Moderate", "Challenging", "Extreme"]).default("Easy"),
  groupSize: optionalText(50), availability: optionalText(100), featured: boolean.default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"), highlights: z.array(cleanText(200)).max(50).default([]),
  inclusions: z.array(cleanText(200)).max(50).default([]), rating: numeric(z.number().min(0).max(5)).default(0), reviews: nonNegativeInteger.default(0),
  itinerary: z.array(itinerary).max(100).default([]), departures: z.array(departure).max(100).default([]),
};

export const createPackageSchema = z.object(packageFields);
export const updatePackageSchema = z.object(packageFields);
export const patchPackageSchema = z.object(packageFields).partial().refine((data) => Object.keys(data).length > 0, "At least one field is required");
export const bookingSchema = z.object({
  name: cleanText(100), email: z.string().trim().email().max(254), travellers: numeric(z.number().int().min(1).max(100)), 
  items: z.array(z.object({ packageId: cleanText(100), departureId: optionalText(100).optional() })).min(1).max(50), notes: optionalText(2000),
});
export const bookingStatusSchema = z.object({ status: z.enum(["new", "confirmed", "completed", "cancelled"]) });
export const loginSchema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(8).max(200) });
