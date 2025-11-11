import clsx from "clsx";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

// Store
import { useWindowStore } from "@/stores";

// Constant
import { DESKTOP_ICONS } from "@/constant";

// Types
import type { WindowKey } from "@/types";

import IconButton from "@/components/IconButton";

interface TaskbarProps {
  onToggleSearch: () => void;
}

const Taskbar = ({ onToggleSearch }: TaskbarProps) => {
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
    <div className="fixed bottom-0 left-0 right-0 h-[44px] bg-[#33353c] border-t border-white/10 flex z-[9999]">
      <div className="flex items-center gap-2">
        <div className="h-full w-[42px] flex justify-center items-center hover:bg-white/10">
          <IconButton
            iconStyles="fa-solid fa-bars fa-lg text-[#FFFFFF] text-sm"
            onClick={onToggleSearch}
          />
        </div>
        {openKeys.map((key) => {
          const icon = metaOf(key);
          const isActive = topMost === key;

          return (
            <div
              key={`task-${key}`}
              className={clsx("hover:bg-white/10 h-full flex-shrink-0", {
                "bg-white/10": isActive,
              })}
            >
              <button
                title={icon.title}
                onClick={() => handleTaskClick(key)}
                className="h-[36px] px-2 flex items-center select-none"
              >
                <img src={icon.image} alt="" className="h-[26px] w-[26px]" />
              </button>
              <div className="h-[2px] bg-[#1ca1c1]" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Taskbar;
