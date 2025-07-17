import { memo } from "react";
import clsx from "clsx";

type Variant = "primary" | "outline" | "text" | "auth";

interface ButtonProps {
	type?: "button" | "submit";
	variant?: Variant;
	disabled?: boolean;
	className?: string;
	children?: React.ReactNode;
	label?: string;
	pendingLabel?: string;
	onClick?: () => void;
}

const Button: React.FC<ButtonProps> = memo(
	({
		type = "button",
		variant = "primary",
		disabled = false,
		className = "",
		children,
		label,
		pendingLabel,
		onClick,
	}) => {
		const baseStyles =
			"flex items-center justify-center focus:outline-none focus:ring-2 transition-all";

		const sharedPrimary =
			"rounded-[8px] font-bold text-white lg:text-[18px] md:text-[16px] w-[161px] h-[29px] md:w-[181px] md:h-[39px] lg:w-[201px] lg:h-[49px]";

		const primaryStyle = clsx(sharedPrimary, {
			"bg-orange-500 hover:bg-orange-600": !disabled,
			"bg-gray-400 cursor-not-allowed hover:bg-gray-600": disabled,
		});

		const sharedOutline =
			"text-[12px] rounded-[5px] w-[70px] h-[25px] md:w-[85px] md:h-[30px] lg:w-[90px] lg:h-[35px] md:text-[14px]";

		const outlineStyle = clsx(sharedOutline, {
			"border border-[#F76B56] text-[#F76B56] hover:bg-orange-100": !disabled,
			"cursor-not-allowed border border-[#000000] text-[#000000] hover:bg-gray-200":
				disabled,
		});

		const textStyle = "";

		const authStyle = clsx(
			"bg-[#FA7C54] text-white py-2 rounded-md hover:bg-[#ec6945] transition-opacity",
			{
				"opacity-50 cursor-not-allowed": disabled,
			}
		);

		const variants = {
			primary: primaryStyle,
			outline: outlineStyle,
			text: textStyle,
			auth: authStyle,
		};

		const content = children ?? (disabled ? pendingLabel : label);

		return (
			<button
				type={type}
				onClick={onClick}
				disabled={disabled}
				className={clsx(baseStyles, variants[variant], className)}
			>
				{content}
			</button>
		);
	}
);

export default Button;
