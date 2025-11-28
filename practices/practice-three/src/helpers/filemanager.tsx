import { Key } from "react";
import { v4 as uuidv4 } from "uuid";
import html2canvas from "html2canvas";
import { ColumnsType } from "antd/es/table";
import { DataNode } from "antd/es/tree";

// types
import {
  AddNewItemParams,
  BreadcrumbItem,
  CollectAndUploadParams,
  CreateRootFolderParams,
  CreateSubfoldersParams,
  DeleteParams,
  FileItem,
  FormData,
  RenameFileItemParams,
  UploadFolderParams,
  UploadSingleFileParams,
} from "@/types";

// services
import { saveAllFileFileManager } from "@/services";

// components
import { Icon } from "@/components";

// icons
import { fa } from "@/icons/fa";

// Get icon URL based on type or undefined
export const getPreviewImageSrc = (item: FileItem | null) => {
  if (!item) return "/images/folder-placeholder-image.svg";
  return item.imageUrl || "/images/invalid-image.svg";
};

export const formatSize = (size: number | null) => {
  if (size === null || typeof size !== "number") {
    return "0 B";
  }
  if (size >= 1000 * 1000) {
    return `${(size / (1000 * 1000)).toFixed(1)} MB`;
  } else if (size >= 1000) {
    return `${(size / 1000).toFixed(1)} KB`;
  } else {
    return `${size} B`;
  }
};

// Get location path
export const getLocation = (
  files: FileItem[],
  selectedFolder: string | null,
  item: FileItem | null
) => {
  if (!item || !selectedFolder) return "/";
  const parentFolder = files.find((f) => f.id === selectedFolder);

  return `/${parentFolder?.name || selectedFolder}`;
};

export const getBasicInfo = (
  currentItem: FileItem,
  files: FileItem[],
  selectedFolder: string | null
): { label: string; value: string }[] => {
  return [
    {
      label: "Type",
      value: currentItem.type
        ? currentItem.type.charAt(0).toUpperCase() + currentItem.type.slice(1)
        : "",
    },
    {
      label: "Date",
      value: new Date()
        .toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        .replace(/ /g, " "),
    },
    ...(currentItem.size !== null
      ? [{ label: "Size", value: formatSize(currentItem.size) }]
      : []),
    {
      label: "Location",
      value: getLocation(files, selectedFolder, currentItem),
    },
  ];
};

const extensionMap = {
  "txt css js ts html json sql": {
    type: "code",
    imageUrl: "/images/blank-white-image.webp",
  },
  "db php less": {
    type: "code",
    imageUrl: "/images/code-placeholder-image.svg",
  },
  "doc xls xlsx": {
    type: "document",
    imageUrl: "/images/blank-white-image.webp",
  },
  pdf: { type: "document", imageUrl: "/images/pdf-placeholder-image.svg" },
  "jpg png jpeg gif svg webp": {
    type: "image",
    imageUrl: "/images/file-placeholder-image.svg",
  },
  "zip rar tar": {
    type: "archive",
    imageUrl: "/images/compressed-placeholder-image.svg",
  },
  "mp3 wav wma": {
    type: "audio",
    imageUrl: "/images/audio-placeholder-image.svg",
  },
};

export const mapExtension = (extension: string) => {
  let type = "file";
  let imageUrl = "/images/invalid-image.svg";

  for (const [extList, config] of Object.entries(extensionMap)) {
    if (extList.split(" ").includes(extension)) {
      type = config.type;
      imageUrl = config.imageUrl;
      break;
    }
  }

  return { type, imageUrl };
};

export const createNewItem = (
  addType: "addFolder" | "addFile" | null,
  data: FormData,
  selectedFolder: string
): FileItem => {
  const extension = data.name.split(".").pop()?.toLowerCase() || "";
  const itemCreators: Record<"addFolder" | "addFile", () => FileItem> = {
    addFolder: () => ({
      id: uuidv4(),
      name: data.name,
      type: "folder",
      parentId: selectedFolder,
      size: null,
      imageUrl: "/images/folder-detail-placeholder.svg",
    }),
    addFile: () => {
      const { type, imageUrl } = mapExtension(extension);

      return {
        id: uuidv4(),
        name: data.name,
        type,
        parentId: selectedFolder,
        size: 0,
        imageUrl,
      };
    },
  };
  const key: "addFolder" | "addFile" = addType ?? "addFile";

  return itemCreators[key]();
};

