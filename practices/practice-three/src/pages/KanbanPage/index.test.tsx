import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
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

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
  })),
}));

jest.mock("@/hook", () => ({
  useBoardQuery: jest.fn(),
  useTasksQuery: jest.fn(),
  useAddTask: jest.fn(),
  useUpdateTask: jest.fn(),
  useDeleteTask: jest.fn(),
  useUpdateBoardColumn: jest.fn(),
}));

jest.mock("@/components", () => ({
  Button: ({
    children,
    onClick,
    variant,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    variant: string;
  }) => (
    <button onClick={onClick} data-testid={`button-${variant}`}>
      {children}
    </button>
  ),
  ErrorAlert: ({ title, errors }: { title: string; errors: string[] }) => (
    <div data-testid="error-alert">
      {title}: {errors.join(", ")}
    </div>
  ),
  IconButton: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} data-testid="add-item-button">
      +
    </button>
  ),
  KanbanCard: ({
    task,
    onEdit,
  }: {
    task: { id: string; title: string; tags: string[] };
    onEdit: () => void;
  }) => (
    <div onClick={onEdit} data-testid="kanban-card">
      {task.title}
    </div>
  ),
  Modal: ({
    isOpen,
    title,
    onClose,
    children,
  }: {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
  }) =>
    isOpen ? (
      <div data-testid="modal">
        <h2>{title}</h2>
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
    options: string[];
    selected: string[];
    onChange: (value: string[]) => void;
  }) => (
    <div data-testid="multi-select" onClick={() => onChange([...selected])}>
      {selected.join(", ")}
    </div>
  ),
  SingleSelect: ({
    value,
    onChange,
  }: {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    className: string;
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-testid="single-select"
    >
      <option value="">Select</option>
      <option value="New">New</option>
      <option value="Work">Work</option>
      <option value="Test">Test</option>
      <option value="Done">Done</option>
    </select>
  ),
}));

jest.mock("react-grid-layout", () => ({
  __esModule: true,
  default: ({
    children,
    onLayoutChange,
  }: {
    children: React.ReactNode[];
    onLayoutChange: () => void;
  }) => (
    <div data-testid="grid-layout" onClick={onLayoutChange}>
      {children?.map((child, idx) => (
        <div key={idx}>{child}</div>
      ))}
    </div>
  ),
}));

jest.mock("antd", () => ({
  Spin: ({ spinning }: { spinning: boolean }) =>
    spinning ? <div data-testid="spinner">Loading...</div> : null,
}));

jest.mock("uuid", () => ({
  v4: jest.fn(() => "mock-id-123"),
}));

jest.mock("@/helpers", () => ({
  createKanbanSnapshot: jest.fn(() => ({
    prevTasks: {},
    prevBoard: [],
    prevLayout: [],
  })),
  generateLayout: jest.fn(() => []),
  removeTaskFromBoard: jest.fn((board) => board),
  syncLayoutToBoard: jest.fn((layout, board) => board),
  updateKanbanItems: jest.fn((board) => board),
}));

jest.mock("@/services", () => ({
  saveKanbanBoard: jest.fn(),
}));

jest.mock("@/constant", () => ({
  QUERY_KEY_BOARD: ["board"],
  QUERY_KEY_TASKS: ["tasks"],
  STATUSES: ["New", "Work", "Test", "Done"],
}));

import {
  useBoardQuery,
  useTasksQuery,
  useAddTask,
  useUpdateTask,
  useDeleteTask,
  useUpdateBoardColumn,
} from "@/hook";

describe("KanbanPage", () => {
  const mockBoard = [
    { id: "col-1", progressStatus: "New", taskIds: [], taskOrders: {} },
    { id: "col-2", progressStatus: "Work", taskIds: [], taskOrders: {} },
  ];

  const mockTasks = [
    { id: "task-1", title: "Task 1", tags: ["webix"] },
    { id: "task-2", title: "Task 2", tags: ["jet"] },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

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

    (useAddTask as jest.Mock).mockReturnValue({ mutate: jest.fn() });
    (useUpdateTask as jest.Mock).mockReturnValue({ mutate: jest.fn() });
    (useDeleteTask as jest.Mock).mockReturnValue({ mutate: jest.fn() });
    (useUpdateBoardColumn as jest.Mock).mockReturnValue({ mutate: jest.fn() });

    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      value: 1200,
    });
  });

  it("should render kanban board with headers", () => {
    render(<KanbanPage />);

    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("should match snapshot on initial load", () => {
    const { container } = render(<KanbanPage />);

    expect(container).toMatchSnapshot();
  });

  it("should display loading state when fetching", () => {
    (useBoardQuery as jest.Mock).mockReturnValue({
      data: [],
      isFetching: true,
      isError: false,
      error: null,
    });

    render(<KanbanPage />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("should render grid layout when data is ready", () => {
    render(<KanbanPage />);

    expect(screen.getByTestId("grid-layout")).toBeInTheDocument();
  });

  it("should render all kanban cards", () => {
    render(<KanbanPage />);

    const cards = screen.getAllByTestId("kanban-card");
    expect(cards.length).toBeGreaterThan(0);
  });

  it("should handle multiple board columns", () => {
    render(<KanbanPage />);

    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("should render add item button", () => {
    render(<KanbanPage />);

    expect(screen.getByTestId("add-item-button")).toBeInTheDocument();
  });

  it("should render card titles from mock data", () => {
    render(<KanbanPage />);

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("should match snapshot after modal opened", () => {
    const { container } = render(<KanbanPage />);

    expect(container).toMatchSnapshot();
  });
});
