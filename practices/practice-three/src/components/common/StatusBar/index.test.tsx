import { render, screen, waitFor } from "@testing-library/react";
import StatusBar from ".";

describe("StatusBar", () => {
  const defaultProps = {
    message: "Operation successful",
    type: "success" as const,
    onClear: jest.fn(),
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should not render when message is null", () => {
    render(<StatusBar message={null} type="success" onClear={jest.fn()} />);

    expect(screen.queryByText("Operation successful")).not.toBeInTheDocument();
  });

  it("should render message with success styling", () => {
    render(<StatusBar {...defaultProps} />);

    expect(screen.getByText("Operation successful")).toBeInTheDocument();
    const messageDiv = screen.getByText("Operation successful").closest("div");
    expect(messageDiv).toHaveClass("bg-green-50", "text-green-700");

    const svg = messageDiv?.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should render message with error styling", () => {
    render(
      <StatusBar message="Operation failed" type="error" onClear={jest.fn()} />
    );

    const messageDiv = screen.getByText("Operation failed").closest("div");
    expect(messageDiv).toHaveClass("bg-red-50", "text-red-700");

    const svg = messageDiv?.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should call onClear after 2 seconds", async () => {
    render(<StatusBar {...defaultProps} />);

    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(defaultProps.onClear).toHaveBeenCalledTimes(1);
    });
  });

  it("should clear timeout when component unmounts", () => {
    const { unmount } = render(<StatusBar {...defaultProps} />);
    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
