// services/bookService.ts
import { apiRequest } from "@/services";
import { API_BASE_URL } from "@/config";
import { Book } from "@/types";

// types
import { User } from "@/types";

export const fetchBooks = async (): Promise<Book[]> => {
  const url = `${API_BASE_URL}/books`;

  return apiRequest<null, Book[]>(
    "GET",
    url
  );
};

export const updateUser = async (user: User): Promise<User> => {
  const url = `${API_BASE_URL}/users/${user.id}`;

  return apiRequest(
    "PUT",
    url,
    user
  );
};