export const generateBase64Image = async (file: File): Promise<string> => {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  const snapshotExtensions = [
    "doc",
    "xls",
    "xlsx",
    "txt",
    "js",
    "ts",
    "html",
    "pdf",
  ];
  const imageExtensions = ["jpg", "png", "jpeg", "gif", "svg", "webp"];

  if (imageExtensions.includes(extension)) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  if (snapshotExtensions.includes(extension)) {
    const content = await file.text();
    const tempDiv = document.createElement("div");
    tempDiv.style.width = "500px";
    tempDiv.style.height = "430px";
    tempDiv.style.padding = "20px";
    tempDiv.style.fontFamily = "monospace";
    tempDiv.style.fontSize = "14px";
    tempDiv.style.whiteSpace = "pre-wrap";
    tempDiv.style.overflow = "hidden";
    tempDiv.textContent = content.substring(0, 1000);
    document.body.appendChild(tempDiv);

    const canvas = await html2canvas(tempDiv, { scale: 1 });
    document.body.removeChild(tempDiv);
    return canvas.toDataURL("image/png");
  }

  return "";
};

export const getBreadcrumbPath = (
  files: FileItem[],
  selectedFolder: string
): BreadcrumbItem[] => {
  const path: BreadcrumbItem[] = [];
  let currentId: string | null = selectedFolder;

  while (currentId !== null) {
    if (currentId === "root") {
      path.push({ id: "root", name: "My Files" });
      break;
    }

    const item = files.find((f) => f.id === currentId && f.type === "folder");
    if (!item) break;

    path.push({ id: item.id, name: item.name });
    currentId = item.parentId;
  }

  return path.reverse();
};

export const getPathIds = (files: FileItem[], folderId: string): string[] => {
  const ids: string[] = [];
  let currentId: string | null = folderId;

  while (currentId !== null) {
    ids.push(currentId);
    if (currentId === "root") break;

    const item = files.find((f) => f.id === currentId && f.type === "folder");
    if (!item) break;

    currentId = item.parentId;
  }

  return ids.reverse();
};

/**
 * Recursively builds the file tree structure for Ant Design Tree component.
 * Only folders are included as tree nodes.
 */
export const buildFileTree = (
  items: FileItem[],
  parentId: string | number
): DataNode[] => {
  return items
    .filter((item) => item.parentId === parentId && item.type === "folder")
    .map((item) => ({
      title: (
        <span>
          <Icon icon={fa.faFolder} className="fa-lg mr-[5px] text-[#94A1B3]" />
          {item.name}
        </span>
      ),
      key: item.id,
      children: buildFileTree(items, item.id),
    }));
};

/**
 * Returns the complete tree data structure with "My Files" as root node.
 * Ready to be used directly in Ant Design Tree component.
 */
export const getFileTreeData = (files: FileItem[]): DataNode[] => {
  const rootChildren = buildFileTree(files, "root");

  return [
    {
      title: (
        <span>
          <Icon icon={fa.faFolder} className="fa-lg mr-[5px] text-[#94A1B3]" />
          My Files
        </span>
      ),
      key: "root",
      children: rootChildren,
    },
  ];
};

/**
 * Recursively returns all descendant folder IDs (including the parent itself if it's a folder).
 * Used for search in subtree and bulk delete operations.
 */
export const getAllChildFolderIds = (
  files: FileItem[],
  parentId: string
): string[] => {
  const children = files
    .filter((f) => f.parentId === parentId && f.type === "folder")
    .map((f) => f.id);

  return children.flatMap((id) => [id, ...getAllChildFolderIds(files, id)]);
};

/**
 * Returns filtered file items based on current folder and optional search query.
 * Used in FileManager's main table view.
 */
export const getFilteredItems = (
  files: FileItem[],
  selectedFolder: string,
  searchQuery: string = "",
  getAllChildFolderIds: (files: FileItem[], parentId: string) => string[]
): (FileItem & { key: string })[] => {
  if (searchQuery.trim()) {
    // Search mode: search in current folder and all subfolders
    const subtreeIds = [
      selectedFolder,
      ...getAllChildFolderIds(files, selectedFolder),
    ];

    let items = files
      .filter((item) => subtreeIds.includes(item.parentId!))
      .map((item) => ({ ...item, key: item.id }));

    const query = searchQuery.toLowerCase();
    items = items.filter((item) => item.name.toLowerCase().includes(query));

    return items;
  }

  // Normal mode: show only direct children of selected folder
  return files
    .filter((item) => item.parentId === selectedFolder)
    .map((item) => ({ ...item, key: item.id }));
};

/**
 * Columns configuration for FileManager table view.
 */
