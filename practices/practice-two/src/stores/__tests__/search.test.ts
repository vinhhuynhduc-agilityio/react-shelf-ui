import { useSearchStore } from "../search";

describe("useSearchStore", () => {
  beforeEach(() => {
    useSearchStore.setState({
      searchTerm: "",
      valueSearch: "",
    });
  });

  it("should have initial state", () => {
    const state = useSearchStore.getState();
    expect(state.searchTerm).toBe("");
    expect(state.valueSearch).toBe("");
  });

  it("should set searchTerm", () => {
    useSearchStore.getState().setSearchTerm("abc");
    expect(useSearchStore.getState().searchTerm).toBe("abc");
  });

  it("should set valueSearch", () => {
    useSearchStore.getState().setValueSearch("xyz");
    expect(useSearchStore.getState().valueSearch).toBe("xyz");
  });
});
