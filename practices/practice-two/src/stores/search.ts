import { create } from "zustand";

interface SearchStore {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  valueSearch: string;
  setValueSearch: (value: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
  valueSearch: "",
  setValueSearch: (value: string) => set({ valueSearch: value }),
  selectedFilter: "Title",
  setSelectedFilter: (filter: string) => set({ selectedFilter: filter }),
}));
