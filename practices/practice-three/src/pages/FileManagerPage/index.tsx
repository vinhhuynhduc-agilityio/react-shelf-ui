import { useCallback, useMemo } from "react";
import { Tree } from "antd";
import type { DataNode } from "antd/es/tree";
import { useShallow } from "zustand/react/shallow";

// constant
import { WINDOW_KEYS } from "@/constant";

// store
import { useWindowStore } from "@/stores";

// hook
import { useFilemanagerQuery } from "@/hook";

// components
import { Button, DraggableWindow } from "@/components";

// types
import { FileItem } from "@/types";

const FilemanagerPage = ({
  onClose,
  onMaximize,
  onMinimize,
  zIndex,
}: {
  onClose: () => void;
  onMaximize: () => void;
  onMinimize: () => void;
  zIndex: number;
}) => {
  const { zIndexOrder, setZIndexOrder, isMinimized } = useWindowStore(
    useShallow((state) => ({
      zIndexOrder: state.zIndexOrder,
      setZIndexOrder: state.setZIndexOrder,
      isMinimized: state.windows[WINDOW_KEYS.FILE_MANAGER].isMinimized,
    }))
  );

  const handleMouseDown = () => {
    if (zIndexOrder[zIndexOrder.length - 1] !== WINDOW_KEYS.FILE_MANAGER) {
      setZIndexOrder(WINDOW_KEYS.FILE_MANAGER);
    }
  };

  const { data: files = [] } = useFilemanagerQuery();

  const buildTree = useCallback(
    (items: FileItem[], parentId: string | number): DataNode[] => {
      return items
        .filter((item) => item.parentId === parentId && item.type === "folder")
        .map((item) => ({
          title: (
            <span>
              <i
                className="fa-solid fa-folder fa-lg"
                style={{ marginRight: "5px", color: "#a4b1c6" }}
              ></i>
              {item.name}
            </span>
          ),
          key: item.id,
          children: buildTree(items, item.id),
        }));
    },
    []
  );

  const treeData = useMemo(() => {
    const rootChildren = buildTree(files, "root");
    return [
      {
        title: (
          <span>
            <i
              className="fa-solid fa-folder fa-lg"
              style={{ marginRight: "5px", color: "#a4b1c6" }}
            ></i>
            My Files
          </span>
        ),
        key: "root",
        children: rootChildren,
      },
    ];
  }, [files, buildTree]);

  return (
    <DraggableWindow
      windowKey={WINDOW_KEYS.FILE_MANAGER}
      src="/images/file-manager.png"
      title="File Manager"
      hidden={isMinimized}
      zIndex={zIndex}
      onClose={onClose}
      onMaximize={onMaximize}
      onMinimize={onMinimize}
      onMouseDown={handleMouseDown}
    >
      <div className="flex h-full">
        <div className="w-[250px] border-r border-gray-200 flex flex-col">
          <Button variant="primary" className="mx-6 mt-[8px] mb-[8px]">
            Add New
          </Button>
          <Tree
            treeData={treeData}
            onSelect={() => {}}
            defaultExpandedKeys={["root"]}
          />
        </div>
        <div>Details of Selected Folder</div>
      </div>
    </DraggableWindow>
  );
};

export default FilemanagerPage;
