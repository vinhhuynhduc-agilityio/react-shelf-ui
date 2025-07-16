import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

// constants
import { availability, ROUTE } from "@/constants";

// components
import {
	BackButton,
	AuthorCard,
	BookMediaCard,
	BookDetailInfo,
} from "@/components";

// stores
import { usePendingShelfStore, useUserStore } from "@/stores";

// helpers
import { formatBorrowedDate, isBookInShelf } from "@/helpers";

// hooks
import { useAddShelfItem, useGetMyShelf } from "@/hooks";

const BookPreviewPage = () => {
	const location = useLocation();
	const book = location.state?.book;
	const navigate = useNavigate();
	const currentUser = useUserStore((state) => state.currentUser);

	// Fetch shelves from the API
	const { data: shelves, isFetching: isFetchingShelf } = useGetMyShelf(
		currentUser?.id || ""
	);

	// stores
	const { pendingShelfActions } = usePendingShelfStore();

	// hooks
	const { mutate: addShelf } = useAddShelfItem(currentUser?.id || "");

	const isPendingBorrowedBook = pendingShelfActions.includes(book?.id) || false;
	const isInShelf = isBookInShelf(book?.id, shelves ?? []);

	const handleBorrow = () => {
		const borrowedBook = {
			bookId: book.id,
			borrowedDate: formatBorrowedDate(),
			userId: currentUser?.id || "",
			id: uuidv4(),
		};

		addShelf(borrowedBook);
	};

	const handleClickBackToResult = () => {
		const from = location.state?.from || ROUTE.SEARCH;
		navigate(from);
	};

	if (!book) {
		return <p className="text-red-500">No book data available.</p>;
	}

	return (
		<>
			<BackButton
				onClick={handleClickBackToResult}
				title="Back to results"
				disabled={isPendingBorrowedBook}
			/>
			<div className="flex xl:flex-row flex-col justify-between xl:space-x-6">
				<div className="flex md:flex-row flex-col justify-start mb-16">
					<BookMediaCard imageUrl={book.imageUrl} title={book.title} />
					<BookDetailInfo
						book={book}
						isInShelf={isInShelf}
						isPending={isPendingBorrowedBook}
						isFetching={isFetchingShelf}
						onBorrow={handleBorrow}
						availability={availability}
					/>
				</div>
				<AuthorCard name={book.author.name} bio={book.author.bio} />
			</div>
		</>
	);
};

export default BookPreviewPage;
