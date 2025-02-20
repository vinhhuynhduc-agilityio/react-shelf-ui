import { ShelfBooks } from "@/types";

export const isBookInShelf = (bookId: string, shelf: ShelfBooks[]): boolean => {
  return shelf.some((s) => s.bookId === bookId);
};
