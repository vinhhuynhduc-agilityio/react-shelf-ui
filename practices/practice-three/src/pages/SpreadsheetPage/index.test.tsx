import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SpreadsheetPage from ".";

jest.mock("@fortune-sheet/react", () => {
  const Workbook = React.forwardRef(
    (
      {
        data,
        toolbarItems,
        showSheetTabs,
        cellContextMenu,
        onChange,
      }: {
        data: unknown[];
        toolbarItems: string[];
        showSheetTabs: boolean;
        cellContextMenu: unknown[];
        onChange: () => void;
      },
      ref: React.Ref<HTMLDivElement> | undefined
    ) => (
      <div data-testid="fortune-workbook" ref={ref}>
        <div data-testid="workbook-data">{JSON.stringify(data)}</div>
        <div data-testid="toolbar-items">{JSON.stringify(toolbarItems)}</div>
        <div data-testid="show-sheet-tabs">{String(showSheetTabs)}</div>
        <div data-testid="cell-context-menu">
          {JSON.stringify(cellContextMenu)}
        </div>
        <button data-testid="btn-change-workbook" onClick={onChange}>
          Change
        </button>
      </div>
    )
  );

  Workbook.displayName = "Workbook";

  return {
    __esModule: true,
    Workbook,
  };
});

jest.mock("@/hook", () => ({
  useWindowActions: jest.fn(),
}));

