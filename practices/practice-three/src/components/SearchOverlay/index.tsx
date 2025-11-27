import { useMemo } from "react";

// Hook
import { useDebounce } from "@/hook";

// Constant
import { DESKTOP_ICONS } from "@/constant";

// Types
import type { WindowKey } from "@/types";

// Components
import { DesktopIcon } from "@/components/common";

interface SearchOverlayProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAppSelect: (key: WindowKey) => void;
  onClose: () => void;
}

const SearchOverlay = ({
  searchQuery,
  onSearchChange,
  onAppSelect,
  onClose,
}: SearchOverlayProps) => {
  const debouncedSearch = useDebounce(searchQuery ?? "", 300);

  const filteredIcons = useMemo(() => {
    if (!debouncedSearch.trim()) return DESKTOP_ICONS;

    const q = debouncedSearch.toLowerCase();
    return DESKTOP_ICONS.filter((icon) => icon.title.toLowerCase().includes(q));
  }, [debouncedSearch]);

  return (
    <div className="fixed inset-0 bg-black/75 z-[9999] flex flex-col items-center pt-16">
      {/* Search Input */}
      <div className="relative w-[386px] h-[32px]  mb-16">
        <input
          name="search icons"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 rounded-[3px] border border-[#CCD7E6] focus:border-[#1CA1C1] text-[#475466] text-sm px-2 focus:outline-none w-full h-full bg-white"
        />
        <i className="fa-solid fa-magnifying-glass text-[#94A1B3] text-sm absolute right-4 top-1/2 -translate-y-1/2"></i>
      </div>

      <div className="flex justify-center items-center gap-8 flex-wrap max-w-5xl px-4">
        {filteredIcons.map((icon) => (
          <DesktopIcon
            key={icon.key}
            image={icon.image}
            title={icon.title}
            keyIcon={icon.key}
            onIconClick={() => {
              onAppSelect(icon.key);
              onClose();
            }}
            cursorPointer
          />
        ))}
      </div>
    </div>
  );
};

export default SearchOverlay;
