import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// services
import { addShelfItem, getShelves, removeShelfItem } from "@/services";

// constants
import { QUERY_KEY_MY_SHELF } from "@/constants";

// stores
import { usePendingShelfStore } from "@/stores";

// types
import { ShelfItem } from "@/types";

export const useGetMyShelf = (userId: string) =>
	useQuery({
		queryKey: QUERY_KEY_MY_SHELF(userId),
		queryFn: () => getShelves(userId),
	});

export const useAddShelfItem = (id: string) => {
	const { addPending, removePending } = usePendingShelfStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: addShelfItem,
		onMutate: (shelfItem: ShelfItem) => {
			addPending(shelfItem.bookId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: QUERY_KEY_MY_SHELF(id),
			});
		},
		onSettled: (_data, _error, shelfItem: ShelfItem) => {
			removePending(shelfItem.bookId);
		},
	});
};

export const useRemoveShelfItem = (id: string) => {
	const { addPending, removePending } = usePendingShelfStore();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: removeShelfItem,
		onMutate: (shelfItem: ShelfItem) => {
			addPending(shelfItem.bookId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: QUERY_KEY_MY_SHELF(id),
			});
		},
		onSettled: (_data, _error, shelfItem: ShelfItem) => {
			removePending(shelfItem.bookId);
		},
	});
};
