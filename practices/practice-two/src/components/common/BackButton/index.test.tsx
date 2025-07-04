import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BackButton from ".";

describe("BackButton", () => {
	it("renders with correct title", () => {
		const handleClick = jest.fn();
		render(<BackButton onClick={handleClick} title="Go Back" />);
		const button = screen.getByRole("button", { name: /Go Back/i });
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent("Go Back");
	});

	it("calls onClick when clicked", () => {
		const handleClick = jest.fn();
		render(<BackButton onClick={handleClick} title="Back" />);
		const button = screen.getByRole("button", { name: /Back/i });
		fireEvent.click(button);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("is disabled and has correct class when disabled", () => {
		const handleClick = jest.fn();
		render(<BackButton onClick={handleClick} title="Back" disabled />);
		const button = screen.getByRole("button", { name: /Back/i });
		expect(button).toBeDisabled();
		expect(button).toHaveClass("cursor-not-allowed");
	});

	it("matches snapshot", () => {
		const handleClick = jest.fn();
		const { container } = render(
			<BackButton onClick={handleClick} title="Back" />
		);
		expect(container).toMatchSnapshot();
	});
});
