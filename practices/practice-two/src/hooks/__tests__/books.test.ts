import { waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { wrapper } from "@/helpers/test-utils";
import { useBooksQuery, useFetchBooks } from "../books";
import { getBooks } from "@/services/bookService";
import { useBookStore } from "@/stores/bookStore";
import { MOCK_BOOKS } from "@/__mocks__/book";

jest.mock("@/services/bookService", () => ({
	getBooks: jest.fn(),
}));
jest.mock("@/stores/bookStore", () => ({
	useBookStore: jest.fn(),
}));

describe("useBooksQuery", () => {
	it("should fetch books when enabled", async () => {
		(getBooks as jest.Mock).mockResolvedValue(MOCK_BOOKS);
		const { result } = renderHook(() => useBooksQuery(true), { wrapper });
		await waitFor(() => expect(result.current.data).toEqual(MOCK_BOOKS));
		expect(getBooks).toHaveBeenCalled();
	});
	it("should not fetch books when disabled", async () => {
		renderHook(() => useBooksQuery(false), { wrapper });
		expect(getBooks).not.toHaveBeenCalled();
	});
});

describe("useFetchBooks", () => {
	beforeEach(() => {
		(useBookStore as unknown as jest.Mock).mockImplementation((cb) =>
			cb({
				hasFetched: false,
				setBooks: jest.fn(),
				books: [],
			})
		);
	});
	it("should return books from query if not fetched", async () => {
		(getBooks as jest.Mock).mockResolvedValue(MOCK_BOOKS);
		const { result } = renderHook(() => useFetchBooks(), { wrapper });
		await waitFor(() => expect(result.current.books).toEqual(MOCK_BOOKS));
	});
	it("should return books from store if already fetched", async () => {
		(useBookStore as unknown as jest.Mock).mockImplementation((cb) =>
			cb({
				hasFetched: true,
				setBooks: jest.fn(),
				books: MOCK_BOOKS,
			})
		);
		const { result } = renderHook(() => useFetchBooks(), { wrapper });
		expect(result.current.books).toEqual(MOCK_BOOKS);
	});
});
