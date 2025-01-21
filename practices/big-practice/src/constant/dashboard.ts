import { UserData } from "@/types";

const defaultAvatarUrl = 'https://dummyimage.com/96x96/cccccc/ffffff&text=No+Avatar';

const defaultUserFormValues: UserData = {
  fullName: '',
  email: '',
  avatarUrl: defaultAvatarUrl,
  id: '',
  earnings: '',
  registered: '',
  lastUpdated: ''
};

const FIELD_TYPE = {
  PROJECT: "project",
  USER: "user",
  TASK_NAME: "taskName",
  STATUS: "status",
};

export type FieldType = keyof typeof FIELD_TYPE;

export {
  defaultUserFormValues,
  defaultAvatarUrl,
  FIELD_TYPE
};
