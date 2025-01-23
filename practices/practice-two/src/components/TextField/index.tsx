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
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  togglePasswordVisibility?: () => void;
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
  withErrorMargin = "mt-1",
  showPasswordToggle = false,
  isPasswordVisible = false,
  togglePasswordVisibility,
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

  const inputWrapperClass = clsx("relative", {
    "mb-2": error,
  });

  return (
    <div>
      <div className={containerClass}>
        <label htmlFor={name} className={labelClass}>
          {label}
        </label>
        <div className={inputWrapperClass}>
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-black w-full pr-10"
            {...register(name, validation)}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {isPasswordVisible ? (
                <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 1.34211C5.45455 1.34211 1.57273 4.12474 0 8.05263C1.57273 11.9805 5.45455 14.7632 10 14.7632C14.5455 14.7632 18.4273 11.9805 20 8.05263C18.4273 4.12474 14.5455 1.34211 10 1.34211ZM10 12.5263C8.79447 12.5263 7.63832 12.055 6.78588 11.216C5.93344 10.377 5.45455 9.23913 5.45455 8.05263C5.45455 6.86614 5.93344 5.72824 6.78588 4.88926C7.63832 4.05028 8.79447 3.57895 10 3.57895C11.2055 3.57895 12.3617 4.05028 13.2141 4.88926C14.0666 5.72824 14.5455 6.86614 14.5455 8.05263C14.5455 9.23913 14.0666 10.377 13.2141 11.216C12.3617 12.055 11.2055 12.5263 10 12.5263ZM10 5.36842C9.27668 5.36842 8.58299 5.65122 8.07153 6.15461C7.56006 6.65799 7.27273 7.34073 7.27273 8.05263C7.27273 8.76453 7.56006 9.44727 8.07153 9.95065C8.58299 10.454 9.27668 10.7368 10 10.7368C10.7233 10.7368 11.417 10.454 11.9285 9.95065C12.4399 9.44727 12.7273 8.76453 12.7273 8.05263C12.7273 7.34073 12.4399 6.65799 11.9285 6.15461C11.417 5.65122 10.7233 5.36842 10 5.36842Z" fill="#8EA2B9" />
                </svg>

              ) : (
                <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.84546 5.36842L12.7273 8.19579V8.05263C12.7273 7.34073 12.4399 6.65799 11.9285 6.15461C11.417 5.65122 10.7233 5.36842 10 5.36842H9.84546ZM5.93636 6.08421L7.34545 7.47105C7.3 7.65895 7.27273 7.84684 7.27273 8.05263C7.27273 8.76453 7.56006 9.44727 8.07153 9.95065C8.58299 10.454 9.27668 10.7368 10 10.7368C10.2 10.7368 10.4 10.71 10.5909 10.6653L12 12.0521C11.3909 12.3474 10.7182 12.5263 10 12.5263C8.79447 12.5263 7.63832 12.055 6.78588 11.216C5.93344 10.377 5.45455 9.23913 5.45455 8.05263C5.45455 7.34579 5.63636 6.68368 5.93636 6.08421ZM0.909091 1.13632L2.98182 3.17632L3.39091 3.57895C1.89091 4.74211 0.709091 6.26316 0 8.05263C1.57273 11.9805 5.45455 14.7632 10 14.7632C11.4091 14.7632 12.7545 14.4947 13.9818 14.0116L14.3727 14.3874L17.0273 17L18.1818 15.8637L2.06364 0M10 3.57895C11.2055 3.57895 12.3617 4.05028 13.2141 4.88926C14.0666 5.72824 14.5455 6.86614 14.5455 8.05263C14.5455 8.62526 14.4273 9.18 14.2182 9.68105L16.8818 12.3026C18.2455 11.1842 19.3364 9.71684 20 8.05263C18.4273 4.12474 14.5455 1.34211 10 1.34211C8.72727 1.34211 7.50909 1.56579 6.36364 1.96842L8.33636 3.89211C8.85455 3.69526 9.40909 3.57895 10 3.57895Z" fill="#8EA2B9" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
};
