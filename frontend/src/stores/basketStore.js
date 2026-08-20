import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBasketStore = create(persist((set, get) => ({ items: [], toggleItem: (pkg, departureId) => { const exists = get().items.some((item) => item.packageId === pkg.id); set({ items: exists ? get().items.filter((item) => item.packageId !== pkg.id) : [...get().items, { packageId: pkg.id, departureId: departureId || pkg.departures?.[0]?.id }] }); } }), { name: "travel-basket-items" }));
