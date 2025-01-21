import {
  useEffect,
  useRef,
} from 'react';

// ag-grid
import {
  CellEditingStartedEvent,
  CellEditingStoppedEvent,
  ColDef,
  GetRowIdParams,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  RowClassParams,
  RowClickedEvent
} from 'ag-grid-community';

// components
import {
  DataGrid,
  DropdownCellEditor,
} from '@/components/DataGrid';
import { Spinner } from '@/components/common';
import { CheckMark } from '@/components';

// services
import { updateTask } from '@/services';

// helpers
import {
  getDateColumnSortComparator,
  getUpdatedRow,
  handleProjectChange,
  handleStatusChange,
  handleTaskNameChange,
  handleUserChange
} from './helpers';


// types
import {
  FieldValue,
  ProjectsData,
  TaskData,
  UserData,
} from '@/types';

// constants
import { FIELD_TYPE, FieldType } from '@/constant';

// hooks
import { useTasksContext } from '@/hooks';

interface TaskDataProps {
  selectedUserId: string | null;
  onTaskRowSelected: (userId: string | null) => void;
  sourceComponent: string | null;
  updateEarningsForUsers: (oldUserId: string, newUserId: string, currency: number, status: boolean) => Promise<void>;
  updateEarningsOnStatusChange: (userId: string, currency: number, status: boolean) => Promise<void>;
  registerGridApiTaskDashboard: (api: GridApi) => void;
  isLoading: boolean;
  isSavingTask: boolean;
  isSavingProject: boolean;
  isSavingUser: boolean;
  setSavingTask: (value: boolean) => void;
  projects: ProjectsData[];
  users: UserData[]
};

