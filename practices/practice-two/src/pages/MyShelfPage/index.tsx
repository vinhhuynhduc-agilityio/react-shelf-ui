import { useEffect, useRef } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

// hooks
import { useFetchBooks, useFetchMySHelf, useRemoveShelfItem } from "@/hooks";

// stores
import {
	useBookStore,
	usePendingShelfStore,
	useShelfStore,
	useUserStore,
	useShelfChangedStore,
} from "@/stores";

// components
import { MyShelfBookCard } from "@/components";

// constants
import { QUERY_KEY_MY_SHELF, ROUTE } from "@/constants";

// helpers
import { filterBooksByShelves } from "@/helpers";

// types
import { ShelfItem } from "@/types";

const MyShelfPage: React.FC = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	// Fetch books from the API
	const { isLoading, error, isError: isErrorFetchBook } = useFetchBooks();

	// store
	const books = useBookStore((state) => state.books);
	const currentUser = useUserStore((state) => state.currentUser);
	const { pendingShelfActions } = usePendingShelfStore();
	const { shelf, setShelf } = useShelfStore();
	const { shelfChanged, setShelfChanged } = useShelfChangedStore();

	// API hooks
	const { isError: isErrorShelf, isFetching: isFetchingShelf } =
		useFetchMySHelf(currentUser?.id || "");
	const { mutate: removeShelfItem } = useRemoveShelfItem();

	// refs
	const shelfChangedRef = useRef(shelfChanged);
	const setShelfChangedRef = useRef(setShelfChanged);

	useEffect(() => {
		shelfChangedRef.current = shelfChanged;
	}, [shelfChanged]);

	useEffect(() => {
		setShelfChangedRef.current = setShelfChanged;
	}, [setShelfChanged]);

	useEffect(() => {
		setShelfChangedRef.current = setShelfChanged;

		return () => {
			// Invalidate the shelf query if there are changes
			// when the component unmounts or dependencies change
			if (shelfChangedRef.current) {
				queryClient.invalidateQueries({
					queryKey: QUERY_KEY_MY_SHELF(currentUser?.id ?? ""),
				});
				setShelfChangedRef.current(false);
			}
		};
	}, [currentUser?.id, queryClient, setShelfChanged]);

	const handleReturnBook = (shelfItem: ShelfItem) => {
		removeShelfItem(shelfItem, {
			onSuccess: () => {
				setShelf(
					shelf.filter((item: ShelfItem) => item.bookId !== shelfItem.bookId)
				);
				setShelfChanged(true);
			},
		});
	};

	// Filter books by user's shelf
	const borrowedBooks = filterBooksByShelves(books, shelf ?? []);

	// If loading or error, show appropriate messages
	if (isLoading && isFetchingShelf) return <p>Loading books...</p>;

	if (isErrorShelf || isErrorFetchBook)
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
						const shelfItem = (shelf ?? []).find(
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
