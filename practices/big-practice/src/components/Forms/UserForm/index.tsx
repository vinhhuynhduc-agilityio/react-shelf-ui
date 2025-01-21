import React, { useEffect, useState } from 'react';
import { FaUpload } from 'react-icons/fa';

// types
import { UserData, UserFormData } from '@/types';

// constant
import { defaultAvatarUrl } from '@/constant';

// hooks
import { useUserForm } from '@/hooks';

// components
import { Button } from '@/components/common';
import { Avatar, TextField } from '@/components';

// helpers
import { readFileAsBase64, emailValidation } from './helpers';

interface UserFormProps {
  defaultValues: UserData;
  isEditUser: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  buttonLabel: string;
  users: UserData[]
};

const UserForm: React.FC<UserFormProps> = ({
  defaultValues,
  isEditUser,
  onClose,
  onSubmit,
  buttonLabel,
  users
}) => {
  const [avatarUrl, setAvatarPreview] = useState<string>(defaultAvatarUrl);
  const { isEmailDuplicate } = emailValidation(defaultValues?.email);
  const { register, handleSubmit, errors } = useUserForm(defaultValues);

  useEffect(() => {
    if (isEditUser && defaultValues?.avatarUrl) {
      setAvatarPreview(defaultValues.avatarUrl);
    }
  }, [isEditUser, defaultValues]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      readFileAsBase64(file, setAvatarPreview);
    }
  };

  const onSubmitWithPreview = (data: UserFormData) => {
    onSubmit({
      ...data,
      avatarUrl: avatarUrl,
    });
  };

  return (
    <form
      id='UserForm'
      onSubmit={handleSubmit(onSubmitWithPreview)}
      className='space-y-6'
      data-testid='user-form'
    >

      {/* Full Name */}
      <TextField
        name='fullName'
        label='Full Name'
        placeholder='Enter full name'
        register={register}
        withErrorMargin='ml-24'
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
      />

      {/* Email */}
      <TextField
        name='email'
        label='Email'
        type='email'
        placeholder='Enter email'
        register={register}
        withErrorMargin='ml-24'
        validation={{
          required: 'Email is required',
          pattern: {
            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: 'Invalid email format',
          },
          validate: {
            duplicate: (value) =>
              typeof value === 'string' && !isEmailDuplicate(value, users)
                ? true
                : 'Email already exists',
          },
        }}
        error={errors.email?.message}
      />

      {/* Avatar */}
      <div>
        <div className="flex items-center">
          <label className="w-24 text-gray-700 font-semibold" htmlFor="avatar-upload">
            Avatar
          </label>
          <div className="flex items-center space-x-4">
            <Avatar
              src={avatarUrl}
              alt="Avatar Preview"
              size="large"
            />
            <input
              type="file"
              accept="image/*"
              {...register('avatar', {
                onChange: handleAvatarChange,
              })}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer text-blue-500 flex items-center space-x-1"
            >
              <FaUpload />
              <span>Upload new photo</span>
            </label>
          </div>
        </div>
        {errors.avatar && (
          <p className="text-red-500 text-sm mt-1 ml-24">{errors.avatar.message}</p>
        )}
      </div>

      {/* Registered */}
      {isEditUser && (
        <div className="flex items-center">
          <label className="w-24 text-gray-700 font-semibold">Registered</label>
          <p className="text-gray-600">{defaultValues.registered}</p>
        </div>
      )}

      {/* Last visited */}
      {isEditUser && (
        <div className="flex items-center">
          <label className="w-24 text-gray-700 font-semibold">Last visited</label>
          <p className="text-gray-600">{defaultValues.lastUpdated}</p>
        </div>
      )}

      {/* Footer with Cancel and Save buttons */}
      <div className="border-t border-gray-300 pt-3 flex justify-between">
        <Button
          type="button"
          onClick={onClose}
          label="Cancel"
          variant="secondary"
        />
        <Button
          type="submit"
          label={buttonLabel}
          variant="primary"
          ariaLabel="save-user"
        />
      </div>
    </form>
  );
};

export default UserForm;
