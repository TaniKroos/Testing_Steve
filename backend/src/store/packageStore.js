import { seedPackages } from "../data/seedPackages.js";

let packages = structuredClone(seedPackages);
let bookingRequests = [];

export const packageStore = {
  list({ includeUnpublished = false } = {}) { return packages.filter((item) => includeUnpublished || item.status === "published"); },
  get(id) { return packages.find((travelPackage) => travelPackage.id === id); },
  create(travelPackage) { packages.unshift(travelPackage); return travelPackage; },
  update(id, changes) { const index = packages.findIndex((travelPackage) => travelPackage.id === id); if (index === -1) return null; packages[index] = { ...packages[index], ...changes, id }; return packages[index]; },
  remove(id) { const index = packages.findIndex((travelPackage) => travelPackage.id === id); if (index === -1) return null; return packages.splice(index, 1)[0]; },
  createBooking(booking) { bookingRequests.unshift(booking); return booking; },
  listBookings() { return bookingRequests; }
};
