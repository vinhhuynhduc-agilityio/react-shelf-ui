import { render, screen, fireEvent } from "@/components/Test/test-utils";
import BookPreviewPage from ".";
import { MOCK_BOOKS } from "@/__mocks__/book";
import { MOCK_USER } from "@/__mocks__/user";
import { useNavigate, useParams } from "react-router-dom";
import { usePendingShelfStore, useUserStore } from "@/stores";
import { useGetMyShelf, useAddShelfItem, useBooksQuery } from "@/hooks";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));
jest.mock("@/stores", () => ({
  usePendingShelfStore: jest.fn(),
  useUserStore: jest.fn(),
}));
jest.mock("@/hooks", () => ({
  useGetMyShelf: jest.fn(),
  useAddShelfItem: jest.fn(),
  useBooksQuery: jest.fn(),
}));

const mockBook = MOCK_BOOKS[0];
const mockUser = MOCK_USER;
const mockNavigate = jest.fn();

const mockedUseParams = useParams as jest.Mock;
const mockedUseNavigate = useNavigate as jest.Mock;
const mockedUsePendingShelfStore = usePendingShelfStore as unknown as jest.Mock;
const mockedUseUserStore = useUserStore as unknown as jest.Mock;
const mockedUseGetMyShelf = useGetMyShelf as jest.Mock;
const mockedUseAddShelfItem = useAddShelfItem as jest.Mock;
const mockedUseBooksQuery = useBooksQuery as jest.Mock;

describe("BookPreviewPage", () => {
  beforeEach(() => {
    mockedUseParams.mockReturnValue({ bookId: "11" });
    mockedUseNavigate.mockReturnValue(mockNavigate);
    mockedUseUserStore.mockImplementation(() => ({ currentUser: mockUser }));
    mockedUsePendingShelfStore.mockReturnValue({ pendingShelfActions: [] });
    mockedUseGetMyShelf.mockReturnValue({ data: [] });
    mockedUseAddShelfItem.mockReturnValue({ mutate: jest.fn() });
    mockedUseBooksQuery.mockReturnValue({
      data: MOCK_BOOKS,
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders book info and actions", () => {
    render(<BookPreviewPage />);
    expect(screen.getByText(mockBook.title)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /borrow/i })).toBeInTheDocument();
    expect(screen.getByText(/availability/i)).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
  });

  it("disables borrow button if already in shelf", () => {
    mockedUseGetMyShelf.mockReturnValue({ data: [{ bookId: mockBook.id }] });
    render(<BookPreviewPage />);
    expect(
      screen.getByRole("button", { name: /already in shelf/i })
    ).toBeDisabled();
  });

  it("disables borrow button if pending", () => {
    mockedUsePendingShelfStore.mockReturnValue({
      pendingShelfActions: [mockBook.id],
    });
    render(<BookPreviewPage />);
    expect(screen.getByRole("button", { name: /borrow/i })).toBeDisabled();
  });

  it("calls addShelf when borrow clicked", () => {
    const mutate = jest.fn();
    mockedUseAddShelfItem.mockReturnValue({ mutate });
    render(<BookPreviewPage />);
    fireEvent.click(screen.getByRole("button", { name: /borrow/i }));
    expect(mutate).toHaveBeenCalled();
  });

  it("calls navigate when back button clicked", () => {
    render(<BookPreviewPage />);
    fireEvent.click(screen.getByRole("button", { name: /back to results/i }));
    expect(mockNavigate).toHaveBeenCalled();
  });

  it("matches snapshot", () => {
    const { container } = render(<BookPreviewPage />);
    expect(container).toMatchSnapshot();
  });
});
