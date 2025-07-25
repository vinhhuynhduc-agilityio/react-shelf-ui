import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BookItem from ".";
import { MOCK_BOOKS } from "@/__mocks__/book";

describe("BookItem", () => {
	it("renders book info correctly", () => {
		const book = MOCK_BOOKS[0];
		render(<BookItem {...book} />);
		const img = screen.getByRole("img", { name: book.title });
		expect(img).toHaveAttribute("src", book.imageUrl);
		expect(img).toHaveAttribute("alt", book.title);
		expect(screen.getByText(book.title)).toBeInTheDocument();
		expect(
			screen.getByText(`${book.author.name}, ${book.publishedYear}`)
		).toBeInTheDocument();
		expect(screen.getByText(book.rating.toString())).toBeInTheDocument();
		expect(screen.getByText("/5")).toBeInTheDocument();
	});

	it("calls onClick when clicked", () => {
		const book = MOCK_BOOKS[0];
		const handleClick = jest.fn();
		render(<BookItem {...book} onClick={handleClick} />);
		const card = screen.getByRole("button");
		fireEvent.click(card);
		expect(handleClick).toHaveBeenCalled();
	});

	it("matches snapshot", () => {
		const book = MOCK_BOOKS[0];
		const { container } = render(<BookItem {...book} />);
		expect(container).toMatchSnapshot();
	});
});
