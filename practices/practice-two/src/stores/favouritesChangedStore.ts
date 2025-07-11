import { create } from "zustand";

type FavouritesChangeState = {
	favouritesChanged: boolean;
	setFavouritesChanged: (val: boolean) => void;
};

export const useFavouritesChangedStore = create<FavouritesChangeState>(
	(set) => ({
		favouritesChanged: false,
		setFavouritesChanged: (val) => set({ favouritesChanged: val }),
	})
);
