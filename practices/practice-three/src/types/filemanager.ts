export interface FileItem {
  id: string;
  name: string;
  size: number | null;
  type: string | null;
  parentId: string;
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
  icon: string;
  onClick: () => void;
  danger?: boolean;
}
