import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

// components
import { Button, TextField } from "@/components";

// stores
import { useUserStore } from "@/stores/user";

// constants
import { ROUTE } from "@/constants";

// hooks
import { useGetUser } from "@/hooks";

interface LoginFormValues {
	email: string;
	password: string;
}

const SignInPage: React.FC = () => {
	const navigate = useNavigate();

	// State
	const [showPassword, setShowPassword] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	// Store actions
	const setUser = useUserStore((state) => state.setUser);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>();

	const { mutateAsync: fetchUser, isPending } = useGetUser();

	// Handle form submission
	const onSubmit = async (data: LoginFormValues) => {
		fetchUser(data.email, {
			onSuccess: (user) => {
				if (!user || user.password !== data.password) {
					setErrorMessage("Invalid email or password");
					return;
				}

				setUser(user);
				navigate(ROUTE.HOME);
			},
		});
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#FA7C54] to-[#EC2C5A] p-4 sm:p-6 md:p-8">
			{/* Form Container */}
			<div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 w-[320px] h-[90%] sm:w-[500px] sm:h-[80%] md:w-[565px] md:h-[70%] flex flex-col overflow-auto">
				{/* Logo */}
				<div className="flex justify-center mb-4 sm:mb-6">
					<img
						src="https://i.ibb.co/0Yx3BN3/Book-Shelf.png"
						alt="My Book Shelf Logo"
						className="w-[120px] h-[60px] sm:w-[150px] sm:h-[75px] md:w-[180px] md:h-[90px]"
					/>
				</div>
				{/* Title */}
				<h1 className="text-center text-[18px] sm:text-[20px] font-normal leading-[24px] mb-2 sm:mb-4">
					Welcome Back!
				</h1>
				<p className="text-center text-gray-500 text-sm sm:text-base mb-6">
					Sign in to continue to your Digital Library
				</p>

				{errorMessage && (
					<p className="text-red-500 text-center mb-4">{errorMessage}</p>
				)}

				{/* Form */}
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4 flex-grow"
				>
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
							minLength: {
								value: 6,
								message: "Password must be at least 6 characters",
							},
						}}
						error={errors.password?.message}
						vertical={true}
						showPasswordToggle={true}
						isPasswordVisible={showPassword}
						togglePasswordVisibility={() => setShowPassword(!showPassword)}
					/>
					<div className="flex justify-between items-center text-sm sm:text-base md:text-lg">
						<label className="flex items-center text-gray-600">
							<input type="checkbox" className="mr-2" />
							Remember me
						</label>
						<a
							href="#"
							className="text-right text-[#4D4D4D] underline underline-offset-[4.335px]"
						>
							Forgot password?
						</a>
					</div>
					<Button
						type="submit"
						variant="auth"
						disabled={isPending}
						label={isPending ? "Checking..." : "Login"}
						additionalClasses="mt-4"
					/>
				</form>
				{/* Footer */}
				<p className="text-center text-sm sm:text-base md:text-lg text-[#4D4D4D] mt-6">
					New User?{" "}
					<Link
						to={ROUTE.REGISTER}
						className="underline underline-offset-[4.335px] text-sm sm:text-base md:text-lg"
					>
						Register Here
					</Link>
				</p>
			</div>
		</div>
	);
};

export default SignInPage;
