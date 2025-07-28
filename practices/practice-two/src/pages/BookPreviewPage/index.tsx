import {
	Navigate,
	useLocation,
	useNavigate,
	useParams,
} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

// constants
import { availability, ROUTE } from "@/constants";

// components
import {
	IconButton,
	AuthorCard,
	BookMediaCard,
	BookDetailInfo,
} from "@/components";
import { ArrowBackIcon } from "@/components/icons";

// stores
import { useBookStore, usePendingShelfStore, useUserStore } from "@/stores";

// helpers
import { formatBorrowedDate, isBookInShelf } from "@/helpers";

// hooks
import { useAddShelfItem, useGetMyShelf } from "@/hooks";

// types
import { Book } from "@/types";

const BookPreviewPage = () => {
	const { bookId } = useParams();
	const location = useLocation();

	const book: Book | undefined = useBookStore((state) =>
		state.books.find((b) => b.id.toString() === bookId)
	);

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

	const isPendingBorrowedBook = book?.id
		? pendingShelfActions.includes(book.id)
		: false;
	const isInShelf = isBookInShelf(book?.id ?? "", shelves ?? []);

	const handleBorrow = () => {
		if (!book?.id) return; // Prevent borrowing if book id is missing

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
		return <Navigate to="*" replace />;
	}

	return (
		<>
			<IconButton
				icon={ArrowBackIcon}
				label="Back to results"
				iconPosition="left"
				onClick={handleClickBackToResult}
				additionalClasses="flex items-center text-gray-600 hover:text-gray-800 transition-all mb-4"
				classNameIcon="mr-[9px]"
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
				<AuthorCard name={book.author.name} bio={book.author.bio ?? ""} />
			</div>
		</>
	);
};

export default BookPreviewPage;
