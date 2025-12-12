import { ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  variant?: "success" | "primary" | "segment";
  active?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
  ariaLabel?: string;
}

const Button = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
  active = false,
  ref,
  ariaLabel = "",
}: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-[2px] font-medium transition-colors duration-200 shadow-none px-3 cursor-pointer disabled:cursor-not-allowed border-none";

  const variantClasses = {
    success:
      "bg-[#F4F5F9] text-primary hover:bg-[#E4E6F0] disabled:bg-[#F4F5F9] disabled:text-[#94A1B3] h-[32px] text-base",
    primary:
      "bg-primary text-[#FFFFFF] hover:bg-[#1992af] disabled:bg-[#94A1B3] disabled:text-[#FFFFFF] h-[32px] text-base",
    segment: clsx(
      "h-[26px] text-[#475466] text-sm",
      active && "bg-[rgb(28,161,193)] text-[#FFFFFF]"
    ),
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(baseClasses, variantClasses[variant], className)}
      ref={ref}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default Button;
