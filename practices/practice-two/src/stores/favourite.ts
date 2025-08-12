import { UserBook } from "@/types";
import { create } from "zustand";

interface FavouriteStore {
  favourites: UserBook[];
  setFavourites: (favourites: UserBook[]) => void;
  pendingFavouritesActions: string[];
  addFavourite: (id: string) => void;
  removeFavourite: (id: string) => void;
}

export const useFavouritesStore = create<FavouriteStore>((set) => ({
  favourites: [],
  setFavourites: (favourites) =>
    set({
      favourites,
    }),
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
