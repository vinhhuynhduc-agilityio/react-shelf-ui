import { renderHook, waitFor, wrapper } from "@/components/Test/test-utils";
import { useBooksQuery } from "../books";
import { getBooks } from "@/services/book";

jest.mock("@/services/book.ts", () => ({
  getBooks: jest.fn(),
}));

describe("useBooksQuery", () => {
  it("calls getBooks and returns data", async () => {
    const mockBooks = [{ id: "1", title: "Book 1" }];
    (getBooks as jest.Mock).mockResolvedValue(mockBooks);

    const { result } = renderHook(() => useBooksQuery(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockBooks);
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getBooks).toHaveBeenCalled();
  });

  it("does not call getBooks if enabled is false", async () => {
    renderHook(() => useBooksQuery(false), { wrapper });
    expect(getBooks).not.toHaveBeenCalled();
  });
});
