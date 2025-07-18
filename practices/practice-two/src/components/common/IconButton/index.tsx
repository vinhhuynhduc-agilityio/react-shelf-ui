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
	direction?: "row" | "column";
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
	direction = "row",
	dataTestId = "",
}) => {
	const iconElement = (
		<Icon
			className={classNameIcon}
			{...(typeof filled === "boolean" ? { filled } : {})}
		/>
	);

	const isColumn = direction === "column";

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			aria-label={ariaLabel}
			data-testid={dataTestId}
			className={clsx(
				isColumn
					? "flex flex-col items-center transition-all"
					: "flex items-center transition-all",
				disabled && "opacity-50",
				className
			)}
		>
			{isColumn ? (
				<>
					{iconElement}
					{label}
				</>
			) : (
				<>
					{iconPosition === "left" && iconElement}
					{label}
					{iconPosition === "right" && iconElement}
				</>
			)}
		</button>
	);
};
