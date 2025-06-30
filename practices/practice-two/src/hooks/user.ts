import { useMutation, UseMutationResult } from "@tanstack/react-query";

// stores
import { useProcessingStore } from "@/stores";
import { useUserStore } from "@/stores/userStore";

// types
import { User } from "@/types/user";

// services
import { updateUser } from "@/services";

// helpers
import { showDefaultErrorToast } from "@/helpers";

export const useCurrentUser = (): User | null => {
	return useUserStore((state) => state.currentUser);
};

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
