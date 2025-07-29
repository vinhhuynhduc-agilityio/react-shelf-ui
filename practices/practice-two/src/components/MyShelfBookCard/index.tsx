import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// types
import { Book } from "@/types";

// components
import { BookItem, Button } from "@/components";

// constants
import { ROUTE } from "@/constants";

interface BookCardProps {
	book: Book;
	borrowedDate: string;
	onReturn: (bookId: string) => void;
	disabled?: boolean;
}

const MyShelfBookCard = ({
	book,
	borrowedDate,
	onReturn,
	disabled = false,
}: BookCardProps) => {
	const navigate = useNavigate();

	const handleBookClick = useCallback(
		(bookId: string) => {
			navigate(`${ROUTE.BOOK_PREVIEW}/${bookId}`, {
				state: { from: ROUTE.MY_SHELF },
			});
		},
		[navigate]
	);

	return (
		<div className="flex items-center bg-white rounded-lg shadow-md p-4 w-[308px] h-[260px]">
			<div className="w-3/5">
				<BookItem {...book} onClick={handleBookClick} />
			</div>
			<div className="w-2/5 flex flex-col justify-between items-center h-full ml-2">
				<div>
					<p className="md:text-[15px] text-[13px] text-[#4D4D4D]">
						Borrowed on
					</p>
					<p className="text-[10px] font-semibold text-[#747373]">
						{borrowedDate}
					</p>
				</div>
				<Button
					variant="outline"
					onClick={() => onReturn(book.id)}
					disabled={disabled}
					label="Return"
					additionalClasses="text-[12px] w-[70px] h-[25px] md:w-[85px] md:h-[30px] lg:w-[90px] lg:h-[35px] md:text-[14px]"
				/>
			</div>
		</div>
	);
};

export default MyShelfBookCard;
