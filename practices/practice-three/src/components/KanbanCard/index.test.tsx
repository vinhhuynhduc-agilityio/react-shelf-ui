import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { KanbanCard } from "@/components/KanbanCard";

jest.mock("@/components", () => ({
  IconButton: ({
    onMouseDown,
    iconStyles,
  }: {
    onMouseDown?: (e: React.MouseEvent) => void;
    iconStyles?: string;
  }) => (
    <button
      onClick={onMouseDown}
      data-testid="icon-button-edit"
      className={iconStyles}
    />
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
    const { container } = render(<KanbanCard {...defaultProps} />);

    const avatarIcon = container.querySelector("i.fa-user");
    expect(avatarIcon).toBeInTheDocument();
    expect(avatarIcon).toHaveClass("fa-solid", "fa-user", "fa-lg");
  });

  it("should render edit button with correct icon styles", () => {
    render(<KanbanCard {...defaultProps} />);

    const editBtn = screen.getByTestId("icon-button-edit");
    expect(editBtn).toHaveClass(
      "fa-solid",
      "fa-pencil",
      "fa-xs",
      "text-[#94a1b3]",
      "hover:text-[#1CA1C1]"
    );
  });

  it("should call onEdit with task id when edit button clicked", () => {
    render(<KanbanCard {...defaultProps} />);

    const editBtn = screen.getByTestId("icon-button-edit");
    fireEvent.click(editBtn);

    expect(defaultProps.onEdit).toHaveBeenCalledWith("task-001");
  });

  it("should call onEdit only once when edit button clicked", () => {
    render(<KanbanCard {...defaultProps} />);

    const editBtn = screen.getByTestId("icon-button-edit");
    fireEvent.click(editBtn);

    expect(defaultProps.onEdit).toHaveBeenCalledTimes(1);
  });

  it("should render task with single tag", () => {
    const taskWithOneTag = {
      id: "task-002",
      title: "Fix bug",
      tags: ["Bug"],
    };

    render(<KanbanCard task={taskWithOneTag} onEdit={jest.fn()} />);

    expect(screen.getByText("Fix bug")).toBeInTheDocument();
    expect(screen.getByText("Bug")).toBeInTheDocument();
  });

  it("should render task with multiple tags", () => {
    const taskWithManyTags = {
      id: "task-003",
      title: "Design API",
      tags: ["Backend", "API", "Documentation", "Planning"],
    };

    render(<KanbanCard task={taskWithManyTags} onEdit={jest.fn()} />);

    expect(screen.getByText("Design API")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("API")).toBeInTheDocument();
    expect(screen.getByText("Documentation")).toBeInTheDocument();
    expect(screen.getByText("Planning")).toBeInTheDocument();
  });

  it("should render task with no tags", () => {
    const taskWithoutTags = {
      id: "task-004",
      title: "Review code",
      tags: [],
    };

    render(<KanbanCard task={taskWithoutTags} onEdit={jest.fn()} />);

    expect(screen.getByText("Review code")).toBeInTheDocument();
    const tags = screen.queryAllByText(/Backend|API|Frontend/);
    expect(tags).toHaveLength(0);
  });

  it("should truncate long task title", () => {
    const longTitle =
      "This is a very long task title that should be truncated because it exceeds the maximum width allowed";
    const taskWithLongTitle = {
      id: "task-005",
      title: longTitle,
      tags: ["Long"],
    };

    const { container } = render(
      <KanbanCard task={taskWithLongTitle} onEdit={jest.fn()} />
    );

    const titleElement = container.querySelector("p");
    expect(titleElement).toHaveClass("truncate");
  });

  it("should render tags with correct styling", () => {
    const { container } = render(<KanbanCard {...defaultProps} />);

    const tagElements = container.querySelectorAll("span");
    tagElements.forEach((tag) => {
      if (tag.textContent === "Frontend" || tag.textContent === "Auth") {
        expect(tag).toHaveClass("bg-[rgba(228,230,240,0.8)]");
        expect(tag).toHaveClass("text-[#475466]");
        expect(tag).toHaveClass("rounded-[12px]");
      }
    });
  });

  it("should use memo for performance optimization", () => {
    const { rerender } = render(<KanbanCard {...defaultProps} />);

    const firstRender = screen.getByText("Implement user authentication");
    expect(firstRender).toBeInTheDocument();

    // Re-render with same props - should not re-render component
    rerender(<KanbanCard {...defaultProps} />);

    expect(
      screen.getByText("Implement user authentication")
    ).toBeInTheDocument();
  });

  it("should handle different task ids correctly", () => {
    const task1 = {
      id: "task-1",
      title: "Task 1",
      tags: ["Tag1"],
    };

    const task2 = {
      id: "task-2",
      title: "Task 2",
      tags: ["Tag2"],
    };

    const onEdit1 = jest.fn();
    const onEdit2 = jest.fn();

    const { rerender } = render(<KanbanCard task={task1} onEdit={onEdit1} />);

    let editBtn = screen.getByTestId("icon-button-edit");
    fireEvent.click(editBtn);
    expect(onEdit1).toHaveBeenCalledWith("task-1");

    rerender(<KanbanCard task={task2} onEdit={onEdit2} />);

    editBtn = screen.getByTestId("icon-button-edit");
    fireEvent.click(editBtn);
    expect(onEdit2).toHaveBeenCalledWith("task-2");
  });
});
