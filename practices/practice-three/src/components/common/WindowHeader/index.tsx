import { useShallow } from "zustand/react/shallow";

// Store
import { useWindowStore } from "@/stores";

// Types
import { WindowKey } from "@/types";

// Components
import { IconButton } from "@/components";

interface WindowHeaderProps {
  windowKey: WindowKey;
  title: string;
  src: string;
  onClose: () => void;
  onMaximize: () => void;
  onMinimize: () => void;
}

const WindowHeader = ({
  windowKey,
  src,
  title,
  onClose,
  onMaximize,
  onMinimize,
}: WindowHeaderProps) => {
  const { win } = useWindowStore(
    useShallow((state) => ({
      win: state.windows[windowKey],
    }))
  );

  const isMaximized = !!win?.isMaximized;

  return (
    <div className="window-drag-handle bg-white flex justify-between items-center flex-shrink-0 border-b-[1.3px] border-[#DADEE0] w-full h-[30px] relative">
      <div className="inline-flex items-center justify-center space-x-2">
        <img
          src={src}
          alt={title}
          className="w-[18px] h-[18px] mx-[10px] ml-[8px] text-[10px] pointer-events-none"
        />
        <span className="text-[16px] font-medium text-[#475466] cursor-default">
          {title}
        </span>
      </div>
      <div className="flex items-center justify-center space-x-2 absolute right-0 mr-3 bg-white">
        <IconButton
          iconStyles="fa-solid fa-minus text-[#94A1B3] rounded-full px-[4px] py-[3px] hover:bg-gray-100"
          onClick={onMinimize}
        />
        <IconButton
          iconStyles={
            isMaximized
              ? "fa-regular fa-window-restore text-[#94A1B3] rounded-full px-[4px] py-[3px] hover:bg-gray-100"
              : "fa-regular fa-square text-[#94A1B3] rounded-full px-[4px] py-[3px] hover:bg-gray-100"
          }
          onClick={onMaximize}
        />
        <IconButton
          iconStyles="fa-solid fa-xmark text-[#94A1B3] rounded-full px-[6px] py-[3px] hover:bg-gray-100"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default WindowHeader;
