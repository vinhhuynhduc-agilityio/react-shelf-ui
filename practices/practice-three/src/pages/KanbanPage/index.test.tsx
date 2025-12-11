import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import KanbanPage from ".";

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    constructor(private cb: ResizeObserverCallback) {}
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  } as unknown as typeof ResizeObserver;
});

afterAll(() => {
  Reflect.deleteProperty(globalThis, "ResizeObserver");
});

const mockQueryClient = {
  invalidateQueries: jest.fn(),
  setQueryData: jest.fn(),
  getQueryData: jest.fn(),
};

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => mockQueryClient,
}));

jest.mock("@/hook", () => ({
  useBoardQuery: jest.fn(),
  useTasksQuery: jest.fn(),
  useAddTask: jest.fn(),
  useUpdateTask: jest.fn(),
  useDeleteTask: jest.fn(),
  useUpdateBoardColumn: jest.fn(),
  useWindowActions: jest.fn(),
}));

jest.mock("@/components", () => ({
  Button: ({
    children,
    onClick,
    variant,
  }: {
    children: string;
    onClick: () => void;
    variant: string;
  }) => (
    <button onClick={onClick} data-testid={`btn-${variant}`}>
      {children}
    </button>
  ),
  ErrorAlert: ({ title }: { title: string }) => (
    <div data-testid="error-alert">{title}</div>
  ),
  IconButton: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} data-testid="add-btn">
      +
    </button>
  ),
  KanbanCard: ({
    task,
    onEdit,
  }: {
    task: { id: string; title: string };
    onEdit: (id: string) => void;
  }) => (
    <div onClick={() => onEdit(task.id)} data-testid={`card-${task.id}`}>
      {task.title}
    </div>
  ),
  Modal: ({
    isOpen,
    onClose,
    children,
  }: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }) =>
    isOpen ? (
      <div data-testid="modal">
        {children}
        <button onClick={onClose} data-testid="modal-close">
          Close
        </button>
      </div>
    ) : null,
  MultiSelect: ({
    selected,
    onChange,
  }: {
    selected: string[];
    onChange: (tags: string[]) => void;
  }) => (
    <input
      data-testid="tags-input"
      value={selected.join(",")}
      onChange={(e) => onChange(e.target.value.split(","))}
    />
  ),
  SingleSelect: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (status: string) => void;
  }) => (
    <select
      data-testid="status-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="New">New</option>
      <option value="Work">Work</option>
    </select>
  ),
  WindowHeader: ({
    src,
    title,
    onClose,
    onMaximize,
    onMinimize,
  }: {
    src: string;
    title: string;
    onClose: () => void;
    onMaximize: () => void;
    onMinimize: () => void;
  }) => (
    <div data-testid="window-header">
      <img src={src} alt={title} data-testid="window-icon" />
      <span data-testid="window-title">{title}</span>
      <button data-testid="btn-close" onClick={onClose}>
        Close
      </button>
      <button data-testid="btn-maximize" onClick={onMaximize}>
        Maximize
      </button>
      <button data-testid="btn-minimize" onClick={onMinimize}>
        Minimize
      </button>
    </div>
  ),
}));

jest.mock("react-grid-layout", () => ({
  __esModule: true,
  default: ({
    children,
    onLayoutChange,
    onDragStop,
  }: {
    children: React.ReactNode;
    onLayoutChange: (layout: unknown[]) => void;
    onDragStop: () => void;
  }) => (
    <div
      data-testid="grid-layout"
      onClick={() => onLayoutChange([])}
      onDragEnd={onDragStop}
    >
      {children}
    </div>
  ),
}));

jest.mock("antd", () => ({
  Spin: ({ spinning }: { spinning: boolean }) =>
    spinning ? <div data-testid="spinner">Loading...</div> : null,
}));

jest.mock("uuid", () => ({
  v4: jest.fn(() => "uuid-123"),
}));

jest.mock("@/helpers", () => ({
  createKanbanSnapshot: jest.fn(() => ({
    prevTasks: {},
    prevBoard: [],
    prevLayout: [],
  })),
  generateLayout: jest.fn(() => []),
  removeTaskFromBoard: jest.fn((board: unknown) => board),
  syncLayoutToBoard: jest.fn((layout: unknown, board: unknown) => board),
  updateKanbanItems: jest.fn((board: unknown) => board),
}));

jest.mock("@/services", () => ({
  saveKanbanBoard: jest.fn(),
}));

jest.mock("@/constant", () => ({
  QUERY_KEY_BOARD: ["board"],
  QUERY_KEY_TASKS: ["tasks"],
  STATUSES: ["New", "Work", "Test", "Done"],
  WINDOW_KEYS: { KANBAN: "kanban" },
}));

