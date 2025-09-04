// Types
import { WindowKey } from "@/types";

interface DesktopIconProps {
  image: string;
  title: string;
  keyIcon: WindowKey;
  onIconClick: (keyIcon: WindowKey) => void;
}

export const DesktopIcon = ({
  image,
  title,
  keyIcon,
  onIconClick,
}: DesktopIconProps) => {
  const handleMouseDown = () => {
    onIconClick(keyIcon);
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full overflow-hidden box-border text-xs border-none drag-handle max-w-[100px] max-h-[120px]"
      onMouseDown={handleMouseDown}
    >
      <img
        src={image}
        alt={title}
        className="w-[60px] h-[60px] object-contain"
      />
      <span className="mt-2 text-white font-bold text-sm">{title}</span>
    </div>
  );
};