export const fileTableColumns: ColumnsType<FileItem> = [
  {
    title: "",
    dataIndex: "name",
    key: "name",
    render: (text: string, record: FileItem) => (
      <span>
        <Icon
          icon={record.type === "folder" ? fa.faFolder : fa.faFile}
          className={
            record.type === "folder"
              ? "text-[#1f88dd] fa-lg mr-[10px] ml-[5px]"
              : "text-[#b3cae1] fa-lg mr-[10px] ml-[5px]"
          }
        />
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
    render: (size: number | null) => (size === null ? "" : `${size} KB`),
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
];

export const parseFolderStructure = (fileList: FileList) => {
  const rootName = fileList[0].webkitRelativePath.split("/")[0];

  const paths = new Set<string>();

  for (const file of Array.from(fileList)) {
    const parts = file.webkitRelativePath.split("/").slice(0, -1);
    let currentPath = "";
    let isFirstDir = true;

    for (const dir of parts) {
      if (isFirstDir) {
        isFirstDir = false;
        continue;
      }

      currentPath = currentPath ? `${currentPath}/${dir}` : dir;
      paths.add(currentPath);
    }
  }

  const sortedPaths = Array.from(paths).sort(
    (a, b) => a.split("/").length - b.split("/").length
  );

  return { rootName, sortedPaths };
};

export const createRootFolder = async (
  params: CreateRootFolderParams
): Promise<{ serverRootId: string; rootItem: FileItem } | null> => {
  const { rootName, selectedFolder, files, setStatusBar, addItemAsync } =
    params;

  const existingRoot = files.find(
    (i) => i.parentId === selectedFolder && i.name === rootName
  );
  if (existingRoot) {
    setStatusBar({ message: "Folder name already exists", type: "error" });
    return null;
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

  try {
    const data = await addItemAsync(rootItem);
    return { serverRootId: data.id, rootItem };
  } catch {
    setStatusBar({ message: "Failed to create root folder", type: "error" });
    return null;
  }
};

export const createSubfolders = async (
  params: CreateSubfoldersParams
): Promise<FileItem[]> => {
  const { sortedPaths, parentMap, setStatusBar, addItemAsync } = params;
  const subfolderItems: FileItem[] = [];
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

    subfolderItems.push(dirItem);

    try {
      const data = await addItemAsync(dirItem);
      parentMap[path] = data.id;
    } catch {
      setStatusBar({ message: "Failed to create subfolder", type: "error" });
      return subfolderItems;
    }
  }

  return subfolderItems;
};

export const collectAndUploadFiles = async (params: CollectAndUploadParams) => {
  const { fileList, parentMap, serverRootId, files, addItemAsync } = params;

  const listFile: FileItem[] = [];

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
    const imageUrl = await generateBase64Image(file).catch(() => defaultImage);

    const clientId = uuidv4();
    const fileItem: FileItem = {
      id: clientId,
      name: fileName,
      size: Math.round(file.size / 1024),
      type,
      parentId,
      imageUrl,
    };

    listFile.push(fileItem);
  }

  if (listFile.length > 0) {
    await saveAllFileFileManager({ listFile, addItem: addItemAsync });
  }

  return listFile;
};

export const uploadFolderWithStructure = async (params: UploadFolderParams) => {
  const {
    event,
    files,
    selectedFolder,
    setFiles,
    setStatusBar,
    addItemAsync,
    setIsUploadingFolder,
  } = params;

  const fileList = event.target.files;
  if (!fileList || fileList.length === 0) return;

  setIsUploadingFolder(true);

  try {
    const { rootName, sortedPaths } = parseFolderStructure(fileList);
    const rootResult = await createRootFolder({
      rootName,
      selectedFolder,
      files,
      setStatusBar,
      addItemAsync,
    });
    if (!rootResult) return;

    const { serverRootId, rootItem } = rootResult;

    const parentMap: Record<string, string> = { "": serverRootId };

    const subfolderItems = await createSubfolders({
      sortedPaths,
      parentMap,
      setStatusBar,
      addItemAsync,
    });

    const fileItems = await collectAndUploadFiles({
      fileList,
      parentMap,
      serverRootId,
      files,
      addItemAsync,
    });

    const allNewItems = [rootItem, ...subfolderItems, ...fileItems];
    setFiles((prev) => [...prev, ...allNewItems]);

    setStatusBar({ message: "Folder uploaded successfully", type: "success" });
  } finally {
    setIsUploadingFolder(false);
    if (event.target) event.target.value = "";
  }
};

export const getDescendantIds = (
  files: FileItem[],
  parentId: string
): string[] => {
  const getAll = (id: string): string[] =>
    files
      .filter((f) => f.parentId === id)
      .flatMap((child) => [child.id, ...getAll(child.id)]);

  const allIds = getAll(parentId);

  const depth = (id: string): number => {
    let d = 0;
    let cur = id;
    while (cur) {
      const f = files.find((x) => x.id === cur);
      if (!f) break;
      cur = f.parentId || "";
      d++;
    }
    return d;
  };

  return allIds.sort((a, b) => depth(b) - depth(a));
};

export const optimisticRemove = (
  idsToDelete: string[],
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
) => {
  setFiles((prev) => prev.filter((f) => !idsToDelete.includes(f.id)));
};

export const deleteFromServer = async (
  idsToDelete: string[],
  files: FileItem[],
  deleteItem: (id: string) => Promise<void>,
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>,
  setStatusBar: (
    status: { message: string; type: "success" | "error" } | null
  ) => void
) => {
  for (const id of idsToDelete) {
    try {
      await deleteItem(id);
    } catch {
      const failedItem = files.find((f) => f.id === id);
      if (failedItem) {
        setFiles((prev) => [...prev, failedItem]);
      }
      setStatusBar({
        message: `Failed to delete: ${failedItem?.name || id}`,
        type: "error",
      });
      return;
    }
  }
};

export const deleteItemWithDescendants = async ({
  item,
  files,
  setFiles,
  setStatusBar,
  setIsDeletingFolder,
  setSelectedItem,
  setIsDeleteModalOpen,
  setPendingDeleteItem,
  setHasChanged,
  deleteItem,
}: DeleteParams) => {
  setIsDeletingFolder(true);

  const descendantIds =
    item.type === "folder" ? getDescendantIds(files, item.id) : [];

  const idsToDelete = [...descendantIds, item.id];

  optimisticRemove(idsToDelete, setFiles);

  setIsDeleteModalOpen(false);
  setPendingDeleteItem(null);
  setSelectedItem(null);

  try {
    await deleteFromServer(
      idsToDelete,
      files,
      deleteItem,
      setFiles,
      setStatusBar
    );

    setStatusBar({
      message: `${
        item.type === "folder" ? "Folder" : "File"
      } deleted successfully`,
      type: "success",
    });

    setHasChanged(true);
  } finally {
    setIsDeletingFolder(false);
  }
};

export const checkDuplicateName = (
  files: FileItem[],
  selectedFolder: string,
  fileName: string,
  setStatusBar: (
    status: { message: string; type: "success" | "error" } | null
  ) => void
): boolean => {
  const existing = files.find(
    (item) => item.parentId === selectedFolder && item.name === fileName
  );
  if (existing) {
    setStatusBar({ message: "File name already exists", type: "error" });
    return true;
  }
  return false;
};

export const createFileItem = async (
  file: File,
  selectedFolder: string
): Promise<FileItem> => {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  const { type, imageUrl: defaultImage } = mapExtension(extension);
  const imageUrl = (await generateBase64Image(file)) || defaultImage;

  return {
    id: uuidv4(),
    name: file.name,
    size: Math.round(file.size / 1024),
    type,
    parentId: selectedFolder,
    imageUrl,
  };
};

export const optimisticAdd = (
  newItem: FileItem,
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>,
  setExpandedKeys: React.Dispatch<React.SetStateAction<Key[]>>,
  selectedFolder: string
) => {
  setFiles((prev) => [...prev, newItem]);
  setExpandedKeys((prev) =>
    Array.from(new Set<Key>([...prev, selectedFolder as Key]))
  );
};

export const callAddItem = (
  newItem: FileItem,
  addItem: (
    item: FileItem,
    options: { onSuccess: () => void; onError: () => void }
  ) => void,
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>,
  setStatusBar: (
    status: { message: string; type: "success" | "error" } | null
  ) => void
) => {
  addItem(newItem, {
    onSuccess: () => {
      setStatusBar({
        message: "File uploaded successfully",
        type: "success",
      });
    },
    onError: () => {
      setFiles((prev) => prev.filter((f) => f.id !== newItem.id));
      setStatusBar({ message: "Upload failed", type: "error" });
    },
  });
};

export const uploadSingleFile = async ({
  event,
  files,
  selectedFolder,
  setFiles,
  setExpandedKeys,
  setStatusBar,
  setHasChanged,
  addItem,
  fileInputRef,
}: UploadSingleFileParams) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (checkDuplicateName(files, selectedFolder, file.name, setStatusBar)) {
    return;
  }

  const newItem = await createFileItem(file, selectedFolder);

  optimisticAdd(newItem, setFiles, setExpandedKeys, selectedFolder);

  callAddItem(newItem, addItem, setFiles, setStatusBar);

  setHasChanged(true);
  if (fileInputRef.current) fileInputRef.current.value = "";
};

