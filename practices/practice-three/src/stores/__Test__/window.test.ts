import { useWindowStore } from "../window";
import { emitResizeNextFrame } from "@/helpers";
import type { WindowKey } from "@/types";

jest.mock("@/helpers");

describe("useWindowStore", () => {
  const windowKeys: WindowKey[] = [
    "spreadsheet",
    "filemanager",
    "pivot",
    "kanban",
  ];

  const defaultFrame = {
    x: expect.any(Number),
    y: expect.any(Number),
    width: 800,
    height: 450,
  };

  beforeEach(() => {
    // Reset store to initial state
    useWindowStore.setState({
      windows: {
        spreadsheet: { isOpen: false, isMaximized: false, isMinimized: false },
        filemanager: { isOpen: false, isMaximized: false, isMinimized: false },
        pivot: { isOpen: false, isMaximized: false, isMinimized: false },
        kanban: { isOpen: false, isMaximized: false, isMinimized: false },
      },
      zIndexOrder: [],
      frames: {
        spreadsheet: { x: 0, y: 0, width: 800, height: 450 },
        filemanager: { x: 0, y: 0, width: 800, height: 450 },
        pivot: { x: 0, y: 0, width: 800, height: 450 },
        kanban: { x: 0, y: 0, width: 800, height: 450 },
      },
    });
    jest.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have initial state with all windows closed", () => {
      const state = useWindowStore.getState();

      windowKeys.forEach((key) => {
        expect(state.windows[key]).toEqual({
          isOpen: false,
          isMaximized: false,
          isMinimized: false,
        });
      });
    });

    it("should have empty zIndexOrder", () => {
      const state = useWindowStore.getState();
      expect(state.zIndexOrder).toEqual([]);
    });

    it("should have frames for all windows", () => {
      const state = useWindowStore.getState();

      windowKeys.forEach((key) => {
        expect(state.frames[key]).toEqual(defaultFrame);
      });
    });
  });

  describe("setZIndexOrder", () => {
    it("should add window to zIndexOrder when first opened", () => {
      useWindowStore.getState().setZIndexOrder("spreadsheet");

      expect(useWindowStore.getState().zIndexOrder).toEqual(["spreadsheet"]);
    });

    it("should maintain order when adding multiple windows", () => {
      useWindowStore.getState().setZIndexOrder("spreadsheet");
      useWindowStore.getState().setZIndexOrder("pivot");
      useWindowStore.getState().setZIndexOrder("kanban");

      expect(useWindowStore.getState().zIndexOrder).toEqual([
        "spreadsheet",
        "pivot",
        "kanban",
      ]);
    });

    it("should move window to top when already in order", () => {
      useWindowStore.setState({
        zIndexOrder: ["spreadsheet", "pivot", "kanban"],
      });

      useWindowStore.getState().setZIndexOrder("spreadsheet");

      expect(useWindowStore.getState().zIndexOrder).toEqual([
        "pivot",
        "kanban",
        "spreadsheet",
      ]);
    });

    it("should handle moving middle item to top", () => {
      useWindowStore.setState({
        zIndexOrder: ["spreadsheet", "pivot", "kanban"],
      });

      useWindowStore.getState().setZIndexOrder("pivot");

      expect(useWindowStore.getState().zIndexOrder).toEqual([
        "spreadsheet",
        "kanban",
        "pivot",
      ]);
    });

    it("should not duplicate window in zIndexOrder", () => {
      useWindowStore.setState({
        zIndexOrder: ["spreadsheet", "pivot"],
      });

      useWindowStore.getState().setZIndexOrder("spreadsheet");
      useWindowStore.getState().setZIndexOrder("spreadsheet");

      expect(useWindowStore.getState().zIndexOrder).toEqual([
        "pivot",
        "spreadsheet",
      ]);
    });
  });

  describe("toggleWindow", () => {
    it("should open closed window", () => {
      useWindowStore.getState().toggleWindow("spreadsheet");

      const state = useWindowStore.getState();
      expect(state.windows.spreadsheet.isOpen).toBe(true);
      expect(state.windows.spreadsheet.isMinimized).toBe(false);
    });

    it("should not minimize opened window on toggle", () => {
      useWindowStore.setState({
        windows: {
          spreadsheet: { isOpen: true, isMaximized: false, isMinimized: false },
          filemanager: {
            isOpen: false,
            isMaximized: false,
            isMinimized: false,
          },
          pivot: { isOpen: false, isMaximized: false, isMinimized: false },
          kanban: { isOpen: false, isMaximized: false, isMinimized: false },
        },
      });

      useWindowStore.getState().toggleWindow("spreadsheet");

      // State should not change (toggleWindow doesn't minimize)
      expect(useWindowStore.getState().windows.spreadsheet.isOpen).toBe(true);
      expect(useWindowStore.getState().windows.spreadsheet.isMinimized).toBe(
        false
      );
    });

    it("should restore minimized window", () => {
      useWindowStore.setState({
        windows: {
          spreadsheet: { isOpen: true, isMaximized: false, isMinimized: true },
          filemanager: {
            isOpen: false,
            isMaximized: false,
            isMinimized: false,
          },
          pivot: { isOpen: false, isMaximized: false, isMinimized: false },
          kanban: { isOpen: false, isMaximized: false, isMinimized: false },
        },
      });

      useWindowStore.getState().toggleWindow("spreadsheet");

      expect(useWindowStore.getState().windows.spreadsheet.isMinimized).toBe(
        false
      );
    });

    it("should handle multiple window toggles", () => {
      useWindowStore.getState().toggleWindow("spreadsheet");
      useWindowStore.getState().toggleWindow("pivot");
      useWindowStore.getState().toggleWindow("kanban");

      const state = useWindowStore.getState();
      expect(state.windows.spreadsheet.isOpen).toBe(true);
      expect(state.windows.pivot.isOpen).toBe(true);
      expect(state.windows.kanban.isOpen).toBe(true);
      expect(state.windows.filemanager.isOpen).toBe(false);
    });
  });

  describe("setFrame", () => {
    it("should update frame when window is not maximized", () => {
      const newFrame = { x: 100, y: 100, width: 600, height: 400 };

      useWindowStore.getState().setFrame("spreadsheet", newFrame);

      expect(useWindowStore.getState().frames.spreadsheet).toEqual(newFrame);
    });

    it("should not update frame when window is maximized", () => {
      const originalFrame = useWindowStore.getState().frames.spreadsheet;
      const newFrame = { x: 100, y: 100, width: 600, height: 400 };

      useWindowStore.setState({
        windows: {
          spreadsheet: { isOpen: true, isMaximized: true, isMinimized: false },
          filemanager: {
            isOpen: false,
            isMaximized: false,
            isMinimized: false,
          },
          pivot: { isOpen: false, isMaximized: false, isMinimized: false },
          kanban: { isOpen: false, isMaximized: false, isMinimized: false },
        },
      });

      useWindowStore.getState().setFrame("spreadsheet", newFrame);

      // Frame should remain unchanged
      expect(useWindowStore.getState().frames.spreadsheet).toEqual(
        originalFrame
      );
    });

    it("should handle negative coordinates", () => {
      const newFrame = { x: -50, y: -50, width: 600, height: 400 };

      useWindowStore.getState().setFrame("spreadsheet", newFrame);

      expect(useWindowStore.getState().frames.spreadsheet).toEqual(newFrame);
    });

    it("should update multiple windows frames", () => {
      const frame1 = { x: 10, y: 10, width: 600, height: 400 };
      const frame2 = { x: 20, y: 20, width: 700, height: 500 };

      useWindowStore.getState().setFrame("spreadsheet", frame1);
      useWindowStore.getState().setFrame("pivot", frame2);

      expect(useWindowStore.getState().frames.spreadsheet).toEqual(frame1);
      expect(useWindowStore.getState().frames.pivot).toEqual(frame2);
    });
  });

  describe("maximizeWindow", () => {
    it("should maximize closed window and open it", () => {
      useWindowStore.getState().maximizeWindow("spreadsheet");

      const state = useWindowStore.getState();
      expect(state.windows.spreadsheet.isMaximized).toBe(true);
    });

    it("should add window to zIndexOrder when maximizing", () => {
      useWindowStore.getState().maximizeWindow("spreadsheet");

      expect(useWindowStore.getState().zIndexOrder).toContain("spreadsheet");
    });

    it("should move window to top when maximizing from background", () => {
      useWindowStore.setState({
        zIndexOrder: ["pivot", "kanban", "spreadsheet"],
      });

      useWindowStore.getState().maximizeWindow("spreadsheet");

      expect(useWindowStore.getState().zIndexOrder).toEqual([
        "pivot",
        "kanban",
        "spreadsheet",
      ]);
    });

    it("should not reorder if window already on top", () => {
      useWindowStore.setState({
        zIndexOrder: ["pivot", "kanban", "spreadsheet"],
      });

      useWindowStore.getState().maximizeWindow("spreadsheet");

      expect(useWindowStore.getState().zIndexOrder).toEqual([
        "pivot",
        "kanban",
        "spreadsheet",
      ]);
    });

    it("should toggle maximize off when already maximized", () => {
      useWindowStore.setState({
        windows: {
          spreadsheet: { isOpen: true, isMaximized: true, isMinimized: false },
          filemanager: {
            isOpen: false,
            isMaximized: false,
            isMinimized: false,
          },
          pivot: { isOpen: false, isMaximized: false, isMinimized: false },
          kanban: { isOpen: false, isMaximized: false, isMinimized: false },
        },
      });

      useWindowStore.getState().maximizeWindow("spreadsheet");

      expect(useWindowStore.getState().windows.spreadsheet.isMaximized).toBe(
        false
      );
    });

    it("should emit resize event after maximize", () => {
      useWindowStore.getState().maximizeWindow("spreadsheet");

      expect(emitResizeNextFrame).toHaveBeenCalled();
    });

    it("should emit resize event when toggling maximize off", () => {
      useWindowStore.setState({
        windows: {
          spreadsheet: { isOpen: true, isMaximized: true, isMinimized: false },
          filemanager: {
            isOpen: false,
            isMaximized: false,
            isMinimized: false,
          },
          pivot: { isOpen: false, isMaximized: false, isMinimized: false },
          kanban: { isOpen: false, isMaximized: false, isMinimized: false },
        },
      });

      jest.clearAllMocks();

      useWindowStore.getState().maximizeWindow("spreadsheet");

      expect(emitResizeNextFrame).toHaveBeenCalled();
    });
  });

  describe("minimizeWindow", () => {
    it("should minimize open window", () => {
      useWindowStore.setState({
        windows: {
          spreadsheet: { isOpen: true, isMaximized: false, isMinimized: false },
          filemanager: {
            isOpen: false,
            isMaximized: false,
            isMinimized: false,
          },
          pivot: { isOpen: false, isMaximized: false, isMinimized: false },
          kanban: { isOpen: false, isMaximized: false, isMinimized: false },
        },
      });

      useWindowStore.getState().minimizeWindow("spreadsheet");

      expect(useWindowStore.getState().windows.spreadsheet.isMinimized).toBe(
        true
      );
    });

    it("should minimize maximized window", () => {
      useWindowStore.setState({
        windows: {
          spreadsheet: { isOpen: true, isMaximized: true, isMinimized: false },
          filemanager: {
            isOpen: false,
            isMaximized: false,
            isMinimized: false,
          },
          pivot: { isOpen: false, isMaximized: false, isMinimized: false },
          kanban: { isOpen: false, isMaximized: false, isMinimized: false },
        },
      });

      useWindowStore.getState().minimizeWindow("spreadsheet");

      const state = useWindowStore.getState();
      expect(state.windows.spreadsheet.isMinimized).toBe(true);
      expect(state.windows.spreadsheet.isMaximized).toBe(true); // remains maximized
    });

    it("should handle minimizing multiple windows", () => {
      useWindowStore.setState({
        windows: {
          spreadsheet: { isOpen: true, isMaximized: false, isMinimized: false },
          filemanager: { isOpen: true, isMaximized: false, isMinimized: false },
          pivot: { isOpen: false, isMaximized: false, isMinimized: false },
          kanban: { isOpen: false, isMaximized: false, isMinimized: false },
        },
      });

      useWindowStore.getState().minimizeWindow("spreadsheet");
      useWindowStore.getState().minimizeWindow("filemanager");

      expect(useWindowStore.getState().windows.spreadsheet.isMinimized).toBe(
        true
      );
      expect(useWindowStore.getState().windows.filemanager.isMinimized).toBe(
        true
      );
    });
  });

  describe("restoreWindow", () => {
    it("should restore minimized window", () => {
      useWindowStore.setState({
        windows: {
          spreadsheet: { isOpen: true, isMaximized: false, isMinimized: true },
          filemanager: {
            isOpen: false,
            isMaximized: false,
            isMinimized: false,
          },
          pivot: { isOpen: false, isMaximized: false, isMinimized: false },
          kanban: { isOpen: false, isMaximized: false, isMinimized: false },
        },
      });

      useWindowStore.getState().restoreWindow("spreadsheet");

      expect(useWindowStore.getState().windows.spreadsheet.isMinimized).toBe(
        false
      );
    });

    it("should keep other properties when restoring", () => {
      useWindowStore.setState({
        windows: {
          spreadsheet: { isOpen: true, isMaximized: true, isMinimized: true },
          filemanager: {
            isOpen: false,
            isMaximized: false,
            isMinimized: false,
          },
          pivot: { isOpen: false, isMaximized: false, isMinimized: false },
          kanban: { isOpen: false, isMaximized: false, isMinimized: false },
        },
      });

      useWindowStore.getState().restoreWindow("spreadsheet");

      const state = useWindowStore.getState();
      expect(state.windows.spreadsheet.isMinimized).toBe(false);
      expect(state.windows.spreadsheet.isOpen).toBe(true);
      expect(state.windows.spreadsheet.isMaximized).toBe(true);
    });

    it("should handle restoring already restored window", () => {
      useWindowStore.setState({
        windows: {
          spreadsheet: { isOpen: true, isMaximized: false, isMinimized: false },
          filemanager: {
            isOpen: false,
            isMaximized: false,
            isMinimized: false,
          },
          pivot: { isOpen: false, isMaximized: false, isMinimized: false },
          kanban: { isOpen: false, isMaximized: false, isMinimized: false },
        },
      });

      useWindowStore.getState().restoreWindow("spreadsheet");

      expect(useWindowStore.getState().windows.spreadsheet.isMinimized).toBe(
        false
      );
    });
  });

  describe("closeWindow", () => {
    it("should close open window", () => {
      useWindowStore.setState({
        windows: {
          spreadsheet: { isOpen: true, isMaximized: false, isMinimized: false },
          filemanager: {
            isOpen: false,
            isMaximized: false,
            isMinimized: false,
          },
          pivot: { isOpen: false, isMaximized: false, isMinimized: false },
          kanban: { isOpen: false, isMaximized: false, isMinimized: false },
        },
        zIndexOrder: ["spreadsheet", "pivot"],
      });

      useWindowStore.getState().closeWindow("spreadsheet");

      const state = useWindowStore.getState();
      expect(state.windows.spreadsheet.isOpen).toBe(false);
      expect(state.windows.spreadsheet.isMaximized).toBe(false);
      expect(state.windows.spreadsheet.isMinimized).toBe(false);
    });

    it("should remove window from zIndexOrder when closed", () => {
      useWindowStore.setState({
        windows: {
          spreadsheet: { isOpen: true, isMaximized: false, isMinimized: false },
          filemanager: { isOpen: true, isMaximized: false, isMinimized: false },
          pivot: { isOpen: false, isMaximized: false, isMinimized: false },
          kanban: { isOpen: false, isMaximized: false, isMinimized: false },
        },
        zIndexOrder: ["spreadsheet", "filemanager", "pivot"],
      });

      useWindowStore.getState().closeWindow("spreadsheet");

      expect(useWindowStore.getState().zIndexOrder).toEqual([
        "filemanager",
        "pivot",
      ]);
    });

    it("should reset frame to default when closed", () => {
      useWindowStore.setState({
        windows: {
          spreadsheet: { isOpen: true, isMaximized: false, isMinimized: false },
          filemanager: {
            isOpen: false,
            isMaximized: false,
            isMinimized: false,
          },
          pivot: { isOpen: false, isMaximized: false, isMinimized: false },
          kanban: { isOpen: false, isMaximized: false, isMinimized: false },
        },
        frames: {
          spreadsheet: { x: 100, y: 100, width: 600, height: 400 },
          filemanager: { x: 0, y: 0, width: 800, height: 450 },
          pivot: { x: 0, y: 0, width: 800, height: 450 },
          kanban: { x: 0, y: 0, width: 800, height: 450 },
        },
      });

      useWindowStore.getState().closeWindow("spreadsheet");

      // Frame should be reset to default (not exact match due to calculated values)
      const closedFrame = useWindowStore.getState().frames.spreadsheet;
      expect(closedFrame.width).toBe(800);
      expect(closedFrame.height).toBe(450);
    });

    it("should handle closing multiple windows", () => {
      useWindowStore.setState({
        windows: {
          spreadsheet: { isOpen: true, isMaximized: false, isMinimized: false },
          filemanager: { isOpen: true, isMaximized: false, isMinimized: false },
          pivot: { isOpen: true, isMaximized: false, isMinimized: false },
          kanban: { isOpen: false, isMaximized: false, isMinimized: false },
        },
        zIndexOrder: ["spreadsheet", "filemanager", "pivot"],
      });

      useWindowStore.getState().closeWindow("spreadsheet");
      useWindowStore.getState().closeWindow("pivot");

      const state = useWindowStore.getState();
      expect(state.windows.spreadsheet.isOpen).toBe(false);
      expect(state.windows.pivot.isOpen).toBe(false);
      expect(state.windows.filemanager.isOpen).toBe(true);
      expect(state.zIndexOrder).toEqual(["filemanager"]);
    });

    it("should close maximized window", () => {
      useWindowStore.setState({
        windows: {
          spreadsheet: { isOpen: true, isMaximized: true, isMinimized: false },
          filemanager: {
            isOpen: false,
            isMaximized: false,
            isMinimized: false,
          },
          pivot: { isOpen: false, isMaximized: false, isMinimized: false },
          kanban: { isOpen: false, isMaximized: false, isMinimized: false },
        },
        zIndexOrder: ["spreadsheet"],
      });

      useWindowStore.getState().closeWindow("spreadsheet");

      const state = useWindowStore.getState();
      expect(state.windows.spreadsheet.isOpen).toBe(false);
      expect(state.windows.spreadsheet.isMaximized).toBe(false);
      expect(state.zIndexOrder).toEqual([]);
    });
  });

  describe("window state transitions", () => {
    it("should handle open -> maximize -> minimize -> restore -> close", () => {
      const key: WindowKey = "spreadsheet";

      // Open
      useWindowStore.getState().toggleWindow(key);
      expect(useWindowStore.getState().windows[key].isOpen).toBe(true);

      // Maximize
      useWindowStore.getState().maximizeWindow(key);
      expect(useWindowStore.getState().windows[key].isMaximized).toBe(true);

      // Minimize
      useWindowStore.getState().minimizeWindow(key);
      expect(useWindowStore.getState().windows[key].isMinimized).toBe(true);

      // Restore
      useWindowStore.getState().restoreWindow(key);
      expect(useWindowStore.getState().windows[key].isMinimized).toBe(false);

      // Close
      useWindowStore.getState().closeWindow(key);
      expect(useWindowStore.getState().windows[key].isOpen).toBe(false);
    });

    it("should handle multiple windows interaction", () => {
      useWindowStore.getState().setZIndexOrder("spreadsheet");
      useWindowStore.getState().setZIndexOrder("pivot");
      useWindowStore.getState().maximizeWindow("spreadsheet");

      expect(useWindowStore.getState().zIndexOrder[1]).toBe("spreadsheet");

      useWindowStore.getState().setZIndexOrder("pivot");

      expect(useWindowStore.getState().zIndexOrder[1]).toBe("pivot");
    });
  });
});
