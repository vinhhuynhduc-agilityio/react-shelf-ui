// icons
import { fa } from "@/icons/fa";

// components
import { Button, Icon, Modal } from "@/components";

interface UnsavedChangesModalProps {
  isOpen: boolean;
  fileName?: string;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

const UnsavedChangesModal = ({
  isOpen,
  fileName = "this document",
  onSave,
  onDiscard,
  onCancel,
}: UnsavedChangesModalProps) => {
  return (
    <Modal isOpen={isOpen} title="Save" onClose={onCancel} titleAlign="center">
      <div className="flex flex-col items-center gap-4 p-4">
        <div className="flex items-center gap-3">
          <Icon
            icon={fa.faExclamationTriangle}
            className="text-orange-500 text-2xl"
          />
          <p className="text-gray-700 text-sm leading-relaxed">
            Do you want to save the changes you made to{" "}
            <strong>&quot;{fileName}&quot;</strong>?
          </p>
        </div>

        <div className="flex justify-end gap-3 w-full mt-8">
          <Button variant="primary" onClick={onSave}>
            Yes
          </Button>
          <Button variant="success" onClick={onDiscard}>
            No
          </Button>
          <Button variant="success" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UnsavedChangesModal;
