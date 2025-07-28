import { render, screen, fireEvent, waitFor } from "@/helpers/test-utils";
import SignInPage from ".";
import { useUserStore } from "@/stores/userStore";
import { useGetUser } from "@/hooks";

jest.mock("@/stores/userStore", () => ({
	useUserStore: jest.fn(),
}));
jest.mock("@/hooks", () => ({
	useGetUser: jest.fn(),
}));

const mockedUseUserStore = useUserStore as unknown as jest.Mock;
const mockedUseGetUser = useGetUser as jest.Mock;

describe("SignInPage", () => {
	beforeEach(() => {
		mockedUseUserStore.mockImplementation((cb) => cb({ setUser: jest.fn() }));
		mockedUseGetUser.mockReturnValue({
			mutateAsync: jest.fn(),
			isPending: false,
		});
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("renders form and UI elements", () => {
		render(<SignInPage />);
		expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
		expect(screen.getByText(/register here/i)).toBeInTheDocument();
	});

	it("shows validation errors if fields are empty", async () => {
		render(<SignInPage />);
		fireEvent.click(screen.getByRole("button", { name: /login/i }));
		await waitFor(() => {
			expect(screen.getByText(/email is required/i)).toBeInTheDocument();
			expect(screen.getByText(/password is required/i)).toBeInTheDocument();
		});
	});

	it("shows error if email is invalid", async () => {
		render(<SignInPage />);
		const emailInput = screen.getByLabelText(/email/i);
		fireEvent.input(emailInput, { target: { value: "invalid@123" } });
		fireEvent.blur(emailInput);
		fireEvent.click(screen.getByRole("button", { name: /login/i }));
		await waitFor(() => {
			expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
		});
	});

	it("shows error if password is too short", async () => {
		render(<SignInPage />);
		fireEvent.input(screen.getByLabelText(/email/i), {
			target: { value: "test@example.com" },
		});
		fireEvent.input(screen.getByLabelText(/password/i), {
			target: { value: "123" },
		});
		fireEvent.click(screen.getByRole("button", { name: /login/i }));
		await waitFor(() => {
			expect(
				screen.getByText(/password must be at least 6 characters/i)
			).toBeInTheDocument();
		});
	});

	it("calls fetchUser and setUser on valid login", async () => {
		const setUser = jest.fn();
		const user = { email: "test@example.com", password: "123456" };
		const mutateAsync = jest.fn((email, { onSuccess }) => onSuccess(user));
		mockedUseUserStore.mockImplementation((cb) => cb({ setUser }));
		mockedUseGetUser.mockReturnValue({ mutateAsync, isPending: false });
		render(<SignInPage />);
		fireEvent.input(screen.getByLabelText(/email/i), {
			target: { value: user.email },
		});
		fireEvent.input(screen.getByLabelText(/password/i), {
			target: { value: user.password },
		});
		fireEvent.click(screen.getByRole("button", { name: /login/i }));
		await waitFor(() => {
			expect(mutateAsync).toHaveBeenCalledWith(user.email, expect.any(Object));
			expect(setUser).toHaveBeenCalledWith(user);
		});
	});

	it("shows error if password is incorrect", async () => {
		const setUser = jest.fn();
		const user = { email: "test@example.com", password: "correctpass" };
		const mutateAsync = jest.fn((email, { onSuccess }) => onSuccess(user));
		mockedUseUserStore.mockImplementation((cb) => cb({ setUser }));
		mockedUseGetUser.mockReturnValue({ mutateAsync, isPending: false });
		render(<SignInPage />);
		fireEvent.input(screen.getByLabelText(/email/i), {
			target: { value: user.email },
		});
		fireEvent.input(screen.getByLabelText(/password/i), {
			target: { value: "wrongpass" },
		});
		fireEvent.click(screen.getByRole("button", { name: /login/i }));
		await waitFor(() => {
			expect(
				screen.getByText(/invalid email or password/i)
			).toBeInTheDocument();
			expect(setUser).not.toHaveBeenCalled();
		});
	});

	it("matches snapshot", () => {
		const { container } = render(<SignInPage />);
		expect(container).toMatchSnapshot();
	});
});
