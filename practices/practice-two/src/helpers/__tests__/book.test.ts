import {
  filterBooks,
  filterFavouritedBooks,
  parseAuthorAndYear,
} from "@/helpers/book";
import { MOCK_BOOKS, MOCK_FAVOURITES } from "@/__mocks__/book";

describe("parseAuthorAndYear", () => {
  it("parses author and year correctly", () => {
    expect(parseAuthorAndYear("Steve Krug, 2000")).toEqual({
      authorName: "Steve Krug",
      publishedYear: 2000,
    });
    expect(parseAuthorAndYear("Don Norman, 1988")).toEqual({
      authorName: "Don Norman",
      publishedYear: 1988,
    });
  });
});

describe("filterBooks", () => {
  it("returns all books if searchFromSidebar is true", () => {
    const result = filterBooks(MOCK_BOOKS, "anything", "Title", true);
    expect(result).toEqual(MOCK_BOOKS);
  });

  it("filters by title", () => {
    const result = filterBooks(MOCK_BOOKS, "think", "Title", false);
    expect(result).toEqual([MOCK_BOOKS[0]]);
  });

  it("filters by author", () => {
    const result = filterBooks(MOCK_BOOKS, "don", "Author", false);
    expect(result).toEqual([MOCK_BOOKS[1]]);
  });

  it("filters by category", () => {
    const result = filterBooks(MOCK_BOOKS, "computer", "Subjects", false);
    expect(result).toEqual(MOCK_BOOKS);
  });

  it("returns empty if no match", () => {
    const result = filterBooks(MOCK_BOOKS, "notfound", "Title", false);
    expect(result).toEqual([]);
  });

  it("returns empty if selectedFilter is invalid", () => {
    const result = filterBooks(MOCK_BOOKS, "think", "Invalid", false);
    expect(result).toEqual([]);
  });
});

describe("filterFavouritedBooks", () => {
  it("returns only books that are in favourites", () => {
    const result = filterFavouritedBooks(MOCK_BOOKS, MOCK_FAVOURITES);
    expect(result).toEqual(MOCK_BOOKS);
  });

  it("returns empty if no favourites", () => {
    expect(filterFavouritedBooks(MOCK_BOOKS, [])).toEqual([]);
    expect(filterFavouritedBooks(MOCK_BOOKS, undefined)).toEqual([]);
  });

  it("returns empty if no books match favourites", () => {
    const fav = [
      {
        id: "favourite-1",
        bookId: "999",
        userId: "1bf703cf-9d05-40ea-b069-16c592570f8c",
      },
    ];
    expect(filterFavouritedBooks(MOCK_BOOKS, fav)).toEqual([]);
  });
});
