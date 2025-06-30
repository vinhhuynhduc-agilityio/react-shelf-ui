import { create } from "zustand";

type PendingShelfState = {
	pendingFavouritesActions: string[];
	addPending: (id: string) => void;
	removePending: (id: string) => void;
};

export const usePendingFavouritesStore = create<PendingShelfState>((set) => ({
	pendingFavouritesActions: [],
	addPending: (id) =>
		set((state) => ({
			pendingFavouritesActions: [...state.pendingFavouritesActions, id],
		})),
	removePending: (id) =>
		set((state) => ({
			pendingFavouritesActions: state.pendingFavouritesActions.filter(
				(bookId) => bookId !== id
			),
		})),
}));
