import { render, screen, fireEvent } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { TextField } from ".";

describe("TextField", () => {
	const TestWrapper = (
		props: Partial<React.ComponentProps<typeof TextField>>
	) => {
		const {
			register,
			formState: { errors },
		} = useForm();
		return (
			<form>
				<TextField
					name="username"
					label="Username"
					placeholder="Enter username"
					register={register}
					{...props}
					error={
						props.error ||
						(typeof errors.username?.message === "string"
							? errors.username?.message
							: undefined)
					}
				/>
			</form>
		);
	};

	const setup = (props = {}) => render(<TestWrapper {...props} />);

	it("renders input with correct label and placeholder", () => {
		setup();
		expect(screen.getByLabelText("Username")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
	});

	it("applies the correct label width class", () => {
		setup({ labelWidth: "w-32" });
		const label = screen.getByText("Username");
		expect(label).toHaveClass("w-32");
	});

	it("displays error message when error prop is provided", () => {
		setup({ error: "Required field" });
		expect(screen.getByText("Required field")).toBeInTheDocument();
	});

	it("does not render error message when no error", () => {
		setup();
		expect(screen.queryByText("Required field")).not.toBeInTheDocument();
	});

	it("renders input with correct type", () => {
		setup({ type: "email" });
		const input = screen.getByLabelText("Username");
		expect(input).toHaveAttribute("type", "email");
	});

	it("renders textarea when type is 'textarea'", () => {
		setup({ type: "textarea" });
		expect(screen.getByPlaceholderText("Enter username").tagName).toBe(
			"TEXTAREA"
		);
	});

	it("renders password toggle button when showPasswordToggle is true", () => {
		const toggleFn = jest.fn();
		setup({ showPasswordToggle: true, togglePasswordVisibility: toggleFn });
		expect(screen.getByRole("button")).toBeInTheDocument();
		expect(screen.getByTestId("eye-on")).toBeInTheDocument();
		fireEvent.click(screen.getByRole("button"));
		// toggleFn should be called
		expect(toggleFn).toHaveBeenCalled();
	});

	it("shows eyeOffIcon when isPasswordVisible is true", () => {
		setup({ showPasswordToggle: true, isPasswordVisible: true });
		expect(screen.getByTestId("eye-off")).toBeInTheDocument();
	});

	it("applies disabled state", () => {
		setup({ disabled: true });
		expect(screen.getByLabelText("Username")).toBeDisabled();
	});

	it("applies maxLength prop", () => {
		setup({ maxLength: 10 });
		expect(screen.getByLabelText("Username")).toHaveAttribute(
			"maxLength",
			"10"
		);
	});

	it("matches snapshot", () => {
		const { container } = setup();
		expect(container).toMatchSnapshot();
	});
});
