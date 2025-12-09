import clsx from "clsx";
import type { ColumnsType } from "antd/es/table";

// components
import { DataTable, Breadcrumb, IconButton } from "@/components";

// types
import type { FileItem } from "@/types";

// icons
import { fa } from "@/icons/fa";

interface FileTableViewProps {
  filteredItems: (FileItem & { key: string })[];
  columns: ColumnsType<FileItem>;
  tableHeight: number;
  isFetching: boolean;
  isLoading: boolean;
  isSearchMode: boolean;
  debouncedSearch: string;
  searchPath: string;
  breadcrumbPath: { id: string; name: string }[];
  selectedFolder: string;
  selectedItem: FileItem | null;
  onNavigate: (folderId: string) => void;
  onRowClick: (record: FileItem) => void;
  onRowDoubleClick: (record: FileItem) => void;
  onRowContextMenu: (e: React.MouseEvent, record: FileItem) => void;
  onClearSearch: () => void;
}

export const FileTableView = ({
  filteredItems,
  columns,
  tableHeight,
  isFetching,
  isLoading,
  isSearchMode,
  debouncedSearch,
  searchPath,
  breadcrumbPath,
  selectedFolder,
  selectedItem,
  onNavigate,
  onRowClick,
  onRowDoubleClick,
  onRowContextMenu,
  onClearSearch,
}: FileTableViewProps) => {
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.type === "folder" && b.type !== "folder") return -1;
    if (a.type !== "folder" && b.type === "folder") return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="flex-1 flex flex-col mt-[10px] rounded-[2px] border border-[#e0dada] text-[#475466] overflow-hidden">
      {/* Breadcrumb or Search Result */}
      <div className="flex items-center h-[42px] border-b border-[#DADEE0] bg-[#FFFFFF]">
        {isSearchMode && debouncedSearch.trim() ? (
          <div className="flex items-center w-full text-md ml-1">
            <IconButton
              icon={fa.faChevronLeft}
              onClick={onClearSearch}
              iconStyles="fa-sm text-[#94A1B3]"
              buttonStyles="p-1 w-[38px] h-[38px] flex justify-center items-center rounded-full hover:bg-[#F4F5F9] mr-1"
              ariaLabel="Clear search and go back"
            />
            <span>Search results in {searchPath}</span>
          </div>
        ) : (
          <Breadcrumb
            path={breadcrumbPath}
            onNavigate={onNavigate}
            currentFolderId={selectedFolder}
            breadcrumbStyles="px-3"
          />
        )}
      </div>

      {/* Table */}
      <div
        className={clsx(
          "flex-1 bg-[#FFFFFF]",
          isSearchMode && !sortedItems.length && "hidden"
        )}
      >
        <DataTable
          columns={columns}
          dataSource={sortedItems}
          tableHeight={tableHeight}
          isFetching={isFetching}
          isLoading={isLoading}
          onRow={(record) => ({
            onClick: () => onRowClick(record),
            onDoubleClick: () => onRowDoubleClick(record),
            onContextMenu: (e: React.MouseEvent) => onRowContextMenu(e, record),
            className:
              selectedItem?.id === record.id ? "ant-table-row-selected" : "",
          })}
        />
      </div>
    </div>
  );
};
