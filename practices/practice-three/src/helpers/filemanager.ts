import { FileItem } from "@/types";

// Get icon URL based on type or undefined
export const getPreviewImageSrc = (item: FileItem | null) => {
  if (!item) {
    return "/images/undefined.svg";
  }
  switch (item.type) {
    case "code":
      return "/images/code.svg";
    case "folder":
      return "/images/folder.svg";
    case "audio":
      return "/images/mp3.svg";
    default:
      return item.imageUrl;
  }
};

export const formatSize = (size: number) => {
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
