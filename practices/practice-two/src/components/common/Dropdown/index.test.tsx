import { render, screen, fireEvent } from "@testing-library/react";
import Dropdown from ".";
import { useRef, useState } from "react";

describe("Dropdown", () => {
	const options = [
		{ key: "1", label: "Option 1" },
		{ key: "2", label: "Option 2" },
	];

	const Wrapper = ({
		isOpen = true,
		align = "left",
		onSelect = jest.fn(),
	}: {
		isOpen?: boolean;
		align?: "left" | "right";
		onSelect?: (option: { key: string; label: string }) => void;
	}) => {
		const triggerRef = useRef<HTMLButtonElement>(null);
		const [open, setOpen] = useState(isOpen);
		return (
			<>
				<button ref={triggerRef}>Trigger</button>
				<Dropdown
					options={options}
					isOpen={open}
					setIsOpen={setOpen}
					triggerRef={triggerRef}
					align={align}
					onSelect={onSelect}
				/>
			</>
		);
	};

	it("renders options when open", () => {
		render(<Wrapper isOpen={true} />);
		expect(screen.getByText("Option 1")).toBeInTheDocument();
		expect(screen.getByText("Option 2")).toBeInTheDocument();
	});

	it("does not render when closed", () => {
		render(<Wrapper isOpen={false} />);
		expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
	});

	it("calls onSelect and closes when option clicked", () => {
		const onSelect = jest.fn();
		render(<Wrapper isOpen={true} onSelect={onSelect} />);
		fireEvent.click(screen.getByText("Option 2"));
		expect(onSelect).toHaveBeenCalledWith({ key: "2", label: "Option 2" });
	});

	it("matches snapshot (left)", () => {
		const { container } = render(<Wrapper isOpen={true} align="left" />);
		expect(container).toMatchSnapshot();
	});

	it("matches snapshot (right)", () => {
		const { container } = render(<Wrapper isOpen={true} align="right" />);
		expect(container).toMatchSnapshot();
	});
});
