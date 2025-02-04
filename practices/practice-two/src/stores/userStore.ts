import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// types
import { User } from "@/types/user";

interface UserStore {
  currentUser: User | null;
  signIn: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      currentUser: null,
      signIn: (user: User) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
