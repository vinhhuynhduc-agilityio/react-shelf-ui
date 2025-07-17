import { FC, ElementType } from "react";
import clsx from "clsx";

interface IconButtonProps {
	type?: "button" | "submit";
	icon: ElementType;
	classNameIcon?: string;
	filled?: boolean;
	label?: React.ReactNode;
	ariaLabel?: string;
	onClick?: () => void;
	disabled?: boolean;
	className?: string;
	iconPosition?: "left" | "right";
	dataTestId?: string;
}

export const IconButton: FC<IconButtonProps> = ({
	type = "button",
	icon: Icon,
	classNameIcon = "",
	filled,
	label,
	ariaLabel,
	onClick,
	disabled = false,
	className = "",
	iconPosition = "left",
	dataTestId = "",
}) => {
	const iconElement = (
		<Icon
			className={classNameIcon}
			{...(typeof filled === "boolean" ? { filled } : {})}
		/>
	);

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			aria-label={ariaLabel}
			data-testid={dataTestId}
			className={clsx(
				"flex items-center transition-all",
				disabled && "opacity-50",
				className
			)}
		>
			{iconPosition === "left" && iconElement}
			{label}
			{iconPosition === "right" && iconElement}
		</button>
	);
};
