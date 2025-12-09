// components
import { Button, Icon, Modal } from "@/components";
import { fa } from "@/icons/fa";

// types
import type { FileItem } from "@/types";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  item: FileItem | null;
  isDeleting?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteConfirmModal = ({
  isOpen,
  item,
  isDeleting = false,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) => {
  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      title="Delete files"
      titleAlign="center"
      hideCloseButton
      onClose={onClose}
      className="w-[252px]"
    >
      <div className="flex flex-col space-y-2">
        <p className="text-sm text-[#475466]">
          Are you sure you want to delete this item:
        </p>
        <div className="flex items-center space-x-2">
          <span className="font-medium text-[#475466]">
            ●&nbsp; {item.name}
          </span>
        </div>
        <div className="flex justify-between space-x-2">
          <Button
            variant="success"
            onClick={onClose}
            className="w-[100px] h-[30px] px-4"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className="w-[100px] h-[30px] px-4"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Icon icon={fa.faSpinner} className="fa-spin mr-2" />
                Deleting...
              </>
            ) : (
              "OK"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
