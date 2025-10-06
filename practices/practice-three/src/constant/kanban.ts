export const STATUSES = ["Backlog", "In Progress", "Testing", "Done"];
export const STATUS_TO_COLUMN: { [key: string]: number } = {
  New: 0,
  "In Progress": 1,
  Testing: 2,
  Done: 3,
};
