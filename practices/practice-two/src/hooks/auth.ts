import { useMutation } from "@tanstack/react-query";

// services
import { registerUser } from "@/services";

// helpers
import { showDefaultErrorToast } from "@/helpers";

// constants
import { SUCCESS_MESSAGE } from "@/constants";

// stores
import { useToastStore } from "@/stores";

export const useRegisterUser = () => {
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => showToast(SUCCESS_MESSAGE.REGISTRATION, "success"),
    onError: () => showDefaultErrorToast(),
  });
};
