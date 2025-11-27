// components
import { ContextMenu } from "@/components";

// icons
import { fa } from "@/icons/fa";

// types
import type { FileItem } from "@/types";

interface FileContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  item: FileItem | null;
  onRename: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const FileContextMenu = ({
  visible,
  x,
  y,
  item,
  onRename,
  onDelete,
  onClose,
}: FileContextMenuProps) => {
  if (!visible || !item) return null;

  const options = [
    {
      label: "Rename",
      icon: fa.faPencil,
      onClick: onRename,
    },
    {
      label: "Delete",
      icon: fa.faTrash,
      danger: true,
      onClick: onDelete,
    },
  ];

  return (
    <ContextMenu
      visible={visible}
      x={x}
      y={y}
      options={options}
      onClose={onClose}
    />
  );
};
