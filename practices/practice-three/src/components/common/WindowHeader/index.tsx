interface WindowHeaderProps {
  title: string;
  src: string;
  onClose: () => void;
  onMaximize: () => void;
  onMinimize: () => void;
}

const WindowHeader = ({
  src,
  title,
  onClose,
  onMaximize,
  onMinimize,
}: WindowHeaderProps) => {
  return (
    <div className="drag-handle bg-white flex justify-between items-center border-b border-[#DADEE0] w-full h-[30px]">
      <div className="inline-flex items-center justify-center space-x-2">
        <img
          src={src}
          alt={title}
          className="w-[18px] h-[18px] mx-[10px] ml-[8px] text-[10px] pointer-events-none"
        />
        <span className="text-[16px] font-medium text-[#475466] tracking-normal cursor-default">
          {title}
        </span>
      </div>
      <div className="flex items-center justify-center space-x-2 mr-3">
        <button
          className="text-white text-lg p-1 w-[26px] h-[26px] cursor-pointer flex justify-center items-center rounded-full"
          onClick={onMinimize}
        >
          <i className="fa-solid fa-minus text-[#94A1B3] hover:bg-gray-100 rounded-full px-[4px] py-[3px]"></i>
        </button>
        <button
          className="text-white text-lg p-1 w-[26px] h-[26px] cursor-pointer flex justify-center items-center rounded-full"
          onClick={onMaximize}
        >
          <i className="fa-regular fa-square text-[#94A1B3] px-[4px] py-[3px] hover:bg-gray-100 rounded-full"></i>
        </button>
        <button
          className="text-white text-lg p-1 w-[26px] h-[26px] cursor-pointer flex justify-center items-center rounded-full"
          onClick={onClose}
        >
          <i className="fa-solid fa-xmark text-[#94A1B3] hover:bg-gray-100 rounded-full py-[3px] px-[6px]"></i>
        </button>
      </div>
    </div>
  );
};

export default WindowHeader;