export const checkDuplicateNameForRename = (
  files: FileItem[],
  item: FileItem,
  newName: string,
  setError: (field: "name", error: { type: string; message: string }) => void
): boolean => {
  const duplicate = files.find(
    (f) =>
      f.id !== item.id && f.parentId === item.parentId && f.name === newName
  );

  if (duplicate) {
    setError("name", {
      type: "manual",
      message: `${
        item.type === "folder" ? "Folder" : "File"
      } name already exists`,
    });
    return true;
  }
  return false;
};

export const optimisticRename = (
  updatedItem: FileItem,
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
) => {
  setFiles((prev) =>
    prev.map((f) => (f.id === updatedItem.id ? updatedItem : f))
  );
};

export const callRenameItem = (
  item: FileItem,
  updatedItem: FileItem,
  renameItem: (
    params: { id: string; updatedItem: FileItem },
    options: {
      onSuccess: () => void;
      onError: () => void;
      onSettled: () => void;
    }
  ) => void,
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>,
  setStatusBar: (
    status: { message: string; type: "success" | "error" } | null
  ) => void,
  setIsRenaming: (v: boolean) => void
) => {
  renameItem(
    { id: item.id, updatedItem },
    {
      onSuccess: () => {
        setStatusBar({
          message: "File renamed successfully",
          type: "success",
        });
      },
      onError: () => {
        setFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, name: item.name } : f))
        );
        setStatusBar({
          message: "Failed to rename item",
          type: "error",
        });
      },
      onSettled: () => {
        setIsRenaming(false);
      },
    }
  );
};

