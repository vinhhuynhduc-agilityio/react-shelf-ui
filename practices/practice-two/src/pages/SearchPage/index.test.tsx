import { render, screen } from "@/helpers/test-utils";
import SearchPage from ".";
import { MemoryRouter } from "react-router-dom";
import { MOCK_BOOKS } from "@/__mocks__/book";
import { MOCK_USER } from "@/__mocks__/user";
import {
	useBookStore,
	useUserStore,
	useSearchStore,
	useSearchFilterStore,
	usePendingFavouritesStore,
	useFavouritesStore,
	useFavouritesChangedStore,
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
	useFavouritesChangedStore: jest.fn(),
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
const mockedUseFavouritesChangedStore =
	useFavouritesChangedStore as unknown as jest.Mock;

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
		mockedUseFavouritesChangedStore.mockImplementation((cb) =>
			cb({ favouritesChanged: false, setFavouritesChanged: jest.fn() })
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
});
