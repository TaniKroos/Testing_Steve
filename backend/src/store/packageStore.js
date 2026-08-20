import { randomUUID } from "node:crypto";
import { prisma } from "../prisma.js";

const jsonFields = ["highlights", "inclusions", "itinerary", "departures", "items"];
function parse(value, fallback = []) { try { return JSON.parse(value); } catch { return fallback; } }
function serialisePackage(item) {
  return Object.fromEntries(Object.entries(item).map(([key, value]) => [key, jsonFields.includes(key) ? JSON.stringify(value ?? []) : value]));
}
function hydratePackage(item) {
  if (!item) return null;
  return Object.fromEntries(Object.entries(item).map(([key, value]) => [key, jsonFields.includes(key) ? parse(value) : value]));
}
function hydrateBooking(item) { return item && { ...item, items: parse(item.items) }; }

export const packageStore = {
  async list({ includeUnpublished = false, where = {}, skip, take, orderBy } = {}) {
    const status = includeUnpublished ? undefined : "published";
    const items = await prisma.package.findMany({ where: { ...where, ...(status ? { status } : {}) }, skip, take, orderBy });
    return items.map(hydratePackage);
  },
  async count(where = {}) { return prisma.package.count({ where }); },
  async get(id) { return hydratePackage(await prisma.package.findUnique({ where: { id } })); },
  async create(item) { return hydratePackage(await prisma.package.create({ data: serialisePackage({ ...item, id: item.id || `pkg-${randomUUID()}` }) })); },
  async update(id, changes) { try { return hydratePackage(await prisma.package.update({ where: { id }, data: serialisePackage(changes) })); } catch (error) { if (error.code === "P2025") return null; throw error; } },
  async remove(id) { try { return hydratePackage(await prisma.package.delete({ where: { id } })); } catch (error) { if (error.code === "P2025") return null; throw error; } },
  async createBooking(booking) { return hydrateBooking(await prisma.bookingRequest.create({ data: { ...booking, id: booking.id || `booking-${randomUUID()}`, items: JSON.stringify(booking.items) } })); },
  async listBookings() { return (await prisma.bookingRequest.findMany({ orderBy: { createdAt: "desc" } })).map(hydrateBooking); },
  async updateBooking(id, changes) { try { return hydrateBooking(await prisma.bookingRequest.update({ where: { id }, data: changes })); } catch (error) { if (error.code === "P2025") return null; throw error; } },
};
