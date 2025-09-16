// types
import type { WindowKey } from "@/types";

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
