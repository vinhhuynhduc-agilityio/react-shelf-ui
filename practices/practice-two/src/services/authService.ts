import { v4 as uuidv4 } from "uuid";

// constants
import { API_ENDPOINTS } from "@/constants";

// services
import { API_BASE_URL, apiRequest } from "@/services";

// types
import { User } from "@/types/user";

export interface RegisterUserData {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

export const registerUser = async (
  newUser: RegisterUserData
): Promise<User> => {
  const userWithDefaults = {
    ...newUser,
    id: uuidv4(),
    avatarUrl: "",
  };

  return apiRequest<typeof userWithDefaults, User>(
    "POST",
    `${API_BASE_URL}${API_ENDPOINTS.REGISTER}`,
    userWithDefaults
  );
};
