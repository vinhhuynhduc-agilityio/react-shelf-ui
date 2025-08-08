import { Book, FavouriteItem, ShelfItem } from "@/types";

type AuthorAndYear = {
  authorName: string;
  publishedYear: number;
};

export const parseAuthorAndYear = (input: string): AuthorAndYear => {
  const [name, yearStr] = input.split(",").map((s) => s.trim());

  return {
    authorName: name,
    publishedYear: Number(yearStr),
  };
};

export const filterBooks = (
  books: Book[],
  searchTerm: string,
  selectedFilter: string
): Book[] => {
  const filterMapping: Record<string, (book: Book) => string> = {
    Title: (book) => book.title,
    Author: (book) => parseAuthorAndYear(book.authorAndYear).authorName,
    Subjects: (book) => book.category,
  };

  const getFilterValue = filterMapping[selectedFilter] || (() => "");

  return books.filter((book) =>
    getFilterValue(book).toLowerCase().includes(searchTerm.toLowerCase())
  );
};

/**
 * Filters the list of books based on whether they are in the user's favourites.
 *
 * @param books - The full list of available books
 * @param favourites - The list of user's favourite items
 * @returns A filtered list of books that are included in favourites
 */
export const filterFavouritedBooks = (
  books: Book[],
  favourites: FavouriteItem[] | undefined
): Book[] => {
  // Return empty list if no favourites exist
  if (!favourites || favourites.length === 0) return [];

  // Return only books whose IDs match with a favourite bookId
  return books.filter((book) =>
    favourites.some((favourite) => favourite.bookId === book.id)
  );
};

export const getBookStatus = (
  bookId: string,
  shelves: ShelfItem[] = [],
  favourites: FavouriteItem[] = [],
  pendingFavouritesActions: string[] = [],
  isBookInShelf: (bookId: string, shelf: ShelfItem[]) => boolean
) => {
  const isInShelf = isBookInShelf(bookId, shelves);
  const isFavorite = favourites.some((fav) => fav.bookId === bookId);
  const favouriteId = favourites.find((fav) => fav.bookId === bookId)?.id;
  const isDisabled = pendingFavouritesActions.includes(bookId);

  return { isInShelf, isFavorite, favouriteId, isDisabled };
};
