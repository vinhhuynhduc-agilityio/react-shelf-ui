import {
  generateLayout,
  updateKanbanItems,
  syncLayoutToBoard,
  removeTaskFromBoard,
  createKanbanSnapshot,
} from "../kanbans";
import type { BoardColumn, Task } from "@/types";
import type { Layout } from "react-grid-layout";

jest.mock("@/constant", () => ({
  STATUS_TO_COLUMN: {
    New: 0,
    Work: 1,
    Test: 2,
    Done: 3,
  },
}));

describe("kanbans helpers", () => {
  const mockTasks: Record<string, Task> = {
    "task-1": { id: "task-1", title: "Task 1", tags: [] },
    "task-2": { id: "task-2", title: "Task 2", tags: ["urgent"] },
    "task-3": { id: "task-3", title: "Task 3", tags: [] },
  };

  const mockBoard: BoardColumn[] = [
    {
      id: "new",
      progressStatus: "New",
      taskIds: ["task-1"],
      taskOrders: { "task-1": 0 },
    },
    {
      id: "work",
      progressStatus: "Work",
      taskIds: ["task-2", "task-3"],
      taskOrders: { "task-2": 0, "task-3": 1 },
    },
    {
      id: "test",
      progressStatus: "Test",
      taskIds: [],
      taskOrders: {},
    },
    {
      id: "done",
      progressStatus: "Done",
      taskIds: [],
      taskOrders: {},
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateLayout", () => {
    it("generates layout from board and tasks", () => {
      const result = generateLayout(mockBoard, mockTasks);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        i: "task-1",
        x: 0,
        y: 0,
        w: 1,
        h: 1,
      });
      expect(result[1]).toEqual({
        i: "task-2",
        x: 1,
        y: 0,
        w: 1,
        h: 1,
      });
    });

    it("sorts tasks by taskOrders", () => {
      const board: BoardColumn[] = [
        {
          id: "work",
          progressStatus: "Work",
          taskIds: ["task-3", "task-2"],
          taskOrders: { "task-3": 1, "task-2": 0 },
        },
      ];

      const result = generateLayout(board, mockTasks);

      expect(result[0].i).toBe("task-2");
      expect(result[1].i).toBe("task-3");
    });

    it("skips missing tasks", () => {
      const board: BoardColumn[] = [
        {
          id: "new",
          progressStatus: "New",
          taskIds: ["task-1", "missing-task"],
          taskOrders: { "task-1": 0, "missing-task": 1 },
        },
      ];

      const result = generateLayout(board, mockTasks);

      expect(result).toHaveLength(1);
      expect(result[0].i).toBe("task-1");
    });

    it("handles empty board", () => {
      const result = generateLayout([], mockTasks);

      expect(result).toEqual([]);
    });
  });

  describe("updateKanbanItems", () => {
    it("moves task between columns", () => {
      const formData = {
        title: "Task 1 Updated",
        tags: [],
        progressStatus: "Work",
      };

      const result = updateKanbanItems(mockBoard, "task-1", formData);

      expect(result[0].taskIds).not.toContain("task-1");
      expect(result[1].taskIds).toContain("task-1");
      expect(result[1].taskOrders["task-1"]).toBe(2);
    });

    it("updates taskOrders in old column after move", () => {
      const formData = {
        title: "Task 1",
        tags: [],
        progressStatus: "Work",
      };

      const result = updateKanbanItems(mockBoard, "task-1", formData);

      expect(result[0].taskIds).toEqual([]);
      expect(result[0].taskOrders).toEqual({});
    });

    it("keeps task in same column when status unchanged", () => {
      const formData = {
        title: "Task 1 Updated",
        tags: [],
        progressStatus: "New",
      };

      const result = updateKanbanItems(mockBoard, "task-1", formData);

      expect(result).toEqual(mockBoard);
    });

    it("handles move to empty column", () => {
      const formData = {
        title: "Task 1",
        tags: [],
        progressStatus: "Test",
      };

      const result = updateKanbanItems(mockBoard, "task-1", formData);

      expect(result[2].taskIds).toContain("task-1");
      expect(result[2].taskOrders["task-1"]).toBe(0);
    });
  });

  describe("syncLayoutToBoard", () => {
    it("syncs layout changes to board", () => {
      const newLayout: Layout[] = [
        { i: "task-1", x: 1, y: 0, w: 1, h: 1 },
        { i: "task-2", x: 1, y: 1, w: 1, h: 1 },
        { i: "task-3", x: 2, y: 0, w: 1, h: 1 },
      ];

      const result = syncLayoutToBoard(newLayout, mockBoard);

      expect(result[1].taskIds).toEqual(["task-1", "task-2"]);
      expect(result[2].taskIds).toContain("task-3");
    });

    it("clears empty columns", () => {
      const newLayout: Layout[] = [
        { i: "task-1", x: 1, y: 0, w: 1, h: 1 },
        { i: "task-2", x: 1, y: 1, w: 1, h: 1 },
      ];

      const result = syncLayoutToBoard(newLayout, mockBoard);

      expect(result[0].taskIds).toEqual([]);
      expect(result[0].taskOrders).toEqual({});
    });

    it("updates taskOrders based on y position", () => {
      const newLayout: Layout[] = [
        { i: "task-2", x: 1, y: 2, w: 1, h: 1 },
        { i: "task-3", x: 1, y: 1, w: 1, h: 1 },
      ];

      const result = syncLayoutToBoard(newLayout, mockBoard);

      expect(result[1].taskIds).toEqual(["task-3", "task-2"]);
      expect(result[1].taskOrders["task-3"]).toBe(0);
      expect(result[1].taskOrders["task-2"]).toBe(1);
    });
  });

  describe("removeTaskFromBoard", () => {
    it("removes task from board", () => {
      const result = removeTaskFromBoard(mockBoard, "task-2");

      expect(result[1].taskIds).not.toContain("task-2");
      expect(result[1].taskIds).toEqual(["task-3"]);
    });

    it("updates taskOrders after removal", () => {
      const result = removeTaskFromBoard(mockBoard, "task-2");

      expect(result[1].taskOrders["task-3"]).toBe(0);
      expect(result[1].taskOrders["task-2"]).toBeUndefined();
    });

    it("handles removing non-existent task", () => {
      const result = removeTaskFromBoard(mockBoard, "non-existent");

      expect(result).toEqual(mockBoard);
    });
  });

  describe("createKanbanSnapshot", () => {
    it("creates snapshot with copies of data", () => {
      const layout: Layout[] = [{ i: "task-1", x: 0, y: 0, w: 1, h: 1 }];

      const snapshot = createKanbanSnapshot(mockTasks, mockBoard, layout);

      expect(snapshot.prevTasks).toEqual(mockTasks);
      expect(snapshot.prevBoard).toEqual(mockBoard);
      expect(snapshot.prevLayout).toEqual(layout);
    });
  });
});
