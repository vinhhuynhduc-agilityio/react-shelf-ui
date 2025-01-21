import { GridApi, RowNode } from 'ag-grid-community';
import { v4 as uuidv4 } from 'uuid';
import { formatRegisteredDate, formatStartDate } from '@/helpers';
import { ProjectsData, TaskData, TaskFormValues, UserData, UserFormData } from '@/types';
import { defaultAvatarUrl } from '@/constant';
import { updateUser } from '@/services';

/**
 * Handles scrolling to new user or task
 * Use setTimeOut to ensure `getRowNode` is called
 * after the table has re-rendered and refreshed the data
 */
const handleScrollingToAddedRow = (
  id: string,
  gridApi: GridApi
) => {
  setTimeout(() => {
    if (gridApi && !gridApi.isDestroyed()) {
      const rowNode = gridApi.getRowNode(id);

      if (rowNode) {
        gridApi.ensureNodeVisible(rowNode, 'middle');
      }
    }
  }, 100);
};

const handleRowSelection = (
  userId: string | null,
  sourceComponent: string,
  handleRowSelected: (userId: string | null, sourceComponent: string) => void
) => {
  handleRowSelected(userId, sourceComponent);
};

/**
 * Calculate adjusted earnings based on current earnings, currency, and condition
 * @param earnings - String earnings in the format "$12345"
 * @param currency - The currency adjustment amount
 * @param isIncrease - Boolean to determine whether to increase or decrease earnings
 * @returns number - The adjusted earnings value
 */
const calculateAdjustedEarnings = (
  earnings: string,
  currency: number,
  isIncrease: boolean
): number => {
  const currentEarnings = parseInt(earnings.slice(1)) || 0;

  return isIncrease
    ? currentEarnings + currency
    : currentEarnings - currency;
};

// Helper to format new task data
const formatNewTaskData = (data: TaskFormValues): TaskData => {
  const { currency, project, taskName, user } = data;
  const currencyValue = typeof currency === 'string' ? parseInt(currency, 10) : currency;

  return {
    id: uuidv4(),
    userId: user.id,
    projectId: project.id,
    taskName: taskName,
    startDate: formatStartDate(new Date()),
    completedDate: 'incomplete',
    currency: currencyValue,
    status: false,
    projectName: project.value,
    fullName: user.value,
  };
};

// Helper to format new project data
const formatNewProjectData = (newProjectName: string): ProjectsData => ({
  id: uuidv4(),
  projectName: newProjectName,
});

const formatEditUserData = (data: UserFormData, defaultValues: UserData): UserData => ({
  id: defaultValues.id,
  fullName: data.fullName,
  earnings: defaultValues.earnings,
  email: data.email,
  avatarUrl: data.avatarUrl || defaultAvatarUrl,
  registered: defaultValues.registered,
  lastUpdated: formatRegisteredDate(),
});

const formatNewUserData = (data: UserFormData): UserData => {
  const avatarUrl = data.avatarUrl ?? defaultAvatarUrl;
  const registeredDate = formatRegisteredDate();

  return {
    id: uuidv4(),
    fullName: data.fullName,
    earnings: '$0',
    email: data.email,
    avatarUrl: avatarUrl,
    registered: registeredDate,
    lastUpdated: registeredDate,
  };
};

// Helper function to calculate and prepare updated user data
const prepareUpdatedUserData = (
  userId: string,
  oldUserId: string,
  currency: number,
  gridApi: GridApi
): Promise<{ data: UserData | null; error: Error | null }> | null => {
  const rowNode = gridApi.getRowNode(userId);

  if (!rowNode) return null;

  const adjustedEarnings = calculateAdjustedEarnings(
    rowNode.data.earnings,
    currency,
    userId !== oldUserId
  );

  const updatedData: UserData = {
    ...rowNode.data,
    earnings: `$${adjustedEarnings}`,
  };

  return updateUser(userId, updatedData);
};

// Helper function to update row data in the grid
const updateGridRowData = (
  userId: string,
  result: { data: UserData | null; error: Error | null },
  gridApi: GridApi
) => {
  if (!result.error) {
    const rowNode = gridApi.getRowNode(userId);

    if (rowNode && result.data) {
      rowNode.setData(result.data);
    }
  }
};

// Helper to calculate and prepare updated user data
const generateUpdatedUserData = (
  rowNode: RowNode<UserData>,
  currency: number,
  status: boolean
): UserData => {
  if (!rowNode.data) {
    throw new Error('Row node data is undefined');
  }

  const adjustedEarnings = calculateAdjustedEarnings(
    rowNode.data.earnings,
    currency,
    status
  );

  return {
    ...rowNode.data,
    earnings: `$${adjustedEarnings}`,
  };
};

// Helper to handle API response and update grid
const handleApiResponseAndUpdateGrid = async (
  userId: string,
  updatedData: UserData,
  gridApi: GridApi
): Promise<void> => {
  const response = await updateUser(userId, updatedData);

  if (!response.error) {
    const rowNode = gridApi.getRowNode(userId);
    if (rowNode && response.data) {
      rowNode.setData(response.data);
    }
  }
};


export {
  handleScrollingToAddedRow,
  handleRowSelection,
  calculateAdjustedEarnings,
  formatNewTaskData,
  formatNewProjectData,
  formatEditUserData,
  formatNewUserData,
  prepareUpdatedUserData,
  updateGridRowData,
  generateUpdatedUserData,
  handleApiResponseAndUpdateGrid
};