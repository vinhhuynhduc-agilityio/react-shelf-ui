import { render, screen, fireEvent } from "@/helpers/test-utils";
import Header from ".";
import { useSearchStore, useUserStore } from "@/stores";

const navigate = jest.fn();

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
    useSearchStore: jest.fn(),
  };
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => navigate,
}));

const mockedUseUserStore = useUserStore as unknown as jest.Mock;
const mockedSearchStore = useSearchStore as unknown as jest.Mock;

describe("Header", () => {
  beforeEach(() => {
    mockedUseUserStore.mockImplementation(() => ({ logout: jest.fn() }));
    mockedSearchStore.mockImplementation(() => ({
      setSearchTerm: jest.fn(),
      searchTerm: "",
      valueSearch: "",
      setValueSearch: jest.fn(),
      selectedFilter: "all",
      setSelectedFilter: jest.fn(),
    }));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders search bar and user profile", () => {
    render(<Header />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
    expect(screen.getByTestId("filter-btn")).toBeInTheDocument();
    expect(screen.getByTestId("profile-btn")).toBeInTheDocument();
  });

  it("opens filter dropdown when filter button is clicked", () => {
    render(<Header />);
    const filterBtn = screen.getByTestId("filter-btn");
    fireEvent.click(filterBtn);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("opens profile dropdown when profile button is clicked", () => {
    render(<Header />);
    const profileBtn = screen.getByTestId("profile-btn");
    fireEvent.click(profileBtn);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(<Header />);
    expect(container).toMatchSnapshot();
  });

  it("calls logout and navigates to login when selecting logout in profile menu", () => {
    const logout = jest.fn();
    mockedUseUserStore.mockImplementation(() => ({ logout }));
    render(<Header />);
    const profileBtn = screen.getByTestId("profile-btn");
    fireEvent.click(profileBtn);
    // Find the logout option in the dropdown and click it
    const logoutOption = screen.getByText(/logout/i, { selector: "li" });
    fireEvent.click(logoutOption);
    expect(logout).toHaveBeenCalled();
  });

  it("calls setSearchTerm when typing in search bar", async () => {
    const setSearchTerm = jest.fn();
    const setValueSearch = jest.fn();

    mockedSearchStore.mockImplementation(() => ({
      searchTerm: "",
      setSearchTerm,
      valueSearch: "",
      setValueSearch,
    }));

    render(<Header />);

    const input = screen.getByPlaceholderText(/search/i);
    screen.debug(input);
    fireEvent.input(input, { target: { value: "react" } });
    expect(setValueSearch).toHaveBeenCalledWith("react");
  });

  it("calls setSelectedFilter when filter is changed", () => {
    const setSelectedFilter = jest.fn();
    mockedSearchStore.mockImplementation(() => ({
      setSearchTerm: jest.fn(),
      searchTerm: "do",
      selectedFilter: "",
      setSelectedFilter,
      valueSearch: "do",
      setValueSearch: jest.fn(),
    }));

    render(<Header />);
    const filterBtn = screen.getByTestId("filter-btn");
    fireEvent.click(filterBtn);
    const filterOption = screen.getByText(/Title/i, { selector: "li" });
    fireEvent.click(filterOption);

    expect(setSelectedFilter).toHaveBeenCalledWith("Title");
  });

  it("calls handleSearch when pressing Enter in search input", () => {
    const setSearchTerm = jest.fn();
    mockedSearchStore.mockImplementation(() => ({
      setSearchTerm,
      searchTerm: "",
      valueSearch: "react",
      setValueSearch: jest.fn(),
    }));

    render(<Header />);
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.keyDown(input, { key: "Enter" });
    expect(setSearchTerm).toHaveBeenCalledWith("react");
    expect(navigate).toHaveBeenCalledWith("/search");
  });

  it("calls logout and navigates to login when selecting logout in profile menu", () => {
    const logout = jest.fn();
    mockedUseUserStore.mockImplementation(() => ({ logout }));
    render(<Header />);
    const profileBtn = screen.getByTestId("profile-btn");
    fireEvent.click(profileBtn);
    const logoutOption = screen.getByText(/logout/i, { selector: "li" });
    fireEvent.click(logoutOption);
    expect(logout).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith("/login");
  });

  it("navigates to correct page when selecting profile menu option", () => {
    render(<Header />);
    const profileBtn = screen.getByTestId("profile-btn");
    fireEvent.click(profileBtn);
    const option = screen.getByText(/profile/i, { selector: "li" });
    fireEvent.click(option);
    expect(navigate).toHaveBeenCalledWith("/account-setting");
  });
});
