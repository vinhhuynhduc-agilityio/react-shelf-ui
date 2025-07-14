import { renderHook, act, waitFor } from "@testing-library/react";
import { wrapper } from "@/helpers/test-utils";
import {
	useGetMyShelf,
	useAddShelfItem,
	useRemoveShelfItem,
	useFetchMySHelf,
} from "../shelf";
import { getShelves, addShelfItem, removeShelfItem } from "@/services";
import { usePendingShelfStore, useShelfStore } from "@/stores";
import { ShelfItem } from "@/types";

jest.mock("@/services", () => ({
	getShelves: jest.fn(),
	addShelfItem: jest.fn(),
	removeShelfItem: jest.fn(),
}));
jest.mock("@/stores", () => ({
	usePendingShelfStore: jest.fn(),
	useShelfStore: jest.fn(),
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
	const addPending = jest.fn();
	const removePending = jest.fn();
	beforeEach(() => {
		(usePendingShelfStore as unknown as jest.Mock).mockReturnValue({
			addPending,
			removePending,
		});
		(addShelfItem as jest.Mock).mockResolvedValue({});
		addPending.mockClear();
		removePending.mockClear();
	});
	it("calls addPending and removePending on mutation", async () => {
		const { result } = renderHook(() => useAddShelfItem("user1"), { wrapper });
		const item: ShelfItem = { bookId: "1" } as ShelfItem;
		await act(async () => {
			await result.current.mutateAsync(item);
		});
		expect(addPending).toHaveBeenCalledWith("1");
		expect(removePending).toHaveBeenCalledWith("1");
		expect(addShelfItem).toHaveBeenCalledWith(item);
	});
});

describe("useRemoveShelfItem", () => {
	const addPending = jest.fn();
	const removePending = jest.fn();
	beforeEach(() => {
		(usePendingShelfStore as unknown as jest.Mock).mockReturnValue({
			addPending,
			removePending,
		});
		(removeShelfItem as jest.Mock).mockResolvedValue({});
		addPending.mockClear();
		removePending.mockClear();
	});
	it("calls addPending and removePending on mutation", async () => {
		const { result } = renderHook(() => useRemoveShelfItem(), { wrapper });
		const item: ShelfItem = { bookId: "2" } as ShelfItem;
		await act(async () => {
			await result.current.mutateAsync(item);
		});
		expect(addPending).toHaveBeenCalledWith("2");
		expect(removePending).toHaveBeenCalledWith("2");
		expect(removeShelfItem).toHaveBeenCalledWith(item);
	});
});

describe("useFetchMySHelf", () => {
	it("returns shelf from query when successful", async () => {
		const mockShelf = [{ bookId: "1" }, { bookId: "2" }];
		(getShelves as jest.Mock).mockResolvedValue(mockShelf);

		const setShelf = jest.fn();
		(useShelfStore as unknown as jest.Mock).mockReturnValue({
			shelf: [],
			setShelf,
		});

		const { result } = renderHook(() => useFetchMySHelf("user1"), { wrapper });

		await waitFor(() => expect(result.current.shelf).toEqual([]));
		await waitFor(() => expect(setShelf).toHaveBeenCalledWith(mockShelf));
	});

	it("returns store shelf if queryShelf is empty", async () => {
		(getShelves as jest.Mock).mockResolvedValue([]);
		const setShelf = jest.fn();
		(useShelfStore as unknown as jest.Mock).mockReturnValue({
			shelf: [{ bookId: "store" }],
			setShelf,
		});

		const { result } = renderHook(() => useFetchMySHelf("user1"), { wrapper });

		await waitFor(() =>
			expect(result.current.shelf).toEqual([{ bookId: "store" }])
		);
	});
});
