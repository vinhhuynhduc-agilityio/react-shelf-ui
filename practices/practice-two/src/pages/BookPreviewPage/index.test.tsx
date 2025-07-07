import { render, screen, fireEvent } from "@/helpers/test-utils";
import BookPreviewPage from ".";
import { MOCK_BOOKS } from "@/__mocks__/book";
import { MOCK_USER } from "@/__mocks__/user";
import { useLocation, useNavigate } from "react-router-dom";
import { usePendingShelfStore, useUserStore } from "@/stores";
import { useGetMyShelf, useAddShelfItem } from "@/hooks";

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useLocation: jest.fn(),
	useNavigate: jest.fn(),
}));
jest.mock("@/stores", () => ({
	usePendingShelfStore: jest.fn(),
	useUserStore: jest.fn(),
}));
jest.mock("@/hooks", () => ({
	useGetMyShelf: jest.fn(),
	useAddShelfItem: jest.fn(),
}));

const mockBook = MOCK_BOOKS[0];
const mockUser = MOCK_USER;
const mockNavigate = jest.fn();

const mockedUseLocation = useLocation as jest.Mock;
const mockedUseNavigate = useNavigate as jest.Mock;
const mockedUsePendingShelfStore = usePendingShelfStore as unknown as jest.Mock;
const mockedUseUserStore = useUserStore as unknown as jest.Mock;
const mockedUseGetMyShelf = useGetMyShelf as jest.Mock;
const mockedUseAddShelfItem = useAddShelfItem as jest.Mock;

describe("BookPreviewPage", () => {
	beforeEach(() => {
		mockedUseLocation.mockReturnValue({ state: { book: mockBook } });
		mockedUseNavigate.mockReturnValue(mockNavigate);
		mockedUseUserStore.mockImplementation((cb) =>
			cb({ currentUser: mockUser })
		);
		mockedUsePendingShelfStore.mockReturnValue({ pendingShelfActions: [] });
		mockedUseGetMyShelf.mockReturnValue({ data: [] });
		mockedUseAddShelfItem.mockReturnValue({ mutate: jest.fn() });
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

	it("shows error if no book data", () => {
		mockedUseLocation.mockReturnValue({ state: { book: undefined } });
		render(<BookPreviewPage />);
		expect(screen.getByText(/no book data available/i)).toBeInTheDocument();
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
