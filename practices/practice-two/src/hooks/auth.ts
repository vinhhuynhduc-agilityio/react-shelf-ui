import { useMutation, UseMutationResult } from "@tanstack/react-query";

// types
import { User } from "@/types";

// services
import { registerUser, RegisterUserData } from "@/services";

// helpers
import { showDefaultErrorToast } from "@/helpers";

// constants
import { SUCCESS_MESSAGE } from "@/constants";

// stores
import { useToastStore } from "@/stores";

export const useRegisterUser = (): UseMutationResult<
	User,
	Error,
	RegisterUserData
> => {
	const showToast = useToastStore((state) => state.showToast);

	return useMutation({
		mutationFn: registerUser,
		onSuccess: () => showToast(SUCCESS_MESSAGE.REGISTRATION, "success"),
		onError: () => showDefaultErrorToast(),
	});
};
