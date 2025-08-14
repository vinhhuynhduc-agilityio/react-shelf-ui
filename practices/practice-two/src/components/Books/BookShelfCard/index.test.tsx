import { MemoryRouter } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import BookShelfCard from ".";
import { Book } from "@/types";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("BookShelfCard", () => {
  const mockBook = {
    id: "book-1",
    title: "Test Book",
    authorAndYear: "Author, 2020",
    imageUrl: "img.jpg",
    rating: 4,
    category: "Fiction",
  };
  const borrowedDate = "2025-07-04";
  const onReturn = jest.fn();

  const setup = (props = {}) =>
    render(
      <MemoryRouter>
        <BookShelfCard
          book={mockBook as Book}
          borrowedDate={borrowedDate}
          onReturn={onReturn}
          {...props}
        />
      </MemoryRouter>
    );

  it("renders BookItem, borrowed date, and Return button", () => {
    setup();
    expect(screen.getByText("Test Book")).toBeInTheDocument();
    expect(screen.getByText("Borrowed on")).toBeInTheDocument();
    expect(screen.getByText(borrowedDate)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /return/i })).toBeInTheDocument();
    expect(screen.getByText("Return")).toBeInTheDocument();
  });

  it("calls onReturn with book id when Return button is clicked", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /return/i }));
    expect(onReturn).toHaveBeenCalledWith("book-1");
  });

  it("disables Return button when disabled is true", () => {
    setup({ disabled: true });
    expect(screen.getByRole("button", { name: /return/i })).toBeDisabled();
  });

  it("navigates to book preview when BookItem is clicked", () => {
    setup();
    const bookItem = screen.getByRole("button", { name: /test book/i });
    fireEvent.click(bookItem);
    expect(mockNavigate).toHaveBeenCalledWith("/book-preview/book-1", {
      state: { from: "/my-shelf" },
    });
  });

  it("matches snapshot", () => {
    const { container } = setup();
    expect(container).toMatchSnapshot();
  });
});
