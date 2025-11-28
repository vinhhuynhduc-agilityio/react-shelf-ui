import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Key } from "react";

export interface FileItem {
  id: string;
  name: string;
  size: number | null;
  type: string | null;
  parentId: string | null;
  imageUrl?: string;
  extraInfo?: { [key: string]: string };
}

export type AddConfig = Record<
  string,
  { type: "addFile" | "addFolder" | null; name: string }
>;

export interface FormData {
  name: string;
}

export interface BreadcrumbItem {
  id: string;
  name: string;
}

export interface ContextMenuOption {
  label: string;
  icon: IconDefinition;
  onClick: () => void;
  danger?: boolean;
}

export interface CreateRootParams {
  rootName: string;
  selectedFolder: string;
  files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  setExpandedKeys: React.Dispatch<React.SetStateAction<string[]>>;
  setStatusBar: (
    status: { message: string; type: "success" | "error" } | null
  ) => void;
  addItemAsync: (item: FileItem) => Promise<{ id: string }>;
}

export interface CreateRootFolderParams {
  rootName: string;
  selectedFolder: string;
  files: FileItem[];
  setStatusBar: (
    status: { message: string; type: "success" | "error" } | null
  ) => void;
  addItemAsync: (item: FileItem) => Promise<{ id: string }>;
}

export interface CreateSubfoldersParams {
  sortedPaths: string[];
  parentMap: Record<string, string>;
  setStatusBar: (
    status: { message: string; type: "success" | "error" } | null
  ) => void;
  addItemAsync: (item: FileItem) => Promise<{ id: string }>;
}

export interface CollectAndUploadParams {
  fileList: FileList;
  parentMap: Record<string, string>;
  serverRootId: string;
  files: FileItem[];
  addItemAsync: (item: FileItem) => Promise<{ id: string }>;
}

export interface UploadFolderParams {
  event: React.ChangeEvent<HTMLInputElement>;
  files: FileItem[];
  selectedFolder: string;
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  setExpandedKeys: React.Dispatch<React.SetStateAction<Key[]>>;
  setStatusBar: (
    status: { message: string; type: "success" | "error" } | null
  ) => void;
  addItemAsync: (item: FileItem) => Promise<{ id: string }>;
  setIsUploadingFolder: (value: boolean) => void;
}

export interface DeleteParams {
  item: FileItem;
  files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  setStatusBar: (
    status: { message: string; type: "success" | "error" } | null
  ) => void;
  setIsDeletingFolder: (v: boolean) => void;
  setSelectedItem: (item: FileItem | null) => void;
  setIsDeleteModalOpen: (v: boolean) => void;
  setPendingDeleteItem: (item: FileItem | null) => void;
  setHasChanged: (v: boolean) => void;
  deleteItem: (id: string) => Promise<void>;
}

export interface UploadSingleFileParams {
  event: React.ChangeEvent<HTMLInputElement>;
  files: FileItem[];
  selectedFolder: string;
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  setExpandedKeys: React.Dispatch<React.SetStateAction<Key[]>>;
  setStatusBar: (
    status: { message: string; type: "success" | "error" } | null
  ) => void;
  setHasChanged: (v: boolean) => void;
  addItem: (
    item: FileItem,
    options: { onSuccess: () => void; onError: () => void }
  ) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export interface RenameFileItemParams {
  data: FormData;
  selectedItem: FileItem | null;
  files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  setError: (field: "name", error: { type: string; message: string }) => void;
  setIsRenaming: (v: boolean) => void;
  setShowNameInputDialog: (v: boolean) => void;
  setStatusBar: (
    status: { message: string; type: "success" | "error" } | null
  ) => void;
  setHasChanged: (v: boolean) => void;
  reset: (values?: Partial<FormData>) => void;
  renameItem: (
    params: { id: string; updatedItem: FileItem },
    options: {
      onSuccess: () => void;
      onError: () => void;
      onSettled: () => void;
    }
  ) => void;
}

export interface AddNewItemParams {
  data: FormData;
  files: FileItem[];
  selectedFolder: string;
  addType: "addFolder" | "addFile" | null;
  setFiles: React.Dispatch<React.SetStateAction<FileItem[]>>;
  setExpandedKeys: React.Dispatch<React.SetStateAction<Key[]>>;
  setError: (field: "name", error: { type: string; message: string }) => void;
  setStatusBar: (
    status: { message: string; type: "success" | "error" } | null
  ) => void;
  setShowNameInputDialog: (v: boolean) => void;
  setHasChanged: (v: boolean) => void;
  reset: (values?: Partial<FormData>) => void;
  addItem: (
    item: FileItem,
    options: { onSuccess: () => void; onError: () => void }
  ) => void;
}
