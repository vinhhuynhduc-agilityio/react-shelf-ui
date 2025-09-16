// types
import type { WindowKey } from "@/types";

// constants
import { MIN_H, MIN_W, TASKBAR_H } from "@/constant";

export type Rect = { x: number; y: number; width: number; height: number };

export const getWorkArea = () => ({
  width: Math.max(0, window.innerWidth),
  height: Math.max(0, window.innerHeight - TASKBAR_H),
});

export const clampToViewport = (frame: Rect): Rect => {
  const { width: areaW, height: areaH } = getWorkArea();

  const width = Math.max(MIN_W, Math.min(Number(frame?.width) || MIN_W, areaW));
  const height = Math.max(
    MIN_H,
    Math.min(Number(frame?.height) || MIN_H, areaH)
  );

  const maxX = Math.max(0, areaW - width);
  const maxY = Math.max(0, areaH - height);

  const x = Math.min(Math.max(Number(frame?.x) || 0, 0), maxX);
  const y = Math.min(Math.max(Number(frame?.y) || 0, 0), maxY);

  return { x, y, width, height };
};

export const emitResizeNextFrame = () => {
  requestAnimationFrame(() =>
    requestAnimationFrame(() => window.dispatchEvent(new Event("resize")))
  );
};

export const updateFrame = (
  setFrame: (
    key: WindowKey,
    rect: { x: number; y: number; width: number; height: number }
  ) => void,
  windowKey: WindowKey,
  ref: HTMLElement,
  pos: { x: number; y: number }
) => {
  setFrame(windowKey, {
    x: pos.x,
    y: pos.y,
    width: ref.getBoundingClientRect().width,
    height: ref.getBoundingClientRect().height,
  });

  window.dispatchEvent(new Event("resize"));
};
