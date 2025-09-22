import { render, screen, fireEvent } from "@testing-library/react";
import Toast from ".";
import { useToastStore } from "@/stores";

jest.mock("@/stores", () => ({
  useToastStore: jest.fn(),
}));

describe("Toast Component", () => {
  const mockRemoveToast = jest.fn();

  const mockToasts = [
    { id: "1", message: "Success!", variant: "success" },
    { id: "2", message: "Error!", variant: "error" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useToastStore as unknown as jest.Mock).mockReturnValue({
      toasts: [],
      removeToast: mockRemoveToast,
    });
  });

  it("renders Success and Error toasts with correct messages and variants", () => {
    (useToastStore as unknown as jest.Mock).mockReturnValue({
      toasts: mockToasts,
      removeToast: mockRemoveToast,
    });
    render(<Toast />);
    expect(screen.getByText("Success!")).toBeInTheDocument();
    expect(screen.getByText("Error!")).toBeInTheDocument();
  });

  it("calls removeToast with correct id when close button is clicked", () => {
    (useToastStore as unknown as jest.Mock).mockReturnValue({
      toasts: mockToasts,
      removeToast: mockRemoveToast,
    });
    render(<Toast />);
    const closeButtons = screen.getAllByRole("button", {
      name: /close toast/i,
    });
    fireEvent.click(closeButtons[1]);
    expect(mockRemoveToast).toHaveBeenCalledWith("2");
  });

  it("matches snapshot with multiple toasts", () => {
    (useToastStore as unknown as jest.Mock).mockReturnValue({
      toasts: mockToasts,
      removeToast: mockRemoveToast,
    });
    const { asFragment } = render(<Toast />);
    expect(asFragment()).toMatchSnapshot();
  });
});
