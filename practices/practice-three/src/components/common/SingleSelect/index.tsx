import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { Icon } from "@/components/common/Icon";
import { fa } from "@/icons/fa";

interface SingleSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

interface Position {
  top: number;
  left: number;
  width: number;
}

const SingleSelect = ({
  options,
  value,
  onChange,
  className = "",
}: SingleSelectProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;
      setPosition({
        top: rect.bottom + scrollY,
        left: rect.left + scrollX,
        width: rect.width,
      });
    }
  };

  const handleToggle = () => {
    updatePosition();
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (opt: string) => {
    onChange(opt);
    setIsOpen(false);
  };

  const dropdownContent =
    isOpen && position ? (
      <ul
        className="absolute z-50 bg-white border border-[#DADEE0] rounded-[2px] max-h-40 overflow-auto"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: `${position.width}px`,
        }}
      >
        {options.map((opt) => (
          <li
            key={opt}
            className={clsx(
              "px-2 py-1 cursor-pointer hover:bg-[#F4F5F9] text-sm text-[#475466] h-[36px] border-b border-[#DADEE0]",
              opt === value ? "bg-[#F4F5F9]" : ""
            )}
            onMouseDown={() => handleSelect(opt)}
          >
            {opt}
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <div ref={triggerRef} className={clsx("relative", className)}>
      <div
        className="w-full border border-[#DADEE0] rounded-[2px] px-2 py-1 text-sm text-[#475466] flex items-center justify-between h-[32px] cursor-pointer"
        onClick={handleToggle}
      >
        {value}
        <Icon icon={fa.faChevronDown} className="ml-2 text-[#94A1B3]" />
      </div>
      {dropdownContent && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default SingleSelect;
