import { useNavigate } from "react-router-dom";

// stores
import {
	useBookStore,
	usePendingFavouritesStore,
	useUserStore,
} from "@/stores";

// types
import { Book, FavouriteItem } from "@/types";

// helpers
import { isBookInShelf } from "@/helpers";

// components
import { BackButton, BookRow, HeaderRow } from "@/components";

// hooks
import {
	useFetchBooks,
	useGetFavourites,
	useGetMyShelf,
	useRemoveFavouriteItem,
} from "@/hooks";

// constants
import { ROUTE } from "@/constants";

const FavouritePage: React.FC = () => {
	const navigate = useNavigate();

	// hooks
	const { isLoading, isError, error } = useFetchBooks();

	// store
	const books = useBookStore((state) => state.books);
	const currentUser = useUserStore((state) => state.currentUser);
	const pendingFavouritesActions = usePendingFavouritesStore(
		(state) => state.pendingFavouritesActions
	);

	// API hooks
	const { data: favourites } = useGetFavourites(currentUser?.id || "");
	const { data: shelves } = useGetMyShelf(currentUser?.id || "");
	const { mutate: removeFavourite } = useRemoveFavouriteItem(
		currentUser?.id || ""
	);

	// Filter books by favourites
	const filteredBooks = books.filter((book) => {
		return favourites?.some((favourite) => favourite.bookId === book.id);
	});

	// If loading or error, show appropriate messages
	if (isLoading && books.length === 0) return <p>Loading books...</p>;

	if (isError)
		return (
			<p className="text-red-500">Error loading books: {error?.message}</p>
		);

	// If no books in favourites, show message
	if (!filteredBooks.length)
		return <p className="text-gray-600">No books in your favourites.</p>;

	// Navigate to book preview page with book details and from route
	const handleCLickPreview = (book: Book) =>
		navigate(`${ROUTE.BOOK_PREVIEW}/${book.id}`, {
			state: {
				book,
				from: ROUTE.FAVOURITE,
			},
		});

	// Handle back navigation
	const handleClickBack = () => navigate(ROUTE.MY_SHELF);

	// Handle favorite click to remove from favourites
	const handleFavoriteClick = (book: Book, favouriteId?: string) => {
		const removeItem = {
			bookId: book.id,
			id: favouriteId || "",
			userId: currentUser?.id || "",
		} as FavouriteItem;

		removeFavourite(removeItem);
	};

	return (
		<>
			<BackButton onClick={handleClickBack} title="Back" />
			<h1 className="md:text-[25px] text-[20px] font-semibold text-[#4D4D4D] mb-6">
				Your Favourite
			</h1>
			<div className="overflow-x-auto text-[#4D4D4D]">
				<HeaderRow />
				<div className="space-y-4 mt-4">
					{filteredBooks.length === 0 ? (
						<p className="text-xl font-semibold text-red-400 mt-9 ml-8">
							No books found in your favourites.
						</p>
					) : (
						filteredBooks.map((book) => {
							const isInShelf = isBookInShelf(book.id, shelves ?? []);
							const favouriteObj = favourites?.find(
								(fav: FavouriteItem) => fav.bookId === book.id
							);
							const isFavorite = !!favouriteObj;
							const favouriteId = favouriteObj?.id;
							const isDisabled = pendingFavouritesActions.includes(book.id);

							return (
								<BookRow
									key={book.id}
									book={book}
									isInShelf={isInShelf}
									isFavorite={isFavorite}
									onClickPreview={handleCLickPreview}
									handleFavoriteClick={() =>
										handleFavoriteClick(book, favouriteId)
									}
									disabled={isDisabled}
								/>
							);
						})
					)}
				</div>
			</div>
		</>
	);
};

export default FavouritePage;
