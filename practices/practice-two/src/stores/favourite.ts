import { UserBook } from "@/types";
import { create } from "zustand";

interface FavouriteStore {
  favourites: UserBook[];
  setFavourites: (favourites: UserBook[]) => void;
}

export const useFavouritesStore = create<FavouriteStore>((set) => ({
  favourites: [],
  setFavourites: (favourites) =>
    set({
      favourites,
    }),
}));
