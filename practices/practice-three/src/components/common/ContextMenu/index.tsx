import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import clsx from "clsx";

// types
import { ContextMenuOption } from "@/types";

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
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
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
          <i
            className={clsx(
              opt.icon,
              "mr-2",
              opt.danger ? "text-red-600" : "text-[#94A1B3]"
            )}
          ></i>
          {opt.label}
        </li>
      ))}
    </ul>,
    document.body
  );
};

export default ContextMenu;
