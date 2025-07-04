import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from ".";

describe("Button", () => {
	it("renders children correctly", () => {
		render(<Button>Click me</Button>);
		expect(
			screen.getByRole("button", { name: /Click me/i })
		).toBeInTheDocument();
	});

	it("calls onClick when clicked", () => {
		const handleClick = jest.fn();
		render(<Button onClick={handleClick}>Click</Button>);
		fireEvent.click(screen.getByRole("button", { name: /Click/i }));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("is disabled when disabled prop is true", () => {
		render(<Button disabled>Disabled</Button>);
		const btn = screen.getByRole("button", { name: /Disabled/i });
		expect(btn).toBeDisabled();
		expect(btn).toHaveClass("cursor-not-allowed");
	});

	it("applies primary variant by default", () => {
		render(<Button>Primary</Button>);
		const btn = screen.getByRole("button", { name: /Primary/i });
		expect(btn).toHaveClass("bg-orange-500");
	});

	it("applies outline variant", () => {
		render(<Button variant="outline">Outline</Button>);
		const btn = screen.getByRole("button", { name: /Outline/i });
		expect(btn).toHaveClass("border");
		expect(btn).toHaveClass("text-[#F76B56]");
	});

	it("applies text variant", () => {
		render(<Button variant="text">Text</Button>);
		const btn = screen.getByRole("button", { name: /Text/i });
		expect(btn).toHaveClass("text-orange-500");
	});

	it("applies custom className", () => {
		render(<Button className="custom-class">Custom</Button>);
		const btn = screen.getByRole("button", { name: /Custom/i });
		expect(btn).toHaveClass("custom-class");
	});

	it("matches snapshot", () => {
		const { container } = render(<Button>Snapshot</Button>);
		expect(container).toMatchSnapshot();
	});
});
