import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

// constants
import { ERROR_MESSAGE } from "@/constants";

// services
import {
  addFavouriteItem,
  getFavourites,
  QUERY_KEY_MY_FAVOURITE,
  removeFavouriteItem,
} from "@/services";

// types
import { UserBook } from "@/types";

// stores
import { useFavouritesStore } from "@/stores";

// helpers
import { showDefaultErrorToast } from "@/helpers";

export const useGetFavourites = (userId: string) => {
  return useQuery({
    queryKey: QUERY_KEY_MY_FAVOURITE(userId),
    queryFn: () => getFavourites(userId),
    meta: { errorMessage: ERROR_MESSAGE.FAVOURITES_FETCH_ERROR },
  });
};

export const useGetAndStoreFavourites = (userId: string) => {
  const { favourites, setFavourites } = useFavouritesStore();
  const {
    data: queryFavourites,
    isLoading,
    isError,
    error,
    isSuccess,
    isFetching,
  } = useGetFavourites(userId);

  useEffect(() => {
    if (isSuccess && Array.isArray(queryFavourites)) {
      setFavourites(queryFavourites || []);
    }
  }, [isSuccess, queryFavourites, setFavourites]);

  return {
    favourites,
    isLoading,
    isError,
    error,
    isFetching,
  };
};

export const useAddFavouriteItem = () => {
  const { addFavourite, removeFavourite } = useFavouritesStore();

  return useMutation({
    mutationFn: addFavouriteItem,
    onMutate: (item: UserBook) => {
      addFavourite(item.bookId);
    },
    onSettled: (_data, _error, item: UserBook) => {
      removeFavourite(item.bookId);
    },
    onError: () => showDefaultErrorToast(),
  });
};

export const useRemoveFavouriteItem = () => {
  const { addFavourite, removeFavourite } = useFavouritesStore();

  return useMutation({
    mutationFn: removeFavouriteItem,
    onMutate: (item: UserBook) => {
      addFavourite(item.bookId);
    },
    onSettled: (_data, _error, item: UserBook) => {
      removeFavourite(item.bookId);
    },
    onError: () => showDefaultErrorToast(),
  });
};
