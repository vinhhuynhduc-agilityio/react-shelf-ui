// icons
import { fa } from "@/icons/fa";

// types
import { AddConfig, DropdownOption } from "@/types";

export const dropdownOptions: DropdownOption[] = [
  { key: "create-file", label: "Add new file", icon: fa.faFile },
  { key: "create-folder", label: "Add new folder", icon: fa.faFolder },
  { key: "upload-file", label: "Upload file", icon: fa.faUpload },
  { key: "upload-folder", label: "Upload folder", icon: fa.faFolderPlus },
];

export const addConfigs: AddConfig = {
  "create-file": { type: "addFile", name: "New file.txt" },
  "create-folder": { type: "addFolder", name: "New folder" },
};
