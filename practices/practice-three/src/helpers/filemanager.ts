import { v4 as uuidv4 } from "uuid";
import html2canvas from "html2canvas";

// types
import { BreadcrumbItem, FileItem, FormData } from "@/types";

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
    imageUrl: "/images/blank-white-image.png",
  },
  "db php less": {
    type: "code",
    imageUrl: "/images/code-placeholder-image.svg",
  },
  "doc xls xlsx": {
    type: "document",
    imageUrl: "/images/blank-white-image.png",
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

export const getAllDescendantIdsInDeleteOrder = (
  files: FileItem[],
  parentId: string
): string[] => {
  const getAll = (id: string): string[] =>
    files
      .filter((f) => f.parentId === id)
      .flatMap((child) => [child.id, ...getAll(child.id)]);

  const allIds = getAll(parentId);

  const depth = (id: string): number => {
    let d = 0,
      cur = id;
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
