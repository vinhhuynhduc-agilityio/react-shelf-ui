import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// services
import { getBooks } from "@/services/bookService";

// stores
import { useBookStore } from "@/stores/bookStore";

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

export const useFetchBooks = () => {
	const hasFetched = useBookStore((state) => state.hasFetched);
	const setBooks = useBookStore((state) => state.setBooks);
	const books = useBookStore((state) => state.books);

	const {
		data: queryBooks,
		isLoading,
		isError,
		error,
		isSuccess,
	} = useBooksQuery(!hasFetched);

	useEffect(() => {
		if (isSuccess && !hasFetched && Array.isArray(queryBooks)) {
			setBooks(queryBooks || []);
		}
	}, [isSuccess, queryBooks, hasFetched, setBooks]);

	return {
		books: queryBooks || books,
		isLoading: isLoading,
		isError: isError,
		error: error,
	};
};
