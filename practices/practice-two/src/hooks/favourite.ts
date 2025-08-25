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
  const { setFavourites } = useFavouritesStore();

  return useQuery({
    queryKey: QUERY_KEY_MY_FAVOURITE(userId),
    queryFn: async () => {
      const favouritesData = await getFavourites(userId);
      setFavourites(favouritesData || []);

      return favouritesData;
    },
    meta: { errorMessage: ERROR_MESSAGE.FAVOURITES_FETCH_ERROR },
  });
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
