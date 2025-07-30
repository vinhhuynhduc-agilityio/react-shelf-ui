import { act } from "@testing-library/react";
import { useShelfChangedStore } from "@/stores";

describe("useShelfChangedStore", () => {
	it("should have initial shelfChanged false", () => {
		const state = useShelfChangedStore.getState();
		expect(state.shelfChanged).toBe(false);
	});

	it("should set shelfChanged", () => {
		act(() => {
			useShelfChangedStore.getState().setShelfChanged(true);
		});
		expect(useShelfChangedStore.getState().shelfChanged).toBe(true);
	});
});
