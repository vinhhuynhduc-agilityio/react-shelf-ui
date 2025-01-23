import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// Components
import { TextField } from "@/components/TextField";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    console.log("Login data:", data);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#FA7C54] to-[#EC2C5A]">
      <div className="bg-white shadow-lg rounded-lg p-8 md:w-[565px] md:h-[917px] sm:w-[423px] sm:h-[685px] w-[320px]">
        <div className="flex justify-center mb-6">
          <img
            src="https://i.ibb.co/0Yx3BN3/Book-Shelf.png"
            alt="My Book Shelf Logo"
            className="w-[150px] h-[92px]"
          />
        </div>
        <h1 className="text-center text-[20px] font-normal leading-[24.2px] mb-4">
          Welcome Back!
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Sign in to continue to your Digital Library
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <TextField
            name="email"
            label="Email"
            type="email"
            placeholder="username@collegename.ac.in"
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
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            }}
            error={errors.password?.message}
            vertical={true}
            showPasswordToggle={true}
            isPasswordVisible={showPassword}
            togglePasswordVisibility={() => setShowPassword(!showPassword)}
          />
          <div className="flex justify-between items-center">
            <label className="flex items-center text-gray-600">
              <input
                type="checkbox"
                className="mr-2"
              />
              Remember me
            </label>
            <a
              href="#"
              className="text-right text-[16px] font-normal leading-[16px] text-[#4D4D4D] underline"
            >
              Forgot password?
            </a>

          </div>
          <button
            type="submit"
            className="bg-[#FA7C54] text-white py-2 rounded-md hover:bg-[#ec6945] mt-4"
          >
            Login
          </button>
        </form>
        <p className=" text-[16px] font-normal leading-[16px] text-[#4D4D4D] mt-10">
          New User?{" "}
          <a
            href="#"
            className="underline"
          >
            Register Here
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
