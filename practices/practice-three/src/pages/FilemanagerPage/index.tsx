import {
  Key,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { Tree } from "antd";
import type { DataNode } from "antd/es/tree";
import type { ColumnsType } from "antd/es/table";
import { useShallow } from "zustand/react/shallow";
import { useForm, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";

// constant
import {
  addConfigs,
  dropdownOptions,
  QUERY_KEY_FILE_MANAGER,
  WINDOW_KEYS,
} from "@/constant";

// store
import { useWindowStore } from "@/stores";

// hook
import { useAddFileItem, useDebounce, useFilemanagerQuery } from "@/hook";

// components
import {
  Button,
  DataTable,
  DraggableWindow,
  IconButton,
  Dropdown,
  Modal,
  Breadcrumb,
} from "@/components";

// types
import { FileItem, DropdownOption, FormData } from "@/types";

// helpers
import {
  createNewItem,
  generateBase64Image,
  getBasicInfo,
  getBreadcrumbPath,
  getPathIds,
  getPreviewImageSrc,
  mapExtension,
} from "@/helpers";

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
  const queryClient = useQueryClient();

  // === STATE ===
  const [tableHeight, setTableHeight] = useState<number>(0);
  const [selectedFolder, setSelectedFolder] = useState<string>("root");
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addType, setAddType] = useState<"addFolder" | "addFile" | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>(["root"]);
  const [hasChanged, setHasChanged] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  // refs
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const hasChangedRef = useRef(hasChanged);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormData>({
    defaultValues: { name: "" },
    mode: "onChange",
  });

  // store
  const { zIndexOrder, setZIndexOrder, isMinimized } = useWindowStore(
    useShallow((state) => ({
      zIndexOrder: state.zIndexOrder,
      setZIndexOrder: state.setZIndexOrder,
      isMinimized: state.windows[WINDOW_KEYS.FILE_MANAGER].isMinimized,
    }))
  );

  // Fetch initial data
  const {
    data: initialFiles = [],
    isLoading,
    isSuccess,
  } = useFilemanagerQuery();

  useEffect(() => {
    if (isSuccess && Array.isArray(initialFiles)) {
      setFiles(initialFiles);
    }
  }, [isSuccess, initialFiles, setFiles]);

  useLayoutEffect(() => {
    const containerElement = containerRef.current;

    const updateHeight = () => {
      if (containerElement) {
        const buttonBarHeight = 70;
        const tableHeaderHeight = 37;
        const breadcrumbHeight = 42;
        const totalFixedHeight =
          buttonBarHeight + tableHeaderHeight + breadcrumbHeight;
        const availableHeight =
          containerElement.clientHeight - totalFixedHeight;

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

  // Update refs when state changes
  useEffect(() => {
    hasChangedRef.current = hasChanged;
  }, [hasChanged]);

  // Invalidate queries on unmount if changes occurred
  useEffect(() => {
    return () => {
      if (hasChangedRef.current) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY_FILE_MANAGER });
      }
    };
  }, [queryClient]);

  const handleMouseDown = () => {
    if (zIndexOrder[zIndexOrder.length - 1] !== WINDOW_KEYS.FILE_MANAGER) {
      setZIndexOrder(WINDOW_KEYS.FILE_MANAGER);
    }
  };

  const { mutate: addItem, mutateAsync: addItemAsync } = useAddFileItem();

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

  const getAllChildFolderIds = useCallback(
    (parentId: string): string[] => {
      const children = files
        .filter((f) => f.parentId === parentId && f.type === "folder")
        .map((f) => f.id);

      return children.flatMap((id) => [id, ...getAllChildFolderIds(id)]);
    },
    [files]
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
    // In search mode, filter items in the selected folder subtree
    if (isSearchMode && debouncedSearch.trim()) {
      const subtreeIds = [
        selectedFolder,
        ...getAllChildFolderIds(selectedFolder),
      ];
      let items = files
        .filter((item) => subtreeIds.includes(item.parentId))
        .map((item) => ({ ...item, key: item.id }));

      const query = debouncedSearch.toLowerCase();
      items = items.filter((item) => item.name.toLowerCase().includes(query));

      return items;
    }

    // Normal mode: show items in the selected folder
    return files
      .filter((item) => item.parentId === selectedFolder)
      .map((item) => ({ ...item, key: item.id }));
  }, [
    files,
    selectedFolder,
    isSearchMode,
    debouncedSearch,
    getAllChildFolderIds,
  ]);

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

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  const handleSelect = (option: DropdownOption) => {
    const handleAddConfig = () => {
      const config = addConfigs[option.key];
      if (config) {
        setAddType(config.type);
        reset({ name: config.name });
        setIsAddModalOpen(true);
      } else {
        console.log(`Selected: ${option.label}`);
      }
    };

    const actions: Record<string, () => void> = {
      "upload-file": () => {
        fileInputRef.current?.click();
      },
      "upload-folder": () => {
        folderInputRef.current?.click();
      },
      "create-file": handleAddConfig,
      "create-folder": handleAddConfig,
      default: () => {
        console.log(`Selected: ${option.label}`);
      },
    };

    const action = actions[option.key] || actions.default;
    action();
    setIsDropdownOpen(false);
  };

  const handleAddNewItem = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleAdd = (data: FormData) => {
    // Validate duplicate name
    const existing = files.find(
      (item) => item.parentId === selectedFolder && item.name === data.name
    );
    if (existing) {
      setError("name", {
        type: "manual",
        message: `${
          addType === "addFolder" ? "Folder" : "File"
        } name already exists`,
      });
      return;
    }

    const newItem = createNewItem(addType, data, selectedFolder);

    // Optimistic update
    setFiles((prev) => [...prev, newItem]);
    setExpandedKeys((prev) => [...new Set([...prev, selectedFolder])]);

    // Call API
    addItem(newItem, {
      onError: (error, newItem) => {
        console.error(
          `Add ${addType === "addFolder" ? "folder" : "file"} failed:`,
          error
        );
        setFiles((prev) => prev.filter((item) => item.id !== newItem.id));
      },
    });

    setIsAddModalOpen(false);
    reset({ name: "" });
    setHasChanged(true);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    const { type, imageUrl: defaultImage } = mapExtension(extension);
    const imageUrl = (await generateBase64Image(file)) || defaultImage;

    // Validate duplicate name
    const existing = files.find(
      (item) => item.parentId === selectedFolder && item.name === file.name
    );
    if (existing) {
      alert("File name already exists");
      return;
    }

    const newItem: FileItem = {
      id: uuidv4(),
      name: file.name,
      size: Math.round(file.size / 1024),
      type,
      parentId: selectedFolder,
      imageUrl,
    };

    // Optimistic update
    setFiles((prev) => [...prev, newItem]);
    setExpandedKeys((prev) => [...new Set([...prev, selectedFolder])]);

    // Call API
    addItem(newItem, {
      onError: (error, newItem) => {
        console.error("Upload failed:", error);
        setFiles((prev) => prev.filter((item) => item.id !== newItem.id));
      },
    });

    setHasChanged(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFolderUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const rootName = fileList[0].webkitRelativePath.split("/")[0];

    const existingRoot = files.find(
      (item) => item.parentId === selectedFolder && item.name === rootName
    );
    if (existingRoot) {
      alert("Folder name already exists");
      return;
    }

    const rootClientId = uuidv4();
    const rootItem: FileItem = {
      id: rootClientId,
      name: rootName,
      type: "folder",
      parentId: selectedFolder,
      size: null,
      imageUrl: "/images/folder-detail-placeholder.svg",
    };

    setFiles((prev) => [...prev, rootItem]);
    setExpandedKeys((prev) => [...new Set([...prev, selectedFolder])]);

    let serverRootId: string;
    try {
      const data = await addItemAsync(rootItem);
      serverRootId = data.id;
    } catch (err) {
      console.error(`Add root folder failed:`, err);
      setFiles((prev) => prev.filter((i) => i.id !== rootClientId));
      return;
    }

    const parentMap: { [path: string]: string } = { "": serverRootId };
    const paths = new Set<string>();

    // Get all paths from fileList except root
    for (const file of Array.from(fileList)) {
      const parts = file.webkitRelativePath.split("/").slice(0, -1);
      let currentPath = "";
      for (const dir of parts) {
        if (dir === rootName && currentPath === "") continue;
        currentPath = currentPath ? `${currentPath}/${dir}` : dir;
        paths.add(currentPath);
      }
    }

    const sortedPaths = Array.from(paths).sort(
      (a, b) => a.split("/").length - b.split("/").length
    );

    // Add subfolders first to maintain hierarchy
    for (const path of sortedPaths) {
      const dirName = path.split("/").pop()!;
      const parentPath = path.split("/").slice(0, -1).join("/");
      const parentId = parentMap[parentPath];

      const clientId = uuidv4();
      const dirItem: FileItem = {
        id: clientId,
        name: dirName,
        type: "folder",
        parentId,
        size: null,
        imageUrl: "/images/folder-detail-placeholder.svg",
      };

      setFiles((prev) => [...prev, dirItem]);

      try {
        const data = await addItemAsync(dirItem);
        const serverDirId = data.id;
        parentMap[path] = serverDirId;
      } catch (err) {
        console.error(`Add subfolder ${dirName} failed:`, err);
        setFiles((prev) => prev.filter((i) => i.id !== clientId));
      }
    }

    // Now add files to their respective folders and subfolders
    for (const file of Array.from(fileList)) {
      const parts = file.webkitRelativePath.split("/");
      const fileName = parts.pop()!;
      const parentPath = parts.slice(1).join("/");
      const parentId = parentMap[parentPath] || serverRootId;

      const existing = files.find(
        (i) => i.parentId === parentId && i.name === fileName
      );
      if (existing) continue;

      const extension = fileName.split(".").pop()?.toLowerCase() || "";
      const { type, imageUrl: defaultImage } = mapExtension(extension);

      let imageUrl: string;
      try {
        imageUrl = await generateBase64Image(file);
      } catch (err) {
        console.warn(`Base64 failed for ${fileName}, using placeholder`, err);
        imageUrl = defaultImage;
      }

      const clientId = uuidv4();
      const fileItem: FileItem = {
        id: clientId,
        name: fileName,
        size: Math.round(file.size / 1024),
        type,
        parentId,
        imageUrl,
      };

      setFiles((prev) => [...prev, fileItem]);

      try {
        await addItemAsync(fileItem);
      } catch (err) {
        console.error(`Add file ${fileName} failed:`, err);
        setFiles((prev) => prev.filter((i) => i.id !== clientId));
      }
    }

    setHasChanged(true);

    // Reset inputs for future uploads
    if (folderInputRef.current) folderInputRef.current.value = "";
  };

  const breadcrumbPath = useMemo(() => {
    return selectedFolder
      ? getBreadcrumbPath(files, selectedFolder)
      : [{ id: "root", name: "My Files" }];
  }, [files, selectedFolder]);

  const handleNavigate = useCallback(
    (folderId: string) => {
      setSelectedFolder(folderId);
      setSelectedItem(null);

      // Update expanded keys to show the navigated folder in the tree
      const pathIds = getPathIds(files, folderId);
      setExpandedKeys((prev) => [...new Set([...prev, ...pathIds])]);
    },
    [files]
  );

  // Preview component
  const renderPreview = () => {
    const currentItem = selectedItem || null;
    const imageSrc = getPreviewImageSrc(currentItem);
    const hasItem = !!currentItem;
    const extraInfo = currentItem?.extraInfo;

    return (
      <div
        className="w-[470px] flex flex-col bg-[#EBEDF0] rounded-[2px] mt-[10px] ml-[10px] overflow-auto"
        style={{ height: tableHeight + 43 }}
      >
        {/* Top Card: File Preview */}
        <div
          className={clsx(
            "border border-[#DADEE0] bg-[#FFFFFF] w-full min-h-[450px]",
            extraInfo ? "h-[450px]" : hasItem ? "h-1/2" : "h-full"
          )}
        >
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
          <div className="flex-1 space-y-2 mt-[10px] bg-[#FFFFFF] border border-[#DADEE0] text-[#475466] text-[14px] w-full">
            <h4 className="flex items-center justify-center font-medium border-b border-[#DADEE0] h-[42px] text-[#1CA1C1] shadow-[inset_0_-2px_#1CA1C1] text-[16px]">
              Information
            </h4>
            <div className="h-[130px]">
              {getBasicInfo(currentItem, files, selectedFolder).map(
                ({ label, value }) => (
                  <div className="flex" key={label}>
                    <span className="font-medium w-[40%] text-right p-[6px]">
                      {label}
                    </span>
                    <span className="w-[60%] p-[6px]">{value}</span>
                  </div>
                )
              )}
            </div>

            {extraInfo && Object.keys(extraInfo).length > 0 && (
              <div className="h-[923px] border-t border-[#ebedf0] mt-[24px] ml-[14px]">
                <div className="flex items-center">
                  <span className="flex items-center justify-center rounded-full border border-[#94A1B3] w-[12.5px] h-[12.5px]">
                    <i className="fa-solid fa-info fa-2xs"></i>
                  </span>
                  <span className="font-medium w-[40%] p-[6px]">
                    Extra Info
                  </span>
                  <span className="w-[60%] p-[6px]"></span>
                </div>
                {Object.entries(extraInfo).map(([key, value]) => (
                  <div className="flex" key={key}>
                    <span className="font-medium w-[40%] text-right p-[6px] truncate">
                      {key}
                    </span>
                    <span className="w-[60%] p-[6px]">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    const trimmed = newValue.trim();

    if (trimmed && !isSearchMode) {
      setIsSearchMode(true);
    } else if (!trimmed && isSearchMode) {
      setIsSearchMode(false);
    }
  };

  const renderHeader = () => (
    <div className="flex items-center h-[56px] flex-shrink-0 w-full rounded-[2px] border border-[#DADEE0] text-[#475466] bg-[#FFFFFF] ">
      <div className="flex flex-1 items-center ml-[12px]">
        <span className="font-medium mr-4 text-[#475466]">Files</span>
        <div className="flex-1 max-w-[300px] min-w-[10px] flex items-center h-[32px] relative overflow-hidden">
          <input
            name="search"
            type="text"
            placeholder="Search files and folders"
            className="flex-1 rounded-[3px] border border-[#CCD7E6] focus:border-[#1CA1C1] text-[#475466] text-sm px-2 focus:outline-none w-full h-full"
            value={searchQuery}
            onChange={handleSearchChange}
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
      </div>
    </div>
  );

  const renderTableNavigation = () => (
    <div
      className={clsx(
        "w-[250px] flex flex-col bg-[#FFFFFF] mt-[10px] mr-[10px] rounded-[2px] border border-[#DADEE0] text-[#475466]",
        isSearchMode && debouncedSearch.trim() && "hidden"
      )}
    >
      <div className="flex items-center justify-center w-full mt-[8px] mb-[8px]">
        <Button
          variant="primary"
          className="w-[calc(100%-32px)]"
          onClick={handleAddNewItem}
          ref={buttonRef}
        >
          Add New
        </Button>
      </div>
      <Dropdown
        options={dropdownOptions}
        onSelect={handleSelect}
        isOpen={isDropdownOpen}
        setIsOpen={setIsDropdownOpen}
        triggerRef={buttonRef}
      />
      <Tree
        treeData={treeData}
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        selectedKeys={[selectedFolder]}
        onSelect={(keys) => {
          if (keys.length > 0) {
            setSelectedFolder(keys[0] as string);
            setSelectedItem(null);
          }
        }}
        defaultExpandedKeys={["root"]}
      />
    </div>
  );

  // Compute search path for breadcrumb during search mode
  const searchPath = useMemo(() => {
    const path = getBreadcrumbPath(files, selectedFolder);
    return path.map((p) => p.name).join("/");
  }, [files, selectedFolder]);

  const renderTableDetail = () => {
    const sortedItems = [...filteredItems].sort((a, b) => {
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;
      return a.name.localeCompare(b.name);
    });

    return (
      <div className="flex-1 flex flex-col mt-[10px] rounded-[2px] border border-[#e0dada] text-[#475466] overflow-hidden">
        <div className="flex items-center h-[42px] border-b border-[#DADEE0] bg-[#FFFFFF]">
          {isSearchMode && debouncedSearch.trim() ? (
            <div className="flex items-center w-full text-md ml-1">
              <IconButton
                onClick={() => {
                  setIsSearchMode(false);
                  setSearchQuery("");
                }}
                iconStyles="fa-solid fa-chevron-left fa-sm text-[#94A1B3]"
                buttonStyles="p-1 w-[38px] h-[38px] flex justify-center items-center rounded-full hover:bg-[#F4F5F9] mr-1"
              />
              <span>Search results in {searchPath}</span>
            </div>
          ) : (
            <Breadcrumb
              path={breadcrumbPath}
              onNavigate={handleNavigate}
              currentFolderId={selectedFolder}
              breadcrumbStyles="px-3"
            />
          )}
        </div>
        <div
          className={clsx(
            "flex-1 bg-[#FFFFFF]",
            !sortedItems.length && "hidden"
          )}
        >
          <DataTable
            columns={columns}
            dataSource={sortedItems}
            tableHeight={tableHeight}
            loading={isLoading}
            onRow={(record) => ({
              onClick: () => {
                setSelectedItem(record);
              },
              onDoubleClick: () => {
                if (record.type === "folder") {
                  handleNavigate(record.id);
                  setIsSearchMode(false);
                  setSearchQuery("");
                }
              },
              className:
                selectedItem?.id === record.id ? "ant-table-row-selected" : "",
            })}
          />
        </div>
      </div>
    );
  };

  const renderModal = () => (
    <Modal
      isOpen={isAddModalOpen}
      title="Enter a new name"
      onClose={() => {
        setIsAddModalOpen(false);
        reset({ name: "" });
      }}
    >
      <form
        onSubmit={handleSubmit(handleAdd)}
        className="flex flex-col mt-[6px]"
      >
        <div className="flex items-center">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Folder name is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="flex-1 border-b border-[#1CA1C1] px-4 py-1 text-[14px] text-[#475466] focus:outline-none mr-4"
                placeholder="Enter folder name"
                value={field.value || ""}
              />
            )}
          />
          <Button
            variant="primary"
            type="submit"
            className="w-[96px] h-[32px]"
            disabled={!!errors.name}
          >
            Add
          </Button>
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>
        )}
      </form>
    </Modal>
  );

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
        {renderHeader()}

        {/* Body */}
        <div className="flex flex-1 bg-[#EBEDF0]">
          {renderTableNavigation()}
          {renderTableDetail()}
          {previewMode && renderPreview()}
        </div>
      </div>
      {renderModal()}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFolderUpload}
        webkitdirectory=""
        directory=""
        multiple
        className="hidden"
      />
    </DraggableWindow>
  );
};

export default FilemanagerPage;
