import { getShelves, addShelfItem, removeShelfItem } from "../shelf";
import { apiRequest } from "../../helpers/api";

jest.mock("../../helpers/api");

describe("getShelves", () => {
  it("calls apiRequest with correct params and returns shelves", async () => {
    const shelves = [{ id: "1", bookId: "b", userId: "u", borrowedDate: "" }];
    (apiRequest as jest.Mock).mockResolvedValue(shelves);
    const result = await getShelves("u");
    expect(apiRequest).toHaveBeenCalledWith(
      "GET",
      expect.stringContaining("userId=u")
    );
    expect(result).toEqual(shelves);
  });
});

describe("addShelfItem", () => {
  it("calls apiRequest with correct params and returns item", async () => {
    const item = { id: "1", bookId: "b", userId: "u", borrowedDate: "" };
    (apiRequest as jest.Mock).mockResolvedValue(item);
    const result = await addShelfItem(item);
    expect(apiRequest).toHaveBeenCalledWith(
      "POST",
      expect.stringContaining("/shelves"),
      item
    );
    expect(result).toEqual(item);
  });
});

describe("removeShelfItem", () => {
  it("calls apiRequest with correct params", async () => {
    (apiRequest as jest.Mock).mockResolvedValue(undefined);
    const item = { id: "1", bookId: "b", userId: "u", borrowedDate: "" };
    await removeShelfItem(item);
    expect(apiRequest).toHaveBeenCalledWith(
      "DELETE",
      expect.stringContaining("/shelves/1")
    );
  });
});
