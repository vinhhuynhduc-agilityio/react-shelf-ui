// hooks
import { useFetchBooks, useGetMyShelf } from "@/hooks";

// stores
import { useBookStore, useUserStore } from "@/stores";

// components
import { BookHomeList, ErrorBoundary, TodayQuote } from "@/components";

// types
import { Book } from "@/types/books";

// helpers
import { filterBooksByShelves } from "@/helpers";

const HomePage: React.FC = () => {
	// Fetch books from the API
	const { isLoading, isError, error } = useFetchBooks();

	// store
	const books = useBookStore((state) => state.books);
	const currentUser = useUserStore((state) => state.currentUser);

	// API hooks
	const { data: myShelf } = useGetMyShelf(currentUser?.id || "");

	// If loading or error, show appropriate messages
	if (isLoading && books.length === 0) {
		return <p>Loading books...</p>;
	}

	if (isError) {
		return (
			<p className="text-red-500">Error loading books: {error?.message}</p>
		);
	}

	// If no books are available, show a message
	if (!books.length) {
		return <p className="text-gray-600">No books available.</p>;
	}

	const recommendedBooks = books.slice(0, 8);

	// Simulated recent readings display; no update feature yet.
	const recentReadings: Book[] = filterBooksByShelves(books, myShelf ?? []);

	return (
		<div>
			<TodayQuote />
			<h1 className="mb-4 mt-10 text-[35px] font-semibold text-gray-600">
				Good Morning
			</h1>
			<ErrorBoundary
				fallback={
					<div className="flex items-center justify-center p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg shadow-md">
						<p className="font-semibold text-lg">
							Error loading recommended books.
						</p>
					</div>
				}
			>
				<BookHomeList title="Recommended for You" books={recommendedBooks} />
			</ErrorBoundary>
			<ErrorBoundary>
				{recentReadings.length > 0 ? (
					<BookHomeList title="Recent Readings" books={recentReadings} />
				) : (
					<p className="mt-4 text-gray-600">
						You have no recent readings yet. Start reading to see them here!
					</p>
				)}
			</ErrorBoundary>
		</div>
	);
};

export default HomePage;
