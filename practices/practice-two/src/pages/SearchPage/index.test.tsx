import { render, screen, fireEvent } from "@/helpers/test-utils";
import SearchPage from ".";
import { MemoryRouter } from "react-router-dom";
import { MOCK_BOOKS, MOCK_FAVOURITES, MOCK_SHELVES } from "@/__mocks__/book";
import { MOCK_USER } from "@/__mocks__/user";
import {
	useBookStore,
	useUserStore,
	useSearchStore,
	useFilterStore,
	usePendingFavouritesStore,
} from "@/stores";
import {
	useFetchBooks,
	useGetFavourites,
	useGetMyShelf,
	useAddFavouriteItem,
	useRemoveFavouriteItem,
} from "@/hooks";

jest.mock("@/stores", () => ({
	useBookStore: jest.fn(),
	useUserStore: jest.fn(),
	useSearchStore: jest.fn(),
	useFilterStore: jest.fn(),
	usePendingFavouritesStore: jest.fn(),
}));
jest.mock("@/hooks", () => ({
	useFetchBooks: jest.fn(),
	useGetFavourites: jest.fn(),
	useGetMyShelf: jest.fn(),
	useAddFavouriteItem: jest.fn(),
	useRemoveFavouriteItem: jest.fn(),
}));

const mockedUseBookStore = useBookStore as unknown as jest.Mock;
const mockedUseUserStore = useUserStore as unknown as jest.Mock;
const mockedUseSearchStore = useSearchStore as unknown as jest.Mock;
const mockedUseFilterStore = useFilterStore as unknown as jest.Mock;
const mockedUsePendingFavouritesStore =
	usePendingFavouritesStore as unknown as jest.Mock;
const mockedUseFetchBooks = useFetchBooks as jest.Mock;
const mockedUseGetFavourites = useGetFavourites as jest.Mock;
const mockedUseGetMyShelf = useGetMyShelf as jest.Mock;
const mockedUseAddFavouriteItem = useAddFavouriteItem as jest.Mock;
const mockedUseRemoveFavouriteItem = useRemoveFavouriteItem as jest.Mock;

describe("SearchPage", () => {
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
		mockedUseSearchStore.mockImplementation((cb) =>
			cb({ searchFromSidebar: false, searchTerm: "" })
		);
		mockedUseFilterStore.mockImplementation((cb) =>
			cb({ selectedFilter: "Title" })
		);
		mockedUsePendingFavouritesStore.mockImplementation((cb) =>
			cb({ pendingFavouritesActions: [] })
		);
		mockedUseGetFavourites.mockReturnValue({ data: [] });
		mockedUseGetMyShelf.mockReturnValue({ data: [] });
		mockedUseAddFavouriteItem.mockReturnValue({ mutate: jest.fn() });
		mockedUseRemoveFavouriteItem.mockReturnValue({ mutate: jest.fn() });
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
				<SearchPage />
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
				<SearchPage />
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
				<SearchPage />
			</MemoryRouter>
		);
		expect(screen.getByText(/no books available/i)).toBeInTheDocument();
	});

	it("shows no books found if search yields nothing", () => {
		mockedUseFetchBooks.mockReturnValue({
			books: MOCK_BOOKS,
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseSearchStore.mockImplementation((cb) =>
			cb({ searchFromSidebar: false, searchTerm: "notfound" })
		);
		render(
			<MemoryRouter>
				<SearchPage />
			</MemoryRouter>
		);
		expect(screen.getByText(/no books found/i)).toBeInTheDocument();
	});

	it("renders filtered books list", () => {
		mockedUseFetchBooks.mockReturnValue({
			books: MOCK_BOOKS,
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseSearchStore.mockImplementation((cb) =>
			cb({ searchFromSidebar: false, searchTerm: "think" })
		);
		render(
			<MemoryRouter>
				<SearchPage />
			</MemoryRouter>
		);
		expect(screen.getByText(/don't make me think/i)).toBeInTheDocument();
	});

	it("calls addFavourite when favorite button clicked", () => {
		const mutate = jest.fn();
		mockedUseFetchBooks.mockReturnValue({
			books: MOCK_BOOKS,
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseGetFavourites.mockReturnValue({ data: [] });
		mockedUseAddFavouriteItem.mockReturnValue({ mutate });
		render(
			<MemoryRouter>
				<SearchPage />
			</MemoryRouter>
		);
		const favButtons = screen.getAllByRole("button");
		fireEvent.click(favButtons[0]);
		expect(mutate).toHaveBeenCalled();
	});

	it("calls removeFavourite when favorite button clicked if already favorite", () => {
		const mutate = jest.fn();
		mockedUseFetchBooks.mockReturnValue({
			books: MOCK_BOOKS,
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseGetFavourites.mockReturnValue({ data: MOCK_FAVOURITES });
		mockedUseRemoveFavouriteItem.mockReturnValue({ mutate });
		render(
			<MemoryRouter>
				<SearchPage />
			</MemoryRouter>
		);
		const favButtons = screen.getAllByRole("button");
		fireEvent.click(favButtons[0]);
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
		mockedUseGetFavourites.mockReturnValue({ data: MOCK_FAVOURITES });
		mockedUseGetMyShelf.mockReturnValue({ data: MOCK_SHELVES });
		const { container } = render(
			<MemoryRouter>
				<SearchPage />
			</MemoryRouter>
		);
		expect(container).toMatchSnapshot();
	});
});
