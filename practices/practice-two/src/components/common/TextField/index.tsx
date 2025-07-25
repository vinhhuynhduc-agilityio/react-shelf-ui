import {
	FieldValues,
	UseFormRegister,
	RegisterOptions,
	Path,
} from "react-hook-form";
import clsx from "clsx";

// components
import { EyeOffIcon, EyeOnIcon } from "@/components/icons";

interface TextFieldProps<T extends FieldValues> {
	name: Path<T>;
	label: string;
	type?: string;
	placeholder?: string;
	register: UseFormRegister<T>;
	validation?: RegisterOptions<T, Path<T>>;
	vertical?: boolean;
	error?: string;
	labelWidth?: string;
	withErrorMargin?: string;
	showPasswordToggle?: boolean;
	isPasswordVisible?: boolean;
	togglePasswordVisibility?: () => void;
	additionalClasses?: string;
	maxLength?: number;
	disabled?: boolean;
}

export const TextField = <T extends FieldValues>({
	name,
	label,
	type = "text",
	placeholder = "",
	register,
	validation,
	vertical = false,
	error,
	labelWidth = "w-30",
	showPasswordToggle = false,
	isPasswordVisible = false,
	togglePasswordVisibility,
	additionalClasses = "",
	maxLength,
	disabled = false,
}: TextFieldProps<T>) => {
	const validLabelWidths = ["w-30", "w-32"];

	const labelClass = clsx(
		validLabelWidths.includes(labelWidth) ? labelWidth : "w-30",
		"text-gray-700 font-semibold text-base md:text-lg"
	);

	const errorClass = "text-red-500 text-xs sm:text-sm md:text-base";

	const containerClass = clsx("flex", {
		"flex-col gap-[6px] md:gap-[8px]": vertical,
		"items-center": !vertical,
		additionalClasses,
	});

	const inputClass = clsx(
		"flex-1 p-2 border rounded-md text-[#4C535F] w-full pr-10",
		"text-sm sm:text-base md:text-lg",
		"placeholder:text-sm sm:placeholder:text-base md:placeholder:text-[17.5px]",
		"h-[40px] sm:h-[48px] md:h-[56px]",
		disabled && "bg-gray-100 cursor-not-allowed"
	);

	return (
		<div className={containerClass}>
			<label htmlFor={name} className={`${labelClass}`}>
				{label}
			</label>
			<div className="relative">
				{type === "textarea" ? (
					<textarea
						id={name}
						placeholder={placeholder}
						className={clsx(
							"border rounded-md w-full resize-none h-[158px] placeholder:text-sm sm:placeholder:text-base md:placeholder:text-[17.5px] p-2",
							disabled && "bg-gray-100 cursor-not-allowed"
						)}
						{...register(name, validation)}
						disabled={disabled}
					/>
				) : (
					<input
						id={name}
						type={type}
						placeholder={placeholder}
						className={inputClass}
						{...register(name, validation)}
						maxLength={maxLength ?? 255}
						disabled={disabled}
						data-testid="textfield-input"
					/>
				)}
				{showPasswordToggle && (
					<button
						type="button"
						onClick={togglePasswordVisibility}
						className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
						data-testid="toggle-password-visibility"
					>
						{isPasswordVisible ? (
							<EyeOffIcon data-testid="eye-off" />
						) : (
							<EyeOnIcon data-testid="eye-on" />
						)}
					</button>
				)}
			</div>
			{error && <p className={errorClass}>{error}</p>}
		</div>
	);
};
