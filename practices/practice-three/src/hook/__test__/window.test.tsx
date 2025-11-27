import { renderHook, act } from "@/components/Test/test-utils";
import { useWindowState, useWindowActions, useZIndex } from "../window";
import { useWindowStore } from "@/stores";
import type { WindowKey } from "@/types";

jest.mock("@/stores");
jest.mock("zustand/react/shallow");

describe("useWindowState", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns window state for given windowKey", () => {
    const mockWindowKey: WindowKey = "filemanager";
    const mockState = {
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      frame: { x: 0, y: 0, width: 800, height: 600 },
    };

    (useWindowStore as unknown as jest.Mock).mockReturnValue(mockState);

    const { result } = renderHook(() => useWindowState(mockWindowKey));

    expect(result.current).toEqual(mockState);
    expect(useWindowStore).toHaveBeenCalled();
  });

  it("returns correct window state when minimized", () => {
    const mockWindowKey: WindowKey = "kanban";
    const mockState = {
      isOpen: true,
      isMinimized: true,
      isMaximized: false,
      frame: { x: 100, y: 100, width: 400, height: 300 },
    };

    (useWindowStore as unknown as jest.Mock).mockReturnValue(mockState);

    const { result } = renderHook(() => useWindowState(mockWindowKey));

    expect(result.current.isMinimized).toBe(true);
    expect(result.current.isMaximized).toBe(false);
  });
});

describe("useWindowActions", () => {
  const mockWindowKey: WindowKey = "filemanager";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns window action callbacks", () => {
    const mockActions = {
      toggleWindow: jest.fn(),
      closeWindow: jest.fn(),
      minimizeWindow: jest.fn(),
      maximizeWindow: jest.fn(),
      restoreWindow: jest.fn(),
      setFrame: jest.fn(),
    };

    (useWindowStore as unknown as jest.Mock).mockReturnValue(mockActions);

    const { result } = renderHook(() => useWindowActions(mockWindowKey));

    expect(result.current).toHaveProperty("toggle");
    expect(result.current).toHaveProperty("close");
    expect(result.current).toHaveProperty("minimize");
    expect(result.current).toHaveProperty("maximize");
    expect(result.current).toHaveProperty("restore");
    expect(result.current).toHaveProperty("updateFrame");
  });

  it("closes window successfully", () => {
    const mockCloseWindow = jest.fn();
    const mockActions = {
      toggleWindow: jest.fn(),
      closeWindow: mockCloseWindow,
      minimizeWindow: jest.fn(),
      maximizeWindow: jest.fn(),
      restoreWindow: jest.fn(),
      setFrame: jest.fn(),
    };

    (useWindowStore as unknown as jest.Mock).mockReturnValue(mockActions);

    const { result } = renderHook(() => useWindowActions(mockWindowKey));

    act(() => {
      result.current.close();
    });

    expect(mockCloseWindow).toHaveBeenCalledWith(mockWindowKey);
    expect(mockCloseWindow).toHaveBeenCalledTimes(1);
  });

  it("minimizes window successfully", () => {
    const mockMinimizeWindow = jest.fn();
    const mockActions = {
      toggleWindow: jest.fn(),
      closeWindow: jest.fn(),
      minimizeWindow: mockMinimizeWindow,
      maximizeWindow: jest.fn(),
      restoreWindow: jest.fn(),
      setFrame: jest.fn(),
    };

    (useWindowStore as unknown as jest.Mock).mockReturnValue(mockActions);

    const { result } = renderHook(() => useWindowActions(mockWindowKey));

    act(() => {
      result.current.minimize();
    });

    expect(mockMinimizeWindow).toHaveBeenCalledWith(mockWindowKey);
  });

  it("maximizes window successfully", () => {
    const mockMaximizeWindow = jest.fn();
    const mockActions = {
      toggleWindow: jest.fn(),
      closeWindow: jest.fn(),
      minimizeWindow: jest.fn(),
      maximizeWindow: mockMaximizeWindow,
      restoreWindow: jest.fn(),
      setFrame: jest.fn(),
    };

    (useWindowStore as unknown as jest.Mock).mockReturnValue(mockActions);

    const { result } = renderHook(() => useWindowActions(mockWindowKey));

    act(() => {
      result.current.maximize();
    });

    expect(mockMaximizeWindow).toHaveBeenCalledWith(mockWindowKey);
  });

  it("restores window successfully", () => {
    const mockRestoreWindow = jest.fn();
    const mockActions = {
      toggleWindow: jest.fn(),
      closeWindow: jest.fn(),
      minimizeWindow: jest.fn(),
      maximizeWindow: jest.fn(),
      restoreWindow: mockRestoreWindow,
      setFrame: jest.fn(),
    };

    (useWindowStore as unknown as jest.Mock).mockReturnValue(mockActions);

    const { result } = renderHook(() => useWindowActions(mockWindowKey));

    act(() => {
      result.current.restore();
    });

    expect(mockRestoreWindow).toHaveBeenCalledWith(mockWindowKey);
  });

  it("toggles window successfully", () => {
    const mockToggleWindow = jest.fn();
    const mockActions = {
      toggleWindow: mockToggleWindow,
      closeWindow: jest.fn(),
      minimizeWindow: jest.fn(),
      maximizeWindow: jest.fn(),
      restoreWindow: jest.fn(),
      setFrame: jest.fn(),
    };

    (useWindowStore as unknown as jest.Mock).mockReturnValue(mockActions);

    const { result } = renderHook(() => useWindowActions(mockWindowKey));

    act(() => {
      result.current.toggle();
    });

    expect(mockToggleWindow).toHaveBeenCalledWith(mockWindowKey);
  });

  it("updates frame successfully", () => {
    const mockSetFrame = jest.fn();
    const mockRect = { x: 100, y: 100, width: 800, height: 600 };
    const mockActions = {
      toggleWindow: jest.fn(),
      closeWindow: jest.fn(),
      minimizeWindow: jest.fn(),
      maximizeWindow: jest.fn(),
      restoreWindow: jest.fn(),
      setFrame: mockSetFrame,
    };

    (useWindowStore as unknown as jest.Mock).mockReturnValue(mockActions);

    const { result } = renderHook(() => useWindowActions(mockWindowKey));

    act(() => {
      result.current.updateFrame(mockWindowKey, mockRect);
    });

    expect(mockSetFrame).toHaveBeenCalledWith(mockWindowKey, mockRect);
  });
});

