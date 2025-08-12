import { formatBorrowedDate } from "../date";

describe("formatBorrowedDate", () => {
  it("should format a specific date correctly", () => {
    const date = new Date("2025-07-07T15:30:00");
    // en-GB: 07 Jul 2025 03:30 PM
    expect(formatBorrowedDate(date)).toBe("07 Jul 2025 03:30 PM");
  });

  it("should return AM/PM in uppercase", () => {
    const date = new Date("2025-07-07T01:05:00");
    expect(formatBorrowedDate(date)).toContain("AM");
    const date2 = new Date("2025-07-07T23:45:00");
    expect(formatBorrowedDate(date2)).toContain("PM");
  });
});
