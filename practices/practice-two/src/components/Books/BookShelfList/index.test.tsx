import { render, screen, fireEvent } from "@testing-library/react";
import MyShelfBookList from "./index";
import { Book, ShelfItem } from "@/types";

// Mock BookShelfCard to test rendering and props
jest.mock("@/components", () => ({
  BookShelfCard: (props: {
    book: Book;
    borrowedDate: string;
    onReturn: (bookId: string) => void;
    disabled: boolean;
  }) => (
    <div data-testid="shelf-book-card" data-disabled={props.disabled}>
      <span>{props.book.title}</span>
      <span>{props.borrowedDate}</span>
      <button
        data-testid="return-btn"
        disabled={props.disabled}
        onClick={() => props.onReturn(props.book.id)}
      >
        Return
      </button>
    </div>
  ),
}));

describe("MyShelfBookList", () => {
  const books: Book[] = [
    { id: "1", title: "Book 1" } as Book,
    { id: "2", title: "Book 2" } as Book,
  ];
  const shelf: ShelfItem[] = [
    { bookId: "1", borrowedDate: "2024-07-01" } as ShelfItem,
    { bookId: "2", borrowedDate: "2024-07-02" } as ShelfItem,
  ];
  const pendingShelfActions = ["2"];
  const onReturnBook = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a BookShelfCard for each book", () => {
    render(
      <MyShelfBookList
        books={books}
        shelf={shelf}
        pendingShelfActions={pendingShelfActions}
        onReturnBook={onReturnBook}
      />
    );
    expect(screen.getAllByTestId("shelf-book-card")).toHaveLength(2);
    expect(screen.getByText("Book 1")).toBeInTheDocument();
    expect(screen.getByText("Book 2")).toBeInTheDocument();
    expect(screen.getByText("2024-07-01")).toBeInTheDocument();
    expect(screen.getByText("2024-07-02")).toBeInTheDocument();
  });

  it("disables return button if book is in pendingShelfActions", () => {
    render(
      <MyShelfBookList
        books={books}
        shelf={shelf}
        pendingShelfActions={pendingShelfActions}
        onReturnBook={onReturnBook}
      />
    );
    const buttons = screen.getAllByTestId("return-btn");
    expect(buttons[1]).toBeDisabled();
    expect(buttons[0]).not.toBeDisabled();
  });

  it("calls onReturnBook with correct shelfItem when return button is clicked", () => {
    render(
      <MyShelfBookList
        books={books}
        shelf={shelf}
        pendingShelfActions={pendingShelfActions}
        onReturnBook={onReturnBook}
      />
    );
    fireEvent.click(screen.getAllByTestId("return-btn")[0]);
    expect(onReturnBook).toHaveBeenCalledWith(shelf[0]);
  });
});
