import { render, screen } from "@testing-library/react";
import { BookRowSkeleton } from ".";

describe("BookRowSkeleton", () => {
	it("renders 4 skeleton rows", () => {
		const { container } = render(<BookRowSkeleton />);
		const rows = container.querySelectorAll("div.grid");
		expect(rows.length).toBe(4);
	});

	it("renders skeletons for book image and info", () => {
		render(<BookRowSkeleton />);
		const skeletons = screen.getAllByTestId(/book-row-skeleton/i);
		expect(skeletons.length).toBeGreaterThan(0);
	});

	it("matches snapshot", () => {
		const { container } = render(<BookRowSkeleton />);
		expect(container).toMatchSnapshot();
	});
});
