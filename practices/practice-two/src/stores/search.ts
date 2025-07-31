import { create } from 'zustand';

interface SearchStore {
  searchTerm: string;
  searchFromSidebar: boolean;
  setSearchTerm: (term: string) => void;
  setSearchFromSidebar: (value: boolean) => void;
  valueSearch: string;
  setValueSearch: (value: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  searchTerm: '',
  searchFromSidebar: false,
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSearchFromSidebar: (value: boolean) => set({ searchFromSidebar: value }),
  valueSearch: '',
  setValueSearch: (value: string) => set({ valueSearch: value }),
}));
