import { Book, ShelfItem } from "@/types";

export const isBookInShelf = (
	bookId: string,
	shelves: ShelfItem[]
): boolean => {
	return shelves.some((s) => s.bookId === bookId);
};

export const filterBooksByShelves = (
	books: Book[],
	shelves: ShelfItem[]
): Book[] =>
	books.filter((book) => shelves.some((shelf) => shelf.bookId === book.id));
