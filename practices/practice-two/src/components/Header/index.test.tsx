import { render, screen, fireEvent } from "@/helpers/test-utils";
import Header from ".";
import { MemoryRouter } from "react-router-dom";
import { useSearchFilterStore, useSearchStore, useUserStore } from "@/stores";

jest.mock("@/hooks", () => ({
	useCurrentUser: () => ({
		fullName: "Test User",
		avatarUrl: "https://example.com/avatar.png",
	}),
}));

jest.mock("@/stores", () => {
	const actual = jest.requireActual("@/stores");
	return {
		...actual,
		useUserStore: jest.fn(),
		useSearchFilterStore: jest.fn(),
		useSearchStore: jest.fn(),
	};
});

const mockedUseUserStore = useUserStore as unknown as jest.Mock;
const mockedFilterStore = useSearchFilterStore as unknown as jest.Mock;
const mockedSearchStore = useSearchStore as unknown as jest.Mock;

describe("Header", () => {
	beforeEach(() => {
		mockedUseUserStore.mockImplementation((cb) => cb({ logout: jest.fn() }));
		mockedFilterStore.mockImplementation((cb) =>
			cb({
				selectedFilter: "all",
				setSelectedFilter: jest.fn(),
			})
		);
		mockedSearchStore.mockImplementation((cb) =>
			cb({
				setSearchTerm: jest.fn(),
				searchTerm: "",
				setSearchFromSidebar: jest.fn(),
				valueSearch: "",
				setValueSearch: jest.fn(),
			})
		);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("renders search bar and user profile", () => {
		render(
			<MemoryRouter>
				<Header />
			</MemoryRouter>
		);
		expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
		expect(screen.getByText(/test user/i)).toBeInTheDocument();
		expect(screen.getByTestId("filter-btn")).toBeInTheDocument();
		expect(screen.getByTestId("profile-btn")).toBeInTheDocument();
	});

	it("opens filter dropdown when filter button is clicked", () => {
		render(
			<MemoryRouter>
				<Header />
			</MemoryRouter>
		);
		const filterBtn = screen.getByTestId("filter-btn");
		fireEvent.click(filterBtn);
		expect(screen.getByRole("listbox")).toBeInTheDocument();
	});

	it("opens profile dropdown when profile button is clicked", () => {
		render(
			<MemoryRouter>
				<Header />
			</MemoryRouter>
		);
		const profileBtn = screen.getByTestId("profile-btn");
		fireEvent.click(profileBtn);
		expect(screen.getByRole("listbox")).toBeInTheDocument();
	});

	it("matches snapshot", () => {
		const { container } = render(
			<MemoryRouter>
				<Header />
			</MemoryRouter>
		);
		expect(container).toMatchSnapshot();
	});

	it("calls logout and navigates to login when selecting logout in profile menu", () => {
		const logout = jest.fn();
		mockedUseUserStore.mockImplementation((cb) => cb({ logout }));
		render(
			<MemoryRouter>
				<Header />
			</MemoryRouter>
		);
		const profileBtn = screen.getByTestId("profile-btn");
		fireEvent.click(profileBtn);
		// Find the logout option in the dropdown and click it
		const logoutOption = screen.getByText(/logout/i, { selector: "li" });
		fireEvent.click(logoutOption);
		expect(logout).toHaveBeenCalled();
	});
});
