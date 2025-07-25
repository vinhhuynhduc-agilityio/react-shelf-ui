import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { IconButton } from "./index";

// Mock icon component
const MockIcon = (
	props: React.SVGProps<SVGSVGElement> & { filled?: boolean }
) => (
	<svg
		data-testid="mock-icon"
		{...props}
		{...(props.filled ? { filled: "" } : {})}
	/>
);

describe("IconButton", () => {
	it("renders with label and icon (left)", () => {
		render(<IconButton icon={MockIcon} label="Go Back" />);
		const button = screen.getByRole("button");
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent("Go Back");
		expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
	});

	it("renders icon on the right when iconPosition is right", () => {
		render(<IconButton icon={MockIcon} label="Next" iconPosition="right" />);
		const button = screen.getByRole("button");
		const icons = screen.getAllByTestId("mock-icon");
		expect(icons.length).toBe(1);
		expect(button).toHaveTextContent("Next");
	});

	it("calls onClick when clicked", () => {
		const handleClick = jest.fn();
		render(<IconButton icon={MockIcon} label="Click" onClick={handleClick} />);
		const button = screen.getByRole("button");
		fireEvent.click(button);
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("is disabled and has opacity-50 when disabled", () => {
		render(<IconButton icon={MockIcon} label="Disabled" disabled />);
		const button = screen.getByRole("button");
		expect(button).toBeDisabled();
		expect(button).toHaveClass("opacity-50");
	});

	it("applies custom className", () => {
		render(
			<IconButton
				icon={MockIcon}
				label="Custom"
				additionalClasses="my-custom"
			/>
		);
		const button = screen.getByRole("button");
		expect(button).toHaveClass("my-custom");
	});

	it("sets aria-label and data-testid", () => {
		render(
			<IconButton
				icon={MockIcon}
				label="Label"
				ariaLabel="icon-button"
				dataTestId="icon-btn"
			/>
		);
		const button = screen.getByLabelText("icon-button");
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute("data-testid", "icon-btn");
	});

	it("passes filled prop to icon", () => {
		render(<IconButton icon={MockIcon} label="Filled" filled={true} />);
		const icon = screen.getByTestId("mock-icon");
		screen.debug(icon);
		expect(icon).toHaveAttribute("filled");
	});

	it("matches snapshot", () => {
		const { container } = render(
			<IconButton icon={MockIcon} label="Snapshot" />
		);
		expect(container).toMatchSnapshot();
	});
});
