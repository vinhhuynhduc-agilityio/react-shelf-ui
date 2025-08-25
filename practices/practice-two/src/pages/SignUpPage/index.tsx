import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

// services
import { useRegisterUser } from "@/hooks";

// components
import { Button, ParagraphMessage, TextField } from "@/components";

// constants
import { ROUTE } from "@/constants";

interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>();
  const password = watch("password", "");

  // Custom hooks
  const { mutate: registerUser, isPending } = useRegisterUser();

  // Handle form submission
  const onSubmit: SubmitHandler<RegisterFormValues> = (data) => {
    registerUser(
      {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => navigate(ROUTE.LOGIN),
      }
    );
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#FA7C54] to-[#EC2C5A] p-4 sm:p-6 md:p-8">
      <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 w-[320px] sm:w-[450px] md:w-[480px] max-w-full h-auto max-h-screen flex flex-col overflow-auto">
        <div className="flex justify-center mb-4 sm:mb-6">
          <img
            src="https://i.ibb.co/0Yx3BN3/Book-Shelf.png"
            alt="My Book Shelf Logo"
            className="w-[120px] h-[60px] sm:w-[150px] sm:h-[75px] md:w-[180px] md:h-[90px]"
          />
        </div>

        {/* Title */}
        <h1 className="text-center text-[18px] sm:text-[20px] font-normal leading-[24px] mb-2 sm:mb-4">
          Create an Account
        </h1>
        <ParagraphMessage
          text="Sign up to access your Digital Library"
          className="text-center text-gray-500 text-sm sm:text-base mb-4"
        />
        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 flex-grow"
        >
          <TextField
            name="fullName"
            label="Username"
            type="text"
            placeholder="Your Username"
            register={register}
            validation={{
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
            }}
            error={errors.fullName?.message}
            vertical={true}
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            placeholder="fullName@collegename.ac.in"
            register={register}
            validation={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            }}
            error={errors.email?.message}
            vertical={true}
          />
          <TextField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="******"
            register={register}
            validation={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            error={errors.password?.message}
            vertical={true}
            showPasswordToggle={true}
            isPasswordVisible={showPassword}
            togglePasswordVisibility={handleTogglePasswordVisibility}
          />
          <TextField
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="******"
            register={register}
            validation={{
              required: "Confirm password is required",
              validate: (value) =>
                value === password || "Passwords don't match",
            }}
            error={errors.confirmPassword?.message}
            vertical={true}
            showPasswordToggle={true}
            isPasswordVisible={showConfirmPassword}
            togglePasswordVisibility={handleToggleConfirmPasswordVisibility}
          />

          {/* Terms and Conditions */}
          <div className="flex flex-col items-start">
            <label className="flex items-center text-gray-600 text-sm sm:text-base md:text-lg">
              <input
                type="checkbox"
                className="mr-2"
                {...register("agreeToTerms", {
                  required: "You must agree to the terms and conditions",
                })}
              />
              I agree to the terms and conditions
            </label>
            {errors.agreeToTerms && (
              <ParagraphMessage
                text={errors.agreeToTerms.message || ""}
                className="text-red-500 text-xs sm:text-sm md:text-base mt-1"
              />
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="auth"
            disabled={isPending}
            label={isPending ? "Registering..." : "Register"}
            additionalClasses="mt-2"
          />
        </form>

        {/* Footer */}
        <p className="text-center text-sm sm:text-base text-[#4D4D4D] mt-4">
          Already have an account?{" "}
          <Link to="/login" className="underline underline-offset-[4.335px]">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
