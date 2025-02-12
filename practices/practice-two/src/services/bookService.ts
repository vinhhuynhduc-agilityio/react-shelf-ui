// services/bookService.ts
import { apiRequest } from "@/services";
import { API_BASE_URL } from "@/config";
import { Book } from "@/types/books";

export const fetchBooks = async (): Promise<Book[]> => {
  return apiRequest<null, Book[]>("GET", `${API_BASE_URL}/books`);
};
