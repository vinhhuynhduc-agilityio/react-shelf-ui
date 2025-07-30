import { create } from "zustand";

interface FilterStore {
	selectedFilter: string;
	setSelectedFilter: (filter: string) => void;
}

export const useSearchFilterStore = create<FilterStore>((set) => ({
	selectedFilter: "Title",
	setSelectedFilter: (filter: string) => set({ selectedFilter: filter }),
}));
