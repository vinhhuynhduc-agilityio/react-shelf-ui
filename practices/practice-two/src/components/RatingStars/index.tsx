import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface RatingProps {
	rating: number;
	maxStars?: number;
}

const RatingStars: React.FC<RatingProps> = ({ rating, maxStars = 5 }) => {
	return (
		<div className="flex items-center space-x-">
			{Array.from({ length: maxStars }, (_, index) => {
				if (index < Math.floor(rating)) {
					return (
						<FaStar
							key={index}
							data-testid="icon-full-star"
							className="text-yellow-400"
							style={{ width: "14px", height: "13.22px" }}
						/>
					);
				} else if (index === Math.floor(rating) && rating % 1 !== 0) {
					return (
						<FaStarHalfAlt
							key={index}
							data-testid="icon-half-star"
							className="text-yellow-400"
							style={{ width: "14px", height: "13.22px" }}
						/>
					);
				} else {
					return (
						<FaRegStar
							key={index}
							data-testid="icon-empty-star"
							className="text-gray-300"
							style={{ width: "14px", height: "13.22px" }}
						/>
					);
				}
			})}
			<p className="text-[#4D4D4D] text-[14px] font-medium mr-6">
				{rating} Ratings
			</p>
			<p className="text-[#4D4D4D] text-[14px] font-medium mr-6">
				25 Current reading
			</p>
			<p className="text-[#4D4D4D] text-[14px] font-medium hidden lg:block">
				119 Have read
			</p>
		</div>
	);
};

export default RatingStars;
