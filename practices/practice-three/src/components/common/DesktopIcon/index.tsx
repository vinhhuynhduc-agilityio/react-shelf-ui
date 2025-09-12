import clsx from "clsx";

// Types
import { WindowKey } from "@/types";

interface DesktopIconProps {
  image: string;
  title: string;
  keyIcon: WindowKey;
  isSelected?: boolean;
  onIconClick: (keyIcon: WindowKey) => void;
}

export const DesktopIcon = ({
  image,
  title,
  keyIcon,
  onIconClick,
  isSelected = false,
}: DesktopIconProps) => {
  const handleMouseDown = () => {
    onIconClick(keyIcon);
  };

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center w-full h-full overflow-hidden box-border text-xs border-none",
        "desktop-icon drag-handle max-w-[100px] max-h-[110px]",
        "hover:bg-[rgba(255,255,255,0.2)] hover:[border:2px_solid_rgba(255,255,255,0.2)]",
        isSelected &&
          "bg-[rgba(255,255,255,0.2)] [border:2px_solid_rgba(255,255,255,0.2)]"
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
