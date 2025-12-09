import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SpreadsheetPage from ".";
import { useWindowActions } from "@/hook";
import { saveAs } from "file-saver";
import { exportToXLSX } from "@/helpers";

jest.mock("@fortune-sheet/react", () => {
  const Workbook = React.forwardRef(
    (
      {
        data,
        toolbarItems,
        showSheetTabs,
        cellContextMenu,
        onOp,
      }: {
        data: unknown[];
        toolbarItems: string[];
        showSheetTabs: boolean;
        cellContextMenu: unknown[];
        onOp: () => void;
      },
      ref: React.Ref<HTMLDivElement> | undefined
    ) => {
      const divRef = React.useRef<HTMLDivElement>(null);
      React.useImperativeHandle(ref, () => {
        const element = divRef.current as HTMLDivElement & {
          getAllSheets: () => Array<{
            name: string;
            celldata: [];
            row: number;
            column: number;
            data: (null | null)[][];
            config: Record<string, unknown>;
          }>;
        };
        element.getAllSheets = () => [
          {
            name: "Sheet1",
            celldata: [],
            row: 50,
            column: 26,
            data: [[null, null]],
            config: {},
          },
        ];
        return element;
      });
      return (
        <div data-testid="fortune-workbook" ref={divRef}>
          <div data-testid="workbook-data">{JSON.stringify(data)}</div>
          <div data-testid="toolbar-items">{JSON.stringify(toolbarItems)}</div>
          <div data-testid="show-sheet-tabs">{String(showSheetTabs)}</div>
          <div data-testid="cell-context-menu">
            {JSON.stringify(cellContextMenu)}
          </div>
          <button data-testid="btn-change-workbook" onClick={onOp}>
            Change
          </button>
        </div>
      );
    }
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
        <p>
          Do you want to save the changes you made to &quot;{fileName}&quot;?
        </p>
        <button data-testid="btn-save" onClick={onSave}>
          Yes
        </button>
        <button data-testid="btn-discard" onClick={onDiscard}>
          No
        </button>
        <button data-testid="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    ),
  SpreadsheetWorkbook: React.forwardRef<
    {
      getAllSheets: () => Array<{
        name: string;
        celldata: [];
        row: number;
        column: number;
        data: (null | null)[][];
        config: Record<string, unknown>;
      }>;
    },
    { onUserEdit: () => void }
  >(({ onUserEdit }, ref) => {
    React.useImperativeHandle(ref, () => ({
      getAllSheets: () => [
        {
          name: "Sheet1",
          celldata: [],
          row: 50,
          column: 26,
          data: [[null, null]],
          config: {},
        },
      ],
    }));

    return (
      <div data-testid="spreadsheet-workbook" className="flex-1">
        <button data-testid="btn-trigger-edit" onClick={onUserEdit}>
          Trigger Edit
        </button>
      </div>
    );
  }),
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

jest.mock("exceljs", () => ({
  __esModule: true,
  default: class MockWorkbook {
    addWorksheet = jest.fn().mockReturnValue({
      getCell: jest.fn().mockReturnValue({}),
    });
    xlsx = {
      writeBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    };
  },
}));

jest.mock("@/helpers", () => ({
  exportToXLSX: jest.fn().mockResolvedValue(undefined),
  applyBordersFromConfig: jest.fn(),
  applyFortuneSheetCellToExcel: jest.fn(),
  colorToArgb: jest.fn((color) => color),
}));

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
      expect(screen.getByTestId("spreadsheet-workbook")).toBeInTheDocument();
    });

    it("should render without UnsavedChangesModal initially", () => {
      render(<SpreadsheetPage />);

      expect(
        screen.queryByTestId("unsaved-changes-modal")
      ).not.toBeInTheDocument();
    });

    it("should render with correct layout structure", () => {
      const { container } = render(<SpreadsheetPage />);

      const flexContainer = container.querySelector(".flex-1");
      expect(flexContainer).toBeInTheDocument();
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

  describe("SpreadsheetWorkbook Configuration", () => {
    it("should render SpreadsheetWorkbook component", () => {
      render(<SpreadsheetPage />);

      expect(screen.getByTestId("spreadsheet-workbook")).toBeInTheDocument();
    });

    it("should pass onUserEdit callback to SpreadsheetWorkbook", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-trigger-edit"));

      // After triggering edit, closing should show modal
      fireEvent.click(screen.getByTestId("btn-close"));

      expect(screen.getByTestId("unsaved-changes-modal")).toBeInTheDocument();
    });
  });

  describe("Change Tracking", () => {
    it("should track user edits via onUserEdit callback", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-trigger-edit"));

      fireEvent.click(screen.getByTestId("btn-close"));

      expect(screen.getByTestId("unsaved-changes-modal")).toBeInTheDocument();
    });

    it("should show UnsavedChangesModal when closing with unsaved changes", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-trigger-edit"));
      fireEvent.click(screen.getByTestId("btn-close"));

      expect(screen.getByTestId("unsaved-changes-modal")).toBeInTheDocument();
      expect(screen.getByTestId("unsaved-changes-modal")).toHaveAttribute(
        "data-file-name",
        "Untitled spreadsheet"
      );
    });

    it("should display correct file name in modal", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-trigger-edit"));
      fireEvent.click(screen.getByTestId("btn-close"));

      expect(
        screen.getByText(
          /Do you want to save the changes you made to "Untitled spreadsheet"\?/
        )
      ).toBeInTheDocument();
    });
  });

  describe("handleClose", () => {
    it("should call close when no unsaved changes", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-close"));

      expect(mockWindowActions.close).toHaveBeenCalledTimes(1);
      expect(
        screen.queryByTestId("unsaved-changes-modal")
      ).not.toBeInTheDocument();
    });

    it("should show modal when there are unsaved changes", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-trigger-edit"));
      fireEvent.click(screen.getByTestId("btn-close"));

      expect(screen.getByTestId("unsaved-changes-modal")).toBeInTheDocument();
      expect(mockWindowActions.close).not.toHaveBeenCalled();
    });
  });

  describe("handleYes", () => {
    it("should call exportToXLSX with sheet data", async () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-trigger-edit"));
      fireEvent.click(screen.getByTestId("btn-close"));
      fireEvent.click(screen.getByTestId("btn-save"));

      await waitFor(() => {
        expect(exportToXLSX).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "Sheet1",
            data: [[null, null]],
          })
        );
      });
    });

    it("should close modal and window after saving", async () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-trigger-edit"));
      fireEvent.click(screen.getByTestId("btn-close"));
      fireEvent.click(screen.getByTestId("btn-save"));

      await waitFor(() => {
        expect(mockWindowActions.close).toHaveBeenCalledTimes(1);
        expect(
          screen.queryByTestId("unsaved-changes-modal")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("UnsavedChangesModal - Discard", () => {
    it("should close window when No (Discard) is clicked", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-trigger-edit"));
      fireEvent.click(screen.getByTestId("btn-close"));

      const discardButton = screen.getByTestId("btn-discard");
      fireEvent.click(discardButton);

      expect(mockWindowActions.close).toHaveBeenCalled();
    });

    it("should close modal when No (Discard) is clicked", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-trigger-edit"));
      fireEvent.click(screen.getByTestId("btn-close"));

      expect(screen.getByTestId("unsaved-changes-modal")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("btn-discard"));

      expect(
        screen.queryByTestId("unsaved-changes-modal")
      ).not.toBeInTheDocument();
    });

    it("should not call saveAs when No (Discard) is clicked", () => {
      (saveAs as unknown as jest.Mock).mockClear();

      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-trigger-edit"));
      fireEvent.click(screen.getByTestId("btn-close"));

      fireEvent.click(screen.getByTestId("btn-discard"));

      expect(saveAs).not.toHaveBeenCalled();
    });
  });

  describe("UnsavedChangesModal - Cancel", () => {
    it("should not close window when Cancel is clicked", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-trigger-edit"));
      fireEvent.click(screen.getByTestId("btn-close"));

      fireEvent.click(screen.getByTestId("btn-cancel"));

      expect(mockWindowActions.close).not.toHaveBeenCalled();
    });

    it("should close modal when Cancel is clicked", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-trigger-edit"));
      fireEvent.click(screen.getByTestId("btn-close"));

      expect(screen.getByTestId("unsaved-changes-modal")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("btn-cancel"));

      expect(
        screen.queryByTestId("unsaved-changes-modal")
      ).not.toBeInTheDocument();
    });

    it("should allow continuing editing after Cancel", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-trigger-edit"));
      fireEvent.click(screen.getByTestId("btn-close"));
      fireEvent.click(screen.getByTestId("btn-cancel"));

      expect(screen.getByTestId("spreadsheet-workbook")).toBeInTheDocument();
      expect(
        screen.queryByTestId("unsaved-changes-modal")
      ).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle multiple edits before close", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-trigger-edit"));
      fireEvent.click(screen.getByTestId("btn-trigger-edit"));
      fireEvent.click(screen.getByTestId("btn-trigger-edit"));

      fireEvent.click(screen.getByTestId("btn-close"));

      expect(screen.getByTestId("unsaved-changes-modal")).toBeInTheDocument();
    });

    it("should handle maximize then close with changes", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-maximize"));
      fireEvent.click(screen.getByTestId("btn-trigger-edit"));
      fireEvent.click(screen.getByTestId("btn-close"));

      expect(screen.getByTestId("unsaved-changes-modal")).toBeInTheDocument();
    });

    it("should handle minimize then close with changes", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-minimize"));
      fireEvent.click(screen.getByTestId("btn-trigger-edit"));
      fireEvent.click(screen.getByTestId("btn-close"));

      expect(screen.getByTestId("unsaved-changes-modal")).toBeInTheDocument();
    });
  });

  describe("Integration Workflows", () => {
    it("should handle workflow: edit -> close -> discard -> closed", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-trigger-edit"));
      fireEvent.click(screen.getByTestId("btn-close"));

      expect(screen.getByTestId("unsaved-changes-modal")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("btn-discard"));

      expect(mockWindowActions.close).toHaveBeenCalled();
      expect(
        screen.queryByTestId("unsaved-changes-modal")
      ).not.toBeInTheDocument();
    });

    it("should handle workflow: edit -> close -> cancel -> continue editing", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-trigger-edit"));
      fireEvent.click(screen.getByTestId("btn-close"));

      expect(screen.getByTestId("unsaved-changes-modal")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("btn-cancel"));

      expect(mockWindowActions.close).not.toHaveBeenCalled();
      expect(screen.getByTestId("spreadsheet-workbook")).toBeInTheDocument();
    });

    it("should handle workflow: close without edit -> no modal", () => {
      render(<SpreadsheetPage />);

      fireEvent.click(screen.getByTestId("btn-close"));

      expect(mockWindowActions.close).toHaveBeenCalled();
      expect(
        screen.queryByTestId("unsaved-changes-modal")
      ).not.toBeInTheDocument();
    });
  });
});
