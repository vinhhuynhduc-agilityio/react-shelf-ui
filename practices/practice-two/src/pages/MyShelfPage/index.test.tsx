import { render, screen, fireEvent } from "@/helpers/test-utils";
import MyShelfPage from ".";
import { MOCK_BOOKS, MOCK_SHELVES } from "@/__mocks__/book";
import { MemoryRouter } from "react-router-dom";
import { MOCK_USER } from "@/__mocks__/user";
import {
	useBookStore,
	useUserStore,
	usePendingShelfStore,
	useShelfStore,
	useShelfChangedStore,
} from "@/stores";
import { useFetchBooks, useFetchMySHelf, useRemoveShelfItem } from "@/hooks";

jest.mock("@/stores", () => ({
	useBookStore: jest.fn(),
	useUserStore: jest.fn(),
	usePendingShelfStore: jest.fn(),
	useShelfStore: jest.fn(),
	useShelfChangedStore: jest.fn(),
}));
jest.mock("@/hooks", () => ({
	useFetchBooks: jest.fn(),
	useFetchMySHelf: jest.fn(),
	useRemoveShelfItem: jest.fn(),
}));

const mockedUseBookStore = useBookStore as unknown as jest.Mock;
const mockedUseUserStore = useUserStore as unknown as jest.Mock;
const mockedUsePendingShelfStore = usePendingShelfStore as unknown as jest.Mock;
const mockedUseShelfStore = useShelfStore as unknown as jest.Mock;
const mockedUseShelfChangedStore = useShelfChangedStore as unknown as jest.Mock;
const mockedUseFetchBooks = useFetchBooks as jest.Mock;
const mockedUseFetchMySHelf = useFetchMySHelf as jest.Mock;
const mockedUseRemoveShelfItem = useRemoveShelfItem as jest.Mock;

describe("MyShelfPage", () => {
	beforeEach(() => {
		mockedUseFetchBooks.mockReturnValue({
			books: [],
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: [] }));
		mockedUseUserStore.mockImplementation((cb) =>
			cb({ currentUser: MOCK_USER })
		);
		mockedUsePendingShelfStore.mockReturnValue({ pendingShelfActions: [] });
		mockedUseShelfStore.mockReturnValue({ shelf: [], setShelf: jest.fn() });
		mockedUseShelfChangedStore.mockReturnValue({
			shelfChanged: false,
			setShelfChanged: jest.fn(),
		});
		mockedUseFetchMySHelf.mockReturnValue({
			isError: false,
			isFetching: false,
		});
		mockedUseRemoveShelfItem.mockReturnValue({ mutate: jest.fn() });
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("shows loading when loading and no books", () => {
		mockedUseFetchBooks.mockReturnValue({
			books: [],
			isLoading: true,
			isError: false,
			error: null,
		});
		mockedUseFetchMySHelf.mockReturnValue({ isError: false, isFetching: true });
		render(
			<MemoryRouter>
				<MyShelfPage />
			</MemoryRouter>
		);
		expect(screen.getByText(/loading books/i)).toBeInTheDocument();
	});

	it("shows error when error", () => {
		mockedUseFetchBooks.mockReturnValue({
			books: [],
			isLoading: false,
			isError: true,
			error: { message: "fail" },
		});
		mockedUseFetchMySHelf.mockReturnValue({ isError: true, isFetching: false });
		render(
			<MemoryRouter>
				<MyShelfPage />
			</MemoryRouter>
		);
		expect(screen.getByText(/error loading books/i)).toBeInTheDocument();
		expect(screen.getByText(/fail/)).toBeInTheDocument();
	});

	it("shows no books available if none", () => {
		mockedUseFetchBooks.mockReturnValue({
			books: [],
			isLoading: false,
			isError: false,
			error: null,
		});
		render(
			<MemoryRouter>
				<MyShelfPage />
			</MemoryRouter>
		);
		expect(screen.getByText(/no books available/i)).toBeInTheDocument();
	});

	it("shows no books in your shelf if none", () => {
		mockedUseFetchBooks.mockReturnValue({
			books: MOCK_BOOKS,
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseShelfStore.mockReturnValue({ shelf: [], setShelf: jest.fn() });
		render(
			<MemoryRouter>
				<MyShelfPage />
			</MemoryRouter>
		);
		expect(screen.getByText(/no books in your shelf/i)).toBeInTheDocument();
	});

	it("renders shelf books list", () => {
		mockedUseFetchBooks.mockReturnValue({
			books: MOCK_BOOKS,
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseShelfStore.mockReturnValue({
			shelf: MOCK_SHELVES,
			setShelf: jest.fn(),
		});
		render(
			<MemoryRouter>
				<MyShelfPage />
			</MemoryRouter>
		);
		const headings = screen.getAllByText(
			(_, node) => node?.textContent === "Your Shelf"
		);
		expect(headings.length).toBeGreaterThan(0);
		MOCK_SHELVES.forEach((shelf) => {
			const book = MOCK_BOOKS.find((b) => b.id === shelf.bookId);
			if (book) {
				expect(screen.getByText(book.title)).toBeInTheDocument();
			}
		});
	});

	it("calls removeShelfItem and updates shelf when return clicked", () => {
		const setShelf = jest.fn();
		const setShelfChanged = jest.fn();
		const mutate = jest.fn((item, options) => {
			if (options && options.onSuccess) {
				options.onSuccess();
			}
		});
		mockedUseFetchBooks.mockReturnValue({
			books: MOCK_BOOKS,
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseShelfStore.mockReturnValue({ shelf: MOCK_SHELVES, setShelf });
		mockedUseShelfChangedStore.mockReturnValue({
			shelfChanged: false,
			setShelfChanged,
		});
		mockedUseRemoveShelfItem.mockReturnValue({ mutate });
		render(
			<MemoryRouter>
				<MyShelfPage />
			</MemoryRouter>
		);
		const returnButtons = screen.getAllByRole("button", { name: /return/i });
		fireEvent.click(returnButtons[0]);
		expect(mutate).toHaveBeenCalled();
		expect(setShelf).toHaveBeenCalled();
		expect(setShelfChanged).toHaveBeenCalledWith(true);
	});

	it("matches snapshot", () => {
		mockedUseFetchBooks.mockReturnValue({
			books: MOCK_BOOKS,
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseShelfStore.mockReturnValue({
			shelf: MOCK_SHELVES,
			setShelf: jest.fn(),
		});
		const { container } = render(
			<MemoryRouter>
				<MyShelfPage />
			</MemoryRouter>
		);
		expect(container).toMatchSnapshot();
	});
});
