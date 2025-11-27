import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
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
}));

describe("SpreadsheetPage", () => {
  it("should render workbook component on initial load", () => {
    render(<SpreadsheetPage />);

    expect(screen.getByTestId("fortune-workbook")).toBeInTheDocument();
  });

  it("should match snapshot on initial load", () => {
    const { container } = render(<SpreadsheetPage />);

    expect(container).toMatchSnapshot();
  });

  it("should pass SPREADSHEET_DATA to Workbook component", () => {
    render(<SpreadsheetPage />);

    const workbookData = screen.getByTestId("workbook-data");
    expect(workbookData.textContent).toContain("Sheet1");
    expect(workbookData.textContent).toContain("50");
    expect(workbookData.textContent).toContain("26");
  });

  it("should pass all toolbarItems to Workbook component", () => {
    render(<SpreadsheetPage />);

    const toolbarData = screen.getByTestId("toolbar-items");
    expect(toolbarData.textContent).toContain("undo");
    expect(toolbarData.textContent).toContain("redo");
    expect(toolbarData.textContent).toContain("bold");
    expect(toolbarData.textContent).toContain("merge-cell");
  });

  it("should have flex-1 class on main container", () => {
    const { container } = render(<SpreadsheetPage />);

    const mainDiv = container.querySelector(".flex-1");
    expect(mainDiv).toBeInTheDocument();
  });

  it("should render memoized workbook component correctly", () => {
    const { container } = render(<SpreadsheetPage />);

    const mainWrapper = container.firstChild as HTMLElement;
    expect(mainWrapper).toHaveClass("flex-1");
    expect(
      mainWrapper.querySelector('[data-testid="fortune-workbook"]')
    ).toBeInTheDocument();
  });

  it("should match snapshot with all props configured", () => {
    const { container } = render(<SpreadsheetPage />);

    expect(container).toMatchSnapshot();
  });
});
