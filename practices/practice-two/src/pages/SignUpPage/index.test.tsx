import { render, screen, fireEvent, waitFor } from "@/helpers/test-utils";
import SignUpPage from ".";
import { MemoryRouter } from "react-router-dom";
import { useRegisterUser } from "@/hooks";

jest.mock("@/hooks", () => ({
	useRegisterUser: jest.fn(),
}));

const mockedUseRegisterUser = useRegisterUser as jest.Mock;

describe("SignUpPage", () => {
	beforeEach(() => {
		mockedUseRegisterUser.mockReturnValue({
			mutate: jest.fn(),
			isPending: false,
		});
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("renders form and UI elements", () => {
		render(
			<MemoryRouter>
				<SignUpPage />
			</MemoryRouter>
		);
		expect(screen.getByText(/create an account/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
		expect(
			screen.getByText(/i agree to the terms and conditions/i)
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /register/i })
		).toBeInTheDocument();
		expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
	});

	it("shows validation errors if fields are empty", async () => {
		render(
			<MemoryRouter>
				<SignUpPage />
			</MemoryRouter>
		);
		fireEvent.click(screen.getByRole("button", { name: /register/i }));
		await waitFor(() => {
			expect(
				screen.getAllByText(/username is required/i).length
			).toBeGreaterThanOrEqual(1);
			expect(
				screen.getAllByText(/email is required/i).length
			).toBeGreaterThanOrEqual(1);
			expect(
				screen.getAllByText(/password is required/i).length
			).toBeGreaterThanOrEqual(1);
			expect(
				screen.getAllByText(/confirm password is required/i).length
			).toBeGreaterThanOrEqual(1);
			expect(
				screen.getAllByText(/you must agree to the terms and conditions/i)
					.length
			).toBeGreaterThanOrEqual(1);
		});
	});

	it("shows error if email is invalid", async () => {
		render(
			<MemoryRouter>
				<SignUpPage />
			</MemoryRouter>
		);
		fireEvent.input(screen.getByLabelText(/username/i), {
			target: { value: "Test User" },
		});
		fireEvent.input(screen.getByLabelText(/email/i), {
			target: { value: "invalid@123" },
		});
		fireEvent.blur(screen.getByLabelText(/email/i));
		fireEvent.input(screen.getByLabelText(/^password$/i), {
			target: { value: "123456" },
		});
		fireEvent.input(screen.getByLabelText(/confirm password/i), {
			target: { value: "123456" },
		});
		fireEvent.click(
			screen.getByLabelText(/i agree to the terms and conditions/i)
		);
		fireEvent.click(screen.getByRole("button", { name: /register/i }));
		await waitFor(() => {
			expect(
				screen.getByText((content) =>
					content.toLowerCase().includes("invalid email address")
				)
			).toBeInTheDocument();
		});
	});

	it("shows error if password is too short", async () => {
		render(
			<MemoryRouter>
				<SignUpPage />
			</MemoryRouter>
		);
		fireEvent.input(screen.getByLabelText(/username/i), {
			target: { value: "Test User" },
		});
		fireEvent.input(screen.getByLabelText(/email/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.input(screen.getByLabelText("Password"), {
			target: { value: "123" },
		});
		fireEvent.input(screen.getByLabelText(/confirm password/i), {
			target: { value: "123" },
		});
		fireEvent.click(
			screen.getByLabelText(/i agree to the terms and conditions/i)
		);
		fireEvent.click(screen.getByRole("button", { name: /register/i }));
		await waitFor(() => {
			expect(
				screen.getByText(/password must be at least 6 characters/i)
			).toBeInTheDocument();
		});
	});

	it("shows error if passwords do not match", async () => {
		render(
			<MemoryRouter>
				<SignUpPage />
			</MemoryRouter>
		);
		fireEvent.input(screen.getByLabelText(/^password$/i), {
			target: { value: "123456" },
		});
		fireEvent.input(screen.getByLabelText(/confirm password/i), {
			target: { value: "654321" },
		});
		fireEvent.click(screen.getByRole("button", { name: /register/i }));
		await waitFor(() => {
			expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
		});
	});

	it("calls registerUser on valid submit", async () => {
		const mutate = jest.fn();
		mockedUseRegisterUser.mockReturnValue({ mutate, isPending: false });
		render(
			<MemoryRouter>
				<SignUpPage />
			</MemoryRouter>
		);
		fireEvent.input(screen.getByLabelText(/username/i), {
			target: { value: "Test User" },
		});
		fireEvent.input(screen.getByLabelText(/email/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.input(screen.getByLabelText(/^password$/i), {
			target: { value: "123456" },
		});
		fireEvent.input(screen.getByLabelText(/confirm password/i), {
			target: { value: "123456" },
		});
		fireEvent.click(
			screen.getByLabelText(/i agree to the terms and conditions/i)
		);
		fireEvent.click(screen.getByRole("button", { name: /register/i }));
		await waitFor(() => {
			expect(mutate).toHaveBeenCalledWith(
				{
					fullName: "Test User",
					email: "test@example.com",
					password: "123456",
				},
				expect.any(Object)
			);
		});
	});

	it("matches snapshot", () => {
		const { container } = render(
			<MemoryRouter>
				<SignUpPage />
			</MemoryRouter>
		);
		expect(container).toMatchSnapshot();
	});
});
