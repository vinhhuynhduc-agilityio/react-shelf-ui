import { ReactNode, useRef } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

// components
import IconButton from "@/components/common/IconButton";

// icons
import { fa } from "@/icons/fa";

interface ModalProps {
  isOpen: boolean;
  title: string;
  titleAlign?: "left" | "center" | "right";
  onClose: () => void;
  children: ReactNode;
  className?: string;
  headerHeight?: number;
  hideCloseButton?: boolean;
}

const ModalContent = ({
  isOpen,
  title,
  onClose,
  children,
  className = "w-[364px]",
  headerHeight = 38,
  titleAlign = "left",
  hideCloseButton = false,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      data-testid="modal-overlay"
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20" />
      {/* Modal Content */}
      <div
        ref={modalRef}
        className={clsx(
          "relative overflow-hidden bg-[#FFFFFF] shadow-lg",
          className
        )}
        data-testid="modal-content"
      >
        {/* Header */}
        <div
          className={clsx(
            "flex items-center px-[17px]",
            hideCloseButton && "shadow-[inset_0_4px_0_0_#1CA1C1]"
          )}
          style={{ height: headerHeight }}
          data-testid="modal-header"
        >
          <h2
            className={clsx(
              "flex-1 text-[#475466] font-medium text-[16px] truncate",
              titleAlign === "center" && "text-center",
              titleAlign === "right" && "text-right"
            )}
          >
            {title}
          </h2>

          {!hideCloseButton && (
            <IconButton
              icon={fa.faX}
              onClick={onClose}
              iconStyles="fa-xs text-[#94A1B3] hover:text-[#1CA1C1] text-lg leading-none px-3 py-4 rounded-full"
            />
          )}
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
