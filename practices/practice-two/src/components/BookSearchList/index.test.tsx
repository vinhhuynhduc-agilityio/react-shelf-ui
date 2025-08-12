import { render, screen, fireEvent } from "@testing-library/react";
import BookSearchList from "./index";
import { Book, UserBook, ShelfItem } from "@/types";

// Strictly type the BookRow props for mocking
type BookRowProps = {
  book: Book;
  isInShelf: boolean;
  isFavorite: boolean;
  onClickPreview: (book: Book) => void;
  handleFavoriteClick: () => void;
  disabled: boolean;
};

// Mock BookRow to test rendering and props
jest.mock("@/components/common", () => ({
  BookRow: (props: BookRowProps) => (
    <div data-testid="book-row">
      <span>{props.book.title}</span>
      <button
        data-testid="preview-btn"
        onClick={() => props.onClickPreview(props.book)}
      >
        Preview
      </button>
      <button data-testid="fav-btn" onClick={props.handleFavoriteClick}>
        Favorite
      </button>
    </div>
  ),
}));

describe("BookSearchList", () => {
  const books: Book[] = [
    { id: "1", title: "Book 1" } as Book,
    { id: "2", title: "Book 2" } as Book,
  ];
  const shelves: ShelfItem[] = [{ bookId: "1" } as ShelfItem];
  const favourites: UserBook[] = [{ bookId: "2", id: "fav2" } as UserBook];
  const pendingFavouritesActions = ["2"];
  const handleClickPreview = jest.fn();
  const handleFavoriteClick = jest.fn();
  const isBookInShelf = (bookId: string, shelf: ShelfItem[]) =>
    shelf.some((s) => s.bookId === bookId);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a BookRow for each book", () => {
    render(
      <BookSearchList
        books={books}
        shelves={shelves}
        favourites={favourites}
        pendingFavouritesActions={pendingFavouritesActions}
        handleClickPreview={handleClickPreview}
        handleFavoriteClick={handleFavoriteClick}
        isBookInShelf={isBookInShelf}
      />
    );
    expect(screen.getAllByTestId("book-row")).toHaveLength(2);
    expect(screen.getByText("Book 1")).toBeInTheDocument();
    expect(screen.getByText("Book 2")).toBeInTheDocument();
  });

  it("calls handleClickPreview when preview button is clicked", () => {
    render(
      <BookSearchList
        books={books}
        shelves={shelves}
        favourites={favourites}
        pendingFavouritesActions={pendingFavouritesActions}
        handleClickPreview={handleClickPreview}
        handleFavoriteClick={handleFavoriteClick}
        isBookInShelf={isBookInShelf}
      />
    );
    fireEvent.click(screen.getAllByTestId("preview-btn")[0]);
    expect(handleClickPreview).toHaveBeenCalledWith(books[0]);
  });

  it("calls handleFavoriteClick with correct args when favorite button is clicked", () => {
    render(
      <BookSearchList
        books={books}
        shelves={shelves}
        favourites={favourites}
        pendingFavouritesActions={pendingFavouritesActions}
        handleClickPreview={handleClickPreview}
        handleFavoriteClick={handleFavoriteClick}
        isBookInShelf={isBookInShelf}
      />
    );
    fireEvent.click(screen.getAllByTestId("fav-btn")[1]);
    // Book 2 is favorite, favouriteId is "fav2"
    expect(handleFavoriteClick).toHaveBeenCalledWith(books[1], true, "fav2");
  });
});
