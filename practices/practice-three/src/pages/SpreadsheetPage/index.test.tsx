import { render, screen, fireEvent } from "@testing-library/react";
import SpreadsheetPage from ".";

jest.mock("@fortune-sheet/react", () => ({
  Workbook: ({
    data,
    toolbarItems: items,
  }: {
    data: Array<{
      name: string;
      celldata: unknown[];
      row: number;
      column: number;
    }>;
    toolbarItems: string[];
  }) => (
    <div data-testid="fortune-workbook">
      <div data-testid="workbook-data">{JSON.stringify(data)}</div>
      <div data-testid="toolbar-items">{JSON.stringify(items)}</div>
    </div>
  ),
}));

jest.mock("@/hook", () => ({
  useWindowActions: jest.fn(),
}));

jest.mock("@/components", () => ({
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

jest.mock("@/constant", () => ({
  SPREADSHEET_DATA: [
    {
      name: "Sheet1",
      celldata: [],
      row: 50,
      column: 26,
    },
  ],
  toolbarItems: [
    "undo",
    "redo",
    "|",
    "font",
    "font-size",
    "|",
    "bold",
    "italic",
    "underline",
    "strike-through",
    "font-color",
    "background",
    "border",
    "|",
    "horizontal-align",
    "vertical-align",
    "text-wrap",
    "merge-cell",
    "|",
  ],
  WINDOW_KEYS: { SPREADSHEET: "spreadsheet" },
}));

import { useWindowActions } from "@/hook";

describe("SpreadsheetPage", () => {
  const mockWindowActions = {
    close: jest.fn(),
    maximize: jest.fn(),
    minimize: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useWindowActions as jest.Mock).mockReturnValue(mockWindowActions);
  });

  describe("WindowHeader", () => {
    it("should render WindowHeader with correct title and icon", () => {
      render(<SpreadsheetPage />);

      expect(screen.getByTestId("window-title")).toHaveTextContent(
        "Spreadsheet"
      );
      expect(screen.getByTestId("window-icon")).toHaveAttribute(
        "src",
        "/images/spreadsheet.webp"
      );
    });

    it("should call close action when close button clicked", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-close"));

      expect(mockWindowActions.close).toHaveBeenCalledTimes(1);
    });

    it("should call maximize action when maximize button clicked", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-maximize"));

      expect(mockWindowActions.maximize).toHaveBeenCalledTimes(1);
    });

    it("should call minimize action when minimize button clicked", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-minimize"));

      expect(mockWindowActions.minimize).toHaveBeenCalledTimes(1);
    });

    it("should use correct window key for actions", () => {
      render(<SpreadsheetPage />);

      expect(useWindowActions).toHaveBeenCalledWith("spreadsheet");
    });
  });

  describe("Workbook Component", () => {
    it("should render workbook component", () => {
      render(<SpreadsheetPage />);

      expect(screen.getByTestId("fortune-workbook")).toBeInTheDocument();
    });

    it("should pass SPREADSHEET_DATA to Workbook component", () => {
      render(<SpreadsheetPage />);

      const workbookData = screen.getByTestId("workbook-data");
      expect(workbookData.textContent).toContain("Sheet1");
      expect(workbookData.textContent).toContain("50");
      expect(workbookData.textContent).toContain("26");
    });

    it("should pass toolbarItems to Workbook component", () => {
      render(<SpreadsheetPage />);

      const toolbarData = screen.getByTestId("toolbar-items");
      expect(toolbarData.textContent).toContain("undo");
      expect(toolbarData.textContent).toContain("bold");
      expect(toolbarData.textContent).toContain("merge-cell");
    });
  });

  describe("Layout", () => {
    it("should render with flex-1 container", () => {
      const { container } = render(<SpreadsheetPage />);

      const flexContainer = container.querySelector(".flex-1");
      expect(flexContainer).toBeInTheDocument();
    });

    it("should render workbook inside flex container", () => {
      const { container } = render(<SpreadsheetPage />);

      const flexContainer = container.querySelector(".flex-1");
      expect(
        flexContainer?.querySelector('[data-testid="fortune-workbook"]')
      ).toBeInTheDocument();
    });
  });
});
