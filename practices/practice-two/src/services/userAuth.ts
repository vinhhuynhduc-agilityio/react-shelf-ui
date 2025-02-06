import { v4 as uuidv4 } from 'uuid';

// config
import { API_BASE_URL } from "@/config";

// constants
import { API_USERS } from "@/constants/userRoutes";

// services
import { apiRequest } from "@/services";

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
      id: uuidv4(),
      avatarUrl: "",
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

export const fetchUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const data = await apiRequest<null, User[]>(
      "GET",
      `${API_BASE_URL}${API_USERS.LOGIN}?email=${email}`
    );

    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Failed to fetch user by email:", error);
    throw error;
  }
};