export const renameFileItem = ({
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
}: RenameFileItemParams) => {
  if (!selectedItem) return;

  const item = selectedItem;
  const newName = data.name.trim();

  if (newName === selectedItem.name) {
    setShowNameInputDialog(false);
    return;
  }

  if (checkDuplicateNameForRename(files, item, newName, setError)) {
    return;
  }

  const updatedItem: FileItem = { ...item, name: newName };

  optimisticRename(updatedItem, setFiles);

  setIsRenaming(true);

  callRenameItem(
    item,
    updatedItem,
    renameItem,
    setFiles,
    setStatusBar,
    setIsRenaming
  );

  setShowNameInputDialog(false);
  reset({ name: "" });
  setHasChanged(true);
};

export const checkDuplicateNameForAdd = (
  files: FileItem[],
  selectedFolder: string,
  name: string,
  addType: "addFolder" | "addFile" | null,
  setError: (field: "name", error: { type: string; message: string }) => void
): boolean => {
  const existing = files.find(
    (item) => item.parentId === selectedFolder && item.name === name
  );
  if (existing) {
    setError("name", {
      type: "manual",
      message: `${
        addType === "addFolder" ? "Folder" : "File"
      } name already exists`,
    });
    return true;
  }
  return false;
};

export const optimisticAddNewItem = (
  newItem: FileItem,
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>,
  setExpandedKeys: React.Dispatch<React.SetStateAction<Key[]>>,
  selectedFolder: string
) => {
  setFiles((prev) => [...prev, newItem]);
  setExpandedKeys((prev) => [...new Set([...prev, selectedFolder])]);
};

export const callAddItemForCreate = (
  newItem: FileItem,
  addType: "addFolder" | "addFile" | null,
  addItem: (
    item: FileItem,
    options: { onSuccess: () => void; onError: () => void }
  ) => void,
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>,
  setStatusBar: (
    status: { message: string; type: "success" | "error" } | null
  ) => void
) => {
  addItem(newItem, {
    onSuccess: () => {
      const typeText = addType === "addFolder" ? "Folder" : "File";
      setStatusBar({
        message: `${typeText} created successfully`,
        type: "success",
      });
    },
    onError: () => {
      setFiles((prev) => prev.filter((f) => f.id !== newItem.id));
      setStatusBar({
        message: "Failed to create item",
        type: "error",
      });
    },
  });
};

export const addNewFileOrFolder = ({
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
}: AddNewItemParams) => {
  if (
    checkDuplicateNameForAdd(
      files,
      selectedFolder,
      data.name,
      addType,
      setError
    )
  ) {
    return;
  }

  setShowNameInputDialog(false);
  reset({ name: "" });

  const newItem = createNewItem(addType, data, selectedFolder);

  optimisticAddNewItem(newItem, setFiles, setExpandedKeys, selectedFolder);

  callAddItemForCreate(newItem, addType, addItem, setFiles, setStatusBar);

  setHasChanged(true);
};
