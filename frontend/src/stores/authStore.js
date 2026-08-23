import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  status: "unknown",
  setAuthenticated: (user) => set({ user, status: "authenticated" }),
  setAnonymous: () => set({ user: null, status: "anonymous" }),
}));
