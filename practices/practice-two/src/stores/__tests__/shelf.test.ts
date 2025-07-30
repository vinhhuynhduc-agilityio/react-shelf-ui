import { useShelfStore } from "@/stores";
import { ShelfItem } from "@/types";
import { act } from "@testing-library/react";

describe("useShelfStore", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("should have initial empty shelf", () => {
		const state = useShelfStore.getState();
		expect(state.shelf).toEqual([]);
	});

	it("should set shelf", () => {
		const items = [
			{
				id: "1",
				bookId: "Book-1",
				userId: "User-1",
				borrowedDate: "2023-10-01",
			},
		] as ShelfItem[];
		act(() => {
			useShelfStore.getState().setShelf(items);
		});
		expect(useShelfStore.getState().shelf).toEqual(items);
	});
});
