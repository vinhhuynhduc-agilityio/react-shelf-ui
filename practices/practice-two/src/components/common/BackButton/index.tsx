import clsx from "clsx";

interface BackButtonProps {
	onClick: () => void;
	title: string;
	disabled?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({
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
			<svg
				className="mr-2.5"
				width="14"
				height="14"
				viewBox="0 0 14 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M13.25 7L0.75 7M0.75 7L6.375 12.625M0.75 7L6.375 1.375"
					stroke="#4D4D4D"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
			{title}
		</button>
	);
};

export default BackButton;
