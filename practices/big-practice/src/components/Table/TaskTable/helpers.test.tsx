
import { FIELD_TYPE, FieldType } from "@/constant";
import { FieldValue, ProjectsData, TaskData, UserData } from "@/types";
import { getDateColumnSortComparator, getUpdatedRow, handleProjectChange, handleStatusChange, handleTaskNameChange, handleUserChange } from "./helpers";
import { mockProjects, mockTasks, mockUsers } from "@/mocks";

describe("Task Handlers", () => {
  let mockSetTasks: jest.Mock;
  let mockHandleSaveSelect: jest.Mock;
  let mockUpdateEarningsForUsers: jest.Mock;
  let mockUpdateEarningsOnStatusChange: jest.Mock;

  beforeEach(() => {
    mockSetTasks = jest.fn();
    mockHandleSaveSelect = jest.fn();
    mockUpdateEarningsForUsers = jest.fn();
    mockUpdateEarningsOnStatusChange = jest.fn();
  });

  const mockTask: TaskData = {
    id: "task-1",
    taskName: "Test Task",
    userId: "user-1",
    projectId: "project-1",
    projectName: "Test Project",
    fullName: "John Doe",
    status: false,
    completedDate: "incomplete",
    currency: 100,
    startDate: "01 Jan 2024",
  };

  const mockProject: ProjectsData = {
    id: "project-2",
    projectName: "New Project",
  };

  const mockUser: UserData = {
    id: "user-2",
    fullName: "Jane Smith",
    email: "jane@example.com",
    avatarUrl: "",
    earnings: "$200",
    registered: "",
    lastUpdated: "",
  };

  it("should handle task name change", async () => {
    const originalTaskNameRef = { current: "Old Task Name" };
    await handleTaskNameChange("New Task Name", mockTask, originalTaskNameRef, mockHandleSaveSelect);

    expect(mockHandleSaveSelect).toHaveBeenCalledWith(
      FIELD_TYPE.TASK_NAME,
      "New Task Name",
      mockTask
    );
    expect(mockHandleSaveSelect).toHaveBeenCalledTimes(1);
  });

  it("should handle project change", async () => {
    await handleProjectChange(mockProject, mockTask, mockSetTasks, mockHandleSaveSelect);

    expect(mockHandleSaveSelect).toHaveBeenCalledWith(FIELD_TYPE.PROJECT, mockProject, mockTask);
    expect(mockHandleSaveSelect).toHaveBeenCalledTimes(1);

    expect(mockSetTasks).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should handle project change", async () => {
    const project = {
      id: "project-1",
      projectName: "New Project",
    };
    await handleProjectChange(project, mockTask, mockSetTasks, mockHandleSaveSelect);
  });

  it("should handle user change", async () => {
    await handleUserChange(
      mockUser,
      mockTask,
      mockSetTasks,
      mockUpdateEarningsForUsers,
      mockHandleSaveSelect
    );

    expect(mockHandleSaveSelect).toHaveBeenCalledWith(FIELD_TYPE.USER, mockUser, mockTask);
    expect(mockHandleSaveSelect).toHaveBeenCalledTimes(1);

    expect(mockUpdateEarningsForUsers).toHaveBeenCalledWith(
      mockTask.userId,
      mockUser.id,
      mockTask.currency,
      mockTask.status
    );
    expect(mockUpdateEarningsForUsers).toHaveBeenCalledTimes(1);

    expect(mockSetTasks).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should handle user change", async () => {
    const user = {
      id: "user-1",
      fullName: "Jane Smith",
      email: "jane@example.com",
      avatarUrl: "",
      earnings: "$200",
      registered: "",
      lastUpdated: "",
    }
    await handleUserChange(
      user,
      mockTask,
      mockSetTasks,
      mockUpdateEarningsForUsers,
      mockHandleSaveSelect
    );
  });

  it("should handle status change", async () => {
    const newStatus = true;
    await handleStatusChange(
      newStatus,
      mockTask,
      mockSetTasks,
      mockUpdateEarningsOnStatusChange,
      mockHandleSaveSelect
    );

    expect(mockHandleSaveSelect).toHaveBeenCalledWith(
      FIELD_TYPE.STATUS,
      expect.objectContaining({ status: newStatus, completedDate: expect.any(String) }),
      mockTask
    );
    expect(mockHandleSaveSelect).toHaveBeenCalledTimes(1);

    expect(mockUpdateEarningsOnStatusChange).toHaveBeenCalledWith(
      mockTask.userId,
      mockTask.currency,
      newStatus
    );
    expect(mockUpdateEarningsOnStatusChange).toHaveBeenCalledTimes(1);

    expect(mockSetTasks).toHaveBeenCalledWith(expect.any(Function));
  });

  describe("getUpdatedRow", () => {
    it("should update the row with new project data", () => {
      const row = mockTasks[0];
      const updatedRow = getUpdatedRow(FIELD_TYPE.PROJECT as FieldType, mockProjects[1], row);

      expect(updatedRow).toEqual({
        ...row,
        projectName: mockProjects[1].projectName,
        projectId: mockProjects[1].id,
      });
    });

    it("should update the row with new user data", () => {
      const row = mockTasks[0];
      const updatedRow = getUpdatedRow(FIELD_TYPE.USER as FieldType, mockUsers[1], row);

      expect(updatedRow).toEqual({
        ...row,
        fullName: mockUsers[1].fullName,
        userId: mockUsers[1].id,
      });
    });

    it("should update the row with a new task name", () => {
      const row = mockTasks[0];
      const newTaskName = "New Task Name";
      const updatedRow = getUpdatedRow(FIELD_TYPE.TASK_NAME as FieldType, newTaskName, row);

      expect(updatedRow).toEqual({
        ...row,
        taskName: newTaskName,
      });
    });

    it("should update the row with new status and completed date", () => {
      const row = mockTasks[0];
      const newStatus = { status: false, completedDate: "incomplete" };
      const updatedRow = getUpdatedRow(FIELD_TYPE.STATUS as FieldType, newStatus, row);

      expect(updatedRow).toEqual({
        ...row,
        status: newStatus.status,
        completedDate: newStatus.completedDate,
      });
    });

    it("should return the original row for an unhandled field type", () => {
      const row = mockTasks[0];
      const updatedRow = getUpdatedRow("" as FieldType, "value" as FieldValue, row);
      expect(updatedRow).toEqual(row);
    });
  });

  describe("getDateColumnSortComparator", () => {
    it("should correctly compare two valid dates", () => {
      const date1 = "10 Aug 23";
      const date2 = "15 Nov 23";

      expect(getDateColumnSortComparator(date1, date2)).toBe(-1);
      expect(getDateColumnSortComparator(date2, date1)).toBe(1);
    });

    it("should return 0 when dates are equal", () => {
      const date = "15 Nov 23";

      expect(getDateColumnSortComparator(date, date)).toBe(0);
    });

    it("should correctly handle incomplete dates", () => {
      const date1 = "incomplete";
      const date2 = "15 Nov 23";

      expect(getDateColumnSortComparator(date1, date2)).toBe(-1);
      expect(getDateColumnSortComparator(date2, date1)).toBe(1);
    });

    it("should return 0 if both dates are incomplete", () => {
      const date1 = "incomplete";
      const date2 = "incomplete";

      expect(getDateColumnSortComparator(date1, date2)).toBe(0);
    });
  });
});
