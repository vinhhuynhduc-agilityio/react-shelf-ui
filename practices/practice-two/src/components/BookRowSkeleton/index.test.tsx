import { render, screen } from "@testing-library/react";
import { BookRowSkeleton } from ".";

describe("BookRowSkeleton", () => {
	it("renders the header row", () => {
		render(<BookRowSkeleton />);
		expect(screen.getByText(/title/i)).toBeInTheDocument();
	});

	it("renders skeletons for book image and info", () => {
		render(<BookRowSkeleton />);
		expect(screen.getAllByTestId(/skeleton/i)[0]).toBeInTheDocument();
	});

	it("has correct data-testid for the wrapper", () => {
		render(<BookRowSkeleton />);
		expect(screen.getByTestId("book-row-skeleton")).toBeInTheDocument();
	});
});
