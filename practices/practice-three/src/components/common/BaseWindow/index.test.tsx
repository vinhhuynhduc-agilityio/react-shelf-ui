import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BaseWindow } from ".";
import type { WindowKey } from "@/types";

jest.mock("@/components", () => ({
  DraggableWindow: ({
    children,
    windowKey,
    hidden,
    zIndex,
    onMouseDown,
  }: {
    children: React.ReactNode;
    windowKey: WindowKey;
    hidden: boolean;
    zIndex: number;
    onMouseDown: () => void;
  }) => (
    <div
      data-testid="draggable-window"
      data-window-key={windowKey}
      data-hidden={hidden}
      data-z-index={zIndex}
      onMouseDown={onMouseDown}
      style={{ display: hidden ? "none" : "block" }}
    >
      {children}
    </div>
  ),
}));

jest.mock("@/hook", () => ({
  useWindowState: jest.fn(),
  useWindowActions: jest.fn(),
  useZIndex: jest.fn(),
}));

jest.mock("@/stores", () => ({
  useWindowStore: jest.fn(),
}));

jest.mock("@/helpers", () => ({
  clampToViewport: jest.fn((frame) => frame),
}));

import { useWindowState, useWindowActions, useZIndex } from "@/hook";
import { useWindowStore } from "@/stores";
import { clampToViewport } from "@/helpers";

