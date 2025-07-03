import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BookHomeList from ".";
import { MOCK_BOOKS } from "@/__mocks__/";

// Mock BookItem để kiểm tra render
type Book = { title: string; [key: string]: unknown };

jest.mock("@/components", () => ({
	BookItem: ({ book }: { book: Book }) => (
		<div data-testid="book-item">{book.title}</div>
	),
}));

describe("BookHomeList", () => {
	it("renders the title", () => {
		render(<BookHomeList books={MOCK_BOOKS} title="Recommended Books" />);
		expect(screen.getByText("Recommended Books")).toBeInTheDocument();
	});

	it("renders a BookItem for each book", () => {
		render(<BookHomeList books={MOCK_BOOKS} title="Books" />);
		const items = screen.getAllByTestId("book-item");
		expect(items).toHaveLength(MOCK_BOOKS.length);
		expect(items[0]).toHaveTextContent("Don't Make Me Think");
		expect(items[1]).toHaveTextContent("The Design of Everyday Things");
	});

	it("matches snapshot", () => {
		const { container } = render(
			<BookHomeList books={MOCK_BOOKS} title="Snapshot Title" />
		);
		expect(container).toMatchSnapshot();
	});
});
