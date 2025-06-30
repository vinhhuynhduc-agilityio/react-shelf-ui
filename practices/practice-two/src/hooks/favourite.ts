import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// constants
import { QUERY_KEY_MY_FAVOURITE } from "@/constants";

// services
import {
	addFavouriteItem,
	getFavourites,
	removeFavouriteItem,
} from "@/services";

// types
import { FavouriteItem } from "@/types";

// stores
import { usePendingFavouritesStore } from "@/stores";

export const useGetFavourites = (userId: string) => {
	return useQuery({
		queryKey: QUERY_KEY_MY_FAVOURITE(userId),
		queryFn: () => getFavourites(userId),
	});
};

export const useAddFavouriteItem = (userId: string) => {
	const { addPending, removePending } = usePendingFavouritesStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addFavouriteItem,
		onMutate: (item: FavouriteItem) => {
			addPending(item.bookId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: QUERY_KEY_MY_FAVOURITE(userId),
			});
		},
		onSettled: (_data, _error, item: FavouriteItem) => {
			removePending(item.bookId);
		},
	});
};

export const useRemoveFavouriteItem = (userId: string) => {
	const { addPending, removePending } = usePendingFavouritesStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: removeFavouriteItem,
		onMutate: (item: FavouriteItem) => {
			addPending(item.bookId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: QUERY_KEY_MY_FAVOURITE(userId),
			});
		},
		onSettled: (_data, _error, item: FavouriteItem) => {
			removePending(item.bookId);
		},
	});
};
