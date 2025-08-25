import { getUserByEmail, updateUser } from "../user";
import { apiRequest } from "../../helpers/api";
import { MOCK_USER } from "@/__mocks__/user";

jest.mock("../../helpers/api");

describe("getUserByEmail", () => {
  it("returns user if found", async () => {
    (apiRequest as jest.Mock).mockResolvedValue([MOCK_USER]);
    const result = await getUserByEmail("huongque@gmail.com");
    expect(apiRequest).toHaveBeenCalledWith(
      "GET",
      expect.stringContaining("email=huongque@gmail.com")
    );
    expect(result).toEqual(MOCK_USER);
  });
  it("returns null if not found", async () => {
    (apiRequest as jest.Mock).mockResolvedValue([]);
    const result = await getUserByEmail("notfound@email.com");
    expect(result).toBeNull();
  });
});

describe("updateUser", () => {
  it("calls apiRequest with correct params and returns user", async () => {
    (apiRequest as jest.Mock).mockResolvedValue(MOCK_USER);
    const result = await updateUser(MOCK_USER);
    expect(apiRequest).toHaveBeenCalledWith(
      "PUT",
      expect.stringContaining("/users/1"),
      MOCK_USER
    );
    expect(result).toEqual(MOCK_USER);
  });
});
