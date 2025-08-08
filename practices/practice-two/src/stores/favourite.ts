import { FavouriteItem } from "@/types";
import { create } from "zustand";

interface FavouriteStore {
  favourites: FavouriteItem[];
  setFavourites: (favourites: FavouriteItem[]) => void;
}

export const useFavouritesStore = create<FavouriteStore>((set) => ({
  favourites: [],
  setFavourites: (favourites) =>
    set({
      favourites,
    }),
}));
