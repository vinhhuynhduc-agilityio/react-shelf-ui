import clsx from "clsx";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

// Store
import { useWindowStore } from "@/stores";

// Constant
import { DESKTOP_ICONS } from "@/constant";

// Types
import type { WindowKey } from "@/types";

const Taskbar = () => {
  const {
    windows,
    zIndexOrder,
    setZIndexOrder,
    minimizeWindow,
    restoreWindow,
  } = useWindowStore(
    useShallow((s) => ({
      windows: s.windows,
      zIndexOrder: s.zIndexOrder,
      setZIndexOrder: s.setZIndexOrder,
      minimizeWindow: s.minimizeWindow,
      restoreWindow: s.restoreWindow,
    }))
  );

  // Only show running windows
  const openKeys = useMemo(
    () =>
      (Object.keys(windows) as WindowKey[]).filter((k) => windows[k].isOpen),
    [windows]
  );

  const topMost = zIndexOrder[zIndexOrder.length - 1];
  const metaOf = (key: WindowKey) => DESKTOP_ICONS.find((i) => i.key === key)!;

  const handleTaskClick = (key: WindowKey) => {
    const isMin = windows[key].isMinimized;
    const isTop = topMost === key;

    if (isMin) {
      // minimized -> restore + bring to front
      restoreWindow(key);
      setZIndexOrder(key);
      return;
    }

    if (!isTop) {
      // visible but behind -> bring to front
      setZIndexOrder(key);
      return;
    }

    // visible and already top-most -> minimize
    minimizeWindow(key);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[44px] bg-black/50 backdrop-blur-md border-t border-white/10 px-2 flex items-stretch z-[9999]">
      {/* LEFT: running windows */}
      <div className="flex items-center gap-1">
        {openKeys.map((key) => {
          const icon = metaOf(key);

          return (
            <button
              key={`task-${key}`}
              title={icon.title}
              onClick={() => handleTaskClick(key)}
              className={clsx(
                "h-full px-2 flex items-center gap-2 select-none",
                "hover:bg-white/10"
              )}
            >
              <img src={icon.image} alt="" className="h-[26px] w-[26px]" />
              <span className="text-xs text-white/90">{icon.title}</span>
            </button>
          );
        })}
      </div>
      {/* RIGHT: system tray */}
      <div className="ml-auto flex items-center text-xs text-white/80 px-2">
        ENG | Desktop
      </div>
    </div>
  );
};

export default Taskbar;
