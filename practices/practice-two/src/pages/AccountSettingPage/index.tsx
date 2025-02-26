import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// components
import { Avatar, Button, TextField } from '@/components';

// hooks
import { useUpdateUserBooks } from '@/hooks';

// constants
import { DEFAULT_AVATAR, editIcon } from '@/constants';

// helpers
import { readFileAsBase64 } from './helpers';

interface AccountFormValues {
  fullName: string;
  collegeEmail: string;
  registerNumber: string;
  phoneNumber: string;
  bio: string;
  avatar: string;
}

const AccountSettingPage: React.FC = () => {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarPreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormValues>();

  const mutation = useUpdateUserBooks();

  const onSubmit: SubmitHandler<AccountFormValues> = (data) => {
    // mutation.mutate(
    //   {
    //     fullName: data.fullName,
    //     collegeEmail: data.collegeEmail,
    //     registerNumber: data.registerNumber,
    //     phoneNumber: data.phoneNumber,
    //     bio: data.bio,
    //     avatarUrl: avatarUrl,
    //   },
    //   {
    //     onError: (error) => {
    //       console.error("Failed to update profile:", error);
    //     },
    //   }
    // );
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 flex-grow">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center space-y-3 w-[151px]">
          <h2 className="text-[#4C535F] font-medium text-[16px]">
            Your Profile Picture
          </h2>
          <div className="flex flex-col items-center space-y-3">
            <Avatar
              src={avatarUrl || DEFAULT_AVATAR}
              size="large"
            />
            <input
              type="file"
              accept="image/*"
              {...register('avatar', { onChange: handleAvatarChange })}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer items-center underline underline-offset-4 text-[#909090] text-[10px] font-medium"
            >
              Upload new photo
            </label>
          </div>
        </div>
        <div className="flex flex-row-reverse">
          <button
            type='button'
            className="border-2 border-gray-50 p-3 rounded-full"
          >
            {editIcon}
          </button>
        </div>
        {/* Profile Fields */}
        <div className="flex md:flex-row flex-col gap-4">
          <TextField
            name="fullName"
            label="Full Name"
            type="text"
            placeholder="Your Full Name"
            register={register}
            validation={{
              required: "Full name is required",
            }}
            error={errors.fullName?.message}
            vertical
            className="flex-1"
          />
          <TextField
            name="collegeEmail"
            label="College Email ID"
            type="email"
            placeholder="username@college.com"
            register={register}
            validation={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            }}
            error={errors.collegeEmail?.message}
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
            register={register}
            validation={{
              required: "Register number is required",
            }}
            error={errors.registerNumber?.message}
            vertical
            className="flex-1"
          />
          <TextField
            name="phoneNumber"
            label="Phone Number"
            type="text"
            placeholder="Your Phone Number"
            register={register}
            validation={{
              required: "Phone number is required",
            }}
            error={errors.phoneNumber?.message}
            vertical
            className="flex-1"
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
        />
        {/* Submit Button */}
        <Button
          className="mt-4"
          variant='primary'
          // disabled={isInShelf}
          // onClick={}
          type="submit"
        >
          Update Profile
        </Button>
      </form >
    </div >
  );
};

export default AccountSettingPage;
