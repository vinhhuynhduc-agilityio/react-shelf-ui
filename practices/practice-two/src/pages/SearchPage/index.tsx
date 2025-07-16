import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";

// hooks
import {
	useAddFavouriteItem,
	useFetchBooks,
	useFetchFavourites,
	useGetMyShelf,
	useRemoveFavouriteItem,
} from "@/hooks";

// stores
import {
	useBookStore,
	useFavouritesStore,
	useSearchFilterStore,
	usePendingFavouritesStore,
	useSearchStore,
	useUserStore,
	useFavouritesChangedStore,
} from "@/stores";

// types
import { Book, FavouriteItem } from "@/types";

// helpers
import { isBookInShelf } from "@/helpers";

// components
import { BookRow, BookRowSkeleton, HeaderRow } from "@/components";

// constants
import { QUERY_KEY_MY_FAVOURITE, ROUTE } from "@/constants";

const SearchPage: React.FC = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	// store
	const books = useBookStore((state) => state.books);
	const currentUser = useUserStore((state) => state.currentUser);
	const searchFromSidebar = useSearchStore((state) => state.searchFromSidebar);
	const searchTerm = useSearchStore((state) => state.searchTerm);
	const selectedFilter = useSearchFilterStore((state) => state.selectedFilter);
	const pendingFavouritesActions = usePendingFavouritesStore(
		(state) => state.pendingFavouritesActions
	);
	const setFavourites = useFavouritesStore((state) => state.setFavourites);
	const favourites = useFavouritesStore((state) => state.favourites);
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
	const { data: shelves, isFetching: isFetchingShelf } = useGetMyShelf(
		currentUser?.id || ""
	);
	const { mutate: addFavourite } = useAddFavouriteItem();
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

	// Filter books based on search term and selected filter
	const filteredBooks = searchFromSidebar
		? books
		: books.filter((book) => {
				const filterValue =
					selectedFilter === "Title"
						? book.title
						: selectedFilter === "Author"
						? book.author.name
						: selectedFilter === "Subjects"
						? book.category
						: "";

				return (
					filterValue &&
					filterValue.toLowerCase().includes(searchTerm.toLowerCase())
				);
		  });

	// Navigate to book preview page with book details and from route
	const handleCLickPreview = useCallback(
		(book: Book) =>
			navigate(`${ROUTE.BOOK_PREVIEW}/${book.id}`, {
				state: {
					book,
					from: ROUTE.SEARCH,
				},
			}),
		[navigate]
	);
	// Handle favorite click to add/remove from favourites
	const handleFavoriteClick = (
		book: Book,
		isFavorite: boolean,
		favouriteId?: string
	) => {
		const favouriteItem = !isFavorite
			? ({
					id: uuidv4(),
					bookId: book.id,
					userId: currentUser?.id || "",
			  } as FavouriteItem)
			: ({
					bookId: book.id,
					id: favouriteId || "",
					userId: currentUser?.id || "",
			  } as FavouriteItem);

		const prevFavourites = favourites || [];
		if (!isFavorite) {
			setFavourites([...prevFavourites, favouriteItem]);
			addFavourite(favouriteItem, {
				onSuccess: () => {
					setFavouritesChanged(true);
				},
				onError: () => {
					// Revert on error
					setFavourites(prevFavourites);
				},
			});
		} else {
			const updatedFavourites = prevFavourites.filter(
				(fav) => fav.bookId !== book.id
			);
			setFavourites(updatedFavourites);
			removeFavourite(favouriteItem, {
				onSuccess: () => {
					setFavouritesChanged(true);
				},
				onError: () => {
					// Revert on error
					setFavourites(prevFavourites);
				},
			});
		}
	};

	// If loading or error, show appropriate messages
	if (isLoading || isFetchingFavourites || isFetchingShelf)
		return <BookRowSkeleton />;

	if (isErrorBooks || isErrorFavourites)
		return (
			<p className="text-red-500">Error loading books: {error?.message}</p>
		);

	// If no books found, show message
	if (!books.length)
		return <p className="text-gray-600">No books available.</p>;

	return (
		<div className="overflow-x-auto text-[#4D4D4D]">
			{/* Header */}
			<HeaderRow />

			{/* Rows */}
			<div className="space-y-4 mt-4">
				{filteredBooks.length === 0 ? (
					<p className="text-xl font-semibold text-red-400 mt-9 ml-8">
						No books found.
					</p>
				) : (
					filteredBooks.map((book) => {
						const isInShelf = isBookInShelf(book.id, shelves ?? []);
						const isFavorite = favourites?.some(
							(fav: FavouriteItem) => fav.bookId === book.id
						);
						const favouriteId = favourites?.find(
							(fav: FavouriteItem) => fav.bookId === book.id
						)?.id;
						const isDisabled = pendingFavouritesActions.includes(book.id);

						return (
							<BookRow
								key={book.id}
								book={book}
								isInShelf={isInShelf}
								isFavorite={!!isFavorite}
								onClickPreview={handleCLickPreview}
								handleFavoriteClick={() =>
									handleFavoriteClick(book, !!isFavorite, favouriteId)
								}
								disabled={isDisabled}
							/>
						);
					})
				)}
			</div>
		</div>
	);
};

export default SearchPage;
