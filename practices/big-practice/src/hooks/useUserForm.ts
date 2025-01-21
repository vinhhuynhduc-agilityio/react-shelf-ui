import { useForm } from 'react-hook-form';
import { UserData, UserFormData } from '@/types';

export const useUserForm = (defaultValues: UserData) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UserFormData>({
    defaultValues,
  });

  return { register, handleSubmit, errors };
};
