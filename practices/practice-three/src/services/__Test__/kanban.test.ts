import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  getBoard,
  updateBoardColumn,
  saveKanbanBoard,
} from "../kanban";
import { apiRequest } from "@/helpers";
import { API_BASE_URL } from "@/services";
import { API_ENDPOINTS } from "@/constant";
import { Task, BoardColumn } from "@/types";

jest.mock("@/helpers");

describe("Kanban Services", () => {
  const mockTask: Task = {
    id: "1",
    title: "Task 1",
    tags: ["webix"],
  };

  const mockTasks: Task[] = [
    mockTask,
    {
      id: "2",
      title: "Task 2",
      tags: ["jet"],
    },
  ];

  const mockBoardColumn: BoardColumn = {
    id: "col-1",
    progressStatus: "New",
    taskIds: ["1"],
    taskOrders: { "1": 0 },
  };

  const mockBoard: BoardColumn[] = [
    mockBoardColumn,
    {
      id: "col-2",
      progressStatus: "Work",
      taskIds: ["2"],
      taskOrders: { "2": 0 },
    },
    {
      id: "col-3",
      progressStatus: "Test",
      taskIds: [],
      taskOrders: {},
    },
    {
      id: "col-4",
      progressStatus: "Done",
      taskIds: [],
      taskOrders: {},
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* Tasks Tests */
  describe("getTasks", () => {
    it("should call apiRequest with correct params and return tasks list", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(mockTasks);

      // Act
      const result = await getTasks();

      // Assert
      expect(apiRequest).toHaveBeenCalledWith(
        "GET",
        `${API_BASE_URL}${API_ENDPOINTS.TASKS}`
      );
      expect(result).toEqual(mockTasks);
    });

    it("should return empty array if no tasks", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await getTasks();

      // Assert
      expect(result).toEqual([]);
    });

    it("should return tasks with correct structure", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(mockTasks);

      // Act
      const result = await getTasks();

      // Assert
      result.forEach((task) => {
        expect(task).toHaveProperty("id");
        expect(task).toHaveProperty("title");
        expect(task).toHaveProperty("tags");
        expect(Array.isArray(task.tags)).toBe(true);
      });
    });

    it("should throw error on API failure", async () => {
      // Arrange
      const error = new Error("Failed to fetch tasks");
      (apiRequest as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(getTasks()).rejects.toThrow("Failed to fetch tasks");
    });
  });

  describe("addTask", () => {
    it("should call apiRequest with POST and return created task", async () => {
      // Arrange
      const newTask: Omit<Task, "id"> = {
        title: "New Task",
        tags: ["webix"],
      };
      const createdTask: Task = { ...newTask, id: "3" };
      (apiRequest as jest.Mock).mockResolvedValue(createdTask);

      // Act
      const result = await addTask(newTask);

      // Assert
      expect(apiRequest).toHaveBeenCalledWith(
        "POST",
        `${API_BASE_URL}${API_ENDPOINTS.TASKS}`,
        newTask
      );
      expect(result).toEqual(createdTask);
      expect(result.id).toBe("3");
    });

    it("should handle task with multiple tags", async () => {
      // Arrange
      const newTask: Omit<Task, "id"> = {
        title: "Multi-tag Task",
        tags: ["webix", "jet", "easy"],
      };
      const createdTask: Task = { ...newTask, id: "4" };
      (apiRequest as jest.Mock).mockResolvedValue(createdTask);

      // Act
      const result = await addTask(newTask);

      // Assert
      expect(result.tags).toHaveLength(3);
      expect(result.tags).toContain("webix");
      expect(result.tags).toContain("jet");
      expect(result.tags).toContain("easy");
    });

    it("should handle task without tags", async () => {
      // Arrange
      const newTask: Omit<Task, "id"> = {
        title: "Task without tags",
        tags: [],
      };
      const createdTask: Task = { ...newTask, id: "5" };
      (apiRequest as jest.Mock).mockResolvedValue(createdTask);

      // Act
      const result = await addTask(newTask);

      // Assert
      expect(result.tags).toEqual([]);
    });

    it("should throw error on API failure", async () => {
      // Arrange
      const error = new Error("Failed to add task");
      (apiRequest as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(addTask(mockTask)).rejects.toThrow("Failed to add task");
    });
  });

  describe("updateTask", () => {
    it("should call apiRequest with PUT and return updated task", async () => {
      // Arrange
      const updatedTask: Task = {
        ...mockTask,
        title: "Updated Task",
      };
      (apiRequest as jest.Mock).mockResolvedValue(updatedTask);

      // Act
      const result = await updateTask(updatedTask);

      // Assert
      expect(apiRequest).toHaveBeenCalledWith(
        "PUT",
        `${API_BASE_URL}${API_ENDPOINTS.TASKS}/${mockTask.id}`,
        updatedTask
      );
      expect(result.title).toBe("Updated Task");
    });

    it("should preserve all task properties during update", async () => {
      // Arrange
      const updatedTask = { ...mockTask, title: "New Title" };
      (apiRequest as jest.Mock).mockResolvedValue(updatedTask);

      // Act
      const result = await updateTask(updatedTask);

      // Assert
      expect(result.id).toBe(mockTask.id);
      expect(result.tags).toEqual(mockTask.tags);
    });

    it("should update tags", async () => {
      // Arrange
      const updatedTask: Task = {
        ...mockTask,
        tags: ["jet", "complex"],
      };
      (apiRequest as jest.Mock).mockResolvedValue(updatedTask);

      // Act
      const result = await updateTask(updatedTask);

      // Assert
      expect(result.tags).toEqual(["jet", "complex"]);
      expect(result.tags).not.toContain("webix");
    });

    it("should throw error on API failure", async () => {
      // Arrange
      const error = new Error("Failed to update task");
      (apiRequest as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(updateTask(mockTask)).rejects.toThrow(
        "Failed to update task"
      );
    });
  });

  describe("deleteTask", () => {
    it("should call apiRequest with DELETE", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(undefined);

      // Act
      await deleteTask("1");

      // Assert
      expect(apiRequest).toHaveBeenCalledWith(
        "DELETE",
        `${API_BASE_URL}${API_ENDPOINTS.TASKS}/1`
      );
    });

    it("should handle deleting different task IDs", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(undefined);
      const taskIds = ["1", "2", "3"];

      // Act
      for (const id of taskIds) {
        await deleteTask(id);
      }

      // Assert
      expect(apiRequest).toHaveBeenCalledTimes(3);
      taskIds.forEach((id) => {
        expect(apiRequest).toHaveBeenCalledWith(
          "DELETE",
          expect.stringContaining(`/${id}`)
        );
      });
    });

    it("should throw error on API failure", async () => {
      // Arrange
      const error = new Error("Failed to delete task");
      (apiRequest as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(deleteTask("1")).rejects.toThrow("Failed to delete task");
    });
  });

  /* Board Tests */
  describe("getBoard", () => {
    it("should call apiRequest with correct params and return board", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(mockBoard);

      // Act
      const result = await getBoard();

      // Assert
      expect(apiRequest).toHaveBeenCalledWith(
        "GET",
        `${API_BASE_URL}${API_ENDPOINTS.BOARD}`
      );
      expect(result).toEqual(mockBoard);
      expect(result).toHaveLength(4);
    });

    it("should return all board columns with correct structure", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(mockBoard);

      // Act
      const result = await getBoard();

      // Assert
      const statuses = result.map((col) => col.progressStatus);
      expect(statuses).toEqual(["New", "Work", "Test", "Done"]);
      result.forEach((column) => {
        expect(column).toHaveProperty("id");
        expect(column).toHaveProperty("progressStatus");
        expect(column).toHaveProperty("taskIds");
        expect(column).toHaveProperty("taskOrders");
        expect(Array.isArray(column.taskIds)).toBe(true);
      });
    });

    it("should throw error on API failure", async () => {
      // Arrange
      const error = new Error("Failed to fetch board");
      (apiRequest as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(getBoard()).rejects.toThrow("Failed to fetch board");
    });
  });

  describe("updateBoardColumn", () => {
    it("should call apiRequest with PUT and return updated column", async () => {
      // Arrange
      const updatedColumn: BoardColumn = {
        ...mockBoardColumn,
        taskIds: ["1", "2"],
        taskOrders: { "1": 0, "2": 1 },
      };
      (apiRequest as jest.Mock).mockResolvedValue(updatedColumn);

      // Act
      const result = await updateBoardColumn(updatedColumn);

      // Assert
      expect(apiRequest).toHaveBeenCalledWith(
        "PUT",
        `${API_BASE_URL}${API_ENDPOINTS.BOARD}/${mockBoardColumn.id}`,
        updatedColumn
      );
      expect(result.taskIds).toEqual(["1", "2"]);
      expect(result.taskOrders["2"]).toBe(1);
    });

    it("should handle empty task list in column", async () => {
      // Arrange
      const emptyColumn: BoardColumn = {
        id: "col-3",
        progressStatus: "Test",
        taskIds: [],
        taskOrders: {},
      };
      (apiRequest as jest.Mock).mockResolvedValue(emptyColumn);

      // Act
      const result = await updateBoardColumn(emptyColumn);

      // Assert
      expect(result.taskIds).toEqual([]);
      expect(Object.keys(result.taskOrders)).toHaveLength(0);
    });

    it("should throw error on API failure", async () => {
      // Arrange
      const error = new Error("Failed to update board");
      (apiRequest as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(updateBoardColumn(mockBoardColumn)).rejects.toThrow(
        "Failed to update board"
      );
    });
  });

  /* saveKanbanBoard Tests */
  describe("saveKanbanBoard", () => {
    it("should call updateBoardColumn for each column", async () => {
      // Arrange
      const mockUpdateBoardColumn = jest.fn().mockResolvedValue(undefined);

      // Act
      await saveKanbanBoard({
        board: mockBoard,
        updateBoardColumn: mockUpdateBoardColumn,
      });

      // Assert
      expect(mockUpdateBoardColumn).toHaveBeenCalledTimes(4);
      mockBoard.forEach((col) => {
        expect(mockUpdateBoardColumn).toHaveBeenCalledWith(col);
      });
    });

    it("should handle empty board", async () => {
      // Arrange
      const mockUpdateBoardColumn = jest.fn();

      // Act
      await saveKanbanBoard({
        board: [],
        updateBoardColumn: mockUpdateBoardColumn,
      });

      // Assert
      expect(mockUpdateBoardColumn).not.toHaveBeenCalled();
    });

    it("should handle single column board", async () => {
      // Arrange
      const singleColumnBoard = [mockBoardColumn];
      const mockUpdateBoardColumn = jest.fn().mockResolvedValue(undefined);

      // Act
      await saveKanbanBoard({
        board: singleColumnBoard,
        updateBoardColumn: mockUpdateBoardColumn,
      });

      // Assert
      expect(mockUpdateBoardColumn).toHaveBeenCalledTimes(1);
      expect(mockUpdateBoardColumn).toHaveBeenCalledWith(mockBoardColumn);
    });
  });

  /* URL Construction Tests */
  describe("URL Construction", () => {
    it("should construct correct URLs for all operations", async () => {
      // Arrange
      (apiRequest as jest.Mock).mockResolvedValue(mockTask);
      const tasksUrl = `${API_BASE_URL}${API_ENDPOINTS.TASKS}`;
      const boardUrl = `${API_BASE_URL}${API_ENDPOINTS.BOARD}`;

      // Act
      await getTasks();
      await addTask(mockTask);
      await updateTask(mockTask);
      await deleteTask("1");
      await getBoard();
      await updateBoardColumn(mockBoardColumn);

      // Assert
      expect(apiRequest).toHaveBeenNthCalledWith(1, "GET", tasksUrl);
      expect(apiRequest).toHaveBeenNthCalledWith(2, "POST", tasksUrl, mockTask);
      expect(apiRequest).toHaveBeenNthCalledWith(
        3,
        "PUT",
        `${tasksUrl}/1`,
        mockTask
      );
      expect(apiRequest).toHaveBeenNthCalledWith(4, "DELETE", `${tasksUrl}/1`);
      expect(apiRequest).toHaveBeenNthCalledWith(5, "GET", boardUrl);
      expect(apiRequest).toHaveBeenNthCalledWith(
        6,
        "PUT",
        `${boardUrl}/${mockBoardColumn.id}`,
        mockBoardColumn
      );
    });
  });
});
