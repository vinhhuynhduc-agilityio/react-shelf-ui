import { Book, FavouriteItem } from "@/types";

export const filterBooks = (
  books: Book[],
  searchTerm: string,
  selectedFilter: string,
  searchFromSidebar: boolean
): Book[] => {
  if (searchFromSidebar) return books;

  const filterMapping: Record<string, (book: Book) => string> = {
    Title: (book) => book.title,
    Author: (book) => book.author.name,
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
