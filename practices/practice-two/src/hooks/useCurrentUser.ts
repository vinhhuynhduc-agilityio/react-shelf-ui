// stores
import { useUserStore } from "@/stores/userStore";

// types
import { User } from "@/types/user";

export const useCurrentUser = (): User | null => {
  return useUserStore((state) => state.currentUser);
};
