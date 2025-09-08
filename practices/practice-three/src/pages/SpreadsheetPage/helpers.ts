export const removeSelectedClass = (rowIndex: number, colIndex: number) => {
  const columnHeader = document.querySelector(
    `.Spreadsheet__header:nth-child(${colIndex + 1})`
  );
  const rowHeader = document.querySelector(`tr[row="${rowIndex}"] th`);

  columnHeader?.classList.remove("header_selected");
  rowHeader?.classList.remove("header_selected");
};
