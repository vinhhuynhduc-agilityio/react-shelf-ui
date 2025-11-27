import clsx from "clsx";

// Helpers
import { getPreviewImageSrc, getBasicInfo } from "@/helpers";

// Types
import type { FileItem } from "@/types";

// Icons
import { fa } from "@/icons/fa";

// Components
import { Icon } from "@/components";

interface PreviewPanelProps {
  selectedItem: FileItem | null;
  files: FileItem[];
  currentFolderId: string;
  height: number;
}

export const PreviewPanel = ({
  selectedItem,
  files,
  currentFolderId,
  height,
}: PreviewPanelProps) => {
  const currentItem = selectedItem || null;
  const imageSrc = getPreviewImageSrc(currentItem);
  const hasItem = !!currentItem;
  const extraInfo = currentItem?.extraInfo;

  return (
    <div
      className="w-[470px] flex flex-col bg-[#EBEDF0] rounded-[2px] mt-[10px] ml-[10px] overflow-auto"
      style={{ height }}
    >
      {/* Top Card: File Preview */}
      <div
        className={clsx(
          "border border-[#DADEE0] bg-[#FFFFFF] w-full min-h-[450px]",
          extraInfo ? "h-[450px]" : hasItem ? "h-1/2" : "h-full"
        )}
      >
        {hasItem && (
          <h3 className="flex items-center px-[12px] py-[3px] text-[#475466] font-medium text-[16px] truncate border-b border-[#DADEE0] h-[42px]">
            {currentItem.name}
          </h3>
        )}
        <div className="h-[calc(100%-42px)]">
          <img
            src={imageSrc}
            alt={hasItem ? currentItem.name : "Preview"}
            className="h-full w-full"
          />
        </div>
      </div>

      {/* Bottom Card: Information */}
      {hasItem && (
        <div className="flex-1 space-y-2 mt-[10px] bg-[#FFFFFF] border border-[#DADEE0] text-[#475466] text-[14px] w-full">
          <h4 className="flex items-center justify-center font-medium border-b border-[#DADEE0] h-[42px] text-[#1CA1C1] shadow-[inset_0_-2px_#1CA1C1] text-[16px]">
            Information
          </h4>
          <div className="h-[130px]">
            {getBasicInfo(currentItem, files, currentFolderId).map(
              ({ label, value }) => (
                <div className="flex" key={label}>
                  <span className="font-medium w-[40%] text-right p-[6px]">
                    {label}
                  </span>
                  <span className="w-[60%] p-[6px]">{value}</span>
                </div>
              )
            )}
          </div>

          {extraInfo && Object.keys(extraInfo).length > 0 && (
            <div className="h-[923px] border-t border-[#ebedf0] mt-[24px] ml-[14px]">
              <div className="flex items-center">
                <span className="flex items-center justify-center rounded-full border border-[#94A1B3] w-[12.5px] h-[12.5px]">
                  <Icon icon={fa.faInfo} className="fa-2xs" />
                </span>
                <span className="font-medium w-[40%] p-[6px]">Extra Info</span>
                <span className="w-[60%] p-[6px]"></span>
              </div>
              {Object.entries(extraInfo).map(([key, value]) => (
                <div className="flex" key={key}>
                  <span className="font-medium w-[40%] text-right p-[6px] truncate">
                    {key}
                  </span>
                  <span className="w-[60%] p-[6px]">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
