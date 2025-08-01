import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// services
import { addShelfItem, getShelves, removeShelfItem } from "@/services";

// constants
import {
  ERROR_MESSAGE,
  QUERY_KEY_MY_SHELF,
  SUCCESS_MESSAGE,
} from "@/constants";

// stores
import { usePendingShelfStore, useToastStore } from "@/stores";

// types
import { ShelfItem } from "@/types";

// helpers
import { showDefaultErrorToast } from "@/helpers";

export const useGetMyShelf = (userId: string) =>
  useQuery({
    queryKey: QUERY_KEY_MY_SHELF(userId),
    queryFn: () => getShelves(userId),
    meta: { errorMessage: ERROR_MESSAGE.SHELF_FETCH_ERROR },
  });

export const useFetchMySHelf = (
  userId: string,
  setShelf: (shelf: ShelfItem[]) => void
) => {
  const {
    data: queryShelf,
    isLoading,
    isError,
    error,
    isSuccess,
    isFetching,
  } = useGetMyShelf(userId);

  useEffect(() => {
    if (isSuccess && Array.isArray(queryShelf)) {
      setShelf(queryShelf || []);
    }
  }, [isSuccess, queryShelf, setShelf]);

  return {
    isLoading,
    isError,
    error,
    isFetching,
  };
};

export const useAddShelfItem = (id: string) => {
  const { addPending, removePending } = usePendingShelfStore();
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  return useMutation({
    mutationFn: addShelfItem,
    onMutate: (shelfItem: ShelfItem) => {
      addPending(shelfItem.bookId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY_MY_SHELF(id),
      });
      showToast(SUCCESS_MESSAGE.BOOK_BORROWED, "success");
    },
    onSettled: (_data, _error, shelfItem: ShelfItem) => {
      removePending(shelfItem.bookId);
    },
    onError: () => {
      showDefaultErrorToast();
    },
  });
};

export const useRemoveShelfItem = () => {
  const { addPending, removePending } = usePendingShelfStore();

  return useMutation({
    mutationFn: removeShelfItem,
    onMutate: (shelfItem: ShelfItem) => {
      addPending(shelfItem.bookId);
    },
    onSettled: (_data, _error, shelfItem: ShelfItem) => {
      removePending(shelfItem.bookId);
    },
    onError: () => {
      showDefaultErrorToast();
    },
  });
};
