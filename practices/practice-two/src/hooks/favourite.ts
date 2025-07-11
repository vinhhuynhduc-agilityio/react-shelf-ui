import { useEffect, useRef } from "react";
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
import {
	useFavouritesChangedStore,
	useFavouritesStore,
	usePendingFavouritesStore,
} from "@/stores";

export const useGetFavourites = (userId: string) => {
	return useQuery({
		queryKey: QUERY_KEY_MY_FAVOURITE(userId),
		queryFn: () => getFavourites(userId),
	});
};

export const useFetchFavourites = (userId: string) => {
	const { favourites, setFavourites } = useFavouritesStore();
	const { favouritesChanged, setFavouritesChanged } =
		useFavouritesChangedStore();
	const {
		data: queryFavourites,
		isLoading,
		isError,
		error,
		isSuccess,
		refetch,
	} = useGetFavourites(userId);
	const favouritesChangedRef = useRef(favouritesChanged);
	const refetchRef = useRef(refetch);
	const setFavouritesChangedRef = useRef(setFavouritesChanged);

	useEffect(() => {
		favouritesChangedRef.current = favouritesChanged;
	}, [favouritesChanged]);

	useEffect(() => {
		refetchRef.current = refetch;
		setFavouritesChangedRef.current = setFavouritesChanged;

		return () => {
			if (favouritesChangedRef.current) {
				refetchRef.current();
				setFavouritesChangedRef.current(false);
			}
		};
	}, [refetch, setFavouritesChanged]);

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
