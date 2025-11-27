import { render, screen, fireEvent } from "@testing-library/react";
import { useWindowStore } from "@/stores";
import WindowHeader from ".";
import type { WindowKey } from "@/types";

jest.mock("@/stores", () => ({
  useWindowStore: jest.fn(),
}));

jest.mock("@/components", () => ({
  IconButton: ({
    iconStyles,
    onClick,
  }: {
    iconStyles?: string;
    onClick?: () => void;
  }) => <button onClick={onClick} data-testid={`icon-btn-${iconStyles}`} />,
}));

const mockedUseWindowStore = useWindowStore as jest.MockedFunction<
  typeof useWindowStore
>;

describe("WindowHeader", () => {
  const defaultProps = {
    windowKey: "spreadsheet" as WindowKey,
    src: "/images/spreadsheet.png",
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
      "/images/spreadsheet.png"
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

    const minimizeBtn = screen.getByTestId(
      "icon-btn-fa-solid fa-minus text-[#94A1B3] rounded-full px-[4px] py-[3px] hover:bg-gray-100"
    );
    fireEvent.click(minimizeBtn);

    expect(defaultProps.onMinimize).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when close button clicked", () => {
    mockedUseWindowStore.mockReturnValue({
      windows: {
        spreadsheet: { isMaximized: false },
      },
    } as ReturnType<typeof useWindowStore>);

    render(<WindowHeader {...defaultProps} />);

    const closeBtn = screen.getByTestId(
      "icon-btn-fa-solid fa-xmark text-[#94A1B3] rounded-full px-[6px] py-[3px] hover:bg-gray-100"
    );
    fireEvent.click(closeBtn);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("should render maximize icon when window not maximized", () => {
    mockedUseWindowStore.mockReturnValue({
      windows: {
        spreadsheet: { isMaximized: false },
      },
    } as ReturnType<typeof useWindowStore>);

    render(<WindowHeader {...defaultProps} />);

    expect(
      screen.getByTestId(
        "icon-btn-fa-regular fa-square text-[#94A1B3] rounded-full px-[4px] py-[3px] hover:bg-gray-100"
      )
    ).toBeInTheDocument();
  });

  it("should call onMaximize when maximize/restore button clicked", () => {
    mockedUseWindowStore.mockReturnValue({
      windows: {
        spreadsheet: { isMaximized: false },
      },
    } as ReturnType<typeof useWindowStore>);

    render(<WindowHeader {...defaultProps} />);

    const maximizeBtn = screen.getByTestId(
      "icon-btn-fa-regular fa-square text-[#94A1B3] rounded-full px-[4px] py-[3px] hover:bg-gray-100"
    );
    fireEvent.click(maximizeBtn);

    expect(defaultProps.onMaximize).toHaveBeenCalledTimes(1);
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
});
