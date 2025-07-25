import { memo } from "react";

// constants
import { DEFAULT_AVATAR } from "@/constants";

interface AvatarProps {
	src?: string;
	alt?: string;
	size?: "small" | "medium" | "large";
	additionalClasses?: string;
}

// [MEMO] Optimizing re-render: Prevents Avatar from re-rendering when parent (e.g., Header) re-renders due to search text changes
const Avatar: React.FC<AvatarProps> = memo(
	({ src, alt = "User", size = "medium", additionalClasses = "" }) => {
		const sizeClass =
			size === "small"
				? "w-[34px] h-[34px]"
				: size === "large"
				? "md:w-[100px] md:h-[100px] w-[80px] h-[80px]"
				: "w-[40px] h-[40px]";

		return (
			<div
				data-testid="avatar"
				className={`${sizeClass} rounded-full overflow-hidden flex-shrink-0 border border-gray-300 ${additionalClasses}`}
			>
				<img
					src={src || DEFAULT_AVATAR}
					alt={alt}
					className="w-full h-full object-cover"
				/>
			</div>
		);
	}
);

export default Avatar;
