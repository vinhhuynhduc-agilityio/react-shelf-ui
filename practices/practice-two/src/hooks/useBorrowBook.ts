import { useMutation, UseMutationResult } from "@tanstack/react-query";

// services
import { updateUser } from "@/services";

// types
import { User } from "@/types";

export const useBorrowBook = (): UseMutationResult<User, Error, User> => {
  return useMutation({
    mutationFn: (updatedUser) => updateUser(updatedUser),
  });
};
