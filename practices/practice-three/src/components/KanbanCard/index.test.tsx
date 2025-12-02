import { render, screen, fireEvent } from "@testing-library/react";
import { KanbanCard } from "@/components/KanbanCard";

jest.mock("@/components", () => ({
  Icon: ({ className }: { className?: string }) => (
    <svg data-testid="icon-svg" className={className} />
  ),
  IconButton: ({
    onMouseDown,
  }: {
    onMouseDown?: (e: React.MouseEvent) => void;
  }) => (
    <button onClick={onMouseDown} data-testid="icon-button-edit">
      <svg data-testid="edit-icon-svg" />
    </button>
  ),
}));

describe("KanbanCard", () => {
  const sampleTask = {
    id: "task-001",
    title: "Implement user authentication",
    tags: ["Frontend", "Auth"],
  };

  const defaultProps = {
    task: sampleTask,
    onEdit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render card with task title", () => {
    render(<KanbanCard {...defaultProps} />);

    expect(
      screen.getByText("Implement user authentication")
    ).toBeInTheDocument();
  });

  it("should render all task tags", () => {
    render(<KanbanCard {...defaultProps} />);

    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Auth")).toBeInTheDocument();
  });

  it("should render user avatar icon", () => {
    render(<KanbanCard {...defaultProps} />);

    const avatarIcon = screen.getByTestId("icon-svg");
    expect(avatarIcon).toBeInTheDocument();
  });

  it("should render edit button", () => {
    render(<KanbanCard {...defaultProps} />);

    const editBtn = screen.getByTestId("icon-button-edit");
    expect(editBtn).toBeInTheDocument();
  });

  it("should call onEdit with task id when edit button clicked", () => {
    render(<KanbanCard {...defaultProps} />);

    const editBtn = screen.getByTestId("icon-button-edit");
    fireEvent.click(editBtn);

    expect(defaultProps.onEdit).toHaveBeenCalledWith("task-001");
  });

  it("should render task with multiple tags", () => {
    const taskWithManyTags = {
      id: "task-003",
      title: "Design API",
      tags: ["Backend", "API", "Documentation"],
    };

    render(<KanbanCard task={taskWithManyTags} onEdit={jest.fn()} />);

    expect(screen.getByText("Design API")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("API")).toBeInTheDocument();
    expect(screen.getByText("Documentation")).toBeInTheDocument();
  });

  it("should handle different task ids", () => {
    const task1 = {
      id: "task-1",
      title: "Task 1",
      tags: ["Tag1"],
    };

    const onEdit1 = jest.fn();
    const { rerender } = render(<KanbanCard task={task1} onEdit={onEdit1} />);

    const editBtn = screen.getByTestId("icon-button-edit");
    fireEvent.click(editBtn);
    expect(onEdit1).toHaveBeenCalledWith("task-1");

    const task2 = {
      id: "task-2",
      title: "Task 2",
      tags: ["Tag2"],
    };

    const onEdit2 = jest.fn();
    rerender(<KanbanCard task={task2} onEdit={onEdit2} />);

    fireEvent.click(editBtn);
    expect(onEdit2).toHaveBeenCalledWith("task-2");
  });
});
