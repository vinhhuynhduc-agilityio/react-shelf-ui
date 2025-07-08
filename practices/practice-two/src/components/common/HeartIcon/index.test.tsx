import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import HeartIcon from ".";

describe("HeartIcon", () => {
	it("renders filled heart when filled=true", () => {
		const { container } = render(<HeartIcon filled={true} />);
		const svg = container.querySelector("svg");
		expect(svg).toBeInTheDocument();
		const path = svg?.querySelector("path");
		expect(path).toHaveAttribute("fill", "#F34040");
		expect(path).not.toHaveAttribute("stroke");
	});

	it("renders outlined heart when filled=false", () => {
		const { container } = render(<HeartIcon filled={false} />);
		const svg = container.querySelector("svg");
		expect(svg).toBeInTheDocument();
		const path = svg?.querySelector("path");
		expect(path).toHaveAttribute("stroke", "#B6B6B6");
	});

	it("applies custom className", () => {
		const { container } = render(
			<HeartIcon filled={true} className="custom-class" />
		);
		const svg = container.querySelector("svg");
		expect(svg).toHaveClass("custom-class");
	});

	it("matches snapshot for filled", () => {
		const { container } = render(<HeartIcon filled={true} />);
		expect(container).toMatchSnapshot();
	});

	it("matches snapshot for outlined", () => {
		const { container } = render(<HeartIcon filled={false} />);
		expect(container).toMatchSnapshot();
	});
});
