import { renderHook, act, waitFor } from "@testing-library/react";
import { wrapper } from "@/components/Test/test-utils";
import {
  useGetFavourites,
  useAddFavouriteItem,
  useRemoveFavouriteItem,
  useFetchFavourites,
} from "../favourite";
import {
  getFavourites,
  addFavouriteItem,
  removeFavouriteItem,
} from "@/services";
import { useFavouritesStore, usePendingFavouritesStore } from "@/stores";
import { UserBook } from "@/types";

jest.mock("@/services", () => ({
  getFavourites: jest.fn(),
  addFavouriteItem: jest.fn(),
  removeFavouriteItem: jest.fn(),
}));
jest.mock("@/stores", () => ({
  usePendingFavouritesStore: jest.fn(),
  useFavouritesStore: jest.fn(),
}));

describe("useGetFavourites", () => {
  it("fetches favourites for user", async () => {
    const mockFavourites = [{ bookId: "1" }, { bookId: "2" }];
    (getFavourites as jest.Mock).mockResolvedValue(mockFavourites);
    const { result } = renderHook(() => useGetFavourites("user1"), { wrapper });
    await waitFor(() => expect(result.current.data).toEqual(mockFavourites));
    expect(getFavourites).toHaveBeenCalledWith("user1");
  });
});

describe("useAddFavouriteItem", () => {
  const addFavourite = jest.fn();
  const removeFavourite = jest.fn();
  beforeEach(() => {
    (usePendingFavouritesStore as unknown as jest.Mock).mockReturnValue({
      addFavourite,
      removeFavourite,
    });
    (addFavouriteItem as jest.Mock).mockResolvedValue({});
    addFavourite.mockClear();
    removeFavourite.mockClear();
  });
  it("calls addFavourite and removeFavourite on mutation", async () => {
    const { result } = renderHook(() => useAddFavouriteItem(), {
      wrapper,
    });
    const item: UserBook = { bookId: "1" } as UserBook;
    await act(async () => {
      await result.current.mutateAsync(item);
    });
    expect(addFavourite).toHaveBeenCalledWith("1");
    expect(removeFavourite).toHaveBeenCalledWith("1");
    expect(addFavouriteItem).toHaveBeenCalledWith(item);
  });
});

describe("useRemoveFavouriteItem", () => {
  const addFavourite = jest.fn();
  const removeFavourite = jest.fn();
  beforeEach(() => {
    (usePendingFavouritesStore as unknown as jest.Mock).mockReturnValue({
      addFavourite,
      removeFavourite,
    });
    (removeFavouriteItem as jest.Mock).mockResolvedValue({});
    addFavourite.mockClear();
    removeFavourite.mockClear();
  });
  it("calls addFavourite and removeFavourite on mutation", async () => {
    const { result } = renderHook(() => useRemoveFavouriteItem(), {
      wrapper,
    });
    const item: UserBook = { bookId: "2" } as UserBook;
    await act(async () => {
      await result.current.mutateAsync(item);
    });
    expect(addFavourite).toHaveBeenCalledWith("2");
    expect(removeFavourite).toHaveBeenCalledWith("2");
    expect(removeFavouriteItem).toHaveBeenCalledWith(item);
  });
});

describe("useFetchFavourites", () => {
  it("returns favourites from query when successful", async () => {
    const mockFavourites = [{ bookId: "1" }, { bookId: "2" }];
    (getFavourites as jest.Mock).mockResolvedValue(mockFavourites);

    const setFavourites = jest.fn();
    (useFavouritesStore as unknown as jest.Mock).mockReturnValue({
      favourites: mockFavourites,
      setFavourites,
    });

    const { result } = renderHook(() => useFetchFavourites("user1"), {
      wrapper,
    });

    await waitFor(() =>
      expect(result.current.favourites).toEqual(mockFavourites)
    );
    expect(setFavourites).toHaveBeenCalledWith(mockFavourites);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBeFalsy();
  });
});
