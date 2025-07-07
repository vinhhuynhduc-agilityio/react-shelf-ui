import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from ".";
import { useCurrentUser } from "@/hooks";

jest.mock("@/hooks", () => ({
	useCurrentUser: jest.fn(),
}));

describe("ProtectedRoute", () => {
	const TestChild = () => <div>Protected Content</div>;

	const setup = (user: unknown) => {
		(useCurrentUser as jest.Mock).mockReturnValue(user);
		return render(
			<MemoryRouter initialEntries={["/protected"]}>
				<ProtectedRoute>
					<TestChild />
				</ProtectedRoute>
			</MemoryRouter>
		);
	};

	it("renders children if user exists", () => {
		const { getByText, container } = setup({ id: 1, name: "User" });
		expect(getByText("Protected Content")).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it("redirects to login if no user", () => {
		const { container } = setup(null);
		// Should render a Navigate component
		expect(container.innerHTML).toBe("");
		expect(container).toMatchSnapshot();
	});
});
