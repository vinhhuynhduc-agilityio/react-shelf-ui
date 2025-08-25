import { isBookInShelf, filterBooksByShelves } from "../shelf";
import { MOCK_SHELVES, MOCK_BOOKS } from "@/__mocks__/book";

describe("isBookInShelf", () => {
  it("returns true if the book is in the shelf", () => {
    expect(isBookInShelf("11", MOCK_SHELVES)).toBe(true);
    expect(isBookInShelf("21", MOCK_SHELVES)).toBe(true);
  });

  it("returns false if the book is not in the shelf", () => {
    expect(isBookInShelf("999", MOCK_SHELVES)).toBe(false);
  });

  it("returns false if shelves is empty", () => {
    expect(isBookInShelf("1", [])).toBe(false);
  });
});

describe("filterBooksByShelves", () => {
  it("returns only books that are in shelves", () => {
    const result = filterBooksByShelves(MOCK_BOOKS, MOCK_SHELVES);
    expect(result).toHaveLength(2);
    expect(result.map((b) => b.id)).toEqual(["11", "21"]);
  });

  it("returns empty array if no books are in shelves", () => {
    const books = [
      {
        id: "999",
        title: "Not in shelf",
        authorAndYear: "",
        category: "",
        authorBio: "",
        rating: 0,
        imageUrl: "",
      },
    ];
    const result = filterBooksByShelves(books, MOCK_SHELVES);
    expect(result).toHaveLength(0);
  });

  it("returns empty array if shelves is empty", () => {
    const result = filterBooksByShelves(MOCK_BOOKS, []);
    expect(result).toHaveLength(0);
  });
});
