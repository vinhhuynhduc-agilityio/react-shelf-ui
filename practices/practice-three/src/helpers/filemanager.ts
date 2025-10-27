import { FileItem } from "@/types";

// Get icon URL based on type or undefined
export const getPreviewImageSrc = (item: FileItem | null) => {
  if (!item) {
    return "/images/folder-placeholder-image.svg";
  }
  switch (item.type) {
    case "code":
      return "/images/code-placeholder-image.svg";
    case "folder":
      return "/images/folder-detail-placeholder.svg";
    case "audio":
      return "/images/mp3-placeholder-image.svg";
    default:
      return item.imageUrl;
  }
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
