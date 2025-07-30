import { Book } from "@/types";

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
