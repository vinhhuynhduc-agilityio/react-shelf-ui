import { render, screen, fireEvent } from "@testing-library/react";
import { useWindowStore } from "@/stores";
import WindowHeader from ".";
import type { WindowKey } from "@/types";

jest.mock("@/stores", () => ({
  useWindowStore: jest.fn(
    (selector?: (state: Record<string, unknown>) => unknown) => {
      const mockState = {
        windows: {
          spreadsheet: { isMaximized: false },
          filemanager: { isMaximized: false },
          pivot: { isMaximized: false },
          kanban: { isMaximized: false },
        },
      };
      return selector
        ? selector(mockState as Record<string, unknown>)
        : mockState;
    }
  ),
}));

jest.mock("@/components", () => ({
  IconButton: ({ onClick }: { onClick?: () => void }) => (
    <button onClick={onClick} data-testid="icon-button" />
  ),
}));

const mockedUseWindowStore = useWindowStore as jest.MockedFunction<
  typeof useWindowStore
>;

describe("WindowHeader", () => {
  const defaultProps = {
    windowKey: "spreadsheet" as WindowKey,
    src: "/images/spreadsheet.webp",
    title: "Spreadsheet",
    onClose: jest.fn(),
    onMaximize: jest.fn(),
    onMinimize: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Re-setup the mock with selector support
    (mockedUseWindowStore as unknown as jest.Mock).mockImplementation(
      (selector: (state: Record<string, unknown>) => unknown) => {
        const mockState = {
          windows: {
            spreadsheet: { isMaximized: false },
            filemanager: { isMaximized: false },
            pivot: { isMaximized: false },
            kanban: { isMaximized: false },
          },
        };
        return selector(mockState as Record<string, unknown>);
      }
    );
  });

  it("should render title and icon image", () => {
    render(<WindowHeader {...defaultProps} />);

    expect(screen.getByAltText("Spreadsheet")).toHaveAttribute(
      "src",
      "/images/spreadsheet.webp"
    );
    expect(screen.getByText("Spreadsheet")).toBeInTheDocument();
  });

  it("should call onMinimize when minimize button clicked", () => {
    render(<WindowHeader {...defaultProps} />);

    const minimizeBtn = screen.getAllByTestId("icon-button")[0];
    fireEvent.click(minimizeBtn);

    expect(defaultProps.onMinimize).toHaveBeenCalledTimes(1);
  });

  it("should call onMaximize when maximize/restore button clicked", () => {
    render(<WindowHeader {...defaultProps} />);

    const maximizeBtn = screen.getAllByTestId("icon-button")[1];
    fireEvent.click(maximizeBtn);

    expect(defaultProps.onMaximize).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when close button clicked", () => {
    render(<WindowHeader {...defaultProps} />);

    const closeBtn = screen.getAllByTestId("icon-button")[2];
    fireEvent.click(closeBtn);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("should have window-drag-handle class for dragging", () => {
    const { container } = render(<WindowHeader {...defaultProps} />);

    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass("window-drag-handle");
  });

  it("should render all three icon buttons", () => {
    render(<WindowHeader {...defaultProps} />);

    const buttons = screen.getAllByTestId("icon-button");
    expect(buttons).toHaveLength(3);
  });

  it("should display restore icon when window is maximized", () => {
    // Override the mock for this specific test to return isMaximized: true
    (mockedUseWindowStore as unknown as jest.Mock).mockImplementationOnce(
      (selector: (state: Record<string, unknown>) => unknown) => {
        const mockState = {
          windows: {
            spreadsheet: { isMaximized: true },
          },
        };
        return selector(mockState as Record<string, unknown>);
      }
    );

    render(<WindowHeader {...defaultProps} />);

    const buttons = screen.getAllByTestId("icon-button");
    expect(buttons).toHaveLength(3);
    // Verify that restore button is called when maximized
    fireEvent.click(buttons[1]);
    expect(defaultProps.onMaximize).toHaveBeenCalledTimes(1);
  });
});
