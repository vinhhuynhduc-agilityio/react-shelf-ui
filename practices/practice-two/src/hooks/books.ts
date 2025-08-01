import { useQuery } from "@tanstack/react-query";

// services
import { getBooks } from "@/services/bookService";

// constants
import { ERROR_MESSAGE, QUERY_KEY_BOOKS } from "@/constants";

export const useBooksQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: QUERY_KEY_BOOKS,
    queryFn: getBooks,
    meta: { errorMessage: ERROR_MESSAGE.BOOKS_FETCH_ERROR },
    enabled,
  });
};