import {
  useBoardQuery,
  useTasksQuery,
  useAddTask,
  useUpdateTask,
  useDeleteTask,
  useUpdateBoardColumn,
  useWindowActions,
} from "@/hook";

describe("KanbanPage", () => {
  const mockBoard = [
    {
      id: "col-1",
      progressStatus: "New",
      taskIds: ["1"],
      taskOrders: { "1": 0 },
    },
    {
      id: "col-2",
      progressStatus: "Work",
      taskIds: ["2"],
      taskOrders: { "2": 0 },
    },
    { id: "col-3", progressStatus: "Test", taskIds: [], taskOrders: {} },
    { id: "col-4", progressStatus: "Done", taskIds: [], taskOrders: {} },
  ];

  const mockTasks = [
    { id: "1", title: "Task 1", tags: ["webix"] },
    { id: "2", title: "Task 2", tags: ["jet"] },
  ];

  const mockWindowActions = {
    close: jest.fn(),
    maximize: jest.fn(),
    minimize: jest.fn(),
  };

  const mockAddTask = jest.fn();
  const mockUpdateTask = jest.fn();
  const mockDeleteTask = jest.fn();
  const mockUpdateBoardColumn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      value: 1200,
    });

    (useBoardQuery as jest.Mock).mockReturnValue({
      data: mockBoard,
      isFetching: false,
      isError: false,
      error: null,
    });

    (useTasksQuery as jest.Mock).mockReturnValue({
      data: mockTasks,
      isFetching: false,
      isError: false,
      error: null,
    });

    (useAddTask as jest.Mock).mockReturnValue({ mutate: mockAddTask });
    (useUpdateTask as jest.Mock).mockReturnValue({ mutate: mockUpdateTask });
    (useDeleteTask as jest.Mock).mockReturnValue({ mutate: mockDeleteTask });
    (useUpdateBoardColumn as jest.Mock).mockReturnValue({
      mutate: mockUpdateBoardColumn,
    });

    (useWindowActions as jest.Mock).mockReturnValue(mockWindowActions);
  });

  describe("Initial Render", () => {
    it("should render WindowHeader with correct title and icon", () => {
      render(<KanbanPage />);

      expect(screen.getByTestId("window-title")).toHaveTextContent("Kanban");
      expect(screen.getByTestId("window-icon")).toHaveAttribute(
        "src",
        "/images/kanban.webp"
      );
    });

    it("should render all status columns", () => {
      render(<KanbanPage />);

      expect(screen.getByText("New")).toBeInTheDocument();
      expect(screen.getByText("Work")).toBeInTheDocument();
      expect(screen.getByText("Test")).toBeInTheDocument();
      expect(screen.getByText("Done")).toBeInTheDocument();
    });

    it("should render kanban cards from data", () => {
      render(<KanbanPage />);

      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
    });

    it("should render grid layout", () => {
      render(<KanbanPage />);

      expect(screen.getByTestId("grid-layout")).toBeInTheDocument();
    });
  });

  describe("Loading and Error States", () => {
    it("should show loading spinner when fetching", () => {
      (useBoardQuery as jest.Mock).mockReturnValue({
        data: [],
        isFetching: true,
        isError: false,
        error: null,
      });

      render(<KanbanPage />);

      expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });

    it("should show error alert on board error", () => {
      (useBoardQuery as jest.Mock).mockReturnValue({
        data: [],
        isFetching: false,
        isError: true,
        error: { message: "Failed to load board" },
      });

      render(<KanbanPage />);

      expect(screen.getByTestId("error-alert")).toBeInTheDocument();
    });

    it("should show error alert on tasks error", () => {
      (useTasksQuery as jest.Mock).mockReturnValue({
        data: [],
        isFetching: false,
        isError: true,
        error: { message: "Failed to load tasks" },
      });

      render(<KanbanPage />);

      expect(screen.getByTestId("error-alert")).toBeInTheDocument();
    });
  });

  describe("WindowHeader Actions", () => {
    it("should call close action when close button clicked", () => {
      render(<KanbanPage />);

      fireEvent.click(screen.getByTestId("btn-close"));

      expect(mockWindowActions.close).toHaveBeenCalledTimes(1);
    });

    it("should call maximize action when maximize button clicked", () => {
      render(<KanbanPage />);

      fireEvent.click(screen.getByTestId("btn-maximize"));

      expect(mockWindowActions.maximize).toHaveBeenCalledTimes(1);
    });

    it("should call minimize action when minimize button clicked", () => {
      render(<KanbanPage />);

      fireEvent.click(screen.getByTestId("btn-minimize"));

      expect(mockWindowActions.minimize).toHaveBeenCalledTimes(1);
    });
  });

  describe("Card Interaction", () => {
    it("should open modal when clicking card", () => {
      render(<KanbanPage />);

      fireEvent.click(screen.getByTestId("card-1"));

      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    it("should close modal when clicking close button", () => {
      render(<KanbanPage />);

      fireEvent.click(screen.getByTestId("card-1"));
      expect(screen.getByTestId("modal")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("modal-close"));
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("should display task details in modal", async () => {
      render(<KanbanPage />);

      fireEvent.click(screen.getByTestId("card-1"));

      await waitFor(() => {
        expect(screen.getByDisplayValue("Task 1")).toBeInTheDocument();
      });
    });
  });

  describe("Modal Form Changes", () => {
    it("should update task title in modal", async () => {
      render(<KanbanPage />);

      fireEvent.click(screen.getByTestId("card-1"));

      const titleInput = screen.getByDisplayValue("Task 1") as HTMLInputElement;
      fireEvent.change(titleInput, { target: { value: "Updated Task" } });

      expect(titleInput.value).toBe("Updated Task");
    });

    it("should update task tags in modal", async () => {
      render(<KanbanPage />);

      fireEvent.click(screen.getByTestId("card-1"));

      const tagsInput = screen.getByTestId("tags-input") as HTMLInputElement;
      fireEvent.change(tagsInput, { target: { value: "webix,jet,easy" } });

      expect(tagsInput.value).toBe("webix,jet,easy");
    });

    it("should change task status in modal", async () => {
      render(<KanbanPage />);

      fireEvent.click(screen.getByTestId("card-1"));

      const statusSelect = screen.getByTestId(
        "status-select"
      ) as HTMLSelectElement;
      fireEvent.change(statusSelect, { target: { value: "Work" } });

      expect(statusSelect.value).toBe("Work");
    });
  });

  describe("Task Operations", () => {
    it("should add new task when clicking add button", () => {
      render(<KanbanPage />);

      fireEvent.click(screen.getByTestId("add-btn"));

      expect(mockAddTask).toHaveBeenCalled();
    });

    it("should not save when no changes made to task", () => {
      render(<KanbanPage />);

      fireEvent.click(screen.getByTestId("card-1"));

      // Don't make any changes, just click save
      const saveButton = screen.getAllByRole("button", { name: /save/i })[0];
      fireEvent.click(saveButton);

      expect(mockUpdateTask).not.toHaveBeenCalled();
    });

    it("should update only title when only title changed", () => {
      render(<KanbanPage />);

      fireEvent.click(screen.getByTestId("card-1"));

      // Change only title
      const titleInput = screen.getByDisplayValue("Task 1") as HTMLInputElement;
      fireEvent.change(titleInput, { target: { value: "Updated Task" } });

      // Use correct variant for save button
      const saveButton = screen.getAllByRole("button", { name: /save/i })[0];
      fireEvent.click(saveButton);

      expect(mockUpdateTask).toHaveBeenCalled();
    });

    it("should update only tags when only tags changed", () => {
      render(<KanbanPage />);

      fireEvent.click(screen.getByTestId("card-1"));

      // Change only tags
      const tagsInput = screen.getByTestId("tags-input") as HTMLInputElement;
      fireEvent.change(tagsInput, { target: { value: "jet,easy" } });

      // Use correct variant for save button
      const saveButton = screen.getAllByRole("button", { name: /save/i })[0];
      fireEvent.click(saveButton);

      expect(mockUpdateTask).toHaveBeenCalled();
    });

    it("should not save board when only title or tags changed", () => {
      render(<KanbanPage />);

      fireEvent.click(screen.getByTestId("card-1"));

      // Change only tags
      const tagsInput = screen.getByTestId("tags-input") as HTMLInputElement;
      fireEvent.change(tagsInput, { target: { value: "jet,easy" } });

      // Use correct variant for save button
      const saveButton = screen.getAllByRole("button", { name: /save/i })[0];
      fireEvent.click(saveButton);

      // updateBoardColumn should not be called when only updating task
      expect(mockUpdateBoardColumn).not.toHaveBeenCalled();
    });

    it("should remove task when clicking remove button", () => {
      render(<KanbanPage />);

      fireEvent.click(screen.getByTestId("card-1"));

      fireEvent.click(screen.getAllByTestId("btn-success")[0]);

      expect(mockDeleteTask).toHaveBeenCalled();
    });

    it("should match snapshot with modal open", () => {
      const { container } = render(<KanbanPage />);

      fireEvent.click(screen.getByTestId("card-1"));

      expect(container).toMatchSnapshot();
    });
  });
});
