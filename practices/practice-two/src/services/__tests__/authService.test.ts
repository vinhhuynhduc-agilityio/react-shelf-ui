import { registerUser } from "../authService";
import { apiRequest } from "../apiRequest";

jest.mock("../apiRequest");
jest.mock("uuid", () => ({ v4: () => "mock-uuid" }));

describe("registerUser", () => {
	it("calls apiRequest with correct params and returns user", async () => {
		const user = { fullName: "A", email: "a@email.com", password: "123" };
		const expectedUser = { ...user, id: "mock-uuid", avatarUrl: "" };
		(apiRequest as jest.Mock).mockResolvedValue(expectedUser);
		const result = await registerUser(user);
		expect(apiRequest).toHaveBeenCalledWith(
			"POST",
			expect.stringContaining("/users"),
			expectedUser
		);
		expect(result).toEqual(expectedUser);
	});
});
