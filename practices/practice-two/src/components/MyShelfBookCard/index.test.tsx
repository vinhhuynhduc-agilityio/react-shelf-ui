import { render, screen, fireEvent } from "@testing-library/react";
import MyShelfBookCard from ".";
import { Book } from "@/types";

describe("MyShelfBookCard", () => {
	const mockBook = {
		id: "book-1",
		title: "Test Book",
		author: { name: "Author" },
		publishedYear: 2020,
		imageUrl: "img.jpg",
		rating: 4,
		category: "Fiction",
	};
	const borrowedDate = "2025-07-04";
	const onReturn = jest.fn();

	const setup = (props = {}) =>
		render(
			<MyShelfBookCard
				book={mockBook as Book}
				borrowedDate={borrowedDate}
				onReturn={onReturn}
				{...props}
			/>
		);

	it("renders BookItem, borrowed date, and Return button", () => {
		setup();
		// BookItem: check for book title
		expect(screen.getByText("Test Book")).toBeInTheDocument();
		expect(screen.getByText("Borrowed on")).toBeInTheDocument();
		expect(screen.getByText(borrowedDate)).toBeInTheDocument();
		// Button: check for Return button
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

	it("matches snapshot", () => {
		const { container } = setup();
		expect(container).toMatchSnapshot();
	});
});
