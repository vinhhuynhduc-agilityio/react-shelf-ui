import { render, screen, fireEvent } from "@testing-library/react";
import { BookDetailInfo } from "./index";
import { MOCK_BOOKS } from "@/__mocks__/book";

const mockBook = MOCK_BOOKS[0];
const mockAvailability = ["Available", "Limited"];

describe("BookDetailInfo", () => {
  it("renders book title, author, and year", () => {
    render(
      <BookDetailInfo
        book={mockBook}
        isInShelf={false}
        isPending={false}
        isFetching={false}
        availability={mockAvailability}
        onBorrow={jest.fn()}
      />
    );
    expect(screen.getByText(mockBook.title)).toBeInTheDocument();
  });

  it("renders availability list", () => {
    render(
      <BookDetailInfo
        book={mockBook}
        isInShelf={false}
        isPending={false}
        isFetching={false}
        availability={mockAvailability}
        onBorrow={jest.fn()}
      />
    );
    mockAvailability.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it("disables button when isInShelf, isPending, or isFetching is true", () => {
    const { rerender } = render(
      <BookDetailInfo
        book={mockBook}
        isInShelf={false}
        isPending={false}
        isFetching={false}
        availability={mockAvailability}
        onBorrow={jest.fn()}
      />
    );
    expect(screen.getByRole("button")).not.toBeDisabled();

    rerender(
      <BookDetailInfo
        book={mockBook}
        isInShelf={true}
        isPending={false}
        isFetching={false}
        availability={mockAvailability}
        onBorrow={jest.fn()}
      />
    );
    expect(screen.getByRole("button")).toBeDisabled();

    rerender(
      <BookDetailInfo
        book={mockBook}
        isInShelf={false}
        isPending={true}
        isFetching={false}
        availability={mockAvailability}
        onBorrow={jest.fn()}
      />
    );
    expect(screen.getByRole("button")).toBeDisabled();

    rerender(
      <BookDetailInfo
        book={mockBook}
        isInShelf={false}
        isPending={false}
        isFetching={true}
        availability={mockAvailability}
        onBorrow={jest.fn()}
      />
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("calls onBorrow when button is clicked", () => {
    const onBorrow = jest.fn();
    render(
      <BookDetailInfo
        book={mockBook}
        isInShelf={false}
        isPending={false}
        isFetching={false}
        availability={mockAvailability}
        onBorrow={onBorrow}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onBorrow).toHaveBeenCalled();
  });
});
