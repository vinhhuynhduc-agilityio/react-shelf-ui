import { renderHook, act, waitFor } from "@testing-library/react";
import { wrapper } from "@/components/Test/test-utils";
import {
  useGetMyShelf,
  useAddShelfItem,
  useRemoveShelfItem,
  useFetchAndStoreMyShelf,
} from "../shelf";
import { getShelves, addShelfItem, removeShelfItem } from "@/services";
import { usePendingShelfStore, useToastStore } from "@/stores";
import { ShelfItem } from "@/types";
import { SUCCESS_MESSAGE } from "@/constants";

jest.mock("@/services", () => ({
  getShelves: jest.fn(),
  addShelfItem: jest.fn(),
  removeShelfItem: jest.fn(),
}));
jest.mock("@/stores", () => ({
  usePendingShelfStore: jest.fn(),
  useToastStore: jest.fn(),
}));

describe("useGetMyShelf", () => {
  it("fetches shelf for user", async () => {
    const mockShelf = [{ bookId: "1" }, { bookId: "2" }];
    (getShelves as jest.Mock).mockResolvedValue(mockShelf);
    const { result } = renderHook(() => useGetMyShelf("user1"), { wrapper });
    await waitFor(() => expect(result.current.data).toEqual(mockShelf));
    expect(getShelves).toHaveBeenCalledWith("user1");
  });
});

describe("useAddShelfItem", () => {
  const addShelf = jest.fn();
  const removeShelf = jest.fn();
  const showToast = jest.fn();

  beforeEach(() => {
    (usePendingShelfStore as unknown as jest.Mock).mockReturnValue({
      addShelf,
      removeShelf,
    });
    (addShelfItem as jest.Mock).mockResolvedValue({});
    (useToastStore as unknown as jest.Mock).mockReturnValue({
      showToast,
    });
    addShelf.mockClear();
    removeShelf.mockClear();
    showToast.mockClear();
  });

  it("calls addShelf and removeShelf on mutation", async () => {
    const { result } = renderHook(() => useAddShelfItem("user1"), { wrapper });
    const item: ShelfItem = { bookId: "1" } as ShelfItem;

    await act(async () => {
      await result.current.mutateAsync(item);
    });

    expect(addShelf).toHaveBeenCalledWith("1");
    expect(removeShelf).toHaveBeenCalledWith("1");
    expect(addShelfItem).toHaveBeenCalledWith(item);
    expect(showToast).toHaveBeenCalledWith(
      SUCCESS_MESSAGE.BOOK_BORROWED,
      "success"
    );
  });
});

describe("useRemoveShelfItem", () => {
  const addShelf = jest.fn();
  const removeShelf = jest.fn();
  beforeEach(() => {
    (usePendingShelfStore as unknown as jest.Mock).mockReturnValue({
      addShelf,
      removeShelf,
    });
    (removeShelfItem as jest.Mock).mockResolvedValue({});
    addShelf.mockClear();
    removeShelf.mockClear();
  });
  it("calls addShelf and removeShelf on mutation", async () => {
    const { result } = renderHook(() => useRemoveShelfItem(), { wrapper });
    const item: ShelfItem = { bookId: "2" } as ShelfItem;
    await act(async () => {
      await result.current.mutateAsync(item);
    });
    expect(addShelf).toHaveBeenCalledWith("2");
    expect(removeShelf).toHaveBeenCalledWith("2");
    expect(removeShelfItem).toHaveBeenCalledWith(item);
  });
});

describe("useFetchAndStoreMyShelf", () => {
  it("calls setShelf from component state when query returns shelf", async () => {
    const mockShelf = [{ bookId: "1" }, { bookId: "2" }];
    (getShelves as jest.Mock).mockResolvedValue(mockShelf);

    const setShelf = jest.fn();
    renderHook(() => useFetchAndStoreMyShelf("user1", setShelf), {
      wrapper,
    });

    await waitFor(() => expect(setShelf).toHaveBeenCalledWith(mockShelf));
  });
});
