import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBasketStore = create(persist((set, get) => ({
  items: [],
  toggleItem: (pkg, departureId) => {
    const exists = get().items.some((item) => item.packageId === pkg.id);
    set({ items: exists ? get().items.filter((item) => item.packageId !== pkg.id) : [...get().items, { packageId: pkg.id, departureId: departureId || pkg.departures?.[0]?.id }] });
  },
  clearItems: (items) => set({ items: get().items.filter((item) => !items.some((submitted) => submitted.packageId === item.packageId)) }),
}), { name: "travel-basket-items" }));
