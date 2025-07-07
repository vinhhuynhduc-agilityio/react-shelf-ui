import { render, screen } from "@testing-library/react";
import TodayQuote from ".";

describe("TodayQuote", () => {
	it("renders the quote title, text, and author", () => {
		render(<TodayQuote />);
		expect(screen.getByText("Today’s Quote")).toBeInTheDocument();
		expect(
			screen.getByText(/There is more treasure in books/i)
		).toBeInTheDocument();
		expect(screen.getByText(/Walt Disney/)).toBeInTheDocument();
	});

	it("matches snapshot", () => {
		const { container } = render(<TodayQuote />);
		expect(container).toMatchSnapshot();
	});
});
