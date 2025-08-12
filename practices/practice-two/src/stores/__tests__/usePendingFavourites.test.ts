import { usePendingFavouritesStore } from "../pendingFavourite";

describe("usePendingFavouritesStore", () => {
  beforeEach(() => {
    usePendingFavouritesStore.setState({ pendingFavouritesActions: [] });
  });

  it("should have initial state", () => {
    expect(
      usePendingFavouritesStore.getState().pendingFavouritesActions
    ).toEqual([]);
  });

  it("should add pending id", () => {
    usePendingFavouritesStore.getState().addFavourite("a");
    expect(
      usePendingFavouritesStore.getState().pendingFavouritesActions
    ).toEqual(["a"]);
  });

  it("should remove pending id", () => {
    usePendingFavouritesStore.setState({
      pendingFavouritesActions: ["a", "b"],
    });
    usePendingFavouritesStore.getState().removeFavourite("a");
    expect(
      usePendingFavouritesStore.getState().pendingFavouritesActions
    ).toEqual(["b"]);
  });
});
