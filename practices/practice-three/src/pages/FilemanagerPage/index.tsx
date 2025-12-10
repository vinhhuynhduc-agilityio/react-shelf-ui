import {
  Key,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

// constant
import { addConfigs, QUERY_KEY_FILE_MANAGER, WINDOW_KEYS } from "@/constant";

// hook
import {
  useAddFileItem,
  useDebounce,
  useDeleteFileItem,
  useFilemanagerQuery,
  useRenameFileItem,
  useWindowActions,
} from "@/hook";

// components
import {
  ErrorAlert,
  NameInputModal,
  DeleteConfirmModal,
  FileContextMenu,
  PreviewPanel,
  Sidebar,
  HeaderBar,
  FileTableView,
  WindowHeader,
} from "@/components";

// types
import { FileItem, DropdownOption, FormData } from "@/types";

// helpers
import {
  addNewFileOrFolder,
  deleteItemWithDescendants,
  fileTableColumns,
  getAllChildFolderIds,
  getBreadcrumbPath,
  getFileTreeData,
  getFilteredItems,
  getPathIds,
  renameFileItem,
  uploadFolderWithStructure,
  uploadSingleFile,
} from "@/helpers";

const FilemanagerPage = () => {
  const queryClient = useQueryClient();

  // === STATE ===
  const [tableHeight, setTableHeight] = useState<number>(0);
  const [treeHeight, setTreeHeight] = useState<number>(0);
  const [selectedFolder, setSelectedFolder] = useState<string>("root");
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [addType, setAddType] = useState<"addFolder" | "addFile" | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>(["root"]);
  const [hasChanged, setHasChanged] = useState(false);
  const [isUploadingFolder, setIsUploadingFolder] = useState(false);
  const [isDeletingFolder, setIsDeletingFolder] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [statusBar, setStatusBar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    item: FileItem | null;
  } | null>(null);

  // modal state
  const [showNameInputDialog, setShowNameInputDialog] = useState(false);
  const [nameInputMode, setNameInputMode] = useState<"add" | "rename">("add");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pendingDeleteItem, setPendingDeleteItem] = useState<FileItem | null>(
    null
  );
  const [showNavigation, setShowNavigation] = useState(true);

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

  // hook
  const { close, maximize, minimize } = useWindowActions(
    WINDOW_KEYS.FILE_MANAGER
  );

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

  // === QUERIES & MUTATIONS ===
  const {
    data: initialFiles = [],
    isFetching,
    isSuccess,
    isError: isErrorFilemanager,
    error: filemanagerError,
  } = useFilemanagerQuery();
  const {
    mutate: addItem,
    mutateAsync: addItemAsync,
    isPending: isAdding,
  } = useAddFileItem();
  const { mutate: renameItem } = useRenameFileItem();
  const { mutateAsync: deleteItem } = useDeleteFileItem();

  const isDisabled =
    isAdding || isUploadingFolder || isDeletingFolder || isRenaming;

  useEffect(() => {
    if (isSuccess && Array.isArray(initialFiles)) {
      setFiles(initialFiles);
    }
  }, [isSuccess, initialFiles, setFiles]);

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

  useLayoutEffect(() => {
    const containerElement = containerRef.current;

    const updateDimensions = () => {
      if (!containerElement) return;

      const buttonBarHeight = 70;
      const tableHeaderHeight = 37;
      const breadcrumbHeight = 42;
      const buttonAddNewHeight = 48;
      const totalFixedHeight =
        buttonBarHeight + tableHeaderHeight + breadcrumbHeight;
      const tableHight = containerElement.clientHeight - totalFixedHeight;
      const treeHight =
        containerElement.clientHeight - buttonAddNewHeight - buttonBarHeight;

      setTableHeight(Math.max(tableHight, 100));
      setTreeHeight(Math.max(treeHight, 100));

      setShowNavigation(containerElement.clientWidth >= 650);
    };

    updateDimensions();

    const observer = new ResizeObserver(updateDimensions);
    if (containerElement) observer.observe(containerElement);

    return () => {
      if (containerElement) observer.unobserve(containerElement);
    };
  }, []);

  const isShowNavigation =
    showNavigation && !(isSearchMode && debouncedSearch.trim());

  // Generate tree data
  const treeData = useMemo(() => getFileTreeData(files), [files]);

  const filteredItems = useMemo(() => {
    return getFilteredItems(
      files,
      selectedFolder,
      debouncedSearch,
      getAllChildFolderIds
    );
  }, [files, selectedFolder, debouncedSearch]);

  const togglePreview = useCallback(() => {
    setPreviewMode(!previewMode);
  }, [previewMode]);

  const openNameInputDialog = (
    mode: "add" | "rename",
    defaultName = "",
    type?: "addFolder" | "addFile"
  ) => {
    if (type) setAddType(type);

    setNameInputMode(mode);
    reset({ name: defaultName });
    setShowNameInputDialog(true);
  };

  const handleSelect = (option: DropdownOption) => {
    const handleAddConfig = () => {
      const config = addConfigs[option.key];
      if (config) {
        openNameInputDialog("add", config.name, config.type ?? undefined);
      }
    };

    const actions: Record<string, () => void> = {
      "upload-file": () => fileInputRef.current?.click(),
      "upload-folder": () => folderInputRef.current?.click(),
      "create-file": handleAddConfig,
      "create-folder": handleAddConfig,
    };

    const action = actions[option.key] || (() => {});
    action();
    setIsDropdownOpen(false);
  };

  const handleAddNewItem = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOpenDelete = (item: FileItem) => {
    setPendingDeleteItem(item);
    setIsDeleteModalOpen(true);
    setContextMenu(null);
  };

  const handleAdd = (data: FormData) => {
    addNewFileOrFolder({
      data,
      files,
      selectedFolder,
      addType,
      setFiles,
      setExpandedKeys,
      setError,
      setStatusBar,
      setShowNameInputDialog,
      setHasChanged,
      reset,
      addItem,
    });
  };

  const handleRename = (data: FormData) => {
    renameFileItem({
      data,
      selectedItem,
      files,
      setFiles,
      setError,
      setIsRenaming,
      setShowNameInputDialog,
      setStatusBar,
      setHasChanged,
      reset,
      renameItem,
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    await uploadSingleFile({
      event,
      files,
      selectedFolder,
      setFiles,
      setExpandedKeys,
      setStatusBar,
      setHasChanged,
      addItem,
      fileInputRef,
    });
  };

  const handleFolderUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    await uploadFolderWithStructure({
      event,
      files,
      selectedFolder,
      setFiles,
      setExpandedKeys,
      setStatusBar,
      addItemAsync,
      setIsUploadingFolder,
    });
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

  const handleConfirmDelete = async () => {
    if (!pendingDeleteItem) return;

    await deleteItemWithDescendants({
      item: pendingDeleteItem,
      files,
      setFiles,
      setStatusBar,
      setIsDeletingFolder,
      setSelectedItem,
      setIsDeleteModalOpen,
      setPendingDeleteItem,
      setHasChanged,
      deleteItem,
    });
  };

  const handleTreeSelect = (keys: Key[]) => {
    if (keys.length > 0 && typeof keys[0] === "string") {
      setSelectedFolder(keys[0] as string);
      setSelectedItem(null);
    }
  };

  const handleRowDoubleClick = (record: FileItem) => {
    if (record.type === "folder") {
      handleNavigate(record.id);
      setIsSearchMode(false);
      setSearchQuery("");
    }
  };

  const handleRowContextMenu = (e: React.MouseEvent, record: FileItem) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      item: record,
    });
    setSelectedItem(record);
  };

  const handleClearSearch = () => {
    setIsSearchMode(false);
    setSearchQuery("");
  };

  const renderPreview = () => (
    <PreviewPanel
      selectedItem={selectedItem}
      files={files}
      currentFolderId={selectedFolder}
      height={tableHeight + 83}
    />
  );

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
    <HeaderBar
      searchQuery={searchQuery}
      isDisabled={isDisabled}
      isFetching={isFetching}
      previewMode={previewMode}
      onSearchChange={handleSearchChange}
      onTogglePreview={togglePreview}
    />
  );

  const renderSidebar = () => (
    <Sidebar
      treeData={treeData}
      expandedKeys={expandedKeys}
      selectedKey={selectedFolder}
      treeHeight={treeHeight}
      isDropdownOpen={isDropdownOpen}
      isDisabled={isDisabled}
      isUploadingFolder={isUploadingFolder}
      isDeletingFolder={isDeletingFolder}
      isRenaming={isRenaming}
      isFetching={isFetching}
      statusBar={statusBar}
      buttonRef={buttonRef}
      onExpand={setExpandedKeys}
      onSelect={handleTreeSelect}
      onAddNewClick={handleAddNewItem}
      onDropdownSelect={handleSelect}
      onDropdownClose={() => setIsDropdownOpen(false)}
      onStatusBarClear={() => setStatusBar(null)}
    />
  );

  // Compute search path for breadcrumb during search mode
  const searchPath = useMemo(() => {
    const path = getBreadcrumbPath(files, selectedFolder);
    return path.map((p) => p.name).join("/");
  }, [files, selectedFolder]);

  const renderFileTableView = () => {
    const isLoading =
      isFetching ||
      isRenaming ||
      isAdding ||
      isUploadingFolder ||
      isDeletingFolder;

    return (
      <FileTableView
        filteredItems={filteredItems}
        columns={fileTableColumns}
        tableHeight={tableHeight}
        isFetching={isFetching}
        isLoading={isLoading}
        isSearchMode={isSearchMode}
        debouncedSearch={debouncedSearch}
        searchPath={searchPath}
        breadcrumbPath={breadcrumbPath}
        selectedFolder={selectedFolder}
        selectedItem={selectedItem}
        onNavigate={handleNavigate}
        onRowClick={setSelectedItem}
        onRowDoubleClick={handleRowDoubleClick}
        onRowContextMenu={handleRowContextMenu}
        onClearSearch={handleClearSearch}
      />
    );
  };

  const renderNameInputModal = () => (
    <NameInputModal
      isOpen={showNameInputDialog}
      mode={nameInputMode}
      addType={addType}
      isDisabled={isDisabled}
      control={control}
      errors={errors}
      handleSubmit={handleSubmit}
      onSubmit={(data) => {
        if (nameInputMode === "add") {
          handleAdd(data);
        } else {
          handleRename(data);
        }
      }}
      onClose={() => {
        setShowNameInputDialog(false);
        setNameInputMode("add");
        setAddType(null);
        reset();
      }}
    />
  );

  const renderDeleteModal = () => (
    <DeleteConfirmModal
      isOpen={isDeleteModalOpen}
      item={pendingDeleteItem}
      isDeleting={isDeletingFolder}
      onConfirm={handleConfirmDelete}
      onClose={() => {
        setIsDeleteModalOpen(false);
        setPendingDeleteItem(null);
      }}
    />
  );

  const renderUploadInputs = () => (
    <>
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
    </>
  );

  const renderContextMenu = () => (
    <FileContextMenu
      visible={!!contextMenu?.visible}
      x={contextMenu?.x ?? 0}
      y={contextMenu?.y ?? 0}
      item={contextMenu?.item ?? null}
      onRename={() => {
        if (contextMenu?.item) {
          openNameInputDialog("rename", contextMenu.item.name);
        }
      }}
      onDelete={() => {
        if (contextMenu?.item) {
          handleOpenDelete(contextMenu.item);
        }
      }}
      onClose={() => setContextMenu(null)}
    />
  );

  const renderApiError = () => (
    <ErrorAlert
      title="Failed to load filemanager data"
      centerScreen
      errors={[
        ...(isErrorFilemanager && filemanagerError
          ? [filemanagerError.message]
          : []),
      ]}
    />
  );

  const renderContent = () => (
    <div
      className="flex flex-col h-full w-full overflow-hidden bg-[#EBEDF0]"
      ref={containerRef}
    >
      {renderHeader()}

      {/* Body */}
      <div className="flex flex-1 bg-[#EBEDF0]">
        {isShowNavigation && renderSidebar()}
        {renderFileTableView()}
        {previewMode && renderPreview()}
      </div>
    </div>
  );

  return (
    <>
      <WindowHeader
        windowKey={WINDOW_KEYS.FILE_MANAGER}
        src="/images/file-manager.webp"
        title="File Manager"
        onClose={close}
        onMaximize={maximize}
        onMinimize={minimize}
      />
      {isErrorFilemanager ? renderApiError() : renderContent()}

      {/* render modals */}
      {renderNameInputModal()}
      {renderDeleteModal()}
      {renderContextMenu()}
      {renderUploadInputs()}
    </>
  );
};

export default FilemanagerPage;
