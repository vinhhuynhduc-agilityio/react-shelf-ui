// services/bookService.ts
import { apiRequest } from "@/services";
import { API_BASE_URL } from "@/config";
import { Book } from "@/types";

// types
import { User } from "@/types";

export const fetchBooks = async (): Promise<Book[]> => {
  return apiRequest<null, Book[]>("GET", `${API_BASE_URL}/books`);
};

export const updateUser = async (user: User): Promise<User> => {
  return apiRequest("PUT", `${API_BASE_URL}/users/${user.id}`, user);
};
