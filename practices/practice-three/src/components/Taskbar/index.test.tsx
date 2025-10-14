import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Taskbar from "@/components/Taskbar";
import { DESKTOP_ICONS } from "@/constant";
import { useWindowStore } from "@/stores";

jest.mock("@/stores", () => ({
  useWindowStore: jest.fn(),
}));

const mockedUseWindowStore = useWindowStore as unknown as jest.Mock;

describe("Taskbar", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when no windows are open", () => {
    mockedUseWindowStore.mockImplementation(() => ({
      windows: {
        spreadsheet: { isOpen: false, isMinimized: false },
        pivot: { isOpen: false, isMinimized: false },
        kanban: { isOpen: false, isMinimized: false },
        filemanager: { isOpen: false, isMinimized: false },
      },
      zIndexOrder: [],
      setZIndexOrder: jest.fn(),
      minimizeWindow: jest.fn(),
      restoreWindow: jest.fn(),
    }));

    const { container } = render(<Taskbar />);
    // no task buttons rendered
    expect(container.querySelectorAll("button").length).toBe(0);
  });

  it("renders a task button for each open window", () => {
    mockedUseWindowStore.mockImplementation(() => ({
      windows: {
        spreadsheet: { isOpen: true, isMinimized: false },
        pivot: { isOpen: true, isMinimized: false },
        kanban: { isOpen: false, isMinimized: false },
        filemanager: { isOpen: false, isMinimized: false },
      },
      zIndexOrder: ["spreadsheet", "pivot"],
      setZIndexOrder: jest.fn(),
      minimizeWindow: jest.fn(),
      restoreWindow: jest.fn(),
    }));

    render(<Taskbar />);

    const spreadsheetMeta = DESKTOP_ICONS.find((i) => i.key === "spreadsheet")!;
    const pivotMeta = DESKTOP_ICONS.find((i) => i.key === "pivot")!;

    expect(screen.getByTitle(spreadsheetMeta.title)).toBeInTheDocument();
    expect(screen.getByTitle(pivotMeta.title)).toBeInTheDocument();
  });

  it("clicking minimized task calls restoreWindow and setZIndexOrder", () => {
    const setZIndexOrder = jest.fn();
    const restoreWindow = jest.fn();
    mockedUseWindowStore.mockImplementation(() => ({
      windows: {
        spreadsheet: { isOpen: true, isMinimized: true },
        pivot: { isOpen: false, isMinimized: false },
        kanban: { isOpen: false, isMinimized: false },
        filemanager: { isOpen: false, isMinimized: false },
      },
      zIndexOrder: ["pivot"], // topMost not spreadsheet
      setZIndexOrder,
      minimizeWindow: jest.fn(),
      restoreWindow,
    }));

    render(<Taskbar />);

    const spreadsheetMeta = DESKTOP_ICONS.find((i) => i.key === "spreadsheet")!;
    const btn = screen.getByTitle(spreadsheetMeta.title);
    fireEvent.click(btn);

    expect(restoreWindow).toHaveBeenCalledWith("spreadsheet");
    expect(setZIndexOrder).toHaveBeenCalledWith("spreadsheet");
  });

  it("clicking visible but behind task brings it to front (setZIndexOrder)", () => {
    const setZIndexOrder = jest.fn();
    mockedUseWindowStore.mockImplementation(() => ({
      windows: {
        spreadsheet: { isOpen: true, isMinimized: false },
        pivot: { isOpen: true, isMinimized: false },
        kanban: { isOpen: false, isMinimized: false },
        filemanager: { isOpen: false, isMinimized: false },
      },
      zIndexOrder: ["spreadsheet"], // topMost is spreadsheet
      setZIndexOrder,
      minimizeWindow: jest.fn(),
      restoreWindow: jest.fn(),
    }));

    render(<Taskbar />);

    // pivot is visible but not top-most (not last in zIndexOrder)
    const pivotMeta = DESKTOP_ICONS.find((i) => i.key === "pivot")!;
    const btn = screen.getByTitle(pivotMeta.title);
    screen.debug(btn);
    fireEvent.click(btn);

    expect(setZIndexOrder).toHaveBeenCalledWith("pivot");
  });

  it("clicking top-most visible task minimizes it", () => {
    const setZIndexOrder = jest.fn();
    const minimizeWindow = jest.fn();
    mockedUseWindowStore.mockImplementation(() => ({
      windows: {
        spreadsheet: { isOpen: true, isMinimized: false },
        pivot: { isOpen: false, isMinimized: false },
        kanban: { isOpen: false, isMinimized: false },
        filemanager: { isOpen: false, isMinimized: false },
      },
      zIndexOrder: ["spreadsheet"], // topMost is spreadsheet
      setZIndexOrder,
      minimizeWindow,
      restoreWindow: jest.fn(),
    }));

    render(<Taskbar />);

    const spreadsheetMeta = DESKTOP_ICONS.find((i) => i.key === "spreadsheet")!;
    const btn = screen.getByTitle(spreadsheetMeta.title);
    fireEvent.click(btn);

    expect(minimizeWindow).toHaveBeenCalledWith("spreadsheet");
  });
});
