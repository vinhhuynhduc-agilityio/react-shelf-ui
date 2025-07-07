import { renderHook, act, waitFor } from "@testing-library/react";
import { wrapper } from "@/helpers/test-utils";
import {
	useGetFavourites,
	useAddFavouriteItem,
	useRemoveFavouriteItem,
} from "../favourite";
import {
	getFavourites,
	addFavouriteItem,
	removeFavouriteItem,
} from "@/services";
import { usePendingFavouritesStore } from "@/stores";
import { FavouriteItem } from "@/types";

jest.mock("@/services", () => ({
	getFavourites: jest.fn(),
	addFavouriteItem: jest.fn(),
	removeFavouriteItem: jest.fn(),
}));
jest.mock("@/stores", () => ({
	usePendingFavouritesStore: jest.fn(),
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
	const addPending = jest.fn();
	const removePending = jest.fn();
	beforeEach(() => {
		(usePendingFavouritesStore as unknown as jest.Mock).mockReturnValue({
			addPending,
			removePending,
		});
		(addFavouriteItem as jest.Mock).mockResolvedValue({});
		addPending.mockClear();
		removePending.mockClear();
	});
	it("calls addPending and removePending on mutation", async () => {
		const { result } = renderHook(() => useAddFavouriteItem("user1"), {
			wrapper,
		});
		const item: FavouriteItem = { bookId: "1" } as FavouriteItem;
		await act(async () => {
			await result.current.mutateAsync(item);
		});
		expect(addPending).toHaveBeenCalledWith("1");
		expect(removePending).toHaveBeenCalledWith("1");
		expect(addFavouriteItem).toHaveBeenCalledWith(item);
	});
});

describe("useRemoveFavouriteItem", () => {
	const addPending = jest.fn();
	const removePending = jest.fn();
	beforeEach(() => {
		(usePendingFavouritesStore as unknown as jest.Mock).mockReturnValue({
			addPending,
			removePending,
		});
		(removeFavouriteItem as jest.Mock).mockResolvedValue({});
		addPending.mockClear();
		removePending.mockClear();
	});
	it("calls addPending and removePending on mutation", async () => {
		const { result } = renderHook(() => useRemoveFavouriteItem("user1"), {
			wrapper,
		});
		const item: FavouriteItem = { bookId: "2" } as FavouriteItem;
		await act(async () => {
			await result.current.mutateAsync(item);
		});
		expect(addPending).toHaveBeenCalledWith("2");
		expect(removePending).toHaveBeenCalledWith("2");
		expect(removeFavouriteItem).toHaveBeenCalledWith(item);
	});
});
