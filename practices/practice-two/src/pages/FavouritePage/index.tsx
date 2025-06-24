import { useNavigate } from "react-router-dom";

// stores
import { useBookStore, useUserStore } from "@/stores";

// types
import { Book } from "@/types";

// helpers
import { isBookInShelf } from "@/helpers";

// components
import { BackToResultButton, BookRow, HeaderRow } from "@/components";

// hooks
import { useFetchBooks, useHandleFavoriteClick } from "@/hooks";
import { ROUTE } from "@/constants";

const FavouritePage: React.FC = () => {
	const navigate = useNavigate();

	// hooks
	const { isLoading, isError, error } = useFetchBooks();
	const handleFavoriteClick = useHandleFavoriteClick();

	// store
	const books = useBookStore((state) => state.books);
	const currentUser = useUserStore((state) => state.currentUser);

	// Filter books by favourites
	const filteredBooks = books.filter((book) =>
		currentUser?.favourites?.includes(book.id)
	);

	if (isLoading && books.length === 0) return <p>Loading books...</p>;
	if (isError)
		return (
			<p className="text-red-500">Error loading books: {error?.message}</p>
		);
	if (!filteredBooks.length)
		return <p className="text-gray-600">No books in your favourites.</p>;

	const handleCLickPreview = (book: Book) =>
		navigate(`${ROUTE.BOOK_PREVIEW}/${book.id}`, {
			state: {
				book,
				from: ROUTE.FAVOURITE,
			},
		});

	const handleClickBack = () => navigate(ROUTE.MY_SHELF);

	return (
		<>
			<BackToResultButton onClick={handleClickBack} title="Back" />
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
							const isInShelf = isBookInShelf(
								book.id,
								currentUser?.shelf ?? []
							);
							const isFavorite =
								currentUser?.favourites?.includes(book.id) ?? false;

							return (
								<BookRow
									key={book.id}
									book={book}
									isInShelf={isInShelf}
									isFavorite={isFavorite}
									onClickPreview={handleCLickPreview}
									handleFavoriteClick={() => handleFavoriteClick(book)}
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
