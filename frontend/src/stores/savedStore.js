import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSavedStore = create(persist((set, get) => ({
  items: [],
  toggleItem: (pkg) => {
    const exists = get().items.some((item) => item.packageId === pkg.id);
    set({ items: exists ? get().items.filter((item) => item.packageId !== pkg.id) : [...get().items, { packageId: pkg.id }] });
  },
}), { name: "travel-basket-saved" }));
