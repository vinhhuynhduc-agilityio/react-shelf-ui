import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// types
import { User } from "@/types/user";

interface UserStore {
  currentUser: User | null;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      currentUser: null,
      logout: () => set({ currentUser: null }),
      setUser: (user) => set({ currentUser: user }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
