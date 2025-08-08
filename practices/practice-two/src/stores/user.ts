import { create } from "zustand";

// types
import { User } from "@/types/user";

interface UserStore {
  currentUser: User | null;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  logout: () => set({ currentUser: null }),
  setUser: (user) => set({ currentUser: user }),
}));
