import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BookHomeList from ".";
import { MOCK_BOOKS } from "@/__mocks__";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useNavigate: () => mockNavigate,
}));

jest.mock("@/components", () => ({
	BookItem: ({ title, onClick }: { title: string; onClick?: () => void }) => (
		<div data-testid="book-item" onClick={onClick} role="button">
			{title}
		</div>
	),
	ApiErrorNotice: ({ title }: { title: string }) => <div>{title}</div>,
	Skeleton: () => <div data-testid="skeleton" />,
}));

describe("BookHomeList", () => {
	beforeEach(() => {
		mockNavigate.mockClear();
	});

	it("renders the title", () => {
		render(
			<MemoryRouter>
				<BookHomeList books={MOCK_BOOKS} title="Recommended Books" />
			</MemoryRouter>
		);
		expect(screen.getByText("Recommended Books")).toBeInTheDocument();
	});

	it("renders a BookItem for each book", () => {
		render(
			<MemoryRouter>
				<BookHomeList books={MOCK_BOOKS} title="Books" />
			</MemoryRouter>
		);
		const items = screen.getAllByTestId("book-item");
		expect(items).toHaveLength(MOCK_BOOKS.length);
		expect(items[0]).toHaveTextContent("Don't Make Me Think");
		expect(items[1]).toHaveTextContent("The Design of Everyday Things");
	});

	it("calls navigate when a BookItem is clicked", () => {
		render(
			<MemoryRouter>
				<BookHomeList books={MOCK_BOOKS} title="Books" />
			</MemoryRouter>
		);
		const items = screen.getAllByTestId("book-item");
		fireEvent.click(items[0]);
		expect(mockNavigate).toHaveBeenCalledWith(
			`/book-preview/${MOCK_BOOKS[0].id}`,
			{ state: { from: "/home" } }
		);
	});

	it("matches snapshot", () => {
		const { container } = render(
			<MemoryRouter>
				<BookHomeList books={MOCK_BOOKS} title="Snapshot Title" />
			</MemoryRouter>
		);
		expect(container).toMatchSnapshot();
	});
});
