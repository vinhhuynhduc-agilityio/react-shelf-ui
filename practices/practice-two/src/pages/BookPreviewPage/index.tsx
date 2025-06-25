import { useLocation, useNavigate } from "react-router-dom";

// constants
import {
	checkmarkIcon,
	ERROR_MESSAGE,
	notesIcon,
	reviewIcon,
	ROUTE,
	shareIcon,
} from "@/constants";

// components
import {
	RatingStars,
	StatusBadge,
	Button,
	BackToResultButton,
} from "@/components";

// stores
import { useToastStore, useUserStore } from "@/stores";

// helpers
import { formatBorrowedDate, isBookInShelf } from "@/helpers";

// hooks
import { useUpdateUserBooks } from "@/hooks";

// types
import { User } from "@/types";

const BookPreviewPage = () => {
	const location = useLocation();
	const book = location.state?.book;
	const navigate = useNavigate();

	// stores
	const currentUser = useUserStore((state) => state.currentUser);
	const setUser = useUserStore((state) => state.setUser);
	const showToast = useToastStore((state) => state.showToast);

	// hooks
	const mutation = useUpdateUserBooks();

	if (!book) {
		return <p className="text-red-500">No book data available.</p>;
	}

	const isInShelf = isBookInShelf(book.id, currentUser?.shelf ?? []);

	const handleBorrow = () => {
		const prevUser: User = { ...(currentUser as User) };
		const borrowedBook = {
			bookId: book.id,
			borrowedDate: formatBorrowedDate(),
		};

		const updatedUser = {
			...currentUser,
			recentReadings: currentUser?.recentReadings?.includes(book.id)
				? currentUser.recentReadings
				: [...(currentUser?.recentReadings ?? []), book.id],
			shelf: [...(currentUser?.shelf ?? []), borrowedBook],
		} as User;
		setUser(updatedUser);

		mutation.mutate(updatedUser, {
			onError: () => {
				showToast(ERROR_MESSAGE.DEFAULT, "error");
				setUser(prevUser);
			},
		});
	};

	const handleClickBackToResult = () => {
		const from = location.state?.from || ROUTE.SEARCH;
		navigate(from);
	};

	return (
		<>
			<BackToResultButton
				onClick={handleClickBackToResult}
				title="Back to results"
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
							<div className="flex flex-col items-center justify-center cursor-pointer space-y-2 hover:bg-gray-100 p-2 rounded-lg transition-all">
								<div>{reviewIcon}</div>
								<div className="text-center md:text-[13px] font-bold text-[#333333] sm:text-[11px] text-[10px]">
									Review
								</div>
							</div>
							<div className="flex flex-col items-center justify-center cursor-pointer space-y-2 hover:bg-gray-100 p-2 rounded-lg transition-all">
								<div>{notesIcon}</div>
								<div className="text-center md:text-[13px] font-bold text-[#333333] sm:text-[11px] text-[10px]">
									Notes
								</div>
							</div>
							<div className="flex flex-col items-center justify-center cursor-pointer space-y-2 hover:bg-gray-100 p-2 rounded-lg transition-all">
								<div>{shareIcon}</div>
								<div className="text-center md:text-[13px] font-bold text-[#333333] sm:text-[11px] text-[10px]">
									Share
								</div>
							</div>
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
										{checkmarkIcon}
										<span>Hard Copy</span>
									</li>
									<li className="flex items-center gap-2">
										{checkmarkIcon}
										<span>E-Book</span>
									</li>
									<li className="flex items-center gap-2">
										{checkmarkIcon}
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
							variant={isInShelf ? "disabledPrimary" : "primary"}
							disabled={isInShelf}
							onClick={handleBorrow}
						>
							{isInShelf ? "Already in shelf" : "Borrow"}
						</Button>
					</div>
				</div>
				{/* Column 3 */}
				<div className="xl:w-[445px] xl:h-[418px] bg-white p-6 rounded-[10px]">
					<h3 className="text-[20px] font-semibold text-[#4D4D4D] mb-3">
						<span className="text-[#F27851]">About</span> Author
					</h3>
					<h4 className="text-[20px] text-[#4D4D4D] mb-8">
						{book.author.name}
					</h4>
					<p className="text-[13px] text-[#4D4D4D]">{book.author.bio}</p>
				</div>
			</div>
		</>
	);
};

export default BookPreviewPage;
