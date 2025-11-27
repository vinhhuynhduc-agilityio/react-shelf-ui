import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchOverlay from ".";
import type { WindowKey } from "@/types";

jest.mock("@/constant", () => ({
  DESKTOP_ICONS: [
    {
      key: "spreadsheet" as WindowKey,
      title: "Spreadsheet",
      image: "/icons/spreadsheet.webp",
    },
    {
      key: "filemanager" as WindowKey,
      title: "File Manager",
      image: "/icons/filemanager.webp",
    },
    {
      key: "pivot" as WindowKey,
      title: "Pivot",
      image: "/icons/pivot.webp",
    },
    {
      key: "kanban" as WindowKey,
      title: "Kanban",
      image: "/icons/kanban.webp",
    },
  ],
}));

jest.mock("@/components/common", () => ({
  Icon: ({ className }: { className?: string }) => (
    <svg data-testid="icon-svg" className={className} />
  ),
  DesktopIcon: ({
    image,
    title,
    keyIcon,
    onIconClick,
    cursorPointer,
  }: {
    image: string;
    title: string;
    keyIcon: WindowKey;
    onIconClick: () => void;
    cursorPointer: boolean;
  }) => (
    <div
      data-testid={`icon-${keyIcon}`}
      onClick={onIconClick}
      style={{ cursor: cursorPointer ? "pointer" : "default" }}
    >
      <img src={image} alt={title} />
      <span>{title}</span>
    </div>
  ),
}));

jest.mock("@/hook", () => ({
  useDebounce: (value: string) => value,
}));

describe("SearchOverlay", () => {
  const mockOnSearchChange = jest.fn();
  const mockOnAppSelect = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    searchQuery: "",
    onSearchChange: mockOnSearchChange,
    onAppSelect: mockOnAppSelect,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all desktop icons on initial load", () => {
    render(<SearchOverlay {...defaultProps} />);

    expect(screen.getByText("Spreadsheet")).toBeInTheDocument();
    expect(screen.getByText("File Manager")).toBeInTheDocument();
    expect(screen.getByText("Pivot")).toBeInTheDocument();
    expect(screen.getByText("Kanban")).toBeInTheDocument();
  });

  it("should match snapshot on initial load", () => {
    const { container } = render(<SearchOverlay {...defaultProps} />);

    expect(container).toMatchSnapshot();
  });

  it("should call onSearchChange when typing in search input", () => {
    render(<SearchOverlay {...defaultProps} />);

    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "File" } });

    expect(mockOnSearchChange).toHaveBeenCalledWith("File");
  });

  it("should match snapshot with search input filled", () => {
    const { container } = render(
      <SearchOverlay {...defaultProps} searchQuery="File" />
    );

    expect(container).toMatchSnapshot();
  });

  it("should filter icons based on search query", () => {
    const { rerender } = render(<SearchOverlay {...defaultProps} />);

    rerender(<SearchOverlay {...defaultProps} searchQuery="file" />);

    expect(screen.getByText("File Manager")).toBeInTheDocument();
    expect(screen.queryByText("Spreadsheet")).not.toBeInTheDocument();
    expect(screen.queryByText("Pivot")).not.toBeInTheDocument();
    expect(screen.queryByText("Kanban")).not.toBeInTheDocument();
  });

  it("should call onAppSelect and onClose when icon clicked", () => {
    render(<SearchOverlay {...defaultProps} />);

    const icon = screen.getByTestId("icon-spreadsheet");
    fireEvent.click(icon);

    expect(mockOnAppSelect).toHaveBeenCalledWith("spreadsheet");
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should match snapshot after icon clicked", () => {
    const { container } = render(<SearchOverlay {...defaultProps} />);

    const icon = screen.getByTestId("icon-kanban");
    fireEvent.click(icon);

    expect(container).toMatchSnapshot();
  });
});
