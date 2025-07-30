import { useFavouritesStore } from "@/stores";
import { act } from "@testing-library/react";

describe("useFavouritesStore", () => {
	beforeEach(() => {
		// Clear localStorage before each test
		localStorage.clear();
	});

	it("should have initial empty favourites", () => {
		const state = useFavouritesStore.getState();
		expect(state.favourites).toEqual([]);
	});

	it("should set favourites", () => {
		const items = [{ id: "1", bookId: "Book-1", userId: "User-1" }];
		act(() => {
			useFavouritesStore.getState().setFavourites(items);
		});
		expect(useFavouritesStore.getState().favourites).toEqual(items);
	});
});
