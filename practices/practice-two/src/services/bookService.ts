// services
import { API_BASE_URL, apiRequest } from "@/services";

// types
import { Book } from "@/types";

// constants
import { API_ENDPOINTS } from "@/constants";

export const getBooks = (): Promise<Book[]> => {
  const url = `${API_BASE_URL}${API_ENDPOINTS.BOOKS}`;

  return apiRequest<null, Book[]>("GET", url);
};
