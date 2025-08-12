// services
import { API_BASE_URL } from "@/services";

// helpers
import { apiRequest } from "@/helpers";

// types
import { User } from "@/types";

// constants
import { API_ENDPOINTS } from "@/constants";

export const fetchUserByEmail = async (email: string): Promise<User | null> => {
  const data = await apiRequest<null, User[]>(
    "GET",
    `${API_BASE_URL}${API_ENDPOINTS.LOGIN}?email=${email}`
  );

  return data.length > 0 ? data[0] : null;
};

export const updateUser = async (user: User): Promise<User> => {
  const url = `${API_BASE_URL}/users/${user.id}`;

  return apiRequest("PUT", url, user);
};
