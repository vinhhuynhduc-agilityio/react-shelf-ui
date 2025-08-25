import {
  getFavourites,
  addFavouriteItem,
  removeFavouriteItem,
} from "../favourite";
import { apiRequest } from "../../helpers/api";

jest.mock("../../helpers/api");

describe("getFavourites", () => {
  it("calls apiRequest with correct params and returns favourites", async () => {
    const favs = [{ id: "1", bookId: "b", userId: "u" }];
    (apiRequest as jest.Mock).mockResolvedValue(favs);
    const result = await getFavourites("u");
    expect(apiRequest).toHaveBeenCalledWith(
      "GET",
      expect.stringContaining("userId=u")
    );
    expect(result).toEqual(favs);
  });
});

describe("addFavouriteItem", () => {
  it("calls apiRequest with correct params and returns item", async () => {
    const item = { id: "1", bookId: "b", userId: "u" };
    (apiRequest as jest.Mock).mockResolvedValue(item);
    const result = await addFavouriteItem(item);
    expect(apiRequest).toHaveBeenCalledWith(
      "POST",
      expect.stringContaining("/favourites"),
      item
    );
    expect(result).toEqual(item);
  });
});

describe("removeFavouriteItem", () => {
  it("calls apiRequest with correct params", async () => {
    (apiRequest as jest.Mock).mockResolvedValue(undefined);
    const item = { id: "1", bookId: "b", userId: "u" };
    await removeFavouriteItem(item);
    expect(apiRequest).toHaveBeenCalledWith(
      "DELETE",
      expect.stringContaining("/favourites/1")
    );
  });
});
