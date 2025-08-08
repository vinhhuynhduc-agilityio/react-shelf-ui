import { render, screen, wrapper } from "@/helpers/test-utils";
import ProtectedRoute from ".";
import { useUserStore } from "@/stores";

jest.mock("@/stores", () => ({
  useUserStore: jest.fn(),
}));

const mockedUseUserStore = useUserStore as unknown as jest.Mock;

describe("ProtectedRoute", () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it("redirects to login if not authenticated", () => {
    mockedUseUserStore.mockReturnValue({ currentUser: null });
    render(
      <ProtectedRoute>
        <div>Private Content</div>
      </ProtectedRoute>,
      { wrapper: wrapper }
    );
    expect(screen.queryByText("Private Content")).not.toBeInTheDocument();
  });

  it("renders children if authenticated", () => {
    mockedUseUserStore.mockReturnValue({
      currentUser: { id: "1", name: "User" },
    });
    render(
      <ProtectedRoute>
        <div>Private Content</div>
      </ProtectedRoute>,
      { wrapper: wrapper }
    );
    expect(screen.getByText("Private Content")).toBeInTheDocument();
  });
});
