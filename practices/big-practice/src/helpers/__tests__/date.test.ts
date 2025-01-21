import { formatStartDate, formatRegisteredDate } from "@/helpers";

describe("Utility Functions", () => {

  // Test for formatRegisteredDate
  describe("formatRegisteredDate", () => {
    it("should return the current date and time in the format 'Nov 10, 2024 20:54:10'", () => {
      // Mock the current date
      const mockDate = new Date("2024-11-10T20:54:10");
      jest.spyOn(global, "Date").mockImplementation(() => mockDate as unknown as Date);

      const result = formatRegisteredDate();
      expect(result).toBe("Nov 10, 2024 20:54:10");

      // Restore the original Date implementation
      jest.restoreAllMocks();
    });
  });

  // Test for formatStartDate
  describe("formatStartDate", () => {
    it("should format a Date object into '24 Jan 23'", () => {
      const date = new Date("2023-01-24T00:00:00");
      const result = formatStartDate(date);
      expect(result).toBe("24 Jan 23");
    });
  });
});
