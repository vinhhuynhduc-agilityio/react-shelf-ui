import { render, screen } from "@testing-library/react";
import { renderIconButtonLabel } from "@/helpers";

describe("renderIconButtonLabel", () => {
	it("renders label text inside span", () => {
		render(renderIconButtonLabel("Test Label"));
		const span = screen.getByText("Test Label");
		expect(span).toBeInTheDocument();
		expect(span.tagName).toBe("SPAN");
	});

	it("applies correct className", () => {
		render(renderIconButtonLabel("Label"));
		const span = screen.getByText("Label");
		expect(span).toHaveClass("text-center");
		expect(span).toHaveClass("font-bold");
		expect(span).toHaveClass("text-[#333333]");
	});

	it("matches snapshot", () => {
		const { container } = render(renderIconButtonLabel("Label"));
		expect(container).toMatchSnapshot();
	});
});