const TaskTable: React.FC<TaskDataProps> = ({
  selectedUserId,
  sourceComponent,
  isLoading,
  isSavingTask,
  isSavingProject,
  isSavingUser,
  onTaskRowSelected,
  updateEarningsForUsers,
  updateEarningsOnStatusChange,
  registerGridApiTaskDashboard,
  setSavingTask,
  projects,
  users,
}) => {
  const {
    tasks,
    setTasks
  } = useTasksContext();
  const gridApi = useRef<GridApi | null>(null);
  const tasksRef = useRef(tasks);
  const originalTaskNameRef = useRef<string>('');

  const onGridReady = (params: GridReadyEvent) => {
    gridApi.current = params.api;

    // Pass GridApi to Dashboard via registerGridApi
    registerGridApiTaskDashboard(params.api);
  }

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  //  When `selectedUserId` changes, scroll to the corresponding row
  useEffect(() => {
    if (
      sourceComponent !== 'TaskTable'
      && selectedUserId
      && gridApi.current
    ) {
      const idTask = tasksRef.current
        .slice()
        .reverse()
        .find(item => item.userId === selectedUserId)?.id;

      if (idTask) {
        const rowNode = gridApi.current.getRowNode(idTask);

        // Scroll to row with matching userId
        if (rowNode) {
          gridApi.current.ensureNodeVisible(rowNode, 'middle');
        }
      }
    }
  }, [selectedUserId, sourceComponent]);

  // Stop editing when browser resizes.
  useEffect(() => {
    const handleResize = () => {
      gridApi.current?.stopEditing();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSaveSelect = async (
    type: FieldType,
    value: FieldValue,
    row: TaskData
  ): Promise<void> => {
    setSavingTask(true);
    const updatedRow = getUpdatedRow(type, value, row);

    // Call API to update row in the backend
    const { error } = await updateTask(row.id, updatedRow);

    if (error) {
      setSavingTask(false);
      return;
    }

    setSavingTask(false);
  };

  const handleValueChange = (
    type: FieldType,
  ) => (value: FieldValue, row: TaskData) => {
    switch (type) {
      case FIELD_TYPE.TASK_NAME:
        handleTaskNameChange(value, row, originalTaskNameRef, handleSaveSelect);
        break;

      case FIELD_TYPE.PROJECT:
        handleProjectChange(value, row, setTasks, handleSaveSelect);
        break;

      case FIELD_TYPE.USER:
        handleUserChange(value, row, setTasks, updateEarningsForUsers, handleSaveSelect);
        break;

      case FIELD_TYPE.STATUS:
        handleStatusChange(value, row, setTasks, updateEarningsOnStatusChange, handleSaveSelect);
        break;

      default:
        return;
    }
  };

  const handleRowClicked = (event: RowClickedEvent) => {
    const userId = event.data.userId;

    if (userId) {

      // Pass `userId` to parent component
      onTaskRowSelected(userId);
    }
  };

  const getRowClass = (params: RowClassParams) => {
    return params.data.userId === selectedUserId
      ? 'ag-row-selected'
      : '';
  };

  // Event when editing starts, save the original value
  const handleCellEditingStarted = (event: CellEditingStartedEvent) => {
    const { value, colDef } = event;

    if (colDef.field === FIELD_TYPE.TASK_NAME) {
      originalTaskNameRef.current = value;
    }
  };

  const handleOnCellEditingStopped = (event: CellEditingStoppedEvent) => {
    const {
      value,
      data,
      colDef
    } = event;

    // Check if the edited column is 'taskName'
    if (colDef.field === FIELD_TYPE.TASK_NAME) {
      handleValueChange(FIELD_TYPE.TASK_NAME as FieldType)(value, data);
    }
  };

  const getRowId = (params: GetRowIdParams<TaskData>) => params.data.id;

  const isDisabled = isLoading ||
    isSavingTask ||
    isSavingProject ||
    isSavingUser;

  const columnDefs: ColDef<TaskData>[] = [
    {
      headerName: '',
      field: 'status',
      cellRenderer: CheckMark,
      cellRendererParams: (params: ICellRendererParams) => ({
        onStatusValueChange: () => handleValueChange(FIELD_TYPE.STATUS as FieldType)(!params.data.status, params.data),
        isDisabled: isDisabled
      }),
      width: 55,
      tooltipValueGetter: () => 'Click to complete/uncomplete the task',
      headerClass: 'custom-header'
    },
    {
      headerName: 'Task',
      field: 'taskName',
      editable: true,
      flex: 4.1,
      tooltipValueGetter: () => 'Double-click to edit the task name',
      headerClass: 'custom-header'
    },
    {
      headerName: 'Project',
      field: 'projectName',
      editable: true,
      flex: 3.1,
      cellEditor: DropdownCellEditor,
      cellEditorParams: {
        onSelectOption: handleValueChange(FIELD_TYPE.PROJECT as FieldType),
        options: projects,
        displayKey: 'projectName'
      },
      cellEditorPopup: true, // Make sure editor is visible in popup
      tooltipValueGetter: () => 'Double-click to change the project',
      headerClass: 'custom-header'
    },
    {
      headerName: 'User',
      field: 'fullName',
      editable: true,
      flex: 3.1,
      cellEditor: DropdownCellEditor,
      cellEditorParams: {
        onSelectOption: handleValueChange(FIELD_TYPE.USER as FieldType),
        options: users,
        displayKey: 'fullName',
        showAvatar: true
      },
      cellEditorPopup: true,
      tooltipValueGetter: () => 'Double-click to assign to a different employee',
      headerClass: 'custom-header'
    },
    {
      headerName: 'Currency',
      field: 'currency',
      flex: 2,
      tooltipValueGetter: () => 'Amount received upon task completion',
      headerClass: 'custom-header'
    },
    {
      headerName: 'Start',
      field: 'startDate',
      flex: 2,
      tooltipValueGetter: () => 'The task was created',
      headerClass: 'custom-header',
      comparator: getDateColumnSortComparator
    },
    {
      headerName: 'Completed',
      field: 'completedDate',
      flex: 2,
      tooltipValueGetter: (params) => {
        return params.data?.status
          ? 'The task was completed'
          : 'Click on the red clock to complete the task';
      },
      headerClass: 'custom-header',
      comparator: getDateColumnSortComparator
    },
  ];

  return (
    <div className="ag-theme-alpine h-full w-full">
      <DataGrid
        rowData={tasks}
        columnDefs={columnDefs}
        onRowClicked={handleRowClicked}
        getRowClass={getRowClass}
        onGridReady={onGridReady}
        getRowId={getRowId}
        onCellEditingStarted={handleCellEditingStarted}
        onCellEditingStopped={handleOnCellEditingStopped}
        tooltipShowDelay={0}
        enableBrowserTooltips={true}
        loadingOverlayComponent={Spinner}
        loading={isLoading || isSavingTask || isSavingProject}
        suppressClickEdit={isDisabled}
      />
    </div>
  )
};

export default TaskTable;