describe("useZIndex", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calculates zIndex correctly", () => {
    const mockSetZIndexOrder = jest.fn();
    const mockState = {
      zIndexOrder: ["kanban", "filemanager", "pivot"],
      setZIndexOrder: mockSetZIndexOrder,
    };

    (useWindowStore as unknown as jest.Mock).mockReturnValue(mockState);

    const { result } = renderHook(() => useZIndex("filemanager"));

    expect(result.current.zIndex).toBe(2); // index 1 + 1
  });

  it("calculates zIndex as 1 when window is first in order", () => {
    const mockSetZIndexOrder = jest.fn();
    const mockState = {
      zIndexOrder: ["filemanager"],
      setZIndexOrder: mockSetZIndexOrder,
    };

    (useWindowStore as unknown as jest.Mock).mockReturnValue(mockState);

    const { result } = renderHook(() => useZIndex("filemanager"));

    expect(result.current.zIndex).toBe(1);
  });

  it("brings window to front successfully", () => {
    const mockSetZIndexOrder = jest.fn();
    const mockState = {
      zIndexOrder: ["kanban", "filemanager"],
      setZIndexOrder: mockSetZIndexOrder,
    };

    (useWindowStore as unknown as jest.Mock).mockReturnValue(mockState);

    const { result } = renderHook(() => useZIndex("kanban"));

    act(() => {
      result.current.bringToFront();
    });

    expect(mockSetZIndexOrder).toHaveBeenCalledWith("kanban");
  });

  it("does not call setZIndexOrder when window is already at front", () => {
    const mockSetZIndexOrder = jest.fn();
    const mockState = {
      zIndexOrder: ["kanban", "filemanager"],
      setZIndexOrder: mockSetZIndexOrder,
    };

    (useWindowStore as unknown as jest.Mock).mockReturnValue(mockState);

    const { result } = renderHook(() => useZIndex("filemanager"));

    act(() => {
      result.current.bringToFront();
    });

    expect(mockSetZIndexOrder).not.toHaveBeenCalled();
  });
});
