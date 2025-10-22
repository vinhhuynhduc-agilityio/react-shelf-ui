export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  date: string;
  parentId: string;
  imageUrl: string;
  extraInfo?: { [key: string]: string };
}
