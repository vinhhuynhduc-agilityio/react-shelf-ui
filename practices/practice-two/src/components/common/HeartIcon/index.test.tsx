import { render } from "@testing-library/react";
import { HeartIcon } from "./index";

describe("HeartIcon", () => {
	it("renders with default (not filled) style", () => {
		const { container } = render(<HeartIcon />);
		const path = container.querySelector("path");
		expect(path).toHaveAttribute("stroke", "#B6B6B6");
		expect(path).not.toHaveAttribute("fill", "#F34040");
	});

	it("renders with filled style when filled=true", () => {
		const { container } = render(<HeartIcon filled />);
		const path = container.querySelector("path");
		expect(path).toHaveAttribute("fill", "#F34040");
		expect(path).not.toHaveAttribute("stroke");
	});

	it("passes extra props to svg", () => {
		const { container } = render(<HeartIcon data-testid="heart-svg" />);
		const svg = container.querySelector("svg");
		expect(svg).toHaveAttribute("data-testid", "heart-svg");
	});
});
