import { render, screen, fireEvent } from "@testing-library/react";
import FavouriteBookList from "./index";
import { Book, UserBook, ShelfItem } from "@/types";

// Mock BookRow to test rendering and props
jest.mock("@/components", () => ({
  BookRow: (props: {
    book: Book;
    isInShelf: boolean;
    isFavorite: boolean;
    onClickPreview: (book: Book) => void;
    handleFavoriteClick: () => void;
    disabled: boolean;
    favouriteId?: string;
    onRemoveFavourite?: (book: Book, favouriteId: string) => void;
  }) => (
    <div data-testid="fav-book-row" data-disabled={props.disabled}>
      <span>{props.book.title}</span>
      <button
        data-testid="preview-btn"
        onClick={() => props.onClickPreview(props.book)}
      >
        Preview
      </button>
      <button
        data-testid="remove-fav-btn"
        onClick={() => {
          // Simulate the expected call signature for onRemoveFavourite
          if (props.onRemoveFavourite && props.favouriteId) {
            props.onRemoveFavourite(props.book, props.favouriteId);
          } else {
            props.handleFavoriteClick();
          }
        }}
        disabled={props.disabled}
      >
        Remove Favourite
      </button>
    </div>
  ),
}));

describe("FavouriteBookList", () => {
  const books: Book[] = [
    { id: "1", title: "Book 1" } as Book,
    { id: "2", title: "Book 2" } as Book,
  ];
  const favourites: UserBook[] = [{ bookId: "2", id: "fav2" } as UserBook];
  const shelves: ShelfItem[] = [{ bookId: "1" } as ShelfItem];
  const pendingFavouritesActions = ["2"];
  const onClickPreview = jest.fn();
  const onRemoveFavourite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a BookRow for each book", () => {
    const { container } = render(
      <FavouriteBookList
        books={books}
        favourites={favourites}
        shelves={shelves}
        pendingFavouritesActions={pendingFavouritesActions}
        onClickPreview={onClickPreview}
        onRemoveFavourite={onRemoveFavourite}
      />
    );
    expect(screen.getAllByTestId("fav-book-row")).toHaveLength(2);
    expect(screen.getByText("Book 1")).toBeInTheDocument();
    expect(screen.getByText("Book 2")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("renders a BookRow for each book", () => {
    render(
      <FavouriteBookList
        books={books}
        favourites={favourites}
        shelves={shelves}
        pendingFavouritesActions={pendingFavouritesActions}
        onClickPreview={onClickPreview}
        onRemoveFavourite={onRemoveFavourite}
      />
    );
    expect(screen.getAllByTestId("fav-book-row")).toHaveLength(2);
    expect(screen.getByText("Book 1")).toBeInTheDocument();
    expect(screen.getByText("Book 2")).toBeInTheDocument();
  });

  it("calls onClickPreview when preview button is clicked", () => {
    render(
      <FavouriteBookList
        books={books}
        favourites={favourites}
        shelves={shelves}
        pendingFavouritesActions={pendingFavouritesActions}
        onClickPreview={onClickPreview}
        onRemoveFavourite={onRemoveFavourite}
      />
    );
    fireEvent.click(screen.getAllByTestId("preview-btn")[0]);
    expect(onClickPreview).toHaveBeenCalledWith(books[0]);
  });

  it("disables remove button if book is in pendingFavouritesActions", () => {
    render(
      <FavouriteBookList
        books={books}
        favourites={favourites}
        shelves={shelves}
        pendingFavouritesActions={pendingFavouritesActions}
        onClickPreview={onClickPreview}
        onRemoveFavourite={onRemoveFavourite}
      />
    );
    const buttons = screen.getAllByTestId("remove-fav-btn");
    expect(buttons[1]).toBeDisabled();
    expect(buttons[0]).not.toBeDisabled();
  });
});
