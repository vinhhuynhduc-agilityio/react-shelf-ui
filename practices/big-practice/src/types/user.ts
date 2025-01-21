export interface UserData {
  id: string;
  fullName: string;
  earnings: string;
  email: string;
  avatarUrl: string;
  registered: string;
  lastUpdated: string;
};

export interface UserFormData {
  fullName: string;
  email: string;
  avatar: FileList | null;
  avatarUrl?: string | null;
};
