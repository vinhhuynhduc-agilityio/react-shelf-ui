import { FavouriteItem } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FavouriteStore {
	favourites: FavouriteItem[];
	setFavourites: (favourites: FavouriteItem[]) => void;
}

export const useFavouritesStore = create<FavouriteStore>()(
	persist(
		(set) => ({
			favourites: [],
			setFavourites: (favourites) =>
				set({
					favourites,
				}),
		}),
		{
			name: "favourites-storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
