import { GridApi, RowNode } from "ag-grid-community";
import {
  handleScrollingToAddedRow,
  handleRowSelection,
  calculateAdjustedEarnings,
  formatNewTaskData,
  formatNewProjectData,
  formatEditUserData,
  generateUpdatedUserData,
  handleApiResponseAndUpdateGrid,
} from "./helper";
import { updateUser } from "@/services";
import { UserData, TaskFormValues } from "@/types";

jest.mock("@/services", () => ({
  updateUser: jest.fn(),
}));

describe("Helper Functions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("handleScrollingToAddedRow ensures node visibility", () => {
    const mockGridApi: GridApi = {
      getRowNode: jest.fn().mockReturnValue({}),
      ensureNodeVisible: jest.fn(),
      isDestroyed: jest.fn().mockReturnValue(false),
    } as unknown as GridApi;

    handleScrollingToAddedRow("test-id", mockGridApi);

    setTimeout(() => {
      expect(mockGridApi.getRowNode).toHaveBeenCalledWith("test-id");
      expect(mockGridApi.ensureNodeVisible).toHaveBeenCalledWith({}, "middle");
    }, 100);
  });

  test("handleRowSelection calls handleRowSelected with correct parameters", () => {
    const mockHandleRowSelected = jest.fn();
    handleRowSelection(
      "123e4567-e89b-12d3-a456-426614174000",
      "TestComponent",
      mockHandleRowSelected
    );
    expect(mockHandleRowSelected).toHaveBeenCalledWith(
      "123e4567-e89b-12d3-a456-426614174000",
      "TestComponent"
    );
  });

  test("calculateAdjustedEarnings increases earnings when isIncrease is true", () => {
    const result = calculateAdjustedEarnings("$1000", 500, true);
    expect(result).toBe(1500);
  });

  test("calculateAdjustedEarnings decreases earnings when isIncrease is false", () => {
    const result = calculateAdjustedEarnings("$1000", 500, false);
    expect(result).toBe(500);
  });

  test("generateUpdatedUserData calculates and returns updated user data", () => {
    const mockRowNode: RowNode<UserData> = {
      data: {
        id: "user-id",
        earnings: "$1000",
        fullName: "Test User",
        email: "test@example.com",
        avatarUrl: "",
        registered: "",
        lastUpdated: "",
      },
    } as RowNode<UserData>;

    const updatedData = generateUpdatedUserData(mockRowNode, 500, true);

    expect(updatedData.earnings).toBe("$1500");
    expect(updatedData.fullName).toBe("Test User");
  });

  test("handleApiResponseAndUpdateGrid updates grid row data on success", async () => {
    const mockGridApi: GridApi = {
      getRowNode: jest.fn().mockReturnValue({
        setData: jest.fn(),
      }),
    } as unknown as GridApi;

    (updateUser as jest.Mock).mockResolvedValueOnce({
      data: { id: "test-id", earnings: "$1500", fullName: "Updated User" },
      error: null,
    });

    await handleApiResponseAndUpdateGrid(
      "test-id",
      { id: "test-id", earnings: "$1500", fullName: "Updated User" } as UserData,
      mockGridApi
    );

    expect(mockGridApi.getRowNode).toHaveBeenCalledWith("test-id");
    expect(mockGridApi.getRowNode("test-id")?.setData).toHaveBeenCalledWith({
      id: "test-id",
      earnings: "$1500",
      fullName: "Updated User",
    });
  });

  test("handleApiResponseAndUpdateGrid skips updating grid row on API failure", async () => {
    const setDataMock = jest.fn();
    const getRowNodeMock = jest.fn().mockReturnValue({
      setData: setDataMock,
    });

    const mockGridApi: GridApi = {
      getRowNode: getRowNodeMock,
    } as unknown as GridApi;

    // Mock API failure response
    (updateUser as jest.Mock).mockResolvedValueOnce({
      data: null,
      error: new Error("Failed to update"),
    });

    await handleApiResponseAndUpdateGrid(
      "test-id",
      { id: "test-id", earnings: "$1500", fullName: "Updated User" } as UserData,
      mockGridApi
    );

    // Ensure `getRowNode` was not called when API fails
    expect(getRowNodeMock).not.toHaveBeenCalled();

    // Ensure `setData` was not called because of the error
    expect(setDataMock).not.toHaveBeenCalled();
  });

  test("formatNewTaskData formats task data correctly", () => {
    const mockInput: TaskFormValues = {
      currency: 1000,
      project: { id: "project-id", value: "Project Name" },
      taskName: "Task Name",
      user: { id: "user-id", value: "User Name" },
    };

    const result = formatNewTaskData(mockInput);

    expect(result.taskName).toBe("Task Name");
    expect(result.currency).toBe(1000);
    expect(result.projectId).toBe("project-id");
    expect(result.userId).toBe("user-id");
  });

  test("formatNewProjectData formats project data correctly", () => {
    const projectName = "New Project";
    const result = formatNewProjectData(projectName);

    expect(result.projectName).toBe("New Project");
    expect(result.id).toBeDefined();
  });

  test("formatEditUserData formats user data correctly for editing", () => {
    const mockDefaultUser: UserData = {
      id: "user-id",
      earnings: "$1000",
      fullName: "Test User",
      email: "test@example.com",
      avatarUrl: "",
      registered: "2024-01-01",
      lastUpdated: "2024-01-01",
    };

    const mockUserFormData = {
      fullName: "Updated User",
      email: "updated@example.com",
      avatarUrl: null,
      avatar: null
    };

    const result = formatEditUserData(mockUserFormData, mockDefaultUser);

    expect(result.fullName).toBe("Updated User");
    expect(result.email).toBe("updated@example.com");
    expect(result.avatarUrl).toBeDefined();
  });
});
