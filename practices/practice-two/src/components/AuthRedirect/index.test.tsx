import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import AuthRedirect from ".";
import { useUserStore } from "@/stores";
import { MOCK_USER } from "@/__mocks__/user";

// Mock useUserStore
jest.mock("@/stores/user", () => ({
  useUserStore: jest.fn(),
}));

// Mock SignInPage to avoid internal router hook errors
jest.mock("@/pages/SignInPage", () => ({
  __esModule: true,
  default: () => <div>Sign In Page</div>,
}));

describe("AuthRedirect", () => {
  it("redirects to home if currentUser exists", () => {
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      currentUser: MOCK_USER,
    });
    render(
      <MemoryRouter>
        <AuthRedirect />
      </MemoryRouter>
    );
    expect(screen.queryByText(/Sign In Page/i)).not.toBeInTheDocument();
  });

  it("renders SignInPage if currentUser is null", () => {
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      currentUser: null,
    });
    render(
      <MemoryRouter>
        <AuthRedirect />
      </MemoryRouter>
    );
    expect(screen.getByText(/Sign In Page/i)).toBeInTheDocument();
  });
});
