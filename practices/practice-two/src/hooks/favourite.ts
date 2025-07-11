import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

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
import { useFavouritesStore, usePendingFavouritesStore } from "@/stores";

export const useGetFavourites = (userId: string) => {
	return useQuery({
		queryKey: QUERY_KEY_MY_FAVOURITE(userId),
		queryFn: () => getFavourites(userId),
	});
};

export const useFetchFavourites = (userId: string) => {
	const setFavourites = useFavouritesStore((state) => state.setFavourites);
	const favourites = useFavouritesStore((state) => state.favourites);

	const {
		data: queryFavourites,
		isLoading,
		isError,
		error,
		isSuccess,
	} = useGetFavourites(userId);

	useEffect(() => {
		if (isSuccess && queryFavourites && queryFavourites.length > 0) {
			setFavourites(queryFavourites || []);
		}
	}, [isSuccess, queryFavourites, setFavourites]);

	return {
		favourites: queryFavourites || favourites,
		isLoading,
		isError,
		error,
	};
};

export const useAddFavouriteItem = () => {
	const { addPending, removePending } = usePendingFavouritesStore();

	return useMutation({
		mutationFn: addFavouriteItem,
		onMutate: (item: FavouriteItem) => {
			addPending(item.bookId);
		},
		onSettled: (_data, _error, item: FavouriteItem) => {
			removePending(item.bookId);
		},
	});
};

export const useRemoveFavouriteItem = () => {
	const { addPending, removePending } = usePendingFavouritesStore();

	return useMutation({
		mutationFn: removeFavouriteItem,
		onMutate: (item: FavouriteItem) => {
			addPending(item.bookId);
		},
		onSettled: (_data, _error, item: FavouriteItem) => {
			removePending(item.bookId);
		},
	});
};
