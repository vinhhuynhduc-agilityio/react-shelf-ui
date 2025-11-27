import {
  renderHook,
  waitFor,
  act,
  wrapper,
} from "@/components/Test/test-utils";
import {
  useBoardQuery,
  useTasksQuery,
  useAddTask,
  useUpdateTask,
  useDeleteTask,
  useUpdateBoardColumn,
} from "../kanban";
import * as services from "@/services";

jest.mock("@/services");
jest.mock("@/constant");

// Mock data
const mockBoard = [
  {
    id: "new",
    progressStatus: "New",
    taskIds: ["506f5426-3dc0-4cfe-95e1-6593eb0f0e98", "Hello"],
    taskOrders: {
      "506f5426-3dc0-4cfe-95e1-6593eb0f0e98": 0,
      Hello: 1,
    },
  },
  {
    id: "work",
    progressStatus: "Work",
    taskIds: [
      "07393151-6d3a-4d43-8dff-035ebb5ad646",
      "5ee46a29-510b-4e23-8049-10a1b1f1094c",
    ],
    taskOrders: {
      "07393151-6d3a-4d43-8dff-035ebb5ad646": 0,
      "5ee46a29-510b-4e23-8049-10a1b1f1094c": 1,
    },
  },
  {
    id: "test",
    progressStatus: "Test",
    taskIds: [
      "22e9acba-d0ed-4d0a-9492-29b62aa01b74",
      "cb80c436-8cd5-4627-b07d-d4a76b4c823b",
    ],
    taskOrders: {
      "22e9acba-d0ed-4d0a-9492-29b62aa01b74": 0,
      "cb80c436-8cd5-4627-b07d-d4a76b4c823b": 1,
    },
  },
  {
    id: "done",
    progressStatus: "Done",
    taskIds: ["Performance"],
    taskOrders: {
      Performance: 0,
    },
  },
];

const mockTasks = [
  {
    id: "Hello",
    title: "Hello11",
    tags: ["webix", "jet"],
  },
  {
    id: "Performance",
    title: "Performance1",
    tags: ["webix", "jet", "easy"],
  },
  {
    id: "07393151-6d3a-4d43-8dff-035ebb5ad646",
    title: "New Task 12345",
    tags: [],
  },
  {
    id: "5ee46a29-510b-4e23-8049-10a1b1f1094c",
    title: "New Task 2121132",
    tags: ["webix", "jet", "easy"],
  },
  {
    id: "22e9acba-d0ed-4d0a-9492-29b62aa01b74",
    title: "New Task 123",
    tags: [],
  },
  {
    id: "cb80c436-8cd5-4627-b07d-d4a76b4c823b",
    title: "New Task 1",
    tags: [],
  },
  {
    id: "506f5426-3dc0-4cfe-95e1-6593eb0f0e98",
    title: "New Task 12xxx",
    tags: ["webix", "jet", "easy"],
  },
];

const mockNewTask = {
  title: "New Task",
  tags: [],
  status: "todo",
};

const mockUpdatedTask = {
  tags: [],
  title: "Updated Task",
  id: "1",
};
const mockColumnUpdate = {
  id: "col-1",
  progressStatus: "In Progress",
  taskIds: ["task-2"],
  taskOrders: { "task-2": 1 },
};

describe("useBoardQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch board data successfully", async () => {
    (services.getBoard as jest.Mock).mockResolvedValue(mockBoard);

    const { result } = renderHook(() => useBoardQuery(), { wrapper });

    expect(result.current.isPending).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockBoard);
    expect(services.getBoard).toHaveBeenCalledTimes(1);
  });
});

describe("useAddTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should add task successfully", async () => {
    const mockResponse = { id: "task-3", ...mockNewTask };
    (services.addTask as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAddTask(), { wrapper });

    await act(async () => {
      const response = await result.current.mutateAsync(mockNewTask);
      expect(response).toEqual(mockResponse);
    });

    expect(services.addTask).toHaveBeenCalledWith(mockNewTask);
    expect(services.addTask).toHaveBeenCalledTimes(1);
  });

  it("should not retry on error", async () => {
    const mockError = new Error("Add failed");
    (services.addTask as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAddTask(), { wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync(mockNewTask);
      } catch {
        // Ignore error
      }
    });

    expect(services.addTask).toHaveBeenCalledTimes(1);
  });
});

describe("useUpdateTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update task successfully", async () => {
    (services.updateTask as jest.Mock).mockResolvedValue(mockUpdatedTask);

    const { result } = renderHook(() => useUpdateTask(), { wrapper });

    await act(async () => {
      const response = await result.current.mutateAsync(mockUpdatedTask);
      expect(response).toEqual(mockUpdatedTask);
    });

    expect(services.updateTask).toHaveBeenCalledWith(mockUpdatedTask);
  });
});

describe("useDeleteTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete task successfully", async () => {
    (services.deleteTask as jest.Mock).mockResolvedValue({
      success: true,
    });

    const { result } = renderHook(() => useDeleteTask(), { wrapper });

    await act(async () => {
      const response = await result.current.mutateAsync("task-1");
      expect(response).toEqual({ success: true });
    });

    expect(services.deleteTask).toHaveBeenCalledWith("task-1");
  });
});

describe("useUpdateBoardColumn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update board column successfully", async () => {
    (services.updateBoardColumn as jest.Mock).mockResolvedValue(
      mockColumnUpdate
    );

    const { result } = renderHook(() => useUpdateBoardColumn(), { wrapper });

    await act(async () => {
      const response = await result.current.mutateAsync(mockColumnUpdate);
      expect(response).toEqual(mockColumnUpdate);
    });

    expect(services.updateBoardColumn).toHaveBeenCalledWith(mockColumnUpdate);
  });

  it("should handle multiple column updates", async () => {
    (services.updateBoardColumn as jest.Mock).mockResolvedValue(
      mockColumnUpdate
    );

    const { result } = renderHook(() => useUpdateBoardColumn(), { wrapper });

    const update1 = {
      id: "col-1",
      taskIds: ["task-1"],
      progressStatus: "In Progress",
      taskOrders: { "task-1": 1 },
    };
    const update2 = {
      id: "col-2",
      taskIds: ["task-2"],
      progressStatus: "Done",
      taskOrders: { "task-2": 2 },
    };

    await act(async () => {
      await result.current.mutateAsync(update1);
      await result.current.mutateAsync(update2);
    });

    expect(services.updateBoardColumn).toHaveBeenCalledTimes(2);
    expect(services.updateBoardColumn).toHaveBeenNthCalledWith(1, update1);
    expect(services.updateBoardColumn).toHaveBeenNthCalledWith(2, update2);
  });
});

describe("useTasksQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches tasks and returns data", async () => {
    (services.getTasks as jest.Mock).mockResolvedValue(mockTasks);

    const { result } = renderHook(() => useTasksQuery(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockTasks);
    expect(services.getTasks).toHaveBeenCalledTimes(1);
  });
});
