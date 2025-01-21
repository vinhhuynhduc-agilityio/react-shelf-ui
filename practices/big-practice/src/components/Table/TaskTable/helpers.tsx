import { FIELD_TYPE, FieldType } from "@/constant";
import { FieldValue, ProjectsData, StatusWithDate, TaskData, UserData } from "@/types";

const handleTaskNameChange = async (
  value: FieldValue,
  row: TaskData,
  originalTaskNameRef: React.MutableRefObject<string>,
  handleSaveSelect: (type: FieldType, value: FieldValue, row: TaskData) => Promise<void>,
) => {
  const currentValue = originalTaskNameRef.current;
  const newValue = value;

  if (newValue === currentValue) return;

  await handleSaveSelect(FIELD_TYPE.TASK_NAME as FieldType, newValue, row);
};

const handleProjectChange = async (
  value: FieldValue,
  row: TaskData,
  setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>,
  handleSaveSelect: (type: FieldType, value: FieldValue, row: TaskData) => Promise<void>
) => {
  const currentValue = row.projectId;
  const newValue = (value as ProjectsData).id;

  if (newValue === currentValue) return;

  await handleSaveSelect(FIELD_TYPE.PROJECT as FieldType, value, row);

  setTasks((prevTasks) =>
    prevTasks.map((task) =>
      task.id === row.id
        ? {
          ...task,
          projectId: newValue,
          projectName: (value as ProjectsData).projectName,
        }
        : task
    )
  );
};

const handleUserChange = async (
  value: FieldValue,
  row: TaskData,
  setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>,
  updateEarningsForUsers: (oldUserId: string, newUserId: string, currency: number, status: boolean) => Promise<void>,
  handleSaveSelect: (type: FieldType, value: FieldValue, row: TaskData) => Promise<void>
) => {
  const oldUserId = row.userId;
  const newUserId = (value as UserData).id;

  if (newUserId === oldUserId) return;

  await handleSaveSelect(FIELD_TYPE.USER as FieldType, value, row);
  await updateEarningsForUsers(oldUserId, newUserId, row.currency, row.status);

  // Update tasks state
  setTasks((prevTasks) =>
    prevTasks.map((task) =>
      task.id === row.id
        ? { ...task, userId: newUserId, fullName: (value as UserData).fullName }
        : task
    )
  );
};

const handleStatusChange = async (
  value: FieldValue,
  row: TaskData,
  setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>,
  updateEarningsOnStatusChange: (userId: string, currency: number, status: boolean) => Promise<void>,
  handleSaveSelect: (type: FieldType, value: FieldValue, row: TaskData) => Promise<void>
) => {
  const status = value as boolean;
  const { currency, userId } = row;
  const completedDate = status
    ? new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    } as Intl.DateTimeFormatOptions)
    : 'incomplete';

  await handleSaveSelect(FIELD_TYPE.STATUS as FieldType, { status, completedDate }, row);
  await updateEarningsOnStatusChange(userId, currency, status);

  setTasks((prevTasks) =>
    prevTasks.map((task) =>
      task.id === row.id
        ? {
          ...task,
          status,
          completedDate,
        }
        : task
    )
  );
};

/**
 * Updates a row in the TaskData table based on the provided type and value.
 */
const getUpdatedRow = (
  type: FieldType,
  value: FieldValue,
  row: TaskData
): TaskData => {
  switch (type) {
    case FIELD_TYPE.PROJECT: {
      const { projectName, id } = value as ProjectsData;

      return {
        ...row,
        projectName,
        projectId: id,
      };
    }

    case FIELD_TYPE.USER: {
      const { fullName, id } = value as UserData;

      return {
        ...row,
        fullName,
        userId: id,
      };
    }

    case FIELD_TYPE.TASK_NAME:

      return {
        ...row,
        taskName: value as string,
      };

    case FIELD_TYPE.STATUS: {
      const { status, completedDate } = value as StatusWithDate;

      return {
        ...row,
        status,
        completedDate,
      };
    }

    default:
      return row;
  }
};

/**
 * Custom comparator function to sort dates.
 * @param date1 - The first date string in the format 'DD MMM YY'.
 * @param date2 - The second date string in the format 'DD MMM YY'.
 * @returns 1 if date1 is greater than date2, -1 otherwise.
 */
const getDateColumnSortComparator = (date1: string, date2: string) => {
  const parseDate = (dateStr: string) => {
    if (dateStr === 'incomplete') return null;
    const [day, month, year] = dateStr.split(' ');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return new Date(parseInt(year, 10), months.indexOf(month), parseInt(day, 10));
  };

  const dateObj1 = parseDate(date1);
  const dateObj2 = parseDate(date2);

  if (dateObj1 === null && dateObj2 === null) return 0;
  if (dateObj1 === null) return -1;
  if (dateObj2 === null) return 1;

  return dateObj1 > dateObj2
    ? 1
    : dateObj1 < dateObj2
      ? -1
      : 0;
};

export {
  handleTaskNameChange,
  handleProjectChange,
  handleUserChange,
  handleStatusChange,
  getUpdatedRow,
  getDateColumnSortComparator
};
