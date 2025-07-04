import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HeaderRow from ".";

describe("HeaderRow", () => {
	it("renders all column headers correctly", () => {
		render(<HeaderRow />);
		expect(screen.getByText("Title")).toBeInTheDocument();
		expect(screen.getByText("Ratings")).toBeInTheDocument();
		expect(screen.getByText("Category")).toBeInTheDocument();
		expect(screen.getByText("Status")).toBeInTheDocument();
	});

	it("renders empty columns for actions", () => {
		render(<HeaderRow />);
		// There are two empty columns for actions, both should be present
		const emptyDivs = screen.getAllByText((content, element) => {
			return element?.tagName === "DIV" && content === "";
		});
		expect(emptyDivs.length).toBeGreaterThanOrEqual(2);
	});

	it("matches snapshot", () => {
		const { container } = render(<HeaderRow />);
		expect(container).toMatchSnapshot();
	});
});
