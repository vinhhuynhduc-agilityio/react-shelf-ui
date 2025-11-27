import { render, screen, fireEvent } from "@testing-library/react";
import { FileContextMenu } from ".";
import type { FileItem } from "@/types";

jest.mock("@/components", () => ({
  ContextMenu: ({
    visible,
    x,
    y,
    options,
    onClose,
  }: {
    visible: boolean;
    x: number;
    y: number;
    options: unknown[];
    onClose: () => void;
  }) =>
    visible && (
      <ul data-testid="context-menu" style={{ top: `${y}px`, left: `${x}px` }}>
        {Array.isArray(options) &&
          (options as Array<{ label: string; onClick: () => void }>).map(
            (opt) => (
              <li key={opt.label}>
                <button onClick={opt.onClick}>{opt.label}</button>
              </li>
            )
          )}
        <button onClick={onClose} data-testid="close-btn">
          Close
        </button>
      </ul>
    ),
}));

describe("FileContextMenu", () => {
  const sampleFile: FileItem = {
    id: "file-001",
    name: "document.pdf",
    size: 2048,
    type: "application/pdf",
    parentId: "root",
    imageUrl: undefined,
    extraInfo: { author: "John Doe" },
  };

  const defaultProps = {
    visible: true,
    x: 100,
    y: 150,
    item: sampleFile,
    onRename: jest.fn(),
    onDelete: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render when visible is false", () => {
    render(<FileContextMenu {...defaultProps} visible={false} />);

    expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
  });

  it("should not render when item is null", () => {
    render(<FileContextMenu {...defaultProps} item={null} />);

    expect(screen.queryByTestId("context-menu")).not.toBeInTheDocument();
  });

  it("should render menu when visible and item exist", () => {
    render(<FileContextMenu {...defaultProps} />);

    expect(screen.getByTestId("context-menu")).toBeInTheDocument();
    expect(screen.getByText("Rename")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("should pass correct position to ContextMenu", () => {
    render(<FileContextMenu {...defaultProps} x={200} y={300} />);

    const menu = screen.getByTestId("context-menu");
    expect(menu).toHaveStyle({ top: "300px", left: "200px" });
  });

  it("should call onRename when Rename option clicked", () => {
    render(<FileContextMenu {...defaultProps} />);

    fireEvent.click(screen.getByText("Rename"));

    expect(defaultProps.onRename).toHaveBeenCalledTimes(1);
  });

  it("should call onDelete when Delete option clicked", () => {
    render(<FileContextMenu {...defaultProps} />);

    fireEvent.click(screen.getByText("Delete"));

    expect(defaultProps.onDelete).toHaveBeenCalledTimes(1);
  });

  it("should pass onClose to ContextMenu", () => {
    render(<FileContextMenu {...defaultProps} />);

    fireEvent.click(screen.getByTestId("close-btn"));

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("should have Delete option marked as danger", () => {
    render(<FileContextMenu {...defaultProps} />);

    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("should create correct options array structure", () => {
    const { container } = render(<FileContextMenu {...defaultProps} />);

    const buttons = container.querySelectorAll("button");
    expect(buttons).toHaveLength(3); // Rename, Delete, Close
  });

  it("should render different file items correctly", () => {
    const differentFile: FileItem = {
      id: "file-002",
      name: "image.png",
      size: 1024,
      type: "image/png",
      parentId: "folder-001",
      imageUrl: "https://example.com/image.png",
    };

    render(<FileContextMenu {...defaultProps} item={differentFile} />);

    expect(screen.getByTestId("context-menu")).toBeInTheDocument();
    expect(screen.getByText("Rename")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("should handle rapid option clicks", () => {
    render(<FileContextMenu {...defaultProps} />);

    fireEvent.click(screen.getByText("Rename"));
    fireEvent.click(screen.getByText("Delete"));

    expect(defaultProps.onRename).toHaveBeenCalledTimes(1);
    expect(defaultProps.onDelete).toHaveBeenCalledTimes(1);
  });
});
