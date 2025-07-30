import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Book } from "@/types/books";

interface BookStore {
  books: Book[];
  hasFetched: boolean;
  setBooks: (books: Book[]) => void;
}

export const useBookStore = create<BookStore>()(
  persist(
    (set) => ({
      books: [],
      hasFetched: false,
      setBooks: (books) => set({
        books,
        hasFetched: true
      }),
    }),
    {
      name: "book-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
