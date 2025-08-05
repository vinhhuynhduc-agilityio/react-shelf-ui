import { render, screen, fireEvent } from "@/helpers/test-utils";
import SearchPage from ".";
import { MOCK_BOOKS, MOCK_FAVOURITES, MOCK_SHELVES } from "@/__mocks__/book";
import { MOCK_USER } from "@/__mocks__/user";
import {
  useUserStore,
  useSearchStore,
  useSearchFilterStore,
  usePendingFavouritesStore,
  useFavouritesStore,
} from "@/stores";
import {
  useFetchFavourites,
  useGetMyShelf,
  useAddFavouriteItem,
  useRemoveFavouriteItem,
  useBooksQuery,
} from "@/hooks";

jest.mock("@/stores", () => ({
  useUserStore: jest.fn(),
  useSearchStore: jest.fn(),
  useSearchFilterStore: jest.fn(),
  usePendingFavouritesStore: jest.fn(),
  useFavouritesStore: jest.fn(),
}));
jest.mock("@/hooks", () => ({
  useFetchFavourites: jest.fn(),
  useGetMyShelf: jest.fn(),
  useAddFavouriteItem: jest.fn(),
  useRemoveFavouriteItem: jest.fn(),
  useBooksQuery: jest.fn(),
}));

const mockedUseBooksQuery = useBooksQuery as jest.Mock;
const mockedUseUserStore = useUserStore as unknown as jest.Mock;
const mockedUseSearchStore = useSearchStore as unknown as jest.Mock;
const mockedUseFilterStore = useSearchFilterStore as unknown as jest.Mock;
const mockedUsePendingFavouritesStore =
  usePendingFavouritesStore as unknown as jest.Mock;
const mockedUseFetchFavourites = useFetchFavourites as jest.Mock;
const mockedUseGetMyShelf = useGetMyShelf as jest.Mock;
const mockedUseAddFavouriteItem = useAddFavouriteItem as jest.Mock;
const mockedUseRemoveFavouriteItem = useRemoveFavouriteItem as jest.Mock;
const mockedUseFavouritesStore = useFavouritesStore as unknown as jest.Mock;

describe("SearchPage", () => {
  beforeEach(() => {
    mockedUseBooksQuery.mockReturnValue({
      data: MOCK_BOOKS,
      isLoading: false,
      isError: false,
      error: null,
    });
    mockedUseFetchFavourites.mockReturnValue({
      isError: false,
      isFetching: false,
    });
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
    mockedUseGetMyShelf.mockReturnValue({
      data: MOCK_SHELVES,
      isFetching: false,
    });
    mockedUseAddFavouriteItem.mockReturnValue({ mutate: jest.fn() });
    mockedUseRemoveFavouriteItem.mockReturnValue({ mutate: jest.fn() });
    mockedUseFavouritesStore.mockImplementation(() => ({
      favourites: [],
      setFavourites: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows skeleton when loading books or favourites", () => {
    mockedUseBooksQuery.mockReturnValue({
      data: MOCK_BOOKS,
      isLoading: true,
      isError: false,
      error: null,
    });
    mockedUseFetchFavourites.mockReturnValue({
      isLoading: true,
      isError: false,
    });
    render(<SearchPage />);
    expect(screen.getAllByTestId("book-row-skeleton")[0]).toBeInTheDocument();
  });

  it("shows error when error", () => {
    mockedUseBooksQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      error: { message: "fail" },
    });
    mockedUseFetchFavourites.mockReturnValue({
      isError: true,
      isFetching: false,
      error: { message: "fail2" },
    });
    render(<SearchPage />);
    expect(screen.getByText(/Failed to load search data/)).toBeInTheDocument();
    expect(screen.getAllByText(/fail/)).toHaveLength(2);
    expect(screen.getAllByText(/fail2/)).toHaveLength(1);
  });

  it("shows no books available if none", () => {
    mockedUseBooksQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });
    render(<SearchPage />);
    expect(screen.getByText(/no books available/i)).toBeInTheDocument();
  });

  it("shows no books found if search yields nothing", () => {
    mockedUseBooksQuery.mockReturnValue({
      data: MOCK_BOOKS,
      isLoading: false,
      isError: false,
      error: null,
    });
    mockedUseSearchStore.mockImplementation((cb) =>
      cb({ searchFromSidebar: false, searchTerm: "notfound" })
    );
    render(<SearchPage />);
    expect(screen.getByText(/no books found/i)).toBeInTheDocument();
  });

  it("renders filtered books list", () => {
    mockedUseBooksQuery.mockReturnValue({
      data: MOCK_BOOKS,
      isLoading: false,
      isError: false,
      error: null,
    });
    mockedUseSearchStore.mockImplementation((cb) =>
      cb({ searchFromSidebar: false, searchTerm: "think" })
    );
    mockedUseFavouritesStore.mockImplementation(() => ({
      favourites: [],
      setFavourites: jest.fn(),
    }));
    render(<SearchPage />);
    expect(screen.getByText(/don't make me think/i)).toBeInTheDocument();
  });

  it("calls addFavourite and updates favourites when favorite button clicked", () => {
    const mutate = jest.fn((item, options) => {
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    });
    const setFavouritesMock = jest.fn();
    mockedUseFavouritesStore.mockImplementation(() => ({
      favourites: [],
      setFavourites: setFavouritesMock,
    }));
    mockedUseAddFavouriteItem.mockReturnValue({ mutate });
    render(<SearchPage />);
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
    mockedUseFavouritesStore.mockImplementation(() => ({
      favourites: MOCK_FAVOURITES,
      setFavourites: setFavouritesMock,
    }));
    mockedUseRemoveFavouriteItem.mockReturnValue({ mutate });
    render(<SearchPage />);
    const favButtons = screen.getAllByRole("button");
    fireEvent.click(favButtons[0]);
    expect(mutate).toHaveBeenCalled();
    expect(setFavouritesMock).toHaveBeenCalled();
  });

  it("matches snapshot", () => {
    mockedUseBooksQuery.mockReturnValue({
      data: MOCK_BOOKS,
      isLoading: false,
      isError: false,
      error: null,
    });
    mockedUseFavouritesStore.mockImplementation(() => ({
      favourites: MOCK_FAVOURITES,
      setFavourites: jest.fn(),
    }));
    mockedUseGetMyShelf.mockReturnValue({ data: MOCK_SHELVES });
    const { container } = render(<SearchPage />);
    expect(container).toMatchSnapshot();
  });
});
