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
import { Button, DraggableWindow, IconButton } from "@/components";

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
              <i className="fa-solid fa-folder fa-lg mr-[5px] text-[#94A1B3]"></i>
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
            <i className="fa-solid fa-folder fa-lg mr-5px] text-[#94A1B3]"></i>
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
      <div className="flex flex-col h-full bg-[#EBEDF0]">
        {/* Header */}
        <div className="bg-[#FFFFFF] h-[56px] w-full box-content rounded-[2px] border border-[#DADEE0] text-[#475466] flex items-center">
          <div className="flex flex-1 items-center ml-[12px]">
            <span className="font-medium mr-4 text-[#475466]">Files</span>
            <div className="flex-1 max-w-[300px] min-w-[10px] flex items-center h-[32px] relative overflow-hidden">
              <input
                name="search"
                type="text"
                placeholder="Search files and folders"
                className="flex-1 rounded-[3px] border border-[#CCD7E6] focus:border-[#1CA1C1] text-[#94A1B3] text-sm px-2 focus:outline-none w-full h-full"
                maxLength={26}
              />
              <IconButton
                iconStyles="fa-solid fa-magnifying-glass text-[#94A1B3] text-sm"
                buttonStyles="p-1 flex justify-center items-center rounded-full w-[22px] h-[22px] absolute right-[3px] bg-[#FFFFFF]"
                onClick={() => {}}
              />
            </div>
          </div>
          <div className="flex items-center space-x-1 mr-[12px]">
            <IconButton
              buttonStyles="p-1 flex justify-center items-center w-[60px] h-[38px] bg-[#daddeb] hover:bg-[#E4E6F0]"
              iconStyles="fa-solid fa-eye text-[#1CA1C1] text-sm"
              onClick={() => {}}
            />
            <IconButton
              buttonStyles="p-1 flex justify-center items-center w-[40px] h-[38px] bg-[#1CA1C1] hover:bg-[#1992af]"
              iconStyles="fa-solid fa-bars fa-lg text-[#FFFFFF] text-sm"
              onClick={() => {}}
            />
          </div>
        </div>
        {/* Body */}
        <div className="flex flex-1 bg-[#EBEDF0]">
          <div className="w-[250px] flex flex-col bg-[#FFFFFF] mt-[10px] mr-[10px] box-content rounded-[2px] border border-[#DADEE0] text-[#475466]">
            <Button variant="primary" className="mx-4 mt-[8px] mb-[8px]">
              Add New
            </Button>
            <Tree
              treeData={treeData}
              onSelect={() => {}}
              defaultExpandedKeys={["root"]}
            />
          </div>
          <div className="flex-1 bg-[#FFFFFF] mt-[10px] box-content rounded-[2px] border border-[#DADEE0] text-[#475466]">
            Details of Selected Folder
          </div>
        </div>
      </div>
    </DraggableWindow>
  );
};

export default FilemanagerPage;
