import { useSearchStore } from "../search";

describe("useSearchStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useSearchStore.setState({
      searchTerm: "",
      selectedFilter: "Title",
    });
  });

  it("should have initial state", () => {
    const state = useSearchStore.getState();
    expect(state.searchTerm).toBe("");
    expect(state.selectedFilter).toBe("Title");
  });

  it("should set searchTerm", () => {
    useSearchStore.getState().setSearchTerm("react");
    expect(useSearchStore.getState().searchTerm).toBe("react");
  });

  it("should set selectedFilter", () => {
    useSearchStore.getState().setSelectedFilter("Author");
    expect(useSearchStore.getState().selectedFilter).toBe("Author");
  });
});
