import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "./index";

describe("Button", () => {
	it("renders label", () => {
		render(<Button label="Test" />);
		expect(screen.getByRole("button", { name: "Test" })).toBeInTheDocument();
	});

	it("shows pendingLabel when disabled", () => {
		render(<Button label="Label" pendingLabel="Pending..." disabled />);
		expect(
			screen.getByRole("button", { name: "Pending..." })
		).toBeInTheDocument();
	});

	it("calls onClick when not disabled", () => {
		const onClick = jest.fn();
		render(<Button label="Click" onClick={onClick} />);
		fireEvent.click(screen.getByRole("button", { name: "Click" }));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("does not call onClick when disabled", () => {
		const onClick = jest.fn();
		render(<Button label="Click" onClick={onClick} disabled />);
		fireEvent.click(screen.getByRole("button", { name: "Click" }));
		expect(onClick).not.toHaveBeenCalled();
	});

	it("is disabled when disabled prop is true", () => {
		render(<Button label="Disabled" disabled />);
		const btn = screen.getByRole("button", { name: "Disabled" });
		expect(btn).toBeDisabled();
	});

	it("applies custom className", () => {
		render(<Button label="Custom" className="my-custom" />);
		const btn = screen.getByRole("button", { name: "Custom" });
		expect(btn.className).toMatch(/my-custom/);
	});

	it("matches snapshot", () => {
		const { container } = render(<Button label="Snapshot" />);
		expect(container).toMatchSnapshot();
	});
});
