export const STATUSES = ["Backlog", "In Progress", "Testing", "Done"];

export const STATUS_TO_COLUMN: { [key: string]: number } = {
  New: 0,
  Work: 1,
  Test: 2,
  Done: 3,
};

export const SPREADSHEET_DATA = [
  { name: "Sheet1", celldata: [], row: 50, column: 26 },
];
