// hooks/useFetchBooks.ts
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchBooks } from "@/services/bookService";
import { Book } from "@/types/books";

export const useFetchBooks = (): UseQueryResult<Book[], Error> => {
  return useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });
};
