import { render, screen, fireEvent } from "@/helpers/test-utils";
import SearchPage from ".";
import { MemoryRouter } from "react-router-dom";
import { MOCK_BOOKS, MOCK_FAVOURITES, MOCK_SHELVES } from "@/__mocks__/book";
import { MOCK_USER } from "@/__mocks__/user";
import {
	useBookStore,
	useUserStore,
	useSearchStore,
	useSearchFilterStore,
	usePendingFavouritesStore,
	useFavouritesStore,
} from "@/stores";
import {
	useFetchBooks,
	useFetchFavourites,
	useGetMyShelf,
	useAddFavouriteItem,
	useRemoveFavouriteItem,
} from "@/hooks";

jest.mock("@/stores", () => ({
	useBookStore: jest.fn(),
	useUserStore: jest.fn(),
	useSearchStore: jest.fn(),
	useSearchFilterStore: jest.fn(),
	usePendingFavouritesStore: jest.fn(),
	useFavouritesStore: jest.fn(),
}));
jest.mock("@/hooks", () => ({
	useFetchBooks: jest.fn(),
	useFetchFavourites: jest.fn(),
	useGetMyShelf: jest.fn(),
	useAddFavouriteItem: jest.fn(),
	useRemoveFavouriteItem: jest.fn(),
}));

const mockedUseBookStore = useBookStore as unknown as jest.Mock;
const mockedUseUserStore = useUserStore as unknown as jest.Mock;
const mockedUseSearchStore = useSearchStore as unknown as jest.Mock;
const mockedUseFilterStore = useSearchFilterStore as unknown as jest.Mock;
const mockedUsePendingFavouritesStore =
	usePendingFavouritesStore as unknown as jest.Mock;
const mockedUseFetchBooks = useFetchBooks as jest.Mock;
const mockedUseFetchFavourites = useFetchFavourites as jest.Mock;
const mockedUseGetMyShelf = useGetMyShelf as jest.Mock;
const mockedUseAddFavouriteItem = useAddFavouriteItem as jest.Mock;
const mockedUseRemoveFavouriteItem = useRemoveFavouriteItem as jest.Mock;
const mockedUseFavouritesStore = useFavouritesStore as unknown as jest.Mock;

describe("SearchPage", () => {
	beforeEach(() => {
		mockedUseFetchBooks.mockReturnValue({
			books: [],
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseFetchFavourites.mockReturnValue({
			isError: false,
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
		mockedUseGetMyShelf.mockReturnValue({ data: [] });
		mockedUseAddFavouriteItem.mockReturnValue({ mutate: jest.fn() });
		mockedUseRemoveFavouriteItem.mockReturnValue({ mutate: jest.fn() });
		mockedUseFavouritesStore.mockImplementation((cb) =>
			cb({ favourites: [], setFavourites: jest.fn() })
		);
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
		mockedUseFetchFavourites.mockReturnValue({
			isError: true,
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
		mockedUseFavouritesStore.mockImplementation((cb) =>
			cb({ favourites: [], setFavourites: jest.fn() })
		);
		render(
			<MemoryRouter>
				<SearchPage />
			</MemoryRouter>
		);
		expect(screen.getByText(/don't make me think/i)).toBeInTheDocument();
	});

	it("calls addFavourite and updates favourites when favorite button clicked", () => {
		const mutate = jest.fn((item, options) => {
			if (options && options.onSuccess) {
				options.onSuccess();
			}
		});
		const setFavouritesMock = jest.fn();
		mockedUseFetchBooks.mockReturnValue({
			books: MOCK_BOOKS,
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseFavouritesStore.mockImplementation((cb) =>
			cb({ favourites: [], setFavourites: setFavouritesMock })
		);
		mockedUseAddFavouriteItem.mockReturnValue({ mutate });
		render(
			<MemoryRouter>
				<SearchPage />
			</MemoryRouter>
		);
		const favButtons = screen.getAllByRole("button");
		fireEvent.click(favButtons[0]);
		expect(mutate).toHaveBeenCalled();
		expect(setFavouritesMock).toHaveBeenCalled();
	});

	it("calls removeFavourite and updates favourites when favorite button clicked if already favorite", () => {
		const mutate = jest.fn((item, options) => {
			if (options && options.onSuccess) {
				options.onSuccess();
			}
		});
		const setFavouritesMock = jest.fn();
		mockedUseFetchBooks.mockReturnValue({
			books: MOCK_BOOKS,
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseFavouritesStore.mockImplementation((cb) =>
			cb({ favourites: MOCK_FAVOURITES, setFavourites: setFavouritesMock })
		);
		mockedUseRemoveFavouriteItem.mockReturnValue({ mutate });
		render(
			<MemoryRouter>
				<SearchPage />
			</MemoryRouter>
		);
		const favButtons = screen.getAllByRole("button");
		fireEvent.click(favButtons[0]);
		expect(mutate).toHaveBeenCalled();
		expect(setFavouritesMock).toHaveBeenCalled();
	});

	it("matches snapshot", () => {
		mockedUseFetchBooks.mockReturnValue({
			books: MOCK_BOOKS,
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseFavouritesStore.mockImplementation((cb) =>
			cb({ favourites: MOCK_FAVOURITES, setFavourites: jest.fn() })
		);
		mockedUseGetMyShelf.mockReturnValue({ data: MOCK_SHELVES });
		const { container } = render(
			<MemoryRouter>
				<SearchPage />
			</MemoryRouter>
		);
		expect(container).toMatchSnapshot();
	});
});
