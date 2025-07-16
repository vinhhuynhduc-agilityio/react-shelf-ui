// hooks
import { useFetchBooks, useFetchMySHelf } from "@/hooks";

// stores
import { useBookStore, useShelfStore, useUserStore } from "@/stores";

// components
import { BookHomeList, ErrorBoundary, TodayQuote } from "@/components";

// types
import { Book } from "@/types/books";

// helpers
import { filterBooksByShelves } from "@/helpers";

const HomePage: React.FC = () => {
	const currentUser = useUserStore((state) => state.currentUser);

	// Fetch books and shelves from the API
	const { isLoading: isLoadingBooks, isError, error } = useFetchBooks();
	const { isFetching: isFetchingShelf } = useFetchMySHelf(
		currentUser?.id || ""
	);

	// store
	const books = useBookStore((state) => state.books);
	const { shelf } = useShelfStore();

	const recommendedBooks = books.slice(0, 8);

	// Simulated recent readings display; no update feature yet.
	const recentReadings: Book[] = filterBooksByShelves(books, shelf ?? []);

	const isLoadingRecent = isFetchingShelf || isLoadingBooks;

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
				<BookHomeList
					isLoading={isLoadingBooks}
					isError={isError}
					errorMessage={error?.message}
					title="Recommended for You"
					books={recommendedBooks}
				/>
			</ErrorBoundary>
			<ErrorBoundary
				fallback={
					<div className="flex items-center justify-center p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg shadow-md">
						<p className="font-semibold text-lg">
							Error loading recent readings.
						</p>
					</div>
				}
			>
				<BookHomeList
					isLoading={isLoadingRecent}
					isError={isError}
					errorMessage={error?.message}
					title="Recent Readings"
					books={recentReadings}
				/>
			</ErrorBoundary>
		</div>
	);
};

export default HomePage;
