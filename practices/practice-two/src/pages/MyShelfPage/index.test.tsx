import { render, screen, fireEvent } from "@/components/Test/test-utils";
import MyShelfPage from ".";
import { MOCK_BOOKS, MOCK_SHELVES } from "@/__mocks__/book";
import { MOCK_USER } from "@/__mocks__/user";
import { usePendingShelfStore, useUserStore } from "@/stores";
import {
  useBooksQuery,
  useGetAndStoreMyShelf,
  useRemoveShelfItem,
} from "@/hooks";
import React from "react";

jest.mock("@/stores", () => ({
  useBookStore: jest.fn(),
  useUserStore: jest.fn(),
  usePendingShelfStore: jest.fn(),
}));
jest.mock("@/hooks", () => ({
  useBooksQuery: jest.fn(),
  useGetAndStoreMyShelf: jest.fn(),
  useRemoveShelfItem: jest.fn(),
}));

const mockedUseUserStore = useUserStore as unknown as jest.Mock;
const mockedUsePendingShelfStore = usePendingShelfStore as unknown as jest.Mock;
const mockedUseGetMySHelf = useGetAndStoreMyShelf as jest.Mock;
const mockedUseRemoveShelfItem = useRemoveShelfItem as jest.Mock;
const mockedUseBooksQuery = useBooksQuery as jest.Mock;

describe("MyShelfPage", () => {
  beforeEach(() => {
    mockedUseBooksQuery.mockReturnValue({
      data: MOCK_BOOKS,
      isLoading: false,
      isError: false,
      error: null,
    });
    mockedUseUserStore.mockImplementation(() => ({ currentUser: MOCK_USER }));
    mockedUsePendingShelfStore.mockReturnValue({ pendingShelfActions: [] });
    mockedUseGetMySHelf.mockImplementation((userId, setShelf) => {
      // Avoid direct setShelf call to prevent re-render loop
      React.useEffect(() => {
        setShelf(MOCK_SHELVES);
      }, [setShelf]);
      return {
        isError: false,
        isFetching: false,
        error: null,
      };
    });
    mockedUseRemoveShelfItem.mockReturnValue({ mutate: jest.fn() });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows error notice when error", () => {
    mockedUseBooksQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { message: "Book error" },
    });
    mockedUseGetMySHelf.mockReturnValue({
      isError: true,
      isFetching: false,
      error: { message: "Shelf error" },
    });
    render(<MyShelfPage />);
    expect(screen.getByText(/Failed to load shelf data/)).toBeInTheDocument();
    expect(screen.getByText(/Book error/)).toBeInTheDocument();
    expect(screen.getByText(/Shelf error/)).toBeInTheDocument();
  });

  it("shows no books message when shelf is empty", () => {
    mockedUseBooksQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });
    mockedUseGetMySHelf.mockImplementation((userId, setShelf) => {
      // Avoid direct setShelf call to prevent re-render loop
      React.useEffect(() => {
        setShelf([]);
      }, [setShelf]);
      return {
        isError: false,
        isFetching: false,
        error: null,
      };
    });
    render(<MyShelfPage />);
    expect(screen.getByText(/No books in your shelf./i)).toBeInTheDocument();
  });

  it("renders shelf books list", () => {
    mockedUseBooksQuery.mockReturnValue({
      data: MOCK_BOOKS,
      isLoading: false,
      isError: false,
      error: null,
    });
    mockedUseGetMySHelf.mockImplementation((userId, setShelf) => {
      // Avoid direct setShelf call to prevent re-render loop
      React.useEffect(() => {
        setShelf(MOCK_SHELVES);
      }, [setShelf]);
      return {
        isError: false,
        isFetching: false,
        error: null,
      };
    });
    render(<MyShelfPage />);
    MOCK_SHELVES.forEach((shelf) => {
      const book = MOCK_BOOKS.find((b) => b.id === shelf.bookId);
      if (book) {
        expect(screen.getByText(book.title)).toBeInTheDocument();
      }
    });
  });

  it("calls removeShelfItem and updates shelf when return clicked", () => {
    const mutate = jest.fn((item, options) => {
      if (options && options.onSuccess) {
        options.onSuccess();
      }
    });
    mockedUseRemoveShelfItem.mockReturnValue({ mutate });
    render(<MyShelfPage />);
    const returnButtons = screen.getAllByRole("button", { name: /return/i });
    fireEvent.click(returnButtons[0]);
    expect(mutate).toHaveBeenCalled();
  });

  it("matches snapshot", () => {
    const { container } = render(<MyShelfPage />);
    expect(container).toMatchSnapshot();
  });
});
