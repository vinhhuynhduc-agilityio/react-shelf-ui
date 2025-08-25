import { create } from "zustand";

interface SearchStore {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
  selectedFilter: "Title",
  setSelectedFilter: (filter: string) => set({ selectedFilter: filter }),
}));
