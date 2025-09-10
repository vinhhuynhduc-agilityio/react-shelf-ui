import { RangeSelection, Selection } from "react-spreadsheet";

export const removeSelectedClass = (rowIndex: number, colIndex: number) => {
  const columnHeader = document.querySelector(
    `.Spreadsheet__header:nth-child(${colIndex + 1})`
  );
  const rowHeader = document.querySelector(`tr[row="${rowIndex}"] th`);

  columnHeader?.classList.remove("header_selected");
  rowHeader?.classList.remove("header_selected");
};

export const getSelectedRange = (
  selected: Selection,
  columnLabels: string[],
  rowLabels: string[]
) => {
  if (selected instanceof RangeSelection) {
    const { start, end } = selected.range;
    const startCol = columnLabels[start.column];
    const startRow = rowLabels[start.row];
    let rangeStr = `${startCol}${startRow}`;

    if (start.row !== end.row || start.column !== end.column) {
      const endCol = columnLabels[end.column];
      const endRow = rowLabels[end.row];
      rangeStr += `:${endCol}${endRow}`;
    }

    return rangeStr;
  }

  return "";
};
