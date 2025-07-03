import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AuthButton from ".";

describe("AuthButton", () => {
	it("renders with the correct label when not disabled", () => {
		render(
			<AuthButton
				disabled={false}
				label="Sign In"
				pendingLabel="Signing In..."
			/>
		);
		const button = screen.getByRole("button", { name: "Sign In" });
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent("Sign In");
		expect(button).not.toBeDisabled();
	});

	it("renders with the pending label and disabled state", () => {
		render(
			<AuthButton
				disabled={true}
				label="Sign In"
				pendingLabel="Signing In..."
			/>
		);
		const button = screen.getByRole("button", { name: "Signing In..." });
		expect(button).toBeInTheDocument();
		expect(button).toBeDisabled();
		expect(button).toHaveClass("opacity-50");
		expect(button).toHaveClass("cursor-not-allowed");
	});

	it("applies custom className", () => {
		render(
			<AuthButton
				disabled={false}
				label="Sign Up"
				pendingLabel="Signing Up..."
				className="custom-class"
			/>
		);
		const button = screen.getByRole("button", { name: "Sign Up" });
		expect(button).toHaveClass("custom-class");
	});

	it("matches snapshot", () => {
		const { container } = render(
			<AuthButton
				disabled={false}
				label="Sign In"
				pendingLabel="Signing In..."
			/>
		);
		expect(container).toMatchSnapshot();
	});
});
