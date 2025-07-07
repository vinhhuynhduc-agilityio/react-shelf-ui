import { render, screen, fireEvent, waitFor } from "@/helpers/test-utils";
import AccountSettingPage from ".";
import { MemoryRouter } from "react-router-dom";
import { useUpdateUser } from "@/hooks";
import { useUserStore } from "@/stores";

jest.mock("@/hooks", () => ({
	useUpdateUser: jest.fn(),
}));
jest.mock("@/stores", () => ({
	useUserStore: jest.fn(),
}));

const mockedUseUpdateUser = useUpdateUser as jest.Mock;
const mockedUseUserStore = useUserStore as unknown as jest.Mock;

const mockUser = {
	fullName: "Test User",
	email: "test@college.com",
	registerNumber: "1234567",
	countryCode: "+84",
	phoneNumber: "123456789",
	bio: "Hello!",
	avatarUrl: "",
};

describe("AccountSettingPage", () => {
	beforeEach(() => {
		mockedUseUserStore.mockImplementation((cb) =>
			cb({ currentUser: mockUser })
		);
		mockedUseUpdateUser.mockReturnValue({
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
				<AccountSettingPage />
			</MemoryRouter>
		);
		expect(screen.getByText(/account setting/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/college email id/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/register number/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /update profile/i })
		).toBeInTheDocument();
	});

	it("shows validation errors if fields are empty and submit is clicked", async () => {
		render(
			<MemoryRouter>
				<AccountSettingPage />
			</MemoryRouter>
		);
		fireEvent.click(screen.getByTestId("edit-profile-btn"));
		await waitFor(() => {
			expect(screen.getByLabelText(/full name/i)).not.toBeDisabled();
		});
		fireEvent.change(screen.getByLabelText(/full name/i), {
			target: { value: "" },
		});
		fireEvent.change(screen.getByLabelText(/college email id/i), {
			target: { value: "" },
		});
		fireEvent.change(screen.getByLabelText(/register number/i), {
			target: { value: "" },
		});
		fireEvent.click(screen.getByRole("button", { name: /update profile/i }));
		await waitFor(() => {
			expect(
				screen.getAllByText(/full name is required/i).length
			).toBeGreaterThanOrEqual(1);
			expect(
				screen.getAllByText(/email is required/i).length
			).toBeGreaterThanOrEqual(1);
			expect(
				screen.getAllByText(/register number is required/i).length
			).toBeGreaterThanOrEqual(1);
		});
	});

	it("shows error if email is invalid", async () => {
		render(
			<MemoryRouter>
				<AccountSettingPage />
			</MemoryRouter>
		);
		fireEvent.click(screen.getByTestId("edit-profile-btn"));
		await waitFor(() => {
			expect(screen.getByLabelText(/college email id/i)).not.toBeDisabled();
		});
		const emailInput = screen.getByLabelText(/college email id/i);
		fireEvent.change(emailInput, {
			target: { value: "invalid@123" },
		});
		fireEvent.blur(emailInput);
		fireEvent.click(screen.getByRole("button", { name: /update profile/i }));
		await waitFor(() => {
			expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
		});
	});

	it("shows error if full name is too short", async () => {
		render(
			<MemoryRouter>
				<AccountSettingPage />
			</MemoryRouter>
		);
		fireEvent.click(screen.getByTestId("edit-profile-btn"));
		await waitFor(() => {
			expect(screen.getByLabelText(/full name/i)).not.toBeDisabled();
		});
		const fullNameInput = screen.getByLabelText(/full name/i);
		fireEvent.change(fullNameInput, {
			target: { value: "A" },
		});
		fireEvent.blur(fullNameInput);
		fireEvent.click(screen.getByRole("button", { name: /update profile/i }));
		await waitFor(() => {
			expect(
				screen.getByText(/full name must be at least 3 characters long/i)
			).toBeInTheDocument();
		});
	});

	it("calls updateUser on valid submit", async () => {
		const mutate = jest.fn();
		mockedUseUpdateUser.mockReturnValue({ mutate, isPending: false });
		render(
			<MemoryRouter>
				<AccountSettingPage />
			</MemoryRouter>
		);
		fireEvent.click(screen.getByTestId("edit-profile-btn"));
		await waitFor(() => {
			expect(screen.getByLabelText(/full name/i)).not.toBeDisabled();
		});
		const fullNameInput2 = screen.getByLabelText(/full name/i);
		fireEvent.change(fullNameInput2, {
			target: { value: "New Name" },
		});
		fireEvent.blur(fullNameInput2);
		const emailInput2 = screen.getByLabelText(/college email id/i);
		fireEvent.change(emailInput2, {
			target: { value: "new@college.com" },
		});
		fireEvent.blur(emailInput2);
		const regNumInput = screen.getByLabelText(/register number/i);
		fireEvent.change(regNumInput, {
			target: { value: "7654321" },
		});
		fireEvent.blur(regNumInput);
		const bioInput = screen.getByLabelText(/bio/i);
		fireEvent.change(bioInput, {
			target: { value: "New bio" },
		});
		fireEvent.blur(bioInput);
		// Fill phone number fields if required
		const countryCodeInput = screen.getByTestId("country-code-input");
		fireEvent.change(countryCodeInput, { target: { value: "84" } });
		fireEvent.blur(countryCodeInput);
		const phoneInput = screen.getByTestId("phone-number-input");
		fireEvent.change(phoneInput, { target: { value: "1234567" } });
		fireEvent.blur(phoneInput);
		fireEvent.click(screen.getByRole("button", { name: /update profile/i }));
		await waitFor(() => {
			expect(mutate).toHaveBeenCalled();
		});
	});

	it("matches snapshot", () => {
		const { container } = render(
			<MemoryRouter>
				<AccountSettingPage />
			</MemoryRouter>
		);
		expect(container).toMatchSnapshot();
	});
});
