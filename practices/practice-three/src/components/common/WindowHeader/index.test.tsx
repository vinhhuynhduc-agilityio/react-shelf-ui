import { render, screen, fireEvent } from "@testing-library/react";
import { useWindowStore } from "@/stores";
import WindowHeader from ".";
import type { WindowKey } from "@/types";

jest.mock("@/stores", () => ({
  useWindowStore: jest.fn(),
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
  });

  it("should render title and icon image", () => {
    mockedUseWindowStore.mockReturnValue({
      windows: {
        spreadsheet: { isMaximized: false },
      },
    } as ReturnType<typeof useWindowStore>);

    render(<WindowHeader {...defaultProps} />);

    expect(screen.getByAltText("Spreadsheet")).toHaveAttribute(
      "src",
      "/images/spreadsheet.webp"
    );
    expect(screen.getByText("Spreadsheet")).toBeInTheDocument();
  });

  it("should call onMinimize when minimize button clicked", () => {
    mockedUseWindowStore.mockReturnValue({
      windows: {
        spreadsheet: { isMaximized: false },
      },
    } as ReturnType<typeof useWindowStore>);

    render(<WindowHeader {...defaultProps} />);

    const minimizeBtn = screen.getAllByTestId("icon-button")[0];
    fireEvent.click(minimizeBtn);

    expect(defaultProps.onMinimize).toHaveBeenCalledTimes(1);
  });

  it("should call onMaximize when maximize/restore button clicked", () => {
    mockedUseWindowStore.mockReturnValue({
      windows: {
        spreadsheet: { isMaximized: false },
      },
    } as ReturnType<typeof useWindowStore>);

    render(<WindowHeader {...defaultProps} />);

    const maximizeBtn = screen.getAllByTestId("icon-button")[1];
    fireEvent.click(maximizeBtn);

    expect(defaultProps.onMaximize).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when close button clicked", () => {
    mockedUseWindowStore.mockReturnValue({
      windows: {
        spreadsheet: { isMaximized: false },
      },
    } as ReturnType<typeof useWindowStore>);

    render(<WindowHeader {...defaultProps} />);

    const closeBtn = screen.getAllByTestId("icon-button")[2];
    fireEvent.click(closeBtn);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("should have window-drag-handle class for dragging", () => {
    mockedUseWindowStore.mockReturnValue({
      windows: {
        spreadsheet: { isMaximized: false },
      },
    } as ReturnType<typeof useWindowStore>);

    const { container } = render(<WindowHeader {...defaultProps} />);

    const header = container.firstChild as HTMLElement;
    expect(header).toHaveClass("window-drag-handle");
  });

  it("should render all three icon buttons", () => {
    mockedUseWindowStore.mockReturnValue({
      windows: {
        spreadsheet: { isMaximized: false },
      },
    } as ReturnType<typeof useWindowStore>);

    render(<WindowHeader {...defaultProps} />);

    const buttons = screen.getAllByTestId("icon-button");
    expect(buttons).toHaveLength(3);
  });
});
