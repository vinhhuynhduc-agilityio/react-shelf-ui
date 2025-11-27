import { useState, useRef, useEffect } from "react";
import clsx from "clsx";

// components
import { IconButton } from "@/components";

// icons
import { fa } from "@/icons/fa";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

const MultiSelect = ({
  options,
  selected,
  onChange,
  className = "",
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (opt: string) => {
    const newSelected = selected.includes(opt)
      ? selected.filter((s) => s !== opt)
      : [...selected, opt];
    onChange(newSelected);
  };

  const removeTag = (tag: string) => {
    onChange(selected.filter((s) => s !== tag));
  };

  return (
    <div ref={ref} className={clsx("relative", className)}>
      <div
        className="w-full h-[32px] border border-[#DADEE0] rounded-[2px] px-2 py-1 flex flex-wrap items-center gap-1 text-sm focus:border-[#1CA1C1]"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        data-testid="multiselect-input"
      >
        {selected.map((tag) => (
          <span
            key={tag}
            className="bg-[rgba(228,230,240,0.8)] text-[#475466] text-sm font-normal leading-[24px] px-[6px] py-0 rounded-[12px] flex items-center gap-1"
          >
            {tag}
            <IconButton
              icon={fa.faTimes}
              buttonStyles="p-1 flex justify-center items-center rounded-full w-[18px] h-[18px] bg-[#94A1B3]"
              onClick={() => removeTag(tag)}
              iconStyles="fa-xs mt-[2px] text-[#f2f2f2]"
              ariaLabel={`Remove ${tag}`}
            />
          </span>
        ))}
      </div>
      {isOpen && (
        <div
          className="absolute z-10 w-full bg-white border border-[#DADEE0] rounded-[2px] max-h-40 overflow-auto"
          data-testid="multiselect-dropdown"
        >
          {options.map((opt) => (
            <label
              key={opt}
              className="flex items-center px-2 py-1 hover:bg-gray-100 text-sm text-[#475466] border-b border-[#DADEE0] h-[36px] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggleOption(opt)}
                className="mr-2 accent-[#1CA1C1]"
                aria-label={opt}
              />
              <span className="mb-[3px]">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
