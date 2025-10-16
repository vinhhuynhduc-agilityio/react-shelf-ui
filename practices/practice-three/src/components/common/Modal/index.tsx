import { ReactNode, useRef } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

// components
import IconButton from "@/components/IconButton";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  headerHeight?: number;
}

const ModalContent = ({
  isOpen,
  title,
  onClose,
  children,
  className = "",
  headerHeight = 38,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20" />
      {/* Modal Content */}
      <div
        ref={modalRef}
        className={clsx(
          "relative overflow-hidden max-w-md w-full bg-[#FFFFFF] shadow-lg",
          className
        )}
      >
        {/* Header */}
        <div
          className={clsx(
            "flex justify-between items-center ml-[17px] mt-[8px] mr-[20px]",
            `h-[${headerHeight}px]`
          )}
        >
          <h2 className="text-[#475466] font-medium text-[16px] truncate">
            {title}
          </h2>
          <IconButton
            onClick={onClose}
            iconStyles="fa-solid fa-x fa-xs text-[#94A1B3] hover:text-[#1CA1C1] text-lg leading-none px-3 py-4 rounded-full"
          />
        </div>

        {/* Body */}
        <div className="ml-[17px] mr-[17px] mb-[17px]">{children}</div>
      </div>
    </div>
  );
};

const Modal = (props: ModalProps) => {
  return createPortal(<ModalContent {...props} />, document.body);
};

export default Modal;
