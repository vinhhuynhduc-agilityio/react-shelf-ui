import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Avatar from ".";

// Mock DEFAULT_AVATAR
jest.mock("@/constants", () => ({
	DEFAULT_AVATAR: "default-avatar.png",
}));

describe("Avatar", () => {
	it("renders with provided src and alt", () => {
		render(<Avatar src="avatar.png" alt="Profile" />);
		const img = screen.getByRole("img");
		expect(img).toHaveAttribute("src", "avatar.png");
		expect(img).toHaveAttribute("alt", "Profile");
	});

	it("renders with default alt and default avatar if src is not provided", () => {
		render(<Avatar />);
		const img = screen.getByRole("img");
		expect(img).toHaveAttribute("src", "default-avatar.png");
		expect(img).toHaveAttribute("alt", "User");
	});

	it("applies correct size class for small", () => {
		render(<Avatar size="small" />);
		const avatarDiv = screen.getByTestId("avatar");
		expect(avatarDiv).toHaveClass("w-[34px]", "h-[34px]");
	});

	it("applies correct size class for medium (default)", () => {
		render(<Avatar />);
		const avatarDiv = screen.getByTestId("avatar");
		expect(avatarDiv).toHaveClass("w-[40px]", "h-[40px]");
	});

	it("applies correct size class for large", () => {
		render(<Avatar size="large" />);
		const avatarDiv = screen.getByTestId("avatar");
		expect(avatarDiv).toHaveClass(
			"md:w-[100px]",
			"md:h-[100px]",
			"w-[80px]",
			"h-[80px]"
		);
	});

	it("applies custom className", () => {
		render(<Avatar className="custom-class" />);
		const avatarDiv = screen.getByTestId("avatar");
		expect(avatarDiv).toHaveClass("custom-class");
	});

	it("matches snapshot", () => {
		const { container } = render(
			<Avatar src="avatar.png" alt="Snapshot" size="large" />
		);
		expect(container).toMatchSnapshot();
	});
});
