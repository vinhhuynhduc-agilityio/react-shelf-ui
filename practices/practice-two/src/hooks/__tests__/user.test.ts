import { waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { wrapper } from "@/helpers/test-utils";
import { fetchUserByEmail, updateUser } from "@/services";
import { useGetUser, useCurrentUser, useUpdateUser } from "../user";
import { useToastStore, useUserStore } from "@/stores";

jest.mock("@/services", () => ({
	fetchUserByEmail: jest.fn(),
	updateUser: jest.fn(),
}));
jest.mock("@/helpers", () => ({
	showDefaultErrorToast: jest.fn(),
}));

jest.mock("@/stores", () => ({
	useToastStore: jest.fn(),
	useUserStore: jest.fn(),
}));

const MOCK_USER = {
	id: "1",
	fullName: "Test User",
	email: "test@email.com",
	password: "",
	avatarUrl: "",
	registerNumber: "",
	phoneNumber: "",
	bio: "",
	countryCode: "",
};

describe("useGetUser", () => {
	const showToast = jest.fn();
	beforeEach(() => {
		(useToastStore as unknown as jest.Mock).mockImplementation(
			(cb: (store: { showToast: jest.Mock }) => unknown) => cb({ showToast })
		);
		jest.clearAllMocks();
	});
	it("should call fetchUserByEmail and return user", async () => {
		(fetchUserByEmail as jest.Mock).mockResolvedValue(MOCK_USER);
		const { result } = renderHook(() => useGetUser(), { wrapper });
		await result.current.mutateAsync("test@email.com");
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(fetchUserByEmail).toHaveBeenCalledWith("test@email.com");
	});
	it("should call showToast on error", async () => {
		const error = { response: { data: { error: "err" } } };
		(fetchUserByEmail as jest.Mock).mockRejectedValue(error);
		const { result } = renderHook(() => useGetUser(), { wrapper });
		await expect(result.current.mutateAsync("fail@email.com")).rejects.toBe(
			error
		);
		await waitFor(() => result.current.isError);
		expect(showToast).toHaveBeenCalledWith("err", "error");
	});
});

describe("useCurrentUser", () => {
	beforeEach(() => {
		(useUserStore as unknown as jest.Mock).mockImplementation(
			(cb: (store: { currentUser: typeof MOCK_USER }) => unknown) =>
				cb({ currentUser: MOCK_USER })
		);
	});
	it("should return current user from store", () => {
		const { result } = renderHook(() => useCurrentUser());
		expect(result.current).toEqual(MOCK_USER);
	});
});

describe("useUpdateUser", () => {
	const setUser = jest.fn();
	beforeEach(() => {
		(useUserStore as unknown as jest.Mock).mockImplementation(
			(cb: (store: { setUser: typeof setUser }) => unknown) => cb({ setUser })
		);
		jest.clearAllMocks();
	});
	it("should call updateUser with correct payload and set isSuccess", async () => {
		(updateUser as jest.Mock).mockResolvedValue(MOCK_USER);
		const { result } = renderHook(() => useUpdateUser(), { wrapper });
		await result.current.mutateAsync(MOCK_USER);
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(updateUser).toHaveBeenCalledWith(MOCK_USER);
		expect(setUser).toHaveBeenCalledWith(MOCK_USER);
	});
	it("should handle error correctly", async () => {
		const errorMessage = "Failed to update user";
		(updateUser as jest.Mock).mockImplementation(() =>
			Promise.reject(new Error(errorMessage))
		);
		const { result } = renderHook(() => useUpdateUser(), { wrapper });
		await expect(result.current.mutateAsync(MOCK_USER)).rejects.toThrow(
			errorMessage
		);
		await waitFor(() => result.current.isError);
		expect((result.current.error as Error).message).toBe(errorMessage);
		expect(updateUser).toHaveBeenCalledWith(MOCK_USER);
	});
});
