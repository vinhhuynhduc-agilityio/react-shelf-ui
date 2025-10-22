import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// types
import { DropdownOption, DropdownProps } from "@/types";

type DropdownPosition = { top: number; left: number; width: number };

const Dropdown: React.FC<DropdownProps> = ({
  options,
  isOpen,
  triggerRef,
  onSelect,
  setIsOpen,
}) => {
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [position, setPosition] = useState<DropdownPosition | null>(null);

  useEffect(() => {
    // Handle click outside to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Update position based on trigger button (fixed to viewport, not affected by scroll)
    const updatePosition = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();

        setPosition({
          top: rect.bottom,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    if (isOpen) {
      updatePosition();
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, setIsOpen, triggerRef]);

  if (!isOpen || !position) return null;

  const handleSelectOption = (option: DropdownOption) => () => {
    onSelect(option);
    setIsOpen(false);
  };

  return createPortal(
    <ul
      ref={dropdownRef}
      className="absolute bg-white shadow-md border border-[#DADEE0] rounded-md z-50 overflow-hidden"
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
      }}
      role="listbox"
      data-testid="dropdown-listbox"
    >
      {options.map((option) => (
        <li
          key={option.key}
          className="px-4 py-[8px] text-[#475466] hover:bg-[#F4F5F9] cursor-pointer flex items-center"
          onClick={handleSelectOption(option)}
        >
          <i
            className={`fa-solid ${option.icon} mr-2 text-[#94A1B3] w-[20px] h-[20px]`}
          ></i>
          {option.label}
        </li>
      ))}
    </ul>,
    document.body
  );
};

export default Dropdown;
