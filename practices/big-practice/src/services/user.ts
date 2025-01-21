import { API_BASE_URL } from "@/config";
import { API_ROUTES } from "@/constant";
import { apiRequest } from "@/services/apiRequest";
import { UserData } from "@/types";

export const fetchUsers = async (): Promise<{ data: UserData[] | null; error: Error | null }> => {
  try {
    const data = await apiRequest<UserData[], UserData[]>(
      'GET',
      `${API_BASE_URL}${API_ROUTES.USERS}`
    );

    return {
      data,
      error: null
    };
  } catch (error) {
    console.error("Failed to fetch users:", error);

    return {
      data: null,
      error: error as Error
    };
  }
};

export const updateUser = async (id: string, payload: UserData): Promise<{ data: UserData | null; error: Error | null }> => {
  try {
    const data = await apiRequest<UserData, UserData>(
      'PUT',
      `${API_BASE_URL}${API_ROUTES.USERS}/${id}`,
      payload
    );

    return {
      data,
      error: null
    };
  } catch (error) {
    console.error("Failed to update users:", error);

    return {
      data: null,
      error: error as Error
    };
  }
};

export const createUser = async (payload: UserData): Promise<{ data: UserData | null; error: Error | null }> => {
  try {
    const data = await apiRequest<UserData, UserData>(
      'POST',
      `${API_BASE_URL}${API_ROUTES.USERS}`,
      payload
    );

    return {
      data,
      error: null
    };
  } catch (error) {
    console.error("Failed to create users:", error);

    return {
      data: null,
      error: error as Error
    };
  }
};
