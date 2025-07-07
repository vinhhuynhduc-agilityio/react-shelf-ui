import { screen, render } from "@/helpers/test-utils";
import HomePage from ".";
import { useBookStore, useUserStore } from "@/stores";
import { useFetchBooks, useGetMyShelf } from "@/hooks";
import { queryClient } from "@/services/queryClient";
import { MOCK_BOOKS, MOCK_SHELVES } from "@/__mocks__/book";
import { MOCK_USER } from "@/__mocks__/user";

jest.mock("@/hooks", () => ({
	useFetchBooks: jest.fn(),
	useGetMyShelf: jest.fn(),
}));

jest.mock("@/stores", () => ({
	useBookStore: jest.fn(),
	useUserStore: jest.fn(),
}));

const mockBooks = MOCK_BOOKS;
const mockUser = MOCK_USER;
const mockShelf = MOCK_SHELVES;

const mockedUseFetchBooks = useFetchBooks as jest.Mock;
const mockedUseGetMyShelf = useGetMyShelf as jest.Mock;
const mockedUseBookStore = useBookStore as unknown as jest.Mock;
const mockedUseUserStore = useUserStore as unknown as jest.Mock;

describe("HomePage", () => {
	afterEach(() => {
		queryClient.clear(); // Reset cache
		jest.clearAllMocks();
	});

	it("shows loading when loading and no books", () => {
		mockedUseFetchBooks.mockReturnValue({
			isLoading: true,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: [] }));
		mockedUseUserStore.mockImplementation((cb) =>
			cb({ currentUser: mockUser })
		);
		mockedUseGetMyShelf.mockReturnValue({ data: [] });
		render(<HomePage />);
		expect(screen.getByText(/loading books/i)).toBeInTheDocument();
	});

	it("shows error when error", () => {
		mockedUseFetchBooks.mockReturnValue({
			isLoading: false,
			isError: true,
			error: { message: "fail" },
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: [] }));
		mockedUseUserStore.mockImplementation((cb) =>
			cb({ currentUser: mockUser })
		);
		mockedUseGetMyShelf.mockReturnValue({ data: [] });
		render(<HomePage />);
		expect(screen.getByText(/error loading books/i)).toBeInTheDocument();
		expect(screen.getByText(/fail/)).toBeInTheDocument();
	});

	it("shows no books available if books empty", () => {
		mockedUseFetchBooks.mockReturnValue({
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: [] }));
		mockedUseUserStore.mockImplementation((cb) =>
			cb({ currentUser: mockUser })
		);
		mockedUseGetMyShelf.mockReturnValue({ data: [] });
		render(<HomePage />);
		expect(screen.getByText(/no books available/i)).toBeInTheDocument();
	});

	it("renders recommended and recent readings", async () => {
		mockedUseFetchBooks.mockReturnValue({
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: mockBooks }));
		mockedUseUserStore.mockImplementation((cb) =>
			cb({ currentUser: mockUser })
		);
		mockedUseGetMyShelf.mockReturnValue({ data: mockShelf });
		render(<HomePage />);
		expect(screen.getByText(/good morning/i)).toBeInTheDocument();
		expect(screen.getByText(/recommended for you/i)).toBeInTheDocument();
		expect(screen.getByText(/recent readings/i)).toBeInTheDocument();
		expect(
			screen.getAllByText("Don't Make Me Think").length
		).toBeGreaterThanOrEqual(1);
		expect(
			screen.getAllByText("The Design of Everyday Things").length
		).toBeGreaterThanOrEqual(1);
	});

	it("shows no recent readings message if none", () => {
		mockedUseFetchBooks.mockReturnValue({
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: mockBooks }));
		mockedUseUserStore.mockImplementation((cb) =>
			cb({ currentUser: mockUser })
		);
		mockedUseGetMyShelf.mockReturnValue({ data: [] });
		render(<HomePage />);
		expect(
			screen.getByText(/you have no recent readings yet/i)
		).toBeInTheDocument();
	});

	it("matches snapshot", () => {
		mockedUseFetchBooks.mockReturnValue({
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: mockBooks }));
		mockedUseUserStore.mockImplementation((cb) =>
			cb({ currentUser: mockUser })
		);
		mockedUseGetMyShelf.mockReturnValue({ data: mockShelf });
		const { container } = render(<HomePage />);
		expect(container).toMatchSnapshot();
	});
});
