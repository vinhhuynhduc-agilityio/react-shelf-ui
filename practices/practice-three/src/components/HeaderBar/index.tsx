import clsx from "clsx";
import { memo, useCallback } from "react";

// Components
import { IconButton } from "@/components";

interface HeaderBarProps {
  searchQuery: string;
  isDisabled: boolean;
  isFetching: boolean;
  previewMode: boolean;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePreview: () => void;
}

export const HeaderBar = memo(
  ({
    searchQuery,
    isDisabled,
    isFetching,
    previewMode,
    onSearchChange,
    onTogglePreview,
  }: HeaderBarProps) => {
    const handleSearchClick = useCallback(() => {
      // todo: handle search icon click
    }, []);

    return (
      <div className="flex items-center h-[56px] flex-shrink-0 w-full rounded-[2px] border border-[#DADEE0] text-[#475466] bg-[#FFFFFF]">
        <div className="flex flex-1 items-center ml-[12px]">
          <span className="font-medium mr-4 text-[#475466]">Files</span>
          <div className="flex-1 max-w-[300px] min-w-[10px] flex items-center h-[32px] relative overflow-hidden">
            <input
              name="search"
              type="text"
              placeholder="Search files and folders"
              className="flex-1 rounded-[3px] border border-[#CCD7E6] focus:border-[#1CA1C1] text-[#475466] text-sm px-2 focus:outline-none w-full h-full"
              value={searchQuery}
              onChange={onSearchChange}
              disabled={isDisabled || isFetching}
            />
            <IconButton
              iconStyles="fa-solid fa-magnifying-glass text-[#94A1B3] text-sm"
              buttonStyles="p-1 flex justify-center items-center rounded-full w-[22px] h-[22px] absolute right-[3px] bg-[#FFFFFF]"
              onClick={handleSearchClick}
            />
          </div>
        </div>
        <div className="flex items-center space-x-1 mr-[12px]">
          <IconButton
            buttonStyles={clsx(
              "p-1 flex justify-center items-center w-[60px] h-[38px] transition-colors hover:bg-[#E4E6F0]",
              previewMode ? "bg-[#daddeb]" : "bg-[#F4F5F9]"
            )}
            iconStyles="fa-solid fa-eye text-[#1CA1C1] text-sm"
            onClick={onTogglePreview}
            disabled={isDisabled || isFetching}
          />
        </div>
      </div>
    );
  }
);
