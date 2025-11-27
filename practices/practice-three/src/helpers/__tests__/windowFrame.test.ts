import {
  getWorkArea,
  clampToViewport,
  emitResizeNextFrame,
  updateFrame,
  type Rect,
} from "../windowFrame";
import { MIN_H, MIN_W, TASKBAR_H } from "@/constant";
import type { WindowKey } from "@/types";

jest.mock("@/constant", () => ({
  MIN_H: 300,
  MIN_W: 400,
  TASKBAR_H: 50,
}));

describe("windowFrame helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getWorkArea", () => {
    it("returns work area with correct dimensions", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1920,
      });
      Object.defineProperty(window, "innerHeight", {
        writable: true,
        configurable: true,
        value: 1080,
      });

      const result = getWorkArea();

      expect(result.width).toBe(1920);
      expect(result.height).toBe(1030);
    });

    it("handles zero window size", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 0,
      });
      Object.defineProperty(window, "innerHeight", {
        writable: true,
        configurable: true,
        value: 0,
      });

      const result = getWorkArea();

      expect(result.width).toBe(0);
      expect(result.height).toBe(Math.max(0, 0 - TASKBAR_H));
    });
  });

  describe("clampToViewport", () => {
    beforeEach(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1920,
      });
      Object.defineProperty(window, "innerHeight", {
        writable: true,
        configurable: true,
        value: 1080,
      });
    });

    it("enforces minimum dimensions", () => {
      const frame: Rect = { x: 0, y: 0, width: 100, height: 100 };

      const result = clampToViewport(frame);

      expect(result.width).toBe(MIN_W);
      expect(result.height).toBe(MIN_H);
    });

    it("clamps position to viewport boundaries", () => {
      const frame: Rect = { x: -100, y: -100, width: 400, height: 300 };

      const result = clampToViewport(frame);

      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });

    it("prevents overflow beyond right and bottom edges", () => {
      const frame: Rect = { x: 2000, y: 2000, width: 400, height: 300 };

      const result = clampToViewport(frame);

      expect(result.x + result.width).toBeLessThanOrEqual(1920);
      expect(result.y + result.height).toBeLessThanOrEqual(1030);
    });

    it("keeps valid frame unchanged", () => {
      const frame: Rect = { x: 100, y: 100, width: 800, height: 600 };

      const result = clampToViewport(frame);

      expect(result).toEqual(frame);
    });
  });

  describe("emitResizeNextFrame", () => {
    it("dispatches resize event on next animation frame", () => {
      jest.useFakeTimers();
      const dispatchSpy = jest.spyOn(window, "dispatchEvent");

      emitResizeNextFrame();

      jest.runAllTimers();

      expect(dispatchSpy).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));

      const event = dispatchSpy.mock.calls[0]?.[0] as Event;
      expect(event?.type).toBe("resize");

      dispatchSpy.mockRestore();
      jest.useRealTimers();
    });
  });

  describe("updateFrame", () => {
    it("updates frame and dispatches resize event", () => {
      const setFrameMock = jest.fn();
      const windowKey: WindowKey = "filemanager";
      const mockRef = document.createElement("div");

      jest.spyOn(mockRef, "getBoundingClientRect").mockReturnValue({
        width: 800,
        height: 600,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        bottom: 600,
        right: 800,
        toJSON: () => ({}),
      });

      const dispatchSpy = jest.spyOn(window, "dispatchEvent");
      const pos = { x: 150, y: 200 };

      updateFrame(setFrameMock, windowKey, mockRef, pos);

      expect(setFrameMock).toHaveBeenCalledWith(windowKey, {
        x: 150,
        y: 200,
        width: 800,
        height: 600,
      });
      expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));
      dispatchSpy.mockRestore();
    });

    it("uses ref dimensions from getBoundingClientRect", () => {
      const setFrameMock = jest.fn();
      const windowKey: WindowKey = "kanban";
      const mockRef = document.createElement("div");

      jest.spyOn(mockRef, "getBoundingClientRect").mockReturnValue({
        width: 1024,
        height: 768,
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        bottom: 768,
        right: 1024,
        toJSON: () => ({}),
      });

      updateFrame(setFrameMock, windowKey, mockRef, { x: 0, y: 0 });

      expect(setFrameMock).toHaveBeenCalledWith(windowKey, {
        x: 0,
        y: 0,
        width: 1024,
        height: 768,
      });
    });
  });
});
