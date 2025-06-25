import React, { useState } from "react";
import clsx from "clsx";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";

// components
import { Avatar, Button, PhoneNumberField, TextField } from "@/components";

// hooks
import { useUpdateUserBooks } from "@/hooks";

// constants
import {
	cancelIcon,
	DEFAULT_AVATAR,
	editIcon,
	ERROR_MESSAGE,
} from "@/constants";

// helpers
import { readFileAsBase64 } from "./helpers";

// types
import { AccountFormValues, User } from "@/types";

// stores
import { useToastStore, useUserStore } from "@/stores";

const AccountSettingPage: React.FC = () => {
	// stores
	const currentUser = useUserStore((state) => state.currentUser);
	const setUser = useUserStore((state) => state.setUser);
	const showToast = useToastStore((state) => state.showToast);

	// states
	const [avatarUrl, setAvatarPreview] = useState<string>(
		currentUser?.avatarUrl || DEFAULT_AVATAR
	);
	const [isEditing, setIsEditing] = useState<boolean>(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AccountFormValues>({
		defaultValues: currentUser || ({} as AccountFormValues),
	});

	const mutation = useUpdateUserBooks();

	const onSubmit: SubmitHandler<AccountFormValues> = (data) => {
		if (!currentUser) {
			showToast(ERROR_MESSAGE.NO_USER_DATA, "error");
			return;
		}

		const prevUser = { ...currentUser };
		const updatedUser = {
			...currentUser,
			fullName: data.fullName,
			email: data.email,
			registerNumber: data.registerNumber,
			countryCode: data.countryCode,
			phoneNumber: data.phoneNumber,
			bio: data.bio,
			avatarUrl: avatarUrl,
		} as User;
		setUser(updatedUser);

		mutation.mutate(updatedUser, {
			onSuccess: () => {
				toggleEdit();
			},
			onError: () => {
				showToast(ERROR_MESSAGE.DEFAULT, "error");
				setUser(prevUser);
			},
		});
	};

	const toggleEdit = () => {
		setIsEditing(!isEditing);
	};

	const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
			readFileAsBase64(file, setAvatarPreview);
		}
	};

	return (
		<div className="bg-white shadow-lg rounded-lg p-6 max-w-full h-auto max-h-screen flex flex-col overflow-auto">
			{/* Title */}
			<h1 className=" text-[20px] font-bold text-[#F4683C] mb-10 mt-6">
				Account Setting
			</h1>
			{/* Form */}
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4 flex-grow"
			>
				{/* Avatar Upload */}
				<div className="flex flex-col items-center space-y-3 w-[151px]">
					<h2 className="text-[#4C535F] font-medium text-[16px]">
						Your Profile Picture
					</h2>
					<div className="flex flex-col items-center space-y-3">
						<Avatar src={avatarUrl || DEFAULT_AVATAR} size="large" />
						<input
							type="file"
							accept="image/*"
							{...register("avatar", { onChange: handleAvatarChange })}
							className="hidden"
							id="avatar-upload"
						/>
						<label
							htmlFor="avatar-upload"
							className={clsx(
								"cursor-pointer items-center underline underline-offset-4 text-[#909090] text-[10px] font-medium",
								!isEditing && "pointer-events-none"
							)}
						>
							Upload new photo
						</label>
					</div>
				</div>
				<div className="flex flex-row-reverse">
					<button
						type="button"
						className="border-2 border-gray-50 p-3 rounded-full hover:bg-gray-200 transition"
						onClick={toggleEdit}
					>
						{isEditing ? cancelIcon : editIcon}
					</button>
				</div>
				{/* Profile Fields */}
				<div className="flex md:flex-row flex-col gap-4">
					<TextField
						name="fullName"
						label="Full Name"
						type="text"
						placeholder="Your Full Name"
						disabled={!isEditing}
						register={register}
						validation={{
							required: "Full Name is required",
							minLength: {
								value: 3,
								message: "Full Name must be at least 3 characters long",
							},
							maxLength: {
								value: 50,
								message: "Full Name cannot exceed 30 characters",
							},
							pattern: {
								value: /^[a-zA-Z\s]+$/,
								message: "Full Name can only contain letters and spaces",
							},
						}}
						error={errors.fullName?.message}
						vertical
						className="flex-1"
					/>
					<TextField
						name="email"
						label="College Email ID"
						type="email"
						placeholder="username@college.com"
						disabled={!isEditing}
						register={register}
						validation={{
							required: "Email is required",
							pattern: {
								value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
								message: "Invalid email format",
							},
						}}
						error={errors.email?.message}
						vertical
						className="flex-1"
					/>
				</div>
				<div className="flex md:flex-row flex-col gap-4">
					<TextField
						name="registerNumber"
						label="Register Number"
						type="text"
						placeholder="Your Register Number"
						disabled={!isEditing}
						register={register}
						maxLength={7}
						validation={{
							required: "Register number is required",
							pattern: {
								value: /^[1-9][0-9]{6}$/,
								message:
									"Register Number must be exactly 7 digits and cannot start with 0",
							},
						}}
						error={errors.registerNumber?.message}
						vertical
						className="flex-1"
					/>
					<PhoneNumberField
						register={register}
						errors={errors as FieldErrors<AccountFormValues>}
						isEditing={isEditing}
					/>
				</div>
				<TextField
					name="bio"
					label="Bio"
					type="textarea"
					placeholder="A short bio about you"
					register={register}
					error={errors.bio?.message}
					vertical
					className="w-full resize-none"
					disabled={!isEditing}
				/>
				{/* Submit Button */}
				<Button
					className="mt-4"
					variant={!isEditing ? "disabledPrimary" : "primary"}
					disabled={!isEditing}
					type="submit"
				>
					Update Profile
				</Button>
			</form>
		</div>
	);
};

export default AccountSettingPage;
