import { formatDropdownOptions, isTaskDuplicate } from "./helpers";
import { mockTasks } from "@/mocks";

describe("Utility Functions", () => {
  describe("formatDropdownOptions", () => {
    it("should format data into dropdown options with the specified valueKey", () => {
      const mockData = [
        { id: "1", name: "Option 1", description: "This is option 1" },
        { id: "2", name: "Option 2", description: "This is option 2" },
        { id: "3", name: "Option 3", description: "This is option 3" },
      ];

      const expectedResult = [
        { id: "1", value: "Option 1" },
        { id: "2", value: "Option 2" },
        { id: "3", value: "Option 3" },
      ];

      const result = formatDropdownOptions(mockData, "name");

      expect(result).toEqual(expectedResult);
    });

    it("should return an empty array if the input data is empty", () => {
      const mockData: { id: string; name: string }[] = [];
      const expectedResult: { id: string; value: string }[] = [];

      const result = formatDropdownOptions(mockData, "name");

      expect(result).toEqual(expectedResult);
    });
  });

  describe("isTaskDuplicate", () => {
    it("should return true if the task name already exists (case insensitive)", () => {
      const result = isTaskDuplicate(mockTasks, "build test");
      expect(result).toBe(true);
    });

    it("should return false if the task name does not exist", () => {
      const result = isTaskDuplicate(mockTasks, "Non-Existing Task");
      expect(result).toBe(false);
    });

    it("should return true if the task name matches exactly", () => {
      const result = isTaskDuplicate(mockTasks, "Build test");
      expect(result).toBe(true);
    });

    it("should handle empty input task name and return false", () => {
      const result = isTaskDuplicate(mockTasks, "");
      expect(result).toBe(false);
    });

    it("should handle empty task list and return false", () => {
      const result = isTaskDuplicate([], "Build test");
      expect(result).toBe(false);
    });
  });
});

