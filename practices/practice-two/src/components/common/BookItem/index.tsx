import { memo } from "react";

interface BookItemProps {
	id: string;
	title: string;
	author: { name: string };
	publishedYear: number;
	rating: number;
	imageUrl: string;
	category: string;
	onClick?: (bookId: string) => void;
}

const BookItem: React.FC<BookItemProps> = memo(
	({ id, title, author, publishedYear, rating, imageUrl, onClick }) => {
		const handleClick = () => {
			if (onClick) onClick(id);
		};

		return (
			<div
				className="w-[160px] bg-white p-4 rounded-lg shadow-sm h-[260px] flex flex-col items-center cursor-pointer"
				onClick={handleClick}
				role="button"
				tabIndex={0}
			>
				<img
					src={imageUrl}
					alt={title}
					className="w-[130px] h-[170px] object-cover rounded-lg mx-auto"
				/>
				<h2 className="w-[130px] text-[12px] font-normal mt-2 truncate text-[#4D4D4D] mx-auto">
					{title}
				</h2>
				<p className="w-[130px] text-[10px] text-[#4D4D4D] overflow-ellipsis whitespace-nowrap overflow-hidden mx-auto">
					{author.name}, {publishedYear}
				</p>
				<p className="w-[130px] text-[10px] text-[#4D4D4D] mx-auto">
					{rating}
					<span className="text-[#A7A7A7]">/5</span>
				</p>
			</div>
		);
	}
);

export default BookItem;
