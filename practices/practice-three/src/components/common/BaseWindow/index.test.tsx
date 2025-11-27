import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useWindowStore } from "@/stores";
import { BaseWindow } from ".";
import type { WindowKey } from "@/types";
import * as windowHooks from "@/hook";
import * as helpers from "@/helpers";

interface WindowStoreState {
  zIndexOrder: WindowKey[];
}

jest.mock("@/stores", () => ({
  useWindowStore: jest.fn(),
}));

jest.mock("@/hook", () => ({
  useWindowState: jest.fn(),
  useWindowActions: jest.fn(),
  useZIndex: jest.fn(),
}));

jest.mock("@/helpers", () => ({
  clampToViewport: jest.fn(),
}));

jest.mock("@/components", () => ({
  DraggableWindow: ({
    children,
    onMouseDown,
    hidden,
    zIndex,
  }: {
    children: React.ReactNode;
    onMouseDown: () => void;
    hidden: boolean;
    zIndex: number;
  }) => (
    <div
      data-testid="draggable-window"
      data-hidden={hidden}
      data-z-index={zIndex}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  ),
  WindowHeader: ({
    title,
    src,
    onClose,
    onMaximize,
    onMinimize,
  }: {
    title: string;
    src: string;
    onClose: () => void;
    onMaximize: () => void;
    onMinimize: () => void;
  }) => (
    <div data-testid="window-header">
      <img src={src} alt={title} />
      <h2>{title}</h2>
      <button data-testid="minimize-btn" onClick={onMinimize}>
        Minimize
      </button>
      <button data-testid="maximize-btn" onClick={onMaximize}>
        Maximize
      </button>
      <button data-testid="close-btn" onClick={onClose}>
        Close
      </button>
    </div>
  ),
}));

const mockedUseWindowStore = useWindowStore as jest.MockedFunction<
  typeof useWindowStore
>;
const mockedUseWindowState = windowHooks.useWindowState as jest.MockedFunction<
  typeof windowHooks.useWindowState
>;
const mockedUseWindowActions =
  windowHooks.useWindowActions as jest.MockedFunction<
    typeof windowHooks.useWindowActions
  >;
const mockedUseZIndex = windowHooks.useZIndex as jest.MockedFunction<
  typeof windowHooks.useZIndex
>;
const mockedClampToViewport = helpers.clampToViewport as jest.MockedFunction<
  typeof helpers.clampToViewport
>;

