import { v4 as uuidv4 } from 'uuid';

// config
import { API_BASE_URL } from "@/config";

// constants
import { API_USERS } from "@/constants/userRoutes";

// services
import { apiRequest } from "@/services";

// types
import { User } from '@/types/user';

export interface RegisterUserData {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

export const registerUser = async (newUser: RegisterUserData): Promise<User> => {
  const userWithDefaults = {
    ...newUser,
    id: uuidv4(),
    avatarUrl: "",
    shelf: [],
    favourites: [],
    recentReadings: [],
  };

  return apiRequest<typeof userWithDefaults, User>(
    "POST",
    `${API_BASE_URL}${API_USERS.REGISTER}`,
    userWithDefaults
  );
};

export const fetchUserByEmail = async (email: string): Promise<User | null> => {
  const data = await apiRequest<null, User[]>(
    "GET",
    `${API_BASE_URL}${API_USERS.LOGIN}?email=${email}`
  );

  return data.length > 0 ? data[0] : null;
};
