import { render, screen, fireEvent } from "@/components/Test/test-utils";
import FavouritePage from ".";
import { MOCK_BOOKS, MOCK_FAVOURITES, MOCK_SHELVES } from "@/__mocks__/book";
import { MOCK_USER } from "@/__mocks__/user";
import { useUserStore, useFavouritesStore } from "@/stores";
import {
  useBooksQuery,
  useFetchAndStoreFavourites,
  useGetMyShelf,
  useRemoveFavouriteItem,
} from "@/hooks";

jest.mock("@/stores", () => ({
  useUserStore: jest.fn(),
  usePendingFavouritesStore: jest.fn(),
  useFavouritesStore: jest.fn(),
}));
jest.mock("@/hooks", () => ({
  useBooksQuery: jest.fn(),
  useFetchAndStoreFavourites: jest.fn(),
  useGetMyShelf: jest.fn(),
  useRemoveFavouriteItem: jest.fn(),
}));

const mockedUseUserStore = useUserStore as unknown as jest.Mock;
const mockedUseFavouritesStore = useFavouritesStore as unknown as jest.Mock;
const mockedUseBooksQuery = useBooksQuery as jest.Mock;
const mockedUseFetchFavourites = useFetchAndStoreFavourites as jest.Mock;
const mockedUseGetMyShelf = useGetMyShelf as jest.Mock;
const mockedUseRemoveFavouriteItem = useRemoveFavouriteItem as jest.Mock;

describe("FavouritePage", () => {
  beforeEach(() => {
    mockedUseBooksQuery.mockReturnValue({
      data: MOCK_BOOKS,
      isLoading: false,
      isError: false,
      error: null,
    });
    mockedUseFetchFavourites.mockReturnValue({
      isLoading: false,
      isError: false,
      error: null,
    });
    mockedUseUserStore.mockImplementation(() => ({ currentUser: MOCK_USER }));
    mockedUseFavouritesStore.mockReturnValue({
      favourites: MOCK_FAVOURITES,
      setFavourites: jest.fn(),
      pendingFavouritesActions: ["1", "2"],
    });
    mockedUseGetMyShelf.mockReturnValue({ data: MOCK_SHELVES });
    mockedUseRemoveFavouriteItem.mockReturnValue({ mutate: jest.fn() });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows skeleton when loading books or favourites", () => {
    mockedUseBooksQuery.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
      error: null,
    });
    mockedUseFetchFavourites.mockReturnValue({
      isLoading: true,
      isError: false,
      error: null,
    });
    render(<FavouritePage />);
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
      isLoading: false,
      isError: true,
      error: { message: "fail2" },
    });
    render(<FavouritePage />);
    expect(
      screen.getByText(/failed to load favourites data/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/fail/)).toHaveLength(2);
    expect(screen.getAllByText(/fail2/)).toHaveLength(1);
  });

  it("shows no books in your favourites if none", () => {
    mockedUseFavouritesStore.mockReturnValue({
      favourites: [],
      setFavourites: jest.fn(),
    });
    render(<FavouritePage />);
    expect(
      screen.getByText(/no books found in your favourites/i)
    ).toBeInTheDocument();
  });

  it("renders favourite books list", () => {
    mockedUseFavouritesStore.mockReturnValue({
      favourites: MOCK_FAVOURITES,
      setFavourites: jest.fn(),
      pendingFavouritesActions: ["1", "2"],
    });
    mockedUseGetMyShelf.mockReturnValue({ data: MOCK_SHELVES });
    render(<FavouritePage />);
    expect(screen.getByText(/your favourite/i)).toBeInTheDocument();
    expect(
      screen.getAllByLabelText(/Toggle favorite/i).length
    ).toBeGreaterThanOrEqual(1);
  });

  it("calls removeFavourite and updates favourites when remove clicked", () => {
    const setFavourites = jest.fn();
    const mutate = jest.fn((item, options) => {
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    });
    mockedUseFavouritesStore.mockReturnValue({
      favourites: MOCK_FAVOURITES,
      setFavourites,
      pendingFavouritesActions: ["1", "2"],
    });
    mockedUseRemoveFavouriteItem.mockReturnValue({ mutate });
    render(<FavouritePage />);
    fireEvent.click(screen.getAllByLabelText(/Toggle favorite/i)[0]);
    expect(mutate).toHaveBeenCalled();
    expect(setFavourites).toHaveBeenCalled();
  });

  it("matches snapshot", () => {
    const { container } = render(<FavouritePage />);
    expect(container).toMatchSnapshot();
  });
});
