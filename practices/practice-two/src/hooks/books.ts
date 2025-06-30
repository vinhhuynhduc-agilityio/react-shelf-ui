import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// services
import { getBooks } from "@/services/bookService";

// stores
import { useBookStore } from "@/stores/bookStore";

export const useFetchBooks = () => {
	const hasFetched = useBookStore((state) => state.hasFetched);
	const setBooks = useBookStore((state) => state.setBooks);
	const books = useBookStore((state) => state.books);

	const query = useQuery({
		queryKey: ["books"],
		queryFn: getBooks,
		enabled: !hasFetched,
	});

	useEffect(() => {
		if (query.isSuccess && !hasFetched && query.data && query.data.length > 0) {
			setBooks(query.data || []);
		}
	}, [query.isSuccess, query.data, hasFetched, setBooks]);

	return {
		books: query.data || books,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,
	};
};
