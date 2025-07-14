import { ShelfItem } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ShelfStore {
	shelf: ShelfItem[];
	setShelf: (shelf: ShelfItem[]) => void;
}

export const useShelfStore = create<ShelfStore>()(
	persist(
		(set) => ({
			shelf: [],
			setShelf: (shelf) =>
				set({
					shelf,
				}),
		}),
		{
			name: "shelf-storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
