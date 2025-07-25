import { render } from "@testing-library/react";
import { FavouriteIcon } from "./index";

describe("FavouriteIcon", () => {
	it("renders with default (not filled) style", () => {
		const { container } = render(<FavouriteIcon />);
		const path = container.querySelector("path");
		expect(path).toHaveAttribute("stroke", "#B6B6B6");
		expect(path).not.toHaveAttribute("fill", "#F34040");
	});

	it("renders with filled style when filled=true", () => {
		const { container } = render(<FavouriteIcon filled />);
		const path = container.querySelector("path");
		expect(path).toHaveAttribute("fill", "#F34040");
		expect(path).not.toHaveAttribute("stroke");
	});

	it("passes extra props to svg", () => {
		const { container } = render(<FavouriteIcon data-testid="favourite-svg" />);
		const svg = container.querySelector("svg");
		expect(svg).toHaveAttribute("data-testid", "favourite-svg");
	});
});
