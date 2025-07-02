import clsx from "clsx";
import { useNavigate } from "react-router-dom";

// hooks
import { useFetchBooks, useGetMyShelf, useRemoveShelfItem } from "@/hooks";

// stores
import { useBookStore, usePendingShelfStore, useUserStore } from "@/stores";

// components
import { MyShelfBookCard } from "@/components";

// constants
import { ROUTE } from "@/constants";

// helpers
import { filterBooksByShelves } from "@/helpers";

// types
import { ShelfItem } from "@/types";

const MyShelfPage: React.FC = () => {
	const navigate = useNavigate();

	// Fetch books from the API
	const { isLoading, isError, error } = useFetchBooks();

	// store
	const books = useBookStore((state) => state.books);
	const currentUser = useUserStore((state) => state.currentUser);
	const { pendingShelfActions } = usePendingShelfStore();

	// API hooks
	const { data: myShelf } = useGetMyShelf(currentUser?.id || "");
	const { mutate: removeShelfItem } = useRemoveShelfItem(currentUser?.id || "");

	const handleReturnBook = (shelfItem: ShelfItem) => {
		removeShelfItem(shelfItem);
	};
	// Filter books by user's shelf
	const borrowedBooks = filterBooksByShelves(books, myShelf ?? []);

	// If loading or error, show appropriate messages
	if (isLoading && books.length === 0) return <p>Loading books...</p>;
	if (isError)
		return (
			<p className="text-red-500">Error loading books: {error?.message}</p>
		);

	// If no books found, show message
	if (!books.length)
		return <p className="text-gray-600">No books available.</p>;

	return (
		<div className="">
			<h1 className="sm:text-[25px] text-[23px] font-bold text-[#4D4D4D] mb-6 mt-4">
				Your <span className="text-[#EF8361]">Shelf</span>
			</h1>
			<div className="flex space-x-16 pb-2 mb-6">
				<button
					className={clsx(
						"font-medium text-[#4D4D4D] sm:text-[20px] text-[18px]"
					)}
				>
					All Books
				</button>
				<button
					className={clsx(
						"text-[#868686] hover:text-[#bfbebe] transition sm:text-[20px] text-[18px] font-medium"
					)}
					onClick={() => navigate(ROUTE.FAVOURITE)}
				>
					Favourite
				</button>
			</div>
			<div className="flex flex-wrap gap-10 justify-center">
				{borrowedBooks.length === 0 ? (
					<p className="text-xl font-semibold text-red-400">
						No books in your shelf.
					</p>
				) : (
					borrowedBooks.map((book) => {
						const disabled = pendingShelfActions.includes(book.id);
						const shelfItem = (myShelf ?? []).find(
							(item) => item.bookId === book.id
						);

						return (
							<div key={book.id} className="">
								<MyShelfBookCard
									book={book}
									borrowedDate={shelfItem?.borrowedDate ?? ""}
									onReturn={() => shelfItem && handleReturnBook(shelfItem)}
									disabled={disabled}
								/>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};

export default MyShelfPage;
