import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

// stores
import { useToastStore, useUserStore } from "@/stores";

// types
import { User } from "@/types/user";

// services
import { getUserByEmail, updateUser, removeUser } from "@/services";

// helpers
import { showDefaultErrorToast } from "@/helpers";

// constants
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "@/constants";

export const useGetUser = () => {
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: (email: string) => getUserByEmail(email),
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { error?: string } } };
      const message = err.response?.data?.error || ERROR_MESSAGE.DEFAULT;
      showToast(message, "error");
    },
  });
};

export const useUpdateUser = (): UseMutationResult<User, Error, User> => {
  const { setUser } = useUserStore();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (userToUpdate) => {
      setUser(userToUpdate);
      showToast(SUCCESS_MESSAGE.PROFILE_UPDATE, "success");
    },
    onError: () => showDefaultErrorToast(),
  });
};

export const useDeleteUser = (): UseMutationResult<void, Error, string> => {
  const { logout } = useUserStore();
  const { showToast } = useToastStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: removeUser,
    onSuccess: () => {
      logout();
      showToast(SUCCESS_MESSAGE.ACCOUNT_DELETED, "success");
      // Redirect to sign-in page after successful account deletion
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    },
    onError: () => showDefaultErrorToast(),
  });
};
