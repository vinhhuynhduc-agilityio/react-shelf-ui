import { render, screen, fireEvent } from "@testing-library/react";
import Taskbar from ".";
import { useWindowStore } from "@/stores";

jest.mock("@/stores", () => ({
  useWindowStore: jest.fn(),
}));

jest.mock("@/constant", () => ({
  DESKTOP_ICONS: [
    { key: "spreadsheet", title: "Spreadsheet", image: "/spreadsheet.png" },
    { key: "calculator", title: "Calculator", image: "/calculator.png" },
  ],
}));

jest.mock("@/components/common/IconButton", () => {
  return function MockIconButton({
    onClick,
    iconStyles,
    buttonStyles,
  }: {
    onClick?: () => void;
    iconStyles?: string;
    buttonStyles?: string;
  }) {
    return (
      <button onClick={onClick} className={buttonStyles}>
        <i className={iconStyles} />
      </button>
    );
  };
});

const mockedUseWindowStore = useWindowStore as jest.MockedFunction<
  typeof useWindowStore
>;

describe("Taskbar", () => {
  const defaultStoreState = {
    windows: {
      spreadsheet: { isOpen: true, isMinimized: false },
      calculator: { isOpen: true, isMinimized: false },
    },
    zIndexOrder: ["spreadsheet", "calculator"],
    setZIndexOrder: jest.fn(),
    minimizeWindow: jest.fn(),
    restoreWindow: jest.fn(),
  };

  const mockOnToggleSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseWindowStore.mockImplementation((selector: unknown) => {
      const fn = selector as (state: typeof defaultStoreState) => unknown;
      return fn(defaultStoreState) as ReturnType<typeof useWindowStore>;
    });
  });

  it("should render taskbar with menu and open windows", () => {
    render(<Taskbar onToggleSearch={mockOnToggleSearch} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(3); // menu + 2 windows
  });

  it("should call onToggleSearch when menu button clicked", () => {
    render(<Taskbar onToggleSearch={mockOnToggleSearch} />);

    const menuButton = screen.getAllByRole("button")[0];
    fireEvent.click(menuButton);

    expect(mockOnToggleSearch).toHaveBeenCalled();
  });

  it("should bring minimized window to front and restore when clicked", () => {
    mockedUseWindowStore.mockImplementation((selector: unknown) => {
      const fn = selector as (state: typeof defaultStoreState) => unknown;
      return fn({
        ...defaultStoreState,
        windows: {
          spreadsheet: { isOpen: true, isMinimized: true },
          calculator: { isOpen: true, isMinimized: false },
        },
      }) as ReturnType<typeof useWindowStore>;
    });

    render(<Taskbar onToggleSearch={mockOnToggleSearch} />);

    const spreadsheetButton = screen.getByTitle("Spreadsheet");
    fireEvent.click(spreadsheetButton);

    expect(defaultStoreState.restoreWindow).toHaveBeenCalledWith("spreadsheet");
    expect(defaultStoreState.setZIndexOrder).toHaveBeenCalledWith(
      "spreadsheet"
    );
  });

  it("should bring window to front when clicked and not topmost", () => {
    mockedUseWindowStore.mockImplementation((selector: unknown) => {
      const fn = selector as (state: typeof defaultStoreState) => unknown;
      return fn({
        ...defaultStoreState,
        zIndexOrder: ["calculator", "spreadsheet"],
      }) as ReturnType<typeof useWindowStore>;
    });

    render(<Taskbar onToggleSearch={mockOnToggleSearch} />);

    const calculatorButton = screen.getByTitle("Calculator");
    fireEvent.click(calculatorButton);

    expect(defaultStoreState.setZIndexOrder).toHaveBeenCalledWith("calculator");
    expect(defaultStoreState.minimizeWindow).not.toHaveBeenCalled();
  });

  it("should minimize topmost window when clicked", () => {
    render(<Taskbar onToggleSearch={mockOnToggleSearch} />);

    const calculatorButton = screen.getByTitle("Calculator");
    fireEvent.click(calculatorButton);

    expect(defaultStoreState.minimizeWindow).toHaveBeenCalledWith("calculator");
  });

  it("should only show open windows", () => {
    mockedUseWindowStore.mockImplementation((selector: unknown) => {
      const fn = selector as (state: typeof defaultStoreState) => unknown;
      return fn({
        ...defaultStoreState,
        windows: {
          spreadsheet: { isOpen: true, isMinimized: false },
          calculator: { isOpen: false, isMinimized: false },
        },
      }) as ReturnType<typeof useWindowStore>;
    });

    render(<Taskbar onToggleSearch={mockOnToggleSearch} />);

    expect(screen.getByTitle("Spreadsheet")).toBeInTheDocument();
    expect(screen.queryByTitle("Calculator")).not.toBeInTheDocument();
  });

  it("should not highlight inactive window", () => {
    render(<Taskbar onToggleSearch={mockOnToggleSearch} />);

    const spreadsheetDiv = screen.getByTitle("Spreadsheet").closest("div");
    expect(spreadsheetDiv).not.toHaveClass("bg-white/10");
  });
});
