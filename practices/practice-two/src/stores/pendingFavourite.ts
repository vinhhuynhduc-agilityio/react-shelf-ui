import { create } from "zustand";

type PendingShelfState = {
  pendingFavouritesActions: string[];
  addFavourite: (id: string) => void;
  removeFavourite: (id: string) => void;
};

export const usePendingFavouritesStore = create<PendingShelfState>((set) => ({
  pendingFavouritesActions: [],
  addFavourite: (id) =>
    set((state) => ({
      pendingFavouritesActions: [...state.pendingFavouritesActions, id],
    })),
  removeFavourite: (id) =>
    set((state) => ({
      pendingFavouritesActions: state.pendingFavouritesActions.filter(
        (bookId) => bookId !== id
      ),
    })),
}));
