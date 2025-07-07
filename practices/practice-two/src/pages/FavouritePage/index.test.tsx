import { render, screen, fireEvent } from "@/helpers/test-utils";
import FavouritePage from ".";
import { MOCK_BOOKS, MOCK_FAVOURITES, MOCK_SHELVES } from "@/__mocks__/book";
import { MemoryRouter } from "react-router-dom";
import { MOCK_USER } from "@/__mocks__/user";
import {
	useBookStore,
	useUserStore,
	usePendingFavouritesStore,
} from "@/stores";
import {
	useFetchBooks,
	useGetFavourites,
	useGetMyShelf,
	useRemoveFavouriteItem,
} from "@/hooks";

jest.mock("@/stores", () => ({
	useBookStore: jest.fn(),
	useUserStore: jest.fn(),
	usePendingFavouritesStore: jest.fn(),
}));
jest.mock("@/hooks", () => ({
	useFetchBooks: jest.fn(),
	useGetFavourites: jest.fn(),
	useGetMyShelf: jest.fn(),
	useRemoveFavouriteItem: jest.fn(),
}));

const mockedUseBookStore = useBookStore as unknown as jest.Mock;
const mockedUseUserStore = useUserStore as unknown as jest.Mock;
const mockedUsePendingFavouritesStore =
	usePendingFavouritesStore as unknown as jest.Mock;
const mockedUseFetchBooks = useFetchBooks as jest.Mock;
const mockedUseGetFavourites = useGetFavourites as jest.Mock;
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
		mockedUseBookStore.mockImplementation((cb) => cb({ books: [] }));
		mockedUseUserStore.mockImplementation((cb) =>
			cb({ currentUser: MOCK_USER })
		);
		mockedUsePendingFavouritesStore.mockImplementation((cb) =>
			cb({ pendingFavouritesActions: [] })
		);
		mockedUseGetFavourites.mockReturnValue({ data: [] });
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
		render(
			<MemoryRouter>
				<FavouritePage />
			</MemoryRouter>
		);
		expect(screen.getByText(/error loading books/i)).toBeInTheDocument();
		expect(screen.getByText(/fail/)).toBeInTheDocument();
	});

	it("shows no books in your favourites if none", () => {
		mockedUseFetchBooks.mockReturnValue({
			books: [],
			isLoading: false,
			isError: false,
			error: null,
		});
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
		mockedUseFetchBooks.mockReturnValue({
			books: MOCK_BOOKS,
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseUserStore.mockImplementation((cb) =>
			cb({ currentUser: MOCK_USER })
		);
		mockedUsePendingFavouritesStore.mockImplementation((cb) =>
			cb({ pendingFavouritesActions: [] })
		);
		mockedUseGetFavourites.mockReturnValue({ data: MOCK_FAVOURITES });
		mockedUseGetMyShelf.mockReturnValue({ data: MOCK_SHELVES });
		mockedUseRemoveFavouriteItem.mockReturnValue({ mutate: jest.fn() });
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

	it("calls removeFavourite when remove clicked", () => {
		const mutate = jest.fn();
		mockedUseFetchBooks.mockReturnValue({
			books: MOCK_BOOKS,
			isLoading: false,
			isError: false,
			error: null,
		});
		mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
		mockedUseUserStore.mockImplementation((cb) =>
			cb({ currentUser: MOCK_USER })
		);
		mockedUsePendingFavouritesStore.mockImplementation((cb) =>
			cb({ pendingFavouritesActions: [] })
		);
		mockedUseGetFavourites.mockReturnValue({ data: MOCK_FAVOURITES });
		mockedUseGetMyShelf.mockReturnValue({ data: MOCK_SHELVES });
		mockedUseRemoveFavouriteItem.mockReturnValue({ mutate });
		render(
			<MemoryRouter>
				<FavouritePage />
			</MemoryRouter>
		);
		fireEvent.click(screen.getAllByLabelText(/remove from favorites/i)[0]);
		expect(mutate).toHaveBeenCalled();
	});
});

it("matches snapshot", () => {
	mockedUseFetchBooks.mockReturnValue({
		books: MOCK_BOOKS,
		isLoading: false,
		isError: false,
		error: null,
	});
	mockedUseBookStore.mockImplementation((cb) => cb({ books: MOCK_BOOKS }));
	mockedUseUserStore.mockImplementation((cb) => cb({ currentUser: MOCK_USER }));
	mockedUsePendingFavouritesStore.mockImplementation((cb) =>
		cb({ pendingFavouritesActions: [] })
	);
	mockedUseGetFavourites.mockReturnValue({ data: MOCK_FAVOURITES });
	mockedUseGetMyShelf.mockReturnValue({ data: MOCK_SHELVES });
	mockedUseRemoveFavouriteItem.mockReturnValue({ mutate: jest.fn() });
	const { container } = render(
		<MemoryRouter>
			<FavouritePage />
		</MemoryRouter>
	);
	expect(container).toMatchSnapshot();
});
