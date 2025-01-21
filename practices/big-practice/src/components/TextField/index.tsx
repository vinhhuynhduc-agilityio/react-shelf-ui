import { FieldValues, UseFormRegister, RegisterOptions, Path } from "react-hook-form";
import clsx from "clsx";

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
  labelWidth = "w-24",
  withErrorMargin = "mt-1"
}: TextFieldProps<T>) => {
  const validLabelWidths = ["w-24", "w-32"];
  const validErrorMargins = ["mt-1", "ml-32", "ml-24"];

  const labelClass = clsx(
    validLabelWidths.includes(labelWidth) ? labelWidth : "w-24",
    "text-gray-700 font-semibold"
  );

  const errorClass = clsx(
    "text-red-500 text-sm",
    validErrorMargins.includes(withErrorMargin) ? withErrorMargin : "mt-1"
  );

  const containerClass = clsx("flex", {
    "flex-col gap-[10px]": vertical,
    "items-center": !vertical,
  });

  return (
    <div>
      <div className={containerClass}>
        <label htmlFor={name} className={labelClass}>
          {label}
        </label>
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-black"
          {...register(name, validation)}
        />
      </div>
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
};
