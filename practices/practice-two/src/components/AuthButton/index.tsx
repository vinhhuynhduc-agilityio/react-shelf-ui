import React from "react";

interface AuthButtonProps {
	disabled: boolean;
	label: string;
	pendingLabel: string;
	className?: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({
	disabled,
	label,
	pendingLabel,
	className = "",
}) => {
	return (
		<button
			type="submit"
			disabled={disabled}
			className={`bg-[#FA7C54] text-white py-2 rounded-md hover:bg-[#ec6945] transition-opacity ${
				disabled ? "opacity-50 cursor-not-allowed" : ""
			} ${className}`}
		>
			{disabled ? pendingLabel : label}
		</button>
	);
};

export default AuthButton;
