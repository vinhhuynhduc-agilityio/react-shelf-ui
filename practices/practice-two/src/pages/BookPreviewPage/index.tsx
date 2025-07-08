import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

// constants
import { ROUTE } from "@/constants";
import {
	CheckmarkIcon,
	NotesIcon,
	ReviewIcon,
	ShareIcon,
} from "@/components/icons";

// components
import {
	RatingStars,
	StatusBadge,
	Button,
	BackButton,
	AuthorCard,
	ActionIcon,
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

	// stores
	const currentUser = useUserStore((state) => state.currentUser);
	const { pendingShelfActions } = usePendingShelfStore();

	// hooks
	const { data: shelves } = useGetMyShelf(currentUser?.id || "");
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
					{/* Column 1 */}
					<div className="flex flex-col items-center bg-white rounded-lg md:w-[273px] md:h-[405px] mr-14 sm:w-[243px] sm:h-[385px] w-[233px] h-[365px] mb-8">
						<img
							src={book.imageUrl}
							alt={book.title}
							className="sm:w-[190px] sm:h-[280px] md:w-[209px] md:h-[277px] w-[170px] h-[260px] object-cover rounded-md shadow-lg mt-6"
						/>
						<div className="flex items-center space-x-6 mt-4">
							<ActionIcon icon={<ReviewIcon />} label="Review" />
							<ActionIcon icon={<NotesIcon />} label="Notes" />
							<ActionIcon icon={<ShareIcon />} label="Share" />
						</div>
					</div>
					{/* Column 2 */}
					<div className="flex flex-col md:w-[433px] sm:w-[483px] w-[370px]">
						<h1 className="lg:text-[35px] md:text-[30px] sm:text-[25px] text-[20px]  text-[#4D4D4D] overflow-hidden text-ellipsis line-clamp-2">
							{book.title}
						</h1>
						<h2 className="text-[15px] text-[#4D4D4D] mb-10">
							By <span className="underline">{book.author.name}</span>,{" "}
							{book.publishedYear}
						</h2>
						<RatingStars rating={book.rating} />

						{/* Availability and Status */}
						<div className="flex flex-row mt-4">
							<div className="mr-16">
								<h3 className="lg:text-[18px] md:text-[16px] font-medium mb-[4px] text-[#4D4D4D]">
									Availability:
								</h3>
								<ul className="space-y-2 lg:text-[14px] md:text-[13px]">
									<li className="flex items-center gap-2">
										<CheckmarkIcon />
										<span>Hard Copy</span>
									</li>
									<li className="flex items-center gap-2">
										<CheckmarkIcon />
										<span>E-Book</span>
									</li>
									<li className="flex items-center gap-2">
										<CheckmarkIcon />
										<span>Audio Book</span>
									</li>
								</ul>
							</div>
							<div className="">
								<h3 className="lg:text-[18px] md:text-[16px] font-medium mb-[12px] text-[#4D4D4D]">
									Status
								</h3>
								<StatusBadge status={isInShelf ? "In-Shelf" : "None"} />
							</div>
						</div>
						<Button
							className="mt-10"
							variant="primary"
							disabled={isInShelf || isPendingBorrowedBook}
							onClick={handleBorrow}
						>
							{isInShelf ? "Already in shelf" : "Borrow"}
						</Button>
					</div>
				</div>
				{/* Column 3 */}
				<AuthorCard name={book.author.name} bio={book.author.bio} />
			</div>
		</>
	);
};

export default BookPreviewPage;
