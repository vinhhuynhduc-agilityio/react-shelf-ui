import { useMutation, UseMutationResult } from "@tanstack/react-query";

import { User } from "@/types/user";
import { registerUser, RegisterUserData } from "@/services";

export const useRegisterUser = (): UseMutationResult<
	User,
	Error,
	RegisterUserData
> => {
	return useMutation({
		mutationFn: registerUser,
	});
};
