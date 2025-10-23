import { AddConfig, DropdownOption } from "@/types";

export const dropdownOptions: DropdownOption[] = [
  { key: "create-file", label: "Add new file", icon: "fa-file" },
  { key: "create-folder", label: "Add new folder", icon: "fa-folder" },
  { key: "upload-file", label: "Upload file", icon: "fa-upload" },
  { key: "upload-folder", label: "Upload folder", icon: "fa-folder-plus" },
];

export const addConfigs: AddConfig = {
  "create-file": { type: "file", name: "New file.txt" },
  "create-folder": { type: "folder", name: "New folder" },
};
