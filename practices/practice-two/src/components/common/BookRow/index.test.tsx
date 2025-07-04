import { render, screen, fireEvent } from "@testing-library/react";
import { MOCK_BOOKS } from "@/__mocks__/book";
import "@testing-library/jest-dom";
import BookRow from ".";

describe("BookRow", () => {
	const mockBook = MOCK_BOOKS[0];
	const onClickPreview = jest.fn();
	const handleFavoriteClick = jest.fn();

	it("renders book info correctly", () => {
		render(
			<BookRow
				book={mockBook}
				isInShelf={true}
				isFavorite={false}
				onClickPreview={jest.fn()}
				handleFavoriteClick={jest.fn()}
			/>
		);
		expect(screen.getByAltText(mockBook.title)).toBeInTheDocument();
		expect(screen.getByText(mockBook.title)).toBeInTheDocument();
		expect(
			screen.getByText(`${mockBook.author.name}, ${mockBook.publishedYear}`)
		).toBeInTheDocument();
		expect(screen.getByText(`${mockBook.rating}/5`)).toBeInTheDocument();
		expect(screen.getByText(mockBook.category)).toBeInTheDocument();
		expect(screen.getByText("In-Shelf")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Preview/i })
		).toBeInTheDocument();
	});

	it("calls onClickPreview when Preview button is clicked", () => {
		render(
			<BookRow
				book={mockBook}
				isInShelf={false}
				isFavorite={false}
				onClickPreview={onClickPreview}
				handleFavoriteClick={jest.fn()}
			/>
		);
		fireEvent.click(screen.getByRole("button", { name: /Preview/i }));
		expect(onClickPreview).toHaveBeenCalledTimes(1);
	});

	it("calls handleFavoriteClick when heart icon button is clicked", () => {
		render(
			<BookRow
				book={mockBook}
				isInShelf={false}
				isFavorite={false}
				onClickPreview={jest.fn()}
				handleFavoriteClick={handleFavoriteClick}
			/>
		);
		const favBtn = screen.getByRole("button", { name: /Add to favorites/i });
		fireEvent.click(favBtn);
		expect(handleFavoriteClick).toHaveBeenCalledTimes(1);
	});

	it("shows Remove from favorites when isFavorite is true", () => {
		render(
			<BookRow
				book={mockBook}
				isInShelf={false}
				isFavorite={true}
				onClickPreview={jest.fn()}
				handleFavoriteClick={jest.fn()}
			/>
		);
		expect(
			screen.getByRole("button", { name: /Remove from favorites/i })
		).toBeInTheDocument();
	});

	it("disables favorite button when disabled is true", () => {
		render(
			<BookRow
				book={mockBook}
				isInShelf={false}
				isFavorite={false}
				onClickPreview={jest.fn()}
				handleFavoriteClick={jest.fn()}
				disabled
			/>
		);
		const favBtn = screen.getByRole("button", { name: /Add to favorites/i });
		expect(favBtn).toBeDisabled();
	});

	it("matches snapshot", () => {
		const { container } = render(
			<BookRow
				book={mockBook}
				isInShelf={true}
				isFavorite={true}
				onClickPreview={jest.fn()}
				handleFavoriteClick={jest.fn()}
			/>
		);
		expect(container).toMatchSnapshot();
	});
});