jest.mock("@/components", () => ({
  WindowHeader: ({
    windowKey,
    src,
    title,
    onClose,
    onMaximize,
    onMinimize,
  }: {
    windowKey: string;
    src: string;
    title: string;
    onClose: () => void;
    onMaximize: () => void;
    onMinimize: () => void;
  }) => (
    <div data-testid="window-header" data-window-key={windowKey}>
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
  UnsavedChangesModal: ({
    isOpen,
    fileName,
    onSave,
    onDiscard,
    onCancel,
  }: {
    isOpen: boolean;
    fileName: string;
    onSave: () => void;
    onDiscard: () => void;
    onCancel: () => void;
  }) =>
    isOpen && (
      <div data-testid="unsaved-changes-modal" data-file-name={fileName}>
        <p>Unsaved changes in {fileName}</p>
        <button data-testid="btn-save" onClick={onSave}>
          Save
        </button>
        <button data-testid="btn-discard" onClick={onDiscard}>
          Discard
        </button>
        <button data-testid="btn-cancel" onClick={onCancel}>
          Cancel
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

jest.mock("file-saver", () => ({
  saveAs: jest.fn().mockImplementation((blob, filename) => {
    console.log("saveAs called with:", filename);
  }),
}));

jest.mock("@/helpers", () => ({
  applyBordersFromConfig: jest.fn(),
  applyFortuneSheetCellToExcel: jest.fn(),
  colorToArgb: jest.fn((color) => color),
}));

import { useWindowActions } from "@/hook";
import { saveAs } from "file-saver";

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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Rendering", () => {
    it("should render SpreadsheetPage component", () => {
      render(<SpreadsheetPage />);

      expect(screen.getByTestId("window-header")).toBeInTheDocument();
      expect(screen.getByTestId("fortune-workbook")).toBeInTheDocument();
    });

    it("should render without UnsavedChangesModal initially", () => {
      render(<SpreadsheetPage />);

      expect(
        screen.queryByTestId("unsaved-changes-modal")
      ).not.toBeInTheDocument();
    });

    it("should render flex container with flex-1 class", () => {
      const { container } = render(<SpreadsheetPage />);

      const flexContainer = container.querySelector(".flex-1");
      expect(flexContainer).toBeInTheDocument();
      expect(
        flexContainer?.querySelector('[data-testid="fortune-workbook"]')
      ).toBeInTheDocument();
    });
  });

  describe("WindowHeader", () => {
    it("should render WindowHeader with correct title", () => {
      render(<SpreadsheetPage />);

      expect(screen.getByTestId("window-title")).toHaveTextContent(
        "Spreadsheet"
      );
    });

    it("should render WindowHeader with correct icon", () => {
      render(<SpreadsheetPage />);

      expect(screen.getByTestId("window-icon")).toHaveAttribute(
        "src",
        "/images/spreadsheet.webp"
      );
    });

    it("should render WindowHeader with correct windowKey", () => {
      render(<SpreadsheetPage />);

      expect(screen.getByTestId("window-header")).toHaveAttribute(
        "data-window-key",
        "spreadsheet"
      );
    });

    it("should call useWindowActions with correct window key", () => {
      render(<SpreadsheetPage />);

      expect(useWindowActions).toHaveBeenCalledWith("spreadsheet");
    });
  });

  describe("WindowHeader Actions", () => {
    it("should call maximize when maximize button clicked", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-maximize"));

      expect(mockWindowActions.maximize).toHaveBeenCalled();
    });

    it("should call minimize when minimize button clicked", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-minimize"));

      expect(mockWindowActions.minimize).toHaveBeenCalled();
    });

    it("should call close without unsaved changes", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-close"));

      expect(mockWindowActions.close).toHaveBeenCalled();
      expect(
        screen.queryByTestId("unsaved-changes-modal")
      ).not.toBeInTheDocument();
    });
  });

  describe("Workbook Configuration", () => {
    it("should pass SPREADSHEET_DATA to Workbook", () => {
      render(<SpreadsheetPage />);

      const workbookData = screen.getByTestId("workbook-data");
      expect(workbookData.textContent).toContain("Sheet1");
      expect(workbookData.textContent).toContain("50");
      expect(workbookData.textContent).toContain("26");
    });

    it("should pass toolbarItems to Workbook", () => {
      render(<SpreadsheetPage />);

      const toolbarData = screen.getByTestId("toolbar-items");
      expect(toolbarData.textContent).toContain("undo");
      expect(toolbarData.textContent).toContain("redo");
      expect(toolbarData.textContent).toContain("bold");
      expect(toolbarData.textContent).toContain("italic");
      expect(toolbarData.textContent).toContain("merge-cell");
    });

    it("should set showSheetTabs to false", () => {
      render(<SpreadsheetPage />);

      const sheetTabs = screen.getByTestId("show-sheet-tabs");
      expect(sheetTabs.textContent).toBe("false");
    });

    it("should pass empty cellContextMenu", () => {
      render(<SpreadsheetPage />);

      const contextMenu = screen.getByTestId("cell-context-menu");
      expect(contextMenu.textContent).toBe("[]");
    });
  });

  describe("Change Tracking", () => {
    it("should set hasChanges to true when Workbook onChange is called", () => {
      render(<SpreadsheetPage />);

      const changeButton = screen.getByTestId("btn-change-workbook");
      fireEvent.click(changeButton);

      // Now closing should show modal
      fireEvent.click(screen.getByTestId("btn-close"));

      expect(screen.getByTestId("unsaved-changes-modal")).toBeInTheDocument();
    });

    it("should show UnsavedChangesModal when closing with unsaved changes", () => {
      render(<SpreadsheetPage />);

      // Simulate a change
      fireEvent.click(screen.getByTestId("btn-change-workbook"));

      // Try to close
      fireEvent.click(screen.getByTestId("btn-close"));

      expect(screen.getByTestId("unsaved-changes-modal")).toBeInTheDocument();
      expect(screen.getByTestId("unsaved-changes-modal")).toHaveAttribute(
        "data-file-name",
        "Spreadsheet"
      );
    });

    it("should display correct file name in modal", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-change-workbook"));
      fireEvent.click(screen.getByTestId("btn-close"));

      expect(
        screen.getByText(/Unsaved changes in Spreadsheet/)
      ).toBeInTheDocument();
    });
  });

  describe("UnsavedChangesModal - Discard", () => {
    it("should close window when Discard is clicked", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-change-workbook"));
      fireEvent.click(screen.getByTestId("btn-close"));

      const discardButton = screen.getByTestId("btn-discard");
      fireEvent.click(discardButton);

      expect(mockWindowActions.close).toHaveBeenCalled();
    });

    it("should close modal when Discard is clicked", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-change-workbook"));
      fireEvent.click(screen.getByTestId("btn-close"));

      expect(screen.getByTestId("unsaved-changes-modal")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("btn-discard"));

      expect(
        screen.queryByTestId("unsaved-changes-modal")
      ).not.toBeInTheDocument();
    });

    it("should not save when Discard is clicked", () => {
      (saveAs as unknown as jest.Mock).mockClear();

      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-change-workbook"));
      fireEvent.click(screen.getByTestId("btn-close"));

      fireEvent.click(screen.getByTestId("btn-discard"));

      expect(saveAs).not.toHaveBeenCalled();
    });
  });

  describe("Memoization", () => {
    it("should use MemoizedWorkbook for performance", () => {
      const { rerender } = render(<SpreadsheetPage />);

      expect(screen.getByTestId("fortune-workbook")).toBeInTheDocument();

      // Re-render with same props
      rerender(<SpreadsheetPage />);

      expect(screen.getByTestId("fortune-workbook")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle multiple changes before close", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-change-workbook"));
      fireEvent.click(screen.getByTestId("btn-change-workbook"));
      fireEvent.click(screen.getByTestId("btn-change-workbook"));

      fireEvent.click(screen.getByTestId("btn-close"));

      expect(screen.getByTestId("unsaved-changes-modal")).toBeInTheDocument();
    });

    it("should handle maximize then close with changes", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-maximize"));
      fireEvent.click(screen.getByTestId("btn-change-workbook"));
      fireEvent.click(screen.getByTestId("btn-close"));

      expect(screen.getByTestId("unsaved-changes-modal")).toBeInTheDocument();
    });

    it("should handle minimize then close with changes", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-minimize"));
      fireEvent.click(screen.getByTestId("btn-change-workbook"));
      fireEvent.click(screen.getByTestId("btn-close"));

      expect(screen.getByTestId("unsaved-changes-modal")).toBeInTheDocument();
    });
  });

  describe("Integration", () => {
    it("should handle complete workflow: change -> close -> discard -> close", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-change-workbook"));
      fireEvent.click(screen.getByTestId("btn-close"));

      expect(screen.getByTestId("unsaved-changes-modal")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("btn-discard"));

      expect(mockWindowActions.close).toHaveBeenCalled();
      expect(
        screen.queryByTestId("unsaved-changes-modal")
      ).not.toBeInTheDocument();
    });

    it("should handle workflow: change -> close -> cancel -> continue editing", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-change-workbook"));
      fireEvent.click(screen.getByTestId("btn-close"));

      expect(screen.getByTestId("unsaved-changes-modal")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("btn-cancel"));

      expect(mockWindowActions.close).not.toHaveBeenCalled();
      expect(screen.getByTestId("fortune-workbook")).toBeInTheDocument();
    });
  });
});
