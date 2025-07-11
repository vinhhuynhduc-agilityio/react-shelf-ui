import { render, screen, fireEvent } from "@/helpers/test-utils";
import FavouritePage from ".";
import { MOCK_BOOKS, MOCK_FAVOURITES, MOCK_SHELVES } from "@/__mocks__/book";
import { MemoryRouter } from "react-router-dom";
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

	it("shows loading when loading and no books", () => {
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
		render(
			<MemoryRouter>
				<FavouritePage />
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
			isLoading: false,
			isError: true,
		});
		render(
			<MemoryRouter>
				<FavouritePage />
			</MemoryRouter>
		);
		expect(screen.getByText(/error loading books/i)).toBeInTheDocument();
		expect(screen.getByText(/fail/)).toBeInTheDocument();
	});

	it("shows no books in your favourites if none", () => {
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseFavouritesStore.mockImplementation(() => ({
			favourites: [],
			setFavourites: jest.fn(),
		}));
		render(
			<MemoryRouter>
				<FavouritePage />
			</MemoryRouter>
		);
		expect(
			screen.getByText(/no books in your favourites/i)
		).toBeInTheDocument();
	});

	it("renders favourite books list", () => {
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseFavouritesStore.mockImplementation(() => ({
			favourites: MOCK_FAVOURITES,
			setFavourites: jest.fn(),
		}));
		mockedUseGetMyShelf.mockReturnValue({ data: MOCK_SHELVES });
		render(
			<MemoryRouter>
				<FavouritePage />
			</MemoryRouter>
		);
		expect(screen.getByText(/your favourite/i)).toBeInTheDocument();
		expect(
			screen.getAllByLabelText(/remove from favorites/i).length
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
		render(
			<MemoryRouter>
				<FavouritePage />
			</MemoryRouter>
		);
		fireEvent.click(screen.getAllByLabelText(/remove from favorites/i)[0]);
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
		const { container } = render(
			<MemoryRouter>
				<FavouritePage />
			</MemoryRouter>
		);
		expect(container).toMatchSnapshot();
	});
});
