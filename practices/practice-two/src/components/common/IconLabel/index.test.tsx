import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import IconLabel from ".";

describe("IconLabel", () => {
	it("renders the icon and label", () => {
		render(<IconLabel icon={<span data-testid="icon">🔥</span>} label="Hot" />);
		expect(screen.getByTestId("icon")).toBeInTheDocument();
		expect(screen.getByText("Hot")).toBeInTheDocument();
	});

	it("applies correct container classes", () => {
		const { container } = render(<IconLabel icon={<span />} label="Test" />);
		expect(container.firstChild).toHaveClass(
			"flex",
			"flex-col",
			"items-center",
			"justify-center",
			"cursor-pointer",
			"space-y-2",
			"hover:bg-gray-100",
			"p-2",
			"rounded-lg",
			"transition-all"
		);
	});

	it("matches snapshot", () => {
		const { container } = render(
			<IconLabel icon={<span>⭐</span>} label="Star" />
		);
		expect(container).toMatchSnapshot();
	});
});