describe("BaseWindow", () => {
  const defaultWindowState = {
    frame: { x: 0, y: 0, width: 400, height: 300 },
    isMinimized: false,
    isMaximized: false,
    isOpen: true,
  };

  const defaultWindowActions = {
    toggle: jest.fn(),
    close: jest.fn(),
    minimize: jest.fn(),
    maximize: jest.fn(),
    restore: jest.fn(),
    updateFrame: jest.fn(),
  };

  const defaultZIndex = {
    zIndex: 10,
    bringToFront: jest.fn(),
  };

  const defaultProps = {
    windowKey: "spreadsheet" as WindowKey,
    title: "Spreadsheet",
    src: "/images/spreadsheet.png",
    children: <div>Window Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseWindowState.mockReturnValue(defaultWindowState);
    mockedUseWindowActions.mockReturnValue(defaultWindowActions);
    mockedUseZIndex.mockReturnValue(defaultZIndex);
    mockedClampToViewport.mockReturnValue(defaultWindowState.frame);

    // Setup useWindowStore with getState method
    const mockStoreState: WindowStoreState = {
      zIndexOrder: ["spreadsheet"],
    };

    mockedUseWindowStore.mockImplementation((selector: unknown) => {
      const fn = selector as (state: WindowStoreState) => unknown;
      return fn(mockStoreState) as unknown as ReturnType<typeof useWindowStore>;
    });

    // Mock getState as a static method - typed properly
    const getStateFn = (): WindowStoreState => mockStoreState;
    (mockedUseWindowStore.getState as jest.Mock) = jest.fn(getStateFn);
  });

  it("should render window header and children", () => {
    render(<BaseWindow {...defaultProps} />);

    expect(screen.getByTestId("window-header")).toBeInTheDocument();
    expect(screen.getByText("Spreadsheet")).toBeInTheDocument();
    expect(screen.getByText("Window Content")).toBeInTheDocument();
  });

  it("should render window header with correct props", () => {
    render(<BaseWindow {...defaultProps} />);

    const headerImg = screen.getByAltText("Spreadsheet") as HTMLImageElement;
    expect(headerImg).toBeInTheDocument();
    expect(headerImg.src).toContain("/images/spreadsheet.png");
  });

  it("should render DraggableWindow with correct props", () => {
    render(<BaseWindow {...defaultProps} />);

    const draggableWindow = screen.getByTestId("draggable-window");
    expect(draggableWindow).toHaveAttribute("data-z-index", "10");
    expect(draggableWindow).toHaveAttribute("data-hidden", "false");
  });

  it("should hide window when isMinimized is true", () => {
    mockedUseWindowState.mockReturnValue({
      ...defaultWindowState,
      isMinimized: true,
    });

    render(<BaseWindow {...defaultProps} />);

    const draggableWindow = screen.getByTestId("draggable-window");
    expect(draggableWindow).toHaveAttribute("data-hidden", "true");
  });

  it("should call minimize when minimize button clicked", () => {
    render(<BaseWindow {...defaultProps} />);

    fireEvent.click(screen.getByTestId("minimize-btn"));

    expect(defaultWindowActions.minimize).toHaveBeenCalled();
  });

  it("should call maximize when maximize button clicked", () => {
    render(<BaseWindow {...defaultProps} />);

    fireEvent.click(screen.getByTestId("maximize-btn"));

    expect(defaultWindowActions.maximize).toHaveBeenCalled();
  });

  it("should call close when close button clicked", () => {
    render(<BaseWindow {...defaultProps} />);

    fireEvent.click(screen.getByTestId("close-btn"));

    expect(defaultWindowActions.close).toHaveBeenCalled();
  });

  it("should not call bringToFront when window is already topmost", () => {
    // Setup: Make spreadsheet the topmost window
    const mockStoreState: WindowStoreState = {
      zIndexOrder: ["pivot", "spreadsheet"],
    };

    mockedUseWindowStore.mockImplementation((selector: unknown) => {
      const fn = selector as (state: WindowStoreState) => unknown;
      return fn(mockStoreState) as unknown as ReturnType<typeof useWindowStore>;
    });

    const getStateFn = (): WindowStoreState => ({
      ...mockStoreState,
      zIndexOrder: ["pivot", "spreadsheet"],
    });
    (mockedUseWindowStore.getState as jest.Mock) = jest.fn(getStateFn);

    render(<BaseWindow {...defaultProps} />);

    fireEvent.mouseDown(screen.getByTestId("draggable-window"));

    expect(defaultZIndex.bringToFront).not.toHaveBeenCalled();
  });

  it("should add resize listener on mount when not maximized", () => {
    const addEventListenerSpy = jest.spyOn(window, "addEventListener");

    render(<BaseWindow {...defaultProps} />);

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
  });

  it("should not add resize listener when maximized", () => {
    mockedUseWindowState.mockReturnValue({
      ...defaultWindowState,
      isMaximized: true,
    });

    const addEventListenerSpy = jest.spyOn(window, "addEventListener");

    render(<BaseWindow {...defaultProps} />);

    expect(addEventListenerSpy).not.toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
  });

  it("should remove resize listener on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = render(<BaseWindow {...defaultProps} />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });

  it("should clamp frame to viewport on window resize", async () => {
    const clampedFrame = { x: 10, y: 10, width: 400, height: 300 };
    mockedClampToViewport.mockReturnValue(clampedFrame);

    render(<BaseWindow {...defaultProps} />);

    fireEvent.resize(window);

    await waitFor(() => {
      expect(mockedClampToViewport).toHaveBeenCalledWith(
        defaultWindowState.frame
      );
      expect(defaultWindowActions.updateFrame).toHaveBeenCalledWith(
        "spreadsheet",
        clampedFrame
      );
    });
  });

  it("should not update frame if clamped values are same", async () => {
    mockedClampToViewport.mockReturnValue(defaultWindowState.frame);

    render(<BaseWindow {...defaultProps} />);

    fireEvent.resize(window);

    await waitFor(() => {
      expect(defaultWindowActions.updateFrame).not.toHaveBeenCalled();
    });
  });

  it("should memoize component when props unchanged", () => {
    const { rerender } = render(<BaseWindow {...defaultProps} />);

    const firstRender = screen.getByTestId("window-header");
    const firstRenderId = firstRender.getAttribute("data-testid");

    rerender(<BaseWindow {...defaultProps} />);

    const secondRender = screen.getByTestId("window-header");
    const secondRenderId = secondRender.getAttribute("data-testid");

    expect(firstRenderId).toBe(secondRenderId);
  });
});
