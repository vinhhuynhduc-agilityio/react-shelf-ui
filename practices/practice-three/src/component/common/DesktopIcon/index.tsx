import React from "react";

interface DesktopIconProps {
  image: string;
  title: string;
  keyIcon: string;
  onIconClick: (keyIcon: string) => void;
}

export const DesktopIcon = React.forwardRef<HTMLDivElement, DesktopIconProps>(
  ({ image, title, keyIcon, onIconClick }, ref) => {
    const handleMouseDown = () => {
      onIconClick(keyIcon);
    };

    return (
      <div
        ref={ref}
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
  }
);
