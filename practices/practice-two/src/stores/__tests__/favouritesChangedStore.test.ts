import { useFavouritesChangedStore } from "@/stores";
import { act } from "@testing-library/react";

describe("useFavouritesChangedStore", () => {
	it("should have initial favouritesChanged false", () => {
		const state = useFavouritesChangedStore.getState();
		expect(state.favouritesChanged).toBe(false);
	});

	it("should set favouritesChanged", () => {
		act(() => {
			useFavouritesChangedStore.getState().setFavouritesChanged(true);
		});
		expect(useFavouritesChangedStore.getState().favouritesChanged).toBe(true);
	});
});