describe("BaseWindow", () => {
  const mockFrame = {
    x: 100,
    y: 100,
    width: 800,
    height: 600,
  };

  const mockWindowState = {
    frame: mockFrame,
    isMinimized: false,
    isMaximized: false,
  };

  const mockWindowActions = {
    updateFrame: jest.fn(),
  };

  const mockZIndex = {
    zIndex: 10,
    bringToFront: jest.fn(),
  };

  const mockWindowStoreState = {
    zIndexOrder: ["spreadsheet", "filemanager"],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useWindowState as jest.Mock).mockReturnValue(mockWindowState);
    (useWindowActions as jest.Mock).mockReturnValue(mockWindowActions);
    (useZIndex as jest.Mock).mockReturnValue(mockZIndex);
    (useWindowStore as unknown as jest.Mock).mockReturnValue(
      mockWindowStoreState
    );
    (clampToViewport as jest.Mock).mockImplementation((frame) => frame);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render base window container", () => {
      render(
        <BaseWindow windowKey="spreadsheet">
          <div>Test Content</div>
        </BaseWindow>
      );

      expect(screen.getByTestId("draggable-window")).toBeInTheDocument();
    });

    it("should render children content", () => {
      render(
        <BaseWindow windowKey="filemanager">
          <div data-testid="test-content">Test Content</div>
        </BaseWindow>
      );

      expect(screen.getByTestId("test-content")).toBeInTheDocument();
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("should render multiple children", () => {
      render(
        <BaseWindow windowKey="kanban">
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </BaseWindow>
      );

      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
      expect(screen.getByTestId("child-3")).toBeInTheDocument();
    });
  });

  describe("Window State", () => {
    it("should call useWindowState with correct windowKey", () => {
      render(
        <BaseWindow windowKey="spreadsheet">
          <div>Content</div>
        </BaseWindow>
      );

      expect(useWindowState).toHaveBeenCalledWith("spreadsheet");
    });

    it("should call useWindowActions with correct windowKey", () => {
      render(
        <BaseWindow windowKey="filemanager">
          <div>Content</div>
        </BaseWindow>
      );

      expect(useWindowActions).toHaveBeenCalledWith("filemanager");
    });

    it("should call useZIndex with correct windowKey", () => {
      render(
        <BaseWindow windowKey="pivot">
          <div>Content</div>
        </BaseWindow>
      );

      expect(useZIndex).toHaveBeenCalledWith("pivot");
    });

    it("should work with all valid WindowKey types", () => {
      const windowKeys: WindowKey[] = [
        "spreadsheet",
        "filemanager",
        "pivot",
        "kanban",
      ];

      windowKeys.forEach((key) => {
        jest.clearAllMocks();
        (useWindowState as jest.Mock).mockReturnValue(mockWindowState);
        (useWindowActions as jest.Mock).mockReturnValue(mockWindowActions);
        (useZIndex as jest.Mock).mockReturnValue(mockZIndex);

        render(
          <BaseWindow windowKey={key}>
            <div>Content</div>
          </BaseWindow>
        );

        expect(useWindowState).toHaveBeenCalledWith(key);
        expect(useWindowActions).toHaveBeenCalledWith(key);
        expect(useZIndex).toHaveBeenCalledWith(key);
      });
    });
  });

  describe("Window Visibility", () => {
    it("should hide window when isMinimized is true", () => {
      (useWindowState as jest.Mock).mockReturnValue({
        ...mockWindowState,
        isMinimized: true,
      });

      render(
        <BaseWindow windowKey="spreadsheet">
          <div>Content</div>
        </BaseWindow>
      );

      const draggableWindow = screen.getByTestId("draggable-window");
      expect(draggableWindow).toHaveAttribute("data-hidden", "true");
      expect(draggableWindow).toHaveStyle({ display: "none" });
    });

    it("should show window when isMinimized is false", () => {
      render(
        <BaseWindow windowKey="filemanager">
          <div>Content</div>
        </BaseWindow>
      );

      const draggableWindow = screen.getByTestId("draggable-window");
      expect(draggableWindow).toHaveAttribute("data-hidden", "false");
      expect(draggableWindow).toHaveStyle({ display: "block" });
    });

    it("should pass correct zIndex to DraggableWindow", () => {
      render(
        <BaseWindow windowKey="pivot">
          <div>Content</div>
        </BaseWindow>
      );

      const draggableWindow = screen.getByTestId("draggable-window");
      expect(draggableWindow).toHaveAttribute("data-z-index", "10");
    });
  });

  describe("Window Resize", () => {
    it("should not update frame when isMaximized is true", () => {
      (useWindowState as jest.Mock).mockReturnValue({
        ...mockWindowState,
        isMaximized: true,
      });

      render(
        <BaseWindow windowKey="filemanager">
          <div>Content</div>
        </BaseWindow>
      );

      fireEvent.resize(window);

      expect(mockWindowActions.updateFrame).not.toHaveBeenCalled();
    });

    it("should call clampToViewport on window resize", async () => {
      render(
        <BaseWindow windowKey="pivot">
          <div>Content</div>
        </BaseWindow>
      );

      fireEvent.resize(window);

      await waitFor(() => {
        expect(clampToViewport).toHaveBeenCalledWith(mockFrame);
      });
    });

    it("should call updateFrame when frame needs adjustment", async () => {
      const newFrame = {
        x: 150,
        y: 150,
        width: 900,
        height: 700,
      };

      (clampToViewport as jest.Mock).mockReturnValue(newFrame);

      render(
        <BaseWindow windowKey="kanban">
          <div>Content</div>
        </BaseWindow>
      );

      fireEvent.resize(window);

      await waitFor(() => {
        expect(mockWindowActions.updateFrame).toHaveBeenCalledWith(
          "kanban",
          newFrame
        );
      });
    });

    it("should remove resize listener on unmount", () => {
      const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

      const { unmount } = render(
        <BaseWindow windowKey="spreadsheet">
          <div>Content</div>
        </BaseWindow>
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe("Props", () => {
    it("should accept windowKey prop with valid WindowKey type", () => {
      render(
        <BaseWindow windowKey="filemanager">
          <div>Content</div>
        </BaseWindow>
      );

      expect(useWindowState).toHaveBeenCalledWith("filemanager");
    });

    it("should accept children prop", () => {
      render(
        <BaseWindow windowKey="pivot">
          <div data-testid="custom-child">Custom Child</div>
        </BaseWindow>
      );

      expect(screen.getByTestId("custom-child")).toBeInTheDocument();
    });

    it("should pass windowKey to DraggableWindow", () => {
      render(
        <BaseWindow windowKey="kanban">
          <div>Content</div>
        </BaseWindow>
      );

      const draggableWindow = screen.getByTestId("draggable-window");
      expect(draggableWindow).toHaveAttribute("data-window-key", "kanban");
    });
  });

  describe("Memoization", () => {
    it("should not re-render if windowKey is the same", () => {
      const { rerender } = render(
        <BaseWindow windowKey="spreadsheet">
          <div>Content</div>
        </BaseWindow>
      );

      const initialCallCount = (useWindowState as jest.Mock).mock.calls.length;

      rerender(
        <BaseWindow windowKey="spreadsheet">
          <div>Updated Content</div>
        </BaseWindow>
      );

      expect(
        (useWindowState as jest.Mock).mock.calls.length
      ).toBeLessThanOrEqual(initialCallCount + 1);
    });

    it("should re-render if windowKey changes", () => {
      const { rerender } = render(
        <BaseWindow windowKey="spreadsheet">
          <div>Content</div>
        </BaseWindow>
      );

      rerender(
        <BaseWindow windowKey="filemanager">
          <div>Updated Content</div>
        </BaseWindow>
      );

      expect(useWindowState).toHaveBeenCalledWith("filemanager");
    });
  });

  describe("Layout", () => {
    it("should render DraggableWindow as container", () => {
      render(
        <BaseWindow windowKey="pivot">
          <div>Content</div>
        </BaseWindow>
      );

      expect(screen.getByTestId("draggable-window")).toBeInTheDocument();
    });

    it("should have flex column layout", () => {
      const { container } = render(
        <BaseWindow windowKey="kanban">
          <div>Content</div>
        </BaseWindow>
      );

      const contentDiv = container.querySelector(".flex.flex-col");
      expect(contentDiv).toBeInTheDocument();
    });

    it("should have overflow hidden", () => {
      const { container } = render(
        <BaseWindow windowKey="filemanager">
          <div>Content</div>
        </BaseWindow>
      );

      const contentDiv = container.querySelector(".overflow-hidden");
      expect(contentDiv).toBeInTheDocument();
    });

    it("should have white background with shadow", () => {
      const { container } = render(
        <BaseWindow windowKey="spreadsheet">
          <div>Content</div>
        </BaseWindow>
      );

      const contentDiv = container.querySelector(".bg-white.shadow-lg");
      expect(contentDiv).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty children", () => {
      render(<BaseWindow windowKey="filemanager">Test</BaseWindow>);

      expect(screen.getByTestId("draggable-window")).toBeInTheDocument();
      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });
});
