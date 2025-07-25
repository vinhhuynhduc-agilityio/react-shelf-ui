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
		</div>
	);
};

export default RatingStars;
