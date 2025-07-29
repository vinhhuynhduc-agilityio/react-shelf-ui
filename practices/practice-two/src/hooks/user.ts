import { useMutation, UseMutationResult } from "@tanstack/react-query";

// stores
import { useToastStore, useUserStore } from "@/stores";

// types
import { User } from "@/types/user";

// services
import { fetchUserByEmail, updateUser } from "@/services";

// helpers
import { showDefaultErrorToast } from "@/helpers";

// constants
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "@/constants";

export const useGetUser = () => {
	const showToast = useToastStore((state) => state.showToast);

	return useMutation({
		mutationFn: (email: string) => fetchUserByEmail(email),
		onError: (error: unknown) => {
			const err = error as { response?: { data?: { error?: string } } };
			const message = err.response?.data?.error || ERROR_MESSAGE.DEFAULT;
			showToast(message, "error");
		},
	});
};

export const useCurrentUser = (): User | null => {
	return useUserStore((state) => state.currentUser);
};

export const useUpdateUser = (): UseMutationResult<User, Error, User> => {
	const setUser = useUserStore((state) => state.setUser);
	const showToast = useToastStore((state) => state.showToast);

	return useMutation({
		mutationFn: updateUser,
		onSuccess: (userToUpdate) => {
			setUser(userToUpdate);
			showToast(SUCCESS_MESSAGE.PROFILE_UPDATE, "success");
		},
		onError: () => showDefaultErrorToast(),
	});
};
