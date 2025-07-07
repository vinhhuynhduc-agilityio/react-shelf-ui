import { render, screen, fireEvent } from "@/helpers/test-utils";
import MyShelfPage from ".";
import { MOCK_BOOKS, MOCK_SHELVES } from "@/__mocks__/book";
import { MemoryRouter } from "react-router-dom";
import { MOCK_USER } from "@/__mocks__/user";
import { useBookStore, useUserStore, usePendingShelfStore } from "@/stores";
import { useFetchBooks, useGetMyShelf, useRemoveShelfItem } from "@/hooks";

jest.mock("@/stores", () => ({
	useBookStore: jest.fn(),
	useUserStore: jest.fn(),
	usePendingShelfStore: jest.fn(),
}));
jest.mock("@/hooks", () => ({
	useFetchBooks: jest.fn(),
	useGetMyShelf: jest.fn(),
	useRemoveShelfItem: jest.fn(),
}));

const mockedUseBookStore = useBookStore as unknown as jest.Mock;
const mockedUseUserStore = useUserStore as unknown as jest.Mock;
const mockedUsePendingShelfStore = usePendingShelfStore as unknown as jest.Mock;
const mockedUseFetchBooks = useFetchBooks as jest.Mock;
const mockedUseGetMyShelf = useGetMyShelf as jest.Mock;
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
		mockedUseGetMyShelf.mockReturnValue({ data: [] });
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
		mockedUseGetMyShelf.mockReturnValue({ data: [] });
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
		mockedUseGetMyShelf.mockReturnValue({ data: MOCK_SHELVES });
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

	it("calls removeShelfItem when return clicked", () => {
		const mutate = jest.fn();
		mockedUseFetchBooks.mockReturnValue({
			books: MOCK_BOOKS,
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseGetMyShelf.mockReturnValue({ data: MOCK_SHELVES });
		mockedUseRemoveShelfItem.mockReturnValue({ mutate });
		render(
			<MemoryRouter>
				<MyShelfPage />
			</MemoryRouter>
		);
		const returnButtons = screen.getAllByRole("button", { name: /return/i });
		fireEvent.click(returnButtons[0]);
		expect(mutate).toHaveBeenCalled();
	});

	it("matches snapshot", () => {
		mockedUseFetchBooks.mockReturnValue({
			books: MOCK_BOOKS,
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseGetMyShelf.mockReturnValue({ data: MOCK_SHELVES });
		const { container } = render(
			<MemoryRouter>
				<MyShelfPage />
			</MemoryRouter>
		);
		expect(container).toMatchSnapshot();
	});
});
