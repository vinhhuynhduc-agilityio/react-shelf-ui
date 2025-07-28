import { render, screen, fireEvent } from "@/helpers/test-utils";
import FavouritePage from ".";
import { MOCK_BOOKS, MOCK_FAVOURITES, MOCK_SHELVES } from "@/__mocks__/book";
import { MOCK_USER } from "@/__mocks__/user";
import {
	useBookStore,
	useUserStore,
	usePendingFavouritesStore,
	useFavouritesStore,
	useFavouritesChangedStore,
} from "@/stores";
import {
	useFetchBooks,
	useFetchFavourites,
	useGetMyShelf,
	useRemoveFavouriteItem,
} from "@/hooks";

jest.mock("@/stores", () => ({
	useBookStore: jest.fn(),
	useUserStore: jest.fn(),
	usePendingFavouritesStore: jest.fn(),
	useFavouritesStore: jest.fn(),
	useFavouritesChangedStore: jest.fn(),
}));
jest.mock("@/hooks", () => ({
	useFetchBooks: jest.fn(),
	useFetchFavourites: jest.fn(),
	useGetMyShelf: jest.fn(),
	useRemoveFavouriteItem: jest.fn(),
}));

const mockedUseBookStore = useBookStore as unknown as jest.Mock;
const mockedUseUserStore = useUserStore as unknown as jest.Mock;
const mockedUsePendingFavouritesStore =
	usePendingFavouritesStore as unknown as jest.Mock;
const mockedUseFavouritesStore = useFavouritesStore as unknown as jest.Mock;
const mockedUseFavouritesChangedStore =
	useFavouritesChangedStore as unknown as jest.Mock;
const mockedUseFetchBooks = useFetchBooks as jest.Mock;
const mockedUseFetchFavourites = useFetchFavourites as jest.Mock;
const mockedUseGetMyShelf = useGetMyShelf as jest.Mock;
const mockedUseRemoveFavouriteItem = useRemoveFavouriteItem as jest.Mock;

describe("FavouritePage", () => {
	beforeEach(() => {
		mockedUseFetchBooks.mockReturnValue({
			books: [],
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseFetchFavourites.mockReturnValue({
			isLoading: false,
			isError: false,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: [] }));
		mockedUseUserStore.mockImplementation((cb) =>
			cb({ currentUser: MOCK_USER })
		);
		mockedUsePendingFavouritesStore.mockImplementation((cb) =>
			cb({ pendingFavouritesActions: [] })
		);
		mockedUseFavouritesStore.mockImplementation(() => ({
			favourites: [],
			setFavourites: jest.fn(),
		}));
		mockedUseFavouritesChangedStore.mockImplementation(() => ({
			favouritesChanged: false,
			setFavouritesChanged: jest.fn(),
		}));
		mockedUseGetMyShelf.mockReturnValue({ data: [] });
		mockedUseRemoveFavouriteItem.mockReturnValue({ mutate: jest.fn() });
	});
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("shows skeleton when loading books or favourites", () => {
		mockedUseFetchBooks.mockReturnValue({
			books: [],
			isLoading: true,
			isError: false,
			error: null,
		});
		mockedUseFetchFavourites.mockReturnValue({
			isLoading: true,
			isError: false,
		});
		render(<FavouritePage />);
		expect(screen.getAllByTestId("book-row-skeleton")[0]).toBeInTheDocument();
	});

	it("shows error when error", () => {
		mockedUseFetchBooks.mockReturnValue({
			books: [],
			isLoading: false,
			isError: true,
			error: { message: "fail" },
		});
		mockedUseFetchFavourites.mockReturnValue({
			isLoading: false,
			isError: true,
		});
		render(<FavouritePage />);
		expect(
			screen.getByText(/failed to load favourites data/i)
		).toBeInTheDocument();
		expect(screen.getByText(/fail/)).toBeInTheDocument();
	});

	it("shows no books in your favourites if none", () => {
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseFavouritesStore.mockImplementation(() => ({
			favourites: [],
			setFavourites: jest.fn(),
		}));
		render(<FavouritePage />);
		expect(
			screen.getByText(/no books found in your favourites/i)
		).toBeInTheDocument();
	});

	it("renders favourite books list", () => {
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseFavouritesStore.mockImplementation(() => ({
			favourites: MOCK_FAVOURITES,
			setFavourites: jest.fn(),
		}));
		mockedUseGetMyShelf.mockReturnValue({ data: MOCK_SHELVES });
		render(<FavouritePage />);
		expect(screen.getByText(/your favourite/i)).toBeInTheDocument();
		expect(
			screen.getAllByLabelText(/Toggle favorite/i).length
		).toBeGreaterThanOrEqual(1);
	});

	it("calls removeFavourite and updates favourites when remove clicked", () => {
		const setFavourites = jest.fn();
		const setFavouritesChanged = jest.fn();
		const mutate = jest.fn((item, options) => {
			if (options && options.onSuccess) {
				options.onSuccess();
			}
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseFavouritesStore.mockImplementation(() => ({
			favourites: MOCK_FAVOURITES,
			setFavourites,
		}));
		mockedUseFavouritesChangedStore.mockImplementation(() => ({
			favouritesChanged: false,
			setFavouritesChanged,
		}));
		mockedUseGetMyShelf.mockReturnValue({ data: MOCK_SHELVES });
		mockedUseRemoveFavouriteItem.mockReturnValue({ mutate });
		render(<FavouritePage />);
		fireEvent.click(screen.getAllByLabelText(/Toggle favorite/i)[0]);
		expect(mutate).toHaveBeenCalled();
		expect(setFavourites).toHaveBeenCalled();
		expect(setFavouritesChanged).toHaveBeenCalledWith(true);
	});

	it("matches snapshot", () => {
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseFavouritesStore.mockImplementation(() => ({
			favourites: MOCK_FAVOURITES,
			setFavourites: jest.fn(),
		}));
		mockedUseGetMyShelf.mockReturnValue({ data: MOCK_SHELVES });
		const { container } = render(<FavouritePage />);
		expect(container).toMatchSnapshot();
	});
});
