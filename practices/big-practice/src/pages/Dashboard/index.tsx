import React, {
  lazy,
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react';

// ag-grid
import { GridApi, RowNode } from 'ag-grid-community';

// components
import {
  Footer,
  Header,
  TaskTable,
  ErrorBoundary,
  UsersTable,
} from '@/components';
const UserFormModal = lazy(() => import('@/components/FormModals/UserFormModal'));
const ProjectFormModal = lazy(() => import('@/components/FormModals/ProjectFormModal'));
const TaskFormModal = lazy(() => import('@/components/FormModals/TaskFormModal'));
import { Spinner } from '@/components/common';
import {
  ChartIndividualEmployeeProgress,
  ChartTotalTasksByProjects,
  ChartTotalTasksCompleted
} from '@/components/Chart';

// types
import {
  UserFormData,
  UserData,
  TaskFormValues
} from '@/types';

// services
import { createProject, createTask, createUser, updateUser } from '@/services';

// constant
import {
  defaultUserFormValues
} from '@/constant';

import {
  formatEditUserData,
  formatNewProjectData,
  formatNewTaskData,
  formatNewUserData,
  generateUpdatedUserData,
  handleApiResponseAndUpdateGrid,
  handleRowSelection,
  handleScrollingToAddedRow,
  prepareUpdatedUserData,
  updateGridRowData
} from './helper';

// context
import { TasksContext } from '@/context';

// hooks
import {
  useFetchData,
  useRowSelection
} from '@/hooks';

const Dashboard: React.FC = () => {
  const userListGridApi = useRef<GridApi | null>(null);
  const taskDashboardGridApi = useRef<GridApi | null>(null);

  // State variables related to opening modal dialog
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isEditUser, setEditUser] = useState(false);
  const [defaultValues, setDefaultValues] = useState<UserData>(defaultUserFormValues);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);

  // State to track loading
  const [isSavingUser, setSavingUser] = useState(false);
  const [isSavingTask, setSavingTask] = useState(false);
  const [isSavingProject, setSavingProject] = useState(false);

  const { users, tasks, projects, isLoading, setUsers, setTasks, setProjects } = useFetchData();
  const { selectedUserId, sourceComponent, handleRowSelected } = useRowSelection();

  const registerGridApiTaskDashboard = (api: GridApi) => {
    taskDashboardGridApi.current = api
  };

  // Function to handle when row in TaskTable is selected.
  const handleTaskRowSelected = (userId: string | null) => {
    handleRowSelection(userId, 'TaskTable', handleRowSelected);
  };

  // Function to handle when row in UsersTable is selected
  const handleUserRowSelected = (userId: string | null) => {
    handleRowSelection(userId, 'UsersTable', handleRowSelected);
  };

  const updateEarningsForUsers = async (
    oldUserId: string,
    newUserId: string,
    currency: number,
    status: boolean
  ) => {
    handleTaskRowSelected(newUserId);

    if (!status) return;

    setSavingUser(true);

    const updates: Promise<{ data: UserData | null; error: Error | null }>[] = [];

    [oldUserId, newUserId].forEach((userId) => {
      const update = prepareUpdatedUserData(userId, oldUserId, currency, userListGridApi.current!);

      if (update) updates.push(update);
    });

    // Wait for all updates to complete.
    const results = await Promise.all(updates);

    // Update grid rows based on the results
    results.forEach((result, index) => {
      const userId = [oldUserId, newUserId][index];
      updateGridRowData(userId, result, userListGridApi.current!);
    });

    setSavingUser(false);
  };

  const updateEarningsOnStatusChange = async (
    userId: string,
    currency: number,
    status: boolean
  ) => {
    setSavingUser(true);

    const gridApi = userListGridApi.current;
    const rowNode = gridApi?.getRowNode(userId) as RowNode<UserData>;

    if (rowNode) {
      const updatedData = generateUpdatedUserData(rowNode, currency, status);

      if (updatedData && gridApi) {
        await handleApiResponseAndUpdateGrid(userId, updatedData, gridApi);
      }
    }

    setSavingUser(false);
  };

  const registerGridApi = (api: GridApi) => {
    userListGridApi.current = api
  };

  const handleToggleProjectForm = useCallback(() => {
    setProjectModalOpen(true);
  }, []);

  const handleToggleTaskForm = useCallback(() => {
    setTaskModalOpen(true);
  }, []);

  const handleToggleUserForm = useCallback(() => {
    setDefaultValues(defaultUserFormValues);
    setUserModalOpen(true);
    setEditUser(false);
  }, []);

  const handleUserDoubleClicked = (userData: UserData) => {
    setDefaultValues(userData);
    setUserModalOpen(true);
    setEditUser(true);
  };

  const handleOnSubmit = (data: UserFormData) =>
    isEditUser
      ? handleEditUser(data)
      : handleAddNewUser(data);

  const handleAddNewUser = async (data: UserFormData) => {
    setUserModalOpen(false);
    setSavingUser(true);

    const newUser = formatNewUserData(data);

    // Call createUser API
    const response = await createUser(newUser);

    if (response.error) {
      setSavingUser(false);
      return;
    }

    // Add the new user to the state
    setUsers((prevUsers) => [...prevUsers, response.data!]);

    // Handles scrolling to the new user
    if (userListGridApi.current) {
      handleScrollingToAddedRow(newUser.id, userListGridApi.current);
    }

    // Handle selection for the new user
    handleUserRowSelected(newUser.id);

    setSavingUser(false);
  };

  const handleEditUser = async (data: UserFormData) => {
    setUserModalOpen(false);

    if (!defaultValues?.id) return;

    setSavingUser(true);

    const editUser = formatEditUserData(data, defaultValues);

    // Call updateUser API
    const response = await updateUser(defaultValues.id, editUser);

    if (response.error) {
      setSavingUser(false);
      return;
    }

    // Update the users state with the updated user
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === defaultValues.id ? response.data! : user
      )
    );

    setSavingUser(false);
  };

  const handleAddNewTask = async (data: TaskFormValues) => {
    setTaskModalOpen(false);
    setSavingTask(true);

    const newTask = formatNewTaskData(data);
    const response = await createTask(newTask);

    if (response.error) {
      setSavingTask(false);
      return;
    }

    // Update tasks state and scroll to the new task row
    setTasks((prevTasks) => [...prevTasks, response.data!]);

    if (taskDashboardGridApi.current) {
      handleScrollingToAddedRow(newTask.id, taskDashboardGridApi.current);
    }

    // Handle selection for the new task
    handleTaskRowSelected(newTask.userId);

    setSavingTask(false);
  };

  const handleAddProject = async (newProjectName: string) => {
    setProjectModalOpen(false);
    setSavingProject(true);

    const newProject = formatNewProjectData(newProjectName);
    const response = await createProject(newProject);

    if (response.error) {
      setSavingProject(false);
      return;
    }

    // Update projects state with the new project
    setProjects((prevProjects) => [...prevProjects, response.data!]);

    setSavingProject(false);
  };

  const contextValue = useMemo(() => ({
    tasks,
    setTasks,
  }), [tasks, setTasks]);

  return (
    <TasksContext.Provider value={contextValue}>
      <div className="flex flex-col h-screen w-screen">
        <Header
          onAddUser={handleToggleUserForm}
          onAddProject={handleToggleProjectForm}
          onAddTask={handleToggleTaskForm}
          isLoading={isLoading}
          isSavingTask={isSavingTask}
          isSavingUser={isSavingUser}
          isSavingProject={isSavingProject}
        />
        <div className="flex flex-row flex-grow bg-slate-100 min-h-0">
          <div className="flex-grow-0 ml-1 mr-4 my-4 w-64 ag-theme-alpine overflow-auto">
            <UsersTable
              selectedUserId={selectedUserId}
              onUserSelected={handleUserRowSelected}
              sourceComponent={sourceComponent}
              registerGridApi={registerGridApi}
              onUserDoubleClicked={handleUserDoubleClicked}
              isLoading={isLoading}
              isSavingUser={isSavingUser}
              users={users}
            />
          </div>
          <div className="flex-grow bg-slate-100 my-4 mr-4 overflow-auto">
            <ErrorBoundary>
              <ChartTotalTasksCompleted
                isLoading={isLoading}
                tasks={tasks}
              />
            </ErrorBoundary>
            <div className="flex flex-row bg-slate-100 mt-4 h-[302px]">
              <ErrorBoundary>
                <ChartIndividualEmployeeProgress
                  selectedUserId={selectedUserId}
                  isLoading={isLoading}
                  users={users}
                  tasks={tasks}
                />
              </ErrorBoundary>
              <ErrorBoundary>
                <ChartTotalTasksByProjects
                  isLoading={isLoading}
                  projects={projects}
                  tasks={tasks}
                />
              </ErrorBoundary>
            </div>
            <div className="bg-white mt-4 h-96 border-customBorder">
              <TaskTable
                selectedUserId={selectedUserId}
                onTaskRowSelected={handleTaskRowSelected}
                sourceComponent={sourceComponent}
                updateEarningsForUsers={updateEarningsForUsers}
                updateEarningsOnStatusChange={updateEarningsOnStatusChange}
                registerGridApiTaskDashboard={registerGridApiTaskDashboard}
                isLoading={isLoading}
                isSavingTask={isSavingTask}
                isSavingProject={isSavingProject}
                isSavingUser={isSavingUser}
                setSavingTask={setSavingTask}
                users={users}
                projects={projects}
              />
            </div>
          </div>
        </div>
        <Footer
          content='Team Progress App'
        />
      </div>
      {isUserModalOpen && (
        <Suspense fallback={<Spinner />}>
          <UserFormModal
            isEditUser={isEditUser}
            defaultValues={defaultValues}
            onClose={() => setUserModalOpen(false)}
            onSubmit={handleOnSubmit}
            users={users}
          />
        </Suspense>
      )}
      {isProjectModalOpen && (
        <Suspense fallback={<Spinner />}>
          <ProjectFormModal
            onClose={() => setProjectModalOpen(false)}
            onSubmit={handleAddProject}
            projects={projects}
          />
        </Suspense>
      )}
      {isTaskModalOpen && (
        <Suspense fallback={<Spinner />}>
          <TaskFormModal
            onClose={() => setTaskModalOpen(false)}
            onSubmit={handleAddNewTask}
            users={users}
            projects={projects}
            tasks={tasks}
          />
        </Suspense>
      )}
    </TasksContext.Provider>
  );
};

export default Dashboard;
