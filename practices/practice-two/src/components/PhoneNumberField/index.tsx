import clsx from "clsx";
import { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";

// types
import { AccountFormValues } from "@/types";

interface PhoneNumberFieldProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<AccountFormValues>;
  isEditing: boolean;
};

const PhoneNumberField = <T extends FieldValues>({
  register,
  errors,
  isEditing,
}: PhoneNumberFieldProps<T>) => {
  return (
    <div className="flex flex-col gap-[6px] md:gap-[8px] flex-1">
      <label
        htmlFor="countryCode"
        className="text-gray-700 font-semibold text-base md:text-lg"
      >
        Phone Number
      </label>
      <div
        className={clsx(
          "flex items-center border border-gray-300 rounded-md w-full",
          !isEditing && "bg-gray-100 cursor-not-allowed"
        )}
      >
        <span className="text-[#4C535F] pl-2">+</span>
        <input
          id="countryCode"
          data-testid="country-code-input"
          type="text"
          disabled={!isEditing}
          maxLength={2}
          {...register("countryCode" as Path<T>, {
            required: "Country code is required",
            minLength: { value: 2, message: "Country code must be 2 digits" },
            maxLength: { value: 2, message: "Country code must be 2 digits" },
            pattern: { value: /^[0-9]{2}$/, message: "Only numbers allowed" },
          })}
          className={clsx(
            "bg-transparent text-[#4C535F] text-sm sm:text-base md:text-lg w-6 pr-1 text-center outline-none",
            !isEditing && "bg-gray-100 cursor-not-allowed"
          )}
        />
        <span className="border-r border-gray-300 h-5"></span>
        <input
          id="phoneNumber"
          data-testid="phone-number-input"
          type="text"
          disabled={!isEditing}
          maxLength={7}
          {...register("phoneNumber" as Path<T>, {
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]{7}$/,
              message: "Phone number must be exactly 7 digits",
            },
          })}
          placeholder="Your Phone Number"
          className={clsx(
            "flex-1 p-2 text-[#4C535F] w-full pr-10 text-sm sm:text-base md:text-lg placeholder:text-sm sm:placeholder:text-base md:placeholder:text-[17.5px] h-[40px] sm:h-[48px] md:h-[56px]",
            !isEditing && "bg-gray-100 cursor-not-allowed"
          )}
        />
      </div>
      {errors.countryCode?.message && (
        <p className="text-red-500 text-xs sm:text-sm md:text-base">
          {errors.countryCode?.message}
        </p>
      )}
      {errors.phoneNumber?.message && (
        <p className="text-red-500 text-xs sm:text-sm md:text-base">
          {errors.phoneNumber?.message}
        </p>
      )}
    </div>
  );
};

export default PhoneNumberField;
