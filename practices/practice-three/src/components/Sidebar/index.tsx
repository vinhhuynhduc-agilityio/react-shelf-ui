import { Key } from "react";
import clsx from "clsx";
import { Tree } from "antd";
import type { DataNode } from "antd/es/tree";

// components
import { Button, Dropdown, StatusBar } from "@/components";

// constant
import { dropdownOptions } from "@/constant";

// types
import type { DropdownOption } from "@/types";

interface SidebarProps {
  treeData: DataNode[];
  expandedKeys: Key[];
  selectedKey: string;
  treeHeight: number;
  isDropdownOpen: boolean;
  isDisabled: boolean;
  isUploadingFolder: boolean;
  isDeletingFolder: boolean;
  isRenaming: boolean;
  isFetching: boolean;
  statusBar: { message: string; type: "success" | "error" } | null;
  buttonRef: React.RefObject<HTMLButtonElement | null>;

  onExpand: (expandedKeys: Key[]) => void;
  onSelect: (keys: Key[]) => void;
  onAddNewClick: () => void;
  onDropdownSelect: (option: DropdownOption) => void;
  onDropdownClose: () => void;
  onStatusBarClear: () => void;
}

export const Sidebar = ({
  treeData,
  expandedKeys,
  selectedKey,
  treeHeight,
  isDropdownOpen,
  isDisabled,
  isUploadingFolder,
  isDeletingFolder,
  isRenaming,
  isFetching,
  statusBar,
  buttonRef,
  onExpand,
  onSelect,
  onAddNewClick,
  onDropdownSelect,
  onDropdownClose,
  onStatusBarClear,
}: SidebarProps) => {
  return (
    <div
      className={clsx(
        "w-[250px] flex flex-col bg-[#FFFFFF] mt-[10px] mr-[10px] rounded-[2px] border border-[#DADEE0] text-[#475466]"
      )}
    >
      <div className="flex items-center justify-center w-full mt-[8px] mb-[8px]">
        <Button
          variant="primary"
          className="w-[calc(100%-32px)]"
          onClick={onAddNewClick}
          ref={buttonRef}
          disabled={isDisabled || isFetching}
        >
          {isDisabled ? (
            <>
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              {isUploadingFolder
                ? "Uploading folder..."
                : isDeletingFolder
                ? "Deleting folder..."
                : isRenaming
                ? "Renaming..."
                : "Creating..."}
            </>
          ) : (
            "Add New"
          )}
        </Button>
      </div>

      <Dropdown
        options={dropdownOptions}
        onSelect={onDropdownSelect}
        isOpen={isDropdownOpen}
        setIsOpen={onDropdownClose}
        triggerRef={buttonRef}
      />

      {/* Tree + StatusBar */}
      <div className="relative flex-1">
        <Tree
          treeData={treeData}
          expandedKeys={expandedKeys}
          onExpand={onExpand}
          selectedKeys={[selectedKey]}
          onSelect={onSelect}
          defaultExpandedKeys={["root"]}
          height={treeHeight}
          style={{ whiteSpace: "nowrap", overflow: "visible" }}
        />
        <div className="absolute bottom-0 left-0 right-0">
          <StatusBar
            message={statusBar?.message ?? null}
            type={statusBar?.type ?? "success"}
            onClear={onStatusBarClear}
          />
        </div>
      </div>
    </div>
  );
};
