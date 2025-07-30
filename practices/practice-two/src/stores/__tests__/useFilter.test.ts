import { useSearchFilterStore } from "../searchFilter";

describe("useSearchFilterStore", () => {
	beforeEach(() => {
		useSearchFilterStore.setState({ selectedFilter: "Title" });
	});

	it("should have initial state", () => {
		const state = useSearchFilterStore.getState();
		expect(state.selectedFilter).toBe("Title");
	});

	it("should set selectedFilter", () => {
		useSearchFilterStore.getState().setSelectedFilter("Author");
		const state = useSearchFilterStore.getState();
		expect(state.selectedFilter).toBe("Author");
	});
});
