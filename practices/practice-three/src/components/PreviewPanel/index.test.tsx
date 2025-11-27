import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PreviewPanel } from ".";
import * as helpers from "@/helpers";
import type { FileItem } from "@/types";

jest.mock("@/helpers", () => ({
  getPreviewImageSrc: jest.fn(),
  getBasicInfo: jest.fn(),
}));

jest.mock("@/components", () => ({
  Icon: ({ className }: { className?: string }) => (
    <svg data-testid="icon-svg" className={className} />
  ),
}));

describe("PreviewPanel", () => {
  const mockFiles: FileItem[] = [
    {
      id: "1",
      name: "Document.pdf",
      type: "file",
      parentId: "root",
      size: 1024,
    },
    {
      id: "2",
      name: "Image.jpg",
      type: "file",
      parentId: "root",
      size: 2048,
    },
  ];

  const mockSelectedItem: FileItem = {
    id: "1",
    name: "Document.pdf",
    type: "file",
    parentId: "root",
    size: 1024,
    extraInfo: { author: "John", version: "1.0" },
  };

  const defaultProps = {
    selectedItem: mockSelectedItem,
    files: mockFiles,
    currentFolderId: "root",
    height: 800,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (helpers.getPreviewImageSrc as jest.Mock).mockReturnValue(
      "/preview/document.jpg"
    );
    (helpers.getBasicInfo as jest.Mock).mockReturnValue([
      { label: "Size", value: "1 KB" },
      { label: "Type", value: "PDF" },
      { label: "Created", value: "2024-01-01" },
    ]);
  });

  it("should render preview panel with selected item", () => {
    render(<PreviewPanel {...defaultProps} />);

    expect(screen.getByText("Document.pdf")).toBeInTheDocument();
    expect(screen.getByAltText("Document.pdf")).toBeInTheDocument();
  });

  it("should match snapshot with selected item", () => {
    const { container } = render(<PreviewPanel {...defaultProps} />);

    expect(container).toMatchSnapshot();
  });

  it("should display preview image with correct src", () => {
    render(<PreviewPanel {...defaultProps} />);

    const img = screen.getByAltText("Document.pdf") as HTMLImageElement;
    expect(img.src).toContain("/preview/document.jpg");
  });

  it("should render information section with basic info", () => {
    render(<PreviewPanel {...defaultProps} />);

    expect(screen.getByText("Information")).toBeInTheDocument();
    expect(screen.getByText("Size")).toBeInTheDocument();
    expect(screen.getByText("1 KB")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("PDF")).toBeInTheDocument();
  });

  it("should match snapshot with information section", () => {
    const { container } = render(<PreviewPanel {...defaultProps} />);

    expect(container).toMatchSnapshot();
  });

  it("should render extra info when available", () => {
    render(<PreviewPanel {...defaultProps} />);

    expect(screen.getByText("Extra Info")).toBeInTheDocument();
    expect(screen.getByText("author")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("version")).toBeInTheDocument();
    expect(screen.getByText("1.0")).toBeInTheDocument();
  });

  it("should match snapshot with extra info", () => {
    const { container } = render(<PreviewPanel {...defaultProps} />);

    expect(container).toMatchSnapshot();
  });

  it("should not render information section when no item selected", () => {
    render(<PreviewPanel {...defaultProps} selectedItem={null} />);

    expect(screen.queryByText("Information")).not.toBeInTheDocument();
    expect(screen.queryByText("Extra Info")).not.toBeInTheDocument();
  });

  it("should match snapshot with no selected item", () => {
    const { container } = render(
      <PreviewPanel {...defaultProps} selectedItem={null} />
    );

    expect(container).toMatchSnapshot();
  });

  it("should not render extra info section when no extra info", () => {
    const itemWithoutExtra: FileItem = {
      ...mockSelectedItem,
      extraInfo: undefined,
    };

    render(<PreviewPanel {...defaultProps} selectedItem={itemWithoutExtra} />);

    expect(screen.queryByText("Extra Info")).not.toBeInTheDocument();
  });

  it("should match snapshot without extra info", () => {
    const itemWithoutExtra: FileItem = {
      ...mockSelectedItem,
      extraInfo: undefined,
    };

    const { container } = render(
      <PreviewPanel {...defaultProps} selectedItem={itemWithoutExtra} />
    );

    expect(container).toMatchSnapshot();
  });

  it("should call getPreviewImageSrc with selected item", () => {
    render(<PreviewPanel {...defaultProps} />);

    expect(helpers.getPreviewImageSrc).toHaveBeenCalledWith(mockSelectedItem);
  });

  it("should call getBasicInfo with correct parameters", () => {
    render(<PreviewPanel {...defaultProps} />);

    expect(helpers.getBasicInfo).toHaveBeenCalledWith(
      mockSelectedItem,
      mockFiles,
      "root"
    );
  });

  it("should apply correct height style", () => {
    const { container } = render(
      <PreviewPanel {...defaultProps} height={1000} />
    );

    const panel = container.querySelector("div[style*='height: 1000px']");
    expect(panel).toBeInTheDocument();
  });

  it("should match snapshot with different height", () => {
    const { container } = render(
      <PreviewPanel {...defaultProps} height={1000} />
    );

    expect(container).toMatchSnapshot();
  });

  it("should handle empty extra info object", () => {
    const itemWithEmptyExtra: FileItem = {
      ...mockSelectedItem,
      extraInfo: {},
    };

    render(
      <PreviewPanel {...defaultProps} selectedItem={itemWithEmptyExtra} />
    );

    expect(screen.queryByText("Extra Info")).not.toBeInTheDocument();
  });

  it("should match snapshot with empty extra info", () => {
    const itemWithEmptyExtra: FileItem = {
      ...mockSelectedItem,
      extraInfo: {},
    };

    const { container } = render(
      <PreviewPanel {...defaultProps} selectedItem={itemWithEmptyExtra} />
    );

    expect(container).toMatchSnapshot();
  });

  it("should display all basic info items", () => {
    render(<PreviewPanel {...defaultProps} />);

    expect(screen.getByText("Size")).toBeInTheDocument();
    expect(screen.getByText("1 KB")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("PDF")).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();
    expect(screen.getByText("2024-01-01")).toBeInTheDocument();
  });

  it("should match snapshot with all basic info", () => {
    const { container } = render(<PreviewPanel {...defaultProps} />);

    expect(container).toMatchSnapshot();
  });

  it("should handle switching between items", () => {
    const { rerender } = render(<PreviewPanel {...defaultProps} />);

    expect(screen.getByText("Document.pdf")).toBeInTheDocument();

    const newSelectedItem: FileItem = {
      id: "2",
      name: "Image.jpg",
      type: "file",
      parentId: "root",
      size: 2048,
    };

    rerender(<PreviewPanel {...defaultProps} selectedItem={newSelectedItem} />);

    expect(screen.getByText("Image.jpg")).toBeInTheDocument();
  });

  it("should match snapshot after switching items", () => {
    const { rerender, container } = render(<PreviewPanel {...defaultProps} />);

    const newSelectedItem: FileItem = {
      id: "2",
      name: "Image.jpg",
      type: "file",
      parentId: "root",
      size: 2048,
    };

    rerender(<PreviewPanel {...defaultProps} selectedItem={newSelectedItem} />);

    expect(container).toMatchSnapshot();
  });
});
