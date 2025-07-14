import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

// stores
import {
	useBookStore,
	useFavouritesChangedStore,
	useFavouritesStore,
	usePendingFavouritesStore,
	useUserStore,
} from "@/stores";

// types
import { Book, FavouriteItem } from "@/types";

// helpers
import { isBookInShelf } from "@/helpers";

// components
import { BackButton, BookRow, BookRowSkeleton, HeaderRow } from "@/components";

// hooks
import {
	useFetchBooks,
	useFetchFavourites,
	useGetMyShelf,
	useRemoveFavouriteItem,
} from "@/hooks";

// constants
import { QUERY_KEY_MY_FAVOURITE, ROUTE } from "@/constants";

const FavouritePage: React.FC = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	// store
	const books = useBookStore((state) => state.books);
	const currentUser = useUserStore((state) => state.currentUser);
	const pendingFavouritesActions = usePendingFavouritesStore(
		(state) => state.pendingFavouritesActions
	);
	const { favourites, setFavourites } = useFavouritesStore();
	const { favouritesChanged, setFavouritesChanged } =
		useFavouritesChangedStore();

	// refs
	const favouritesChangedRef = useRef(favouritesChanged);
	const setFavouritesChangedRef = useRef(setFavouritesChanged);
	const setFavouritesRef = useRef(setFavourites);

	// API hooks
	const { isLoading, isError: isErrorBooks, error } = useFetchBooks();
	const { isError: isErrorFavourites, isFetching: isFetchingFavourites } =
		useFetchFavourites(currentUser?.id || "");
	const { data: shelves } = useGetMyShelf(currentUser?.id || "");
	const { mutate: removeFavourite } = useRemoveFavouriteItem();

	useEffect(() => {
		favouritesChangedRef.current = favouritesChanged;
	}, [favouritesChanged]);
	useEffect(() => {
		setFavouritesRef.current = setFavourites;
	}, [setFavourites]);

	useEffect(() => {
		setFavouritesChangedRef.current = setFavouritesChanged;

		return () => {
			// Invalidate the favourites query if there are changes
			// when the component unmounts or dependencies change
			if (favouritesChangedRef.current) {
				queryClient.invalidateQueries({
					queryKey: QUERY_KEY_MY_FAVOURITE(currentUser?.id || ""),
				});
				setFavouritesChangedRef.current(false);
				setFavouritesRef.current([]);
			}
		};
	}, [setFavouritesChanged, queryClient, currentUser?.id]);

	// Filter books by favourites
	const filteredBooks = books.filter((book) => {
		return favourites?.some((favourite) => favourite.bookId === book.id);
	});

	// Navigate to book preview page with book details and from route
	const handleCLickPreview = useCallback(
		(book: Book) =>
			navigate(`${ROUTE.BOOK_PREVIEW}/${book.id}`, {
				state: {
					book,
					from: ROUTE.FAVOURITE,
				},
			}),
		[navigate]
	);

	// Handle back navigation
	const handleClickBack = () => navigate(ROUTE.MY_SHELF);

	// Handle favorite click to remove from favourites
	const handleFavoriteClick = useCallback(
		(book: Book, favouriteId?: string) => {
			const removeItem = {
				bookId: book.id,
				id: favouriteId || "",
				userId: currentUser?.id || "",
			};

			removeFavourite(removeItem, {
				onSuccess: () => {
					setFavourites(
						(favourites || []).filter((fav) => fav.bookId !== book.id)
					);
					setFavouritesChanged(true);
				},
			});
		},
		[
			currentUser,
			favourites,
			removeFavourite,
			setFavourites,
			setFavouritesChanged,
		]
	);

	// If loading or error, show appropriate messages
	if (isLoading || isFetchingFavourites) return <BookRowSkeleton />;

	if (isErrorBooks || isErrorFavourites)
		return (
			<p className="text-red-500">Error loading books: {error?.message}</p>
		);

	// If no books in favourites, show message
	if (!filteredBooks.length)
		return <p className="text-gray-600">No books in your favourites.</p>;

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
