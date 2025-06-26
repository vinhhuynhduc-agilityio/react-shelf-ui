import { useMutation, UseMutationResult } from "@tanstack/react-query";

// services
import { updateUser } from "@/services";

// types
import { User } from "@/types";
import { showDefaultErrorToast } from "@/helpers/errorManager";

// stores
import { useProcessingStore, useUserStore } from "@/stores";

export const useUpdateUserBooks = (): UseMutationResult<User, Error, User> => {
	const setUser = useUserStore((state) => state.setUser);
	const setProcessing = useProcessingStore((state) => state.setProcessing);

	return useMutation({
		mutationFn: updateUser,
		onSuccess: (userToUpdate) => {
			setUser(userToUpdate);
		},
		onError: () => showDefaultErrorToast(),
		onSettled: () => {
			setProcessing(false);
		},
	});
};
