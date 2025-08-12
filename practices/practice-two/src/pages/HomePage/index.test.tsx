import { screen, render } from "@/components/Test/test-utils";
import HomePage from ".";
import { useUserStore } from "@/stores";
import { useBooksQuery, useGetMyShelf } from "@/hooks";
import { MOCK_BOOKS, MOCK_SHELVES } from "@/__mocks__/book";
import { MOCK_USER } from "@/__mocks__/user";

jest.mock("@/hooks", () => ({
  useBooksQuery: jest.fn(),
  useGetMyShelf: jest.fn(),
}));

jest.mock("@/stores", () => ({
  useUserStore: jest.fn(),
}));

const mockBooks = MOCK_BOOKS;
const mockUser = MOCK_USER;
const mockShelf = MOCK_SHELVES;

const mockedUseBooksQuery = useBooksQuery as jest.Mock;
const mockedUseGetMyShelf = useGetMyShelf as jest.Mock;
const mockedUseUserStore = useUserStore as unknown as jest.Mock;

describe("HomePage", () => {
  beforeEach(() => {
    mockedUseGetMyShelf.mockReturnValue({ data: [], isLoading: false });
    mockedUseBooksQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });
    mockedUseUserStore.mockImplementation(() => ({ currentUser: mockUser }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows error when error", () => {
    mockedUseBooksQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      error: { message: "fail" },
    });
    mockedUseGetMyShelf.mockReturnValue({ data: [], isLoading: false });
    render(<HomePage />);
    const errorElements = screen.getAllByText(/Failed to load books data/i);
    expect(errorElements).toHaveLength(2);
  });

  it("shows loading state for recent readings", () => {
    mockedUseBooksQuery.mockReturnValue({
      data: mockBooks,
      isLoading: false,
      isError: false,
      error: null,
    });
    mockedUseGetMyShelf.mockReturnValue({ data: mockShelf, isLoading: true });
    render(<HomePage />);
    expect(screen.getByText(/Recent Readings/i)).toBeInTheDocument();
  });

  it("renders TodayQuote component", () => {
    mockedUseBooksQuery.mockReturnValue({
      data: mockBooks,
      isLoading: false,
      isError: false,
      error: null,
    });
    mockedUseGetMyShelf.mockReturnValue({ data: mockShelf, isLoading: false });
    render(<HomePage />);
    expect(screen.getByText(/good morning/i)).toBeInTheDocument();
  });

  it("renders recommended and recent readings", () => {
    mockedUseBooksQuery.mockReturnValue({
      data: mockBooks,
      isLoading: false,
      isError: false,
      error: null,
    });
    mockedUseGetMyShelf.mockReturnValue({ data: mockShelf, isLoading: false });
    render(<HomePage />);
    expect(screen.getByText(/good morning/i)).toBeInTheDocument();
    expect(screen.getByText(/Recommended for You/i)).toBeInTheDocument();
    expect(screen.getByText(/Recent Readings/i)).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    mockedUseBooksQuery.mockReturnValue({
      data: mockBooks,
      isLoading: false,
      isError: false,
      error: null,
    });
    mockedUseGetMyShelf.mockReturnValue({ data: mockShelf, isLoading: false });
    const { container } = render(<HomePage />);
    expect(container).toMatchSnapshot();
  });
});
