import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { WorkbookInstance } from "@fortune-sheet/react";
import "@testing-library/jest-dom";
import SpreadsheetWorkbook from ".";
import { SPREADSHEET_DATA, toolbarItems } from "@/constant";

interface MockWorkbookProps {
  ref: React.Ref<HTMLDivElement>;
  data: typeof SPREADSHEET_DATA;
  showSheetTabs: boolean;
  toolbarItems: typeof toolbarItems;
  cellContextMenu: unknown[];
  onOp: () => void;
}

jest.mock("@fortune-sheet/react", () => {
  const Workbook = React.forwardRef<
    HTMLDivElement,
    Omit<MockWorkbookProps, "ref">
  >(({ data, showSheetTabs, toolbarItems: items, onOp }, ref) => (
    <div data-testid="workbook" ref={ref}>
      <div data-testid="workbook-data">{JSON.stringify(data)}</div>
      <div data-testid="show-sheet-tabs">{String(showSheetTabs)}</div>
      <div data-testid="toolbar-items">{JSON.stringify(items)}</div>
      <button data-testid="btn-trigger-op" onClick={onOp}>
        Trigger Operation
      </button>
    </div>
  ));

  Workbook.displayName = "Workbook";

  return {
    __esModule: true,
    Workbook,
  };
});

describe("SpreadsheetWorkbook", () => {
  it("should render Workbook component", () => {
    render(<SpreadsheetWorkbook onUserEdit={jest.fn()} />);

    expect(screen.getByTestId("workbook")).toBeInTheDocument();
  });

  it("should pass SPREADSHEET_DATA to Workbook", () => {
    render(<SpreadsheetWorkbook onUserEdit={jest.fn()} />);

    const workbookData = screen.getByTestId("workbook-data");
    expect(workbookData.textContent).toContain(
      JSON.stringify(SPREADSHEET_DATA)
    );
  });

  it("should pass toolbarItems to Workbook", () => {
    render(<SpreadsheetWorkbook onUserEdit={jest.fn()} />);

    const toolbarItemsData = screen.getByTestId("toolbar-items");
    expect(toolbarItemsData.textContent).toContain(
      JSON.stringify(toolbarItems)
    );
  });

  it("should set showSheetTabs to false", () => {
    render(<SpreadsheetWorkbook onUserEdit={jest.fn()} />);

    expect(screen.getByTestId("show-sheet-tabs")).toHaveTextContent("false");
  });

  it("should call onUserEdit when onOp is triggered", () => {
    const mockOnUserEdit = jest.fn();
    render(<SpreadsheetWorkbook onUserEdit={mockOnUserEdit} />);

    fireEvent.click(screen.getByTestId("btn-trigger-op"));

    expect(mockOnUserEdit).toHaveBeenCalledTimes(1);
  });

  it("should call onUserEdit multiple times", () => {
    const mockOnUserEdit = jest.fn();
    render(<SpreadsheetWorkbook onUserEdit={mockOnUserEdit} />);

    fireEvent.click(screen.getByTestId("btn-trigger-op"));
    fireEvent.click(screen.getByTestId("btn-trigger-op"));
    fireEvent.click(screen.getByTestId("btn-trigger-op"));

    expect(mockOnUserEdit).toHaveBeenCalledTimes(3);
  });

  it("should have flex-1 container", () => {
    const { container } = render(
      <SpreadsheetWorkbook onUserEdit={jest.fn()} />
    );

    const flexContainer = container.querySelector(".flex-1");
    expect(flexContainer).toBeInTheDocument();
  });

  it("should forward ref to Workbook component", () => {
    const ref = React.createRef<WorkbookInstance>();
    render(<SpreadsheetWorkbook ref={ref} onUserEdit={jest.fn()} />);

    expect(ref.current).toBeTruthy();
  });
});
