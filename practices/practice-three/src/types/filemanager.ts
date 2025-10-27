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
  { type: "file" | "folder"; name: string }
>;
