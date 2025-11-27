import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import clsx from "clsx";
import { ContextMenuOption } from "@/types";
import { Icon } from "@/components";

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  options: ContextMenuOption[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  visible,
  x,
  y,
  options,
  onClose,
}) => {
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleScroll = () => onClose();
    const handleResize = () => onClose();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return createPortal(
    <ul
      ref={menuRef}
      className="fixed bg-white border border-[#DADEE0] rounded-md shadow-lg py-1 z-[9999] min-w-[140px]"
      style={{ top: `${y}px`, left: `${x}px` }}
    >
      {options.map((opt, idx) => (
        <li
          key={idx}
          onClick={() => {
            opt.onClick();
            onClose();
          }}
          className={clsx(
            "px-3 py-2 hover:bg-[#F4F5F9] cursor-pointer flex items-center text-sm",
            opt.danger ? "text-red-600" : "text-[#475466]"
          )}
        >
          {opt.icon && (
            <Icon
              icon={opt.icon}
              className={clsx(
                "mr-2",
                opt.danger ? "text-red-600" : "text-[#94A1B3]"
              )}
            />
          )}
          {opt.label}
        </li>
      ))}
    </ul>,
    document.body
  );
};

export default ContextMenu;
