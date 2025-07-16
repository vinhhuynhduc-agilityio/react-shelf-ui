import clsx from "clsx";

// components
import { ArrowBackIcon } from "@/components/icons/ArrowBackIcon";

interface IconButtonProps {
	onClick: () => void;
	title: string;
	disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
	onClick,
	title,
	disabled,
}) => {
	return (
		<button
			onClick={onClick}
			className={clsx(
				"flex items-center text-gray-600 hover:text-gray-800 transition-all mb-4",
				disabled && "cursor-not-allowed text-gray-200 hover:text-gray-400"
			)}
			disabled={disabled}
		>
			<ArrowBackIcon />
			{title}
		</button>
	);
};

export default IconButton;
