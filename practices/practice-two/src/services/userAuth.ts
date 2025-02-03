// config
import { API_BASE_URL } from "@/config";

// constants
import { API_USERS } from "@/constants/userRoutes";

// services
import { apiRequest } from "@/services/apiRequest";

// types
import { User } from "@/types/user";

export const registerUser = async (newUser: {
  username: string;
  email: string;
  password: string;
}): Promise<{ data: User | null; error: Error | null }> => {
  try {
    const userWithDefaults = {
      ...newUser,
      shelf: [],
      favourites: [],
      recentReadings: [],
    };

    const data = await apiRequest<typeof userWithDefaults, User>(
      "POST",
      `${API_BASE_URL}${API_USERS.REGISTER}`,
      userWithDefaults
    );

    return { data, error: null };
  } catch (error) {
    console.error("Failed to register:", error);
    return { data: null, error: error as Error };
  }
};
