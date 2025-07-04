import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import StatusBadge from ".";

describe("StatusBadge", () => {
	it("renders with 'In-Shelf' status and correct style", () => {
		render(<StatusBadge status="In-Shelf" />);
		const badge = screen.getByText("In-Shelf");
		expect(badge).toBeInTheDocument();
		expect(badge).toHaveClass("bg-[#42BB4E]", "text-white");
	});

	it("renders with 'None' status and correct style", () => {
		render(<StatusBadge status="None" />);
		const badge = screen.getByText("None");
		expect(badge).toBeInTheDocument();
		expect(badge).toHaveClass("bg-[#C7C7C7]", "text-white");
	});

	it("matches snapshot for 'In-Shelf'", () => {
		const { container } = render(<StatusBadge status="In-Shelf" />);
		expect(container).toMatchSnapshot();
	});

	it("matches snapshot for 'None'", () => {
		const { container } = render(<StatusBadge status="None" />);
		expect(container).toMatchSnapshot();
	});
});
