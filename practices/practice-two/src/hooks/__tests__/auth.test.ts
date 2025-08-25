import { waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { wrapper } from "@/components/Test/test-utils";
import { registerUser } from "@/services";
import { useRegisterUser } from "../auth";

jest.mock("@/services", () => ({
  registerUser: jest.fn(),
}));

describe("useRegisterUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call registerUser with correct payload and set isSuccess", async () => {
    const payload = {
      fullName: "Test User",
      email: "test@email.com",
      password: "123456",
    };
    (registerUser as jest.Mock).mockResolvedValue({
      id: "1",
      ...payload,
      avatarUrl: "",
      registerNumber: "",
      phoneNumber: "",
      bio: "",
      countryCode: "",
    });

    const { result } = renderHook(() => useRegisterUser(), { wrapper });
    await waitFor(() => {
      result.current.mutateAsync(payload);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(registerUser).toHaveBeenCalledWith(payload);
  });
  it("should handle error correctly", async () => {
    const errorMessage = "Failed to register user";
    (registerUser as jest.Mock).mockImplementation(() =>
      Promise.reject(new Error(errorMessage))
    );
    const payload = {
      fullName: "Test User",
      email: "test@email.com",
      password: "123456",
    };
    const { result } = renderHook(() => useRegisterUser(), { wrapper });
    await waitFor(() => {
      expect(result.current.mutateAsync(payload)).rejects.toThrow(errorMessage);
    });
    await waitFor(() => result.current.isError);
    expect((result.current.error as Error).message).toBe(errorMessage);
    expect(registerUser).toHaveBeenCalledWith(payload);
  });
});
