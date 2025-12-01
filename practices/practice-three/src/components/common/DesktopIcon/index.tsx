import { useRef } from "react";
import clsx from "clsx";

// Types
import { WindowKey } from "@/types";

interface DesktopIconProps {
  image: string;
  title: string;
  keyIcon: WindowKey;
  isSelected?: boolean;
  cursorPointer?: boolean;
  onIconClick: (keyIcon: WindowKey) => void;
  onDoubleClick: (keyIcon: WindowKey) => void;
}

export const DesktopIcon = ({
  image,
  title,
  keyIcon,
  isSelected = false,
  cursorPointer = false,
  onIconClick,
  onDoubleClick,
}: DesktopIconProps) => {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDown = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
      onDoubleClick(keyIcon);
    } else {
      onIconClick(keyIcon);

      timer.current = setTimeout(() => {
        timer.current = null;
      }, 300);
    }
  };

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center overflow-hidden box-border text-xs border-none",
        "desktop-icon grid-drag-handle",
        "w-[100px] h-[110px]",
        "hover:bg-[rgba(255,255,255,0.2)] hover:[border:2px_solid_rgba(255,255,255,0.2)]",
        isSelected &&
          "bg-[rgba(255,255,255,0.2)] [border:2px_solid_rgba(255,255,255,0.2)]",
        cursorPointer && "cursor-pointer"
      )}
      onMouseDown={handleMouseDown}
    >
      <img
        src={image}
        alt={title}
        className="w-[50px] h-[50px] object-contain"
      />
      <span
        className="mt-2 text-white text-[14px] font-normal leading-tight max-w-[85px] text-center truncate"
        style={{
          letterSpacing: "0.2px",
          textShadow: "1px 1px #222, 0px 1px 0px #000",
        }}
      >
        {title}
      </span>
    </div>
  );
};
