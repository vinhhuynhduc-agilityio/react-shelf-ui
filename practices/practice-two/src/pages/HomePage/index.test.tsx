import { screen, render } from "@/helpers/test-utils";
import HomePage from ".";
import { useBookStore, useShelfStore, useUserStore } from "@/stores";
import { useFetchBooks, useFetchMySHelf } from "@/hooks";
import { queryClient } from "@/services/queryClient";
import { MOCK_BOOKS, MOCK_SHELVES } from "@/__mocks__/book";
import { MOCK_USER } from "@/__mocks__/user";

jest.mock("@/hooks", () => ({
	useFetchBooks: jest.fn(),
	useFetchMySHelf: jest.fn(),
}));

jest.mock("@/stores", () => ({
	useBookStore: jest.fn(),
	useUserStore: jest.fn(),
	useShelfStore: jest.fn(),
}));

const mockBooks = MOCK_BOOKS;
const mockUser = MOCK_USER;
const mockShelf = MOCK_SHELVES;

const mockedUseFetchBooks = useFetchBooks as jest.Mock;
const mockedUseFetchMySHelf = useFetchMySHelf as jest.Mock;
const mockedUseBookStore = useBookStore as unknown as jest.Mock;
const mockedUseUserStore = useUserStore as unknown as jest.Mock;
const mockedUseShelfStore = useShelfStore as unknown as jest.Mock;

describe("HomePage", () => {
	beforeEach(() => {
		mockedUseShelfStore.mockReturnValue({ shelf: [], setShelf: jest.fn() });
		mockedUseFetchMySHelf.mockReturnValue({ isFetching: false });
	});

	afterEach(() => {
		queryClient.clear();
		jest.clearAllMocks();
	});

	it("shows error when error", () => {
		mockedUseFetchBooks.mockReturnValue({
			isLoading: false,
			isError: true,
			error: { message: "fail" },
		});
		mockedUseFetchMySHelf.mockReturnValue({ isFetching: false });
		mockedUseBookStore.mockImplementation((cb) => cb({ books: [] }));
		mockedUseUserStore.mockImplementation((cb) =>
			cb({ currentUser: mockUser })
		);
		mockedUseShelfStore.mockReturnValue({ shelf: [], setShelf: jest.fn() });
		render(<HomePage />);
		expect(
			screen.getAllByText(/Failed to load books data/i).length
		).toBeGreaterThanOrEqual(1);
	});

	it("shows loading state for recent readings", () => {
		mockedUseFetchBooks.mockReturnValue({
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseFetchMySHelf.mockReturnValue({ isFetching: true });
		mockedUseBookStore.mockImplementation((cb) => cb({ books: mockBooks }));
		mockedUseUserStore.mockImplementation((cb) =>
			cb({ currentUser: mockUser })
		);
		mockedUseShelfStore.mockReturnValue({
			shelf: mockShelf,
			setShelf: jest.fn(),
		});
		render(<HomePage />);
		expect(screen.getByText(/Recent Readings/i)).toBeInTheDocument();
	});

	it("renders TodayQuote component", () => {
		mockedUseFetchBooks.mockReturnValue({
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseFetchMySHelf.mockReturnValue({ isFetching: false });
		mockedUseBookStore.mockImplementation((cb) => cb({ books: mockBooks }));
		mockedUseUserStore.mockImplementation((cb) =>
			cb({ currentUser: mockUser })
		);
		mockedUseShelfStore.mockReturnValue({
			shelf: mockShelf,
			setShelf: jest.fn(),
		});
		render(<HomePage />);
		expect(screen.getByText(/good morning/i)).toBeInTheDocument();
	});

	it("renders recommended and recent readings", () => {
		mockedUseFetchBooks.mockReturnValue({
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseFetchMySHelf.mockReturnValue({ isFetching: false });
		mockedUseBookStore.mockImplementation((cb) => cb({ books: mockBooks }));
		mockedUseUserStore.mockImplementation((cb) =>
			cb({ currentUser: mockUser })
		);
		mockedUseShelfStore.mockReturnValue({
			shelf: mockShelf,
			setShelf: jest.fn(),
		});
		render(<HomePage />);
		expect(screen.getByText(/good morning/i)).toBeInTheDocument();
		expect(
			screen.getAllByAltText(/The Design of Everyday Things/i)[0]
		).toBeInTheDocument();
		expect(screen.getByText(/recent readings/i)).toBeInTheDocument();
	});

	it("matches snapshot", () => {
		mockedUseFetchBooks.mockReturnValue({
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseFetchMySHelf.mockReturnValue({ isFetching: false });
		mockedUseBookStore.mockImplementation((cb) => cb({ books: mockBooks }));
		mockedUseUserStore.mockImplementation((cb) =>
			cb({ currentUser: mockUser })
		);
		mockedUseShelfStore.mockReturnValue({
			shelf: mockShelf,
			setShelf: jest.fn(),
		});
		const { container } = render(<HomePage />);
		expect(container).toMatchSnapshot();
	});
});
