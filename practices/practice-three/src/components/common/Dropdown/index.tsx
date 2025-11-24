import React, { useCallback, useEffect, useRef, useState } from "react";
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

  // Calculate position based on trigger element
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  }, [triggerRef]);

  useEffect(() => {
    if (!isOpen) {
      setPosition(null);
      return;
    }

    // Calculate position immediately when opened
    calculatePosition();

    // Handle scroll - recalculate position on scroll
    const handleScroll = () => {
      calculatePosition();
    };

    // Handle window resize - recalculate position on resize
    const handleResize = () => {
      calculatePosition();
    };

    // Add event listeners
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    // Handle click outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is outside both trigger and dropdown
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, setIsOpen, triggerRef, calculatePosition]);

  if (!isOpen || !position) return null;

  const handleSelectOption = (option: DropdownOption) => () => {
    onSelect(option);
    setIsOpen(false);
  };

  const dropdownContent = (
    <ul
      ref={dropdownRef}
      className="absolute bg-white shadow-md border border-[#DADEE0] rounded-md z-50 overflow-hidden"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        minWidth: "150px",
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
    </ul>
  );

  return createPortal(dropdownContent, document.body);
};

export default Dropdown;
