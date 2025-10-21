import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Tree } from "antd";
import type { DataNode } from "antd/es/tree";
import type { ColumnsType } from "antd/es/table";
import { useShallow } from "zustand/react/shallow";

// constant
import { WINDOW_KEYS } from "@/constant";

// store
import { useWindowStore } from "@/stores";

// hook
import { useFilemanagerQuery } from "@/hook";

// components
import { Button, DataTable, DraggableWindow, IconButton } from "@/components";

// types
import { FileItem } from "@/types";

// helpers
import { formatSize, getLocation, getPreviewImageSrc } from "@/helpers";

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
  const containerRef = useRef<HTMLDivElement>(null);

  // state
  const [tableHeight, setTableHeight] = useState<number>(0);
  const [selectedFolder, setSelectedFolder] = useState<string>("root");
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);

  // store
  const { zIndexOrder, setZIndexOrder, isMinimized } = useWindowStore(
    useShallow((state) => ({
      zIndexOrder: state.zIndexOrder,
      setZIndexOrder: state.setZIndexOrder,
      isMinimized: state.windows[WINDOW_KEYS.FILE_MANAGER].isMinimized,
    }))
  );

  useLayoutEffect(() => {
    const containerElement = containerRef.current;

    const updateHeight = () => {
      if (containerElement) {
        const buttonBarHeight = 70;
        const tableHeaderHeight = 37;
        const availableHeight =
          containerElement.clientHeight - tableHeaderHeight - buttonBarHeight;
        setTableHeight(Math.max(availableHeight, 100));
      }
    };

    const observer = new ResizeObserver(updateHeight);
    if (containerElement) {
      observer.observe(containerElement);
    }

    updateHeight();

    return () => {
      if (containerElement) {
        observer.unobserve(containerElement);
      }
    };
  }, []);

  const handleMouseDown = () => {
    if (zIndexOrder[zIndexOrder.length - 1] !== WINDOW_KEYS.FILE_MANAGER) {
      setZIndexOrder(WINDOW_KEYS.FILE_MANAGER);
    }
  };

  const { data: files = [], isLoading } = useFilemanagerQuery();

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
            <i className="fa-solid fa-folder fa-lg mr-[5px] text-[#94A1B3]"></i>
            My Files
          </span>
        ),
        key: "root",
        children: rootChildren,
      },
    ];
  }, [files, buildTree]);

  const filteredItems = useMemo(() => {
    return files
      .filter((item) => item.parentId === selectedFolder)
      .map((item) => ({
        ...item,
        key: item.id,
      }));
  }, [files, selectedFolder]);

  const columns = useMemo<ColumnsType<FileItem>>(
    () => [
      {
        title: "",
        dataIndex: "name",
        key: "name",
        render: (text: string, record: FileItem) => (
          <span>
            <i
              className={`fa-solid ${
                record.type === "folder"
                  ? "fa-folder text-[#1f88dd]"
                  : "fa-file text-[#b3cae1]"
              } fa-lg mr-[10px]`}
            ></i>
            {text}
          </span>
        ),
      },
      {
        title: "Size",
        dataIndex: "size",
        key: "size",
        width: 100,
        align: "left",
        render: (size: number) => (size === null ? "" : `${size} KB`),
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        width: 150,
        align: "left",
        render: () =>
          new Date()
            .toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
            .replace(/,/, ""),
      },
    ],
    []
  );

  // Handle table row click to select item
  const handleRowClick = (item: FileItem) => {
    setSelectedItem(item);
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  // Preview component
  const PreviewPane = () => {
    const currentItem = selectedItem || null;
    const imageSrc = getPreviewImageSrc(currentItem);
    const hasItem = !!currentItem;

    return (
      <div className="w-[470px] flex flex-col bg-[#EBEDF0] rounded-[2px] mt-[10px] ml-[10px] ">
        {/* Top Card: File Preview */}
        <div className="border border-[#DADEE0] bg-[#FFFFFF] w-[470px] h-1/2 min-h-[450px]">
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

        {/* Bottom Card: Information (only if item selected, else hide) */}
        {hasItem && (
          <div className="space-y-2 mt-[10px] bg-[#FFFFFF] border border-[#DADEE0] h-1/2 min-h-[215px]">
            <h4 className="flex items-center justify-center font-medium border-b border-[#DADEE0] h-[42px] text-[#1CA1C1] shadow-[inset_0_-2px_#1CA1C1] text-[16px]">
              Information
            </h4>
            <div className="p-4 text-[#475466] text-[14px]">
              <div className="flex">
                <span className="font-medium w-[40%] text-right p-[6px]">
                  Type
                </span>
                <span className="w-[60%] p-[6px] capitalize">
                  {currentItem.type}
                </span>
              </div>
              <div className="flex">
                <span className="font-medium w-[40%] text-right p-[6px]">
                  Size
                </span>
                <span className="w-[60%] p-[6px]">
                  {formatSize(currentItem.size)}
                </span>
              </div>
              <div className="flex">
                <span className="font-medium w-[40%] text-right p-[6px]">
                  Date
                </span>
                <span className="w-[60%] p-[6px]">{currentItem.date}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-[40%] text-right p-[6px]">
                  Location
                </span>
                <span className="w-[60%] p-[6px]">
                  {getLocation(files, selectedFolder, currentItem)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

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
      <div
        className="flex flex-col h-full w-full overflow-hidden bg-[#EBEDF0]"
        ref={containerRef}
      >
        {/* Header */}
        <div className="flex items-center h-[56px] flex-shrink-0 w-full rounded-[2px] border border-[#DADEE0] text-[#475466] bg-[#FFFFFF] ">
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
              buttonStyles="p-1 flex justify-center items-center w-[60px] h-[38px] bg-[#F4F5F9] hover:bg-[#E4E6F0]"
              iconStyles="fa-solid fa-eye text-[#1CA1C1] text-sm"
              onClick={togglePreview}
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
          <div className="w-[250px] flex flex-col bg-[#FFFFFF] mt-[10px] mr-[10px] rounded-[2px] border border-[#DADEE0] text-[#475466]">
            <Button variant="primary" className="mx-4 mt-[8px] mb-[8px]">
              Add New
            </Button>
            <Tree
              treeData={treeData}
              onSelect={(keys) => {
                if (keys.length > 0) {
                  setSelectedFolder(keys[0] as string);
                  setSelectedItem(null);
                }
              }}
              defaultExpandedKeys={["root"]}
              defaultSelectedKeys={["root"]}
            />
          </div>
          <div className="flex-1 bg-[#FFFFFF] mt-[10px] box-content rounded-[2px] border border-[#e0dada] text-[#475466] overflow-auto">
            <DataTable
              columns={columns}
              dataSource={filteredItems}
              tableHeight={tableHeight}
              loading={isLoading}
              onRow={(record) => ({
                onClick: () => {
                  setSelectedItem(record);
                },
                className:
                  selectedItem?.id === record.id
                    ? "ant-table-row-selected"
                    : "",
              })}
            />
          </div>
          {previewMode && <PreviewPane />}
        </div>
      </div>
    </DraggableWindow>
  );
};

export default FilemanagerPage;
