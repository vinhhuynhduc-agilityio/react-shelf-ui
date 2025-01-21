import { isProjectDuplicate } from "./helpers";
import { mockProjects } from "@/mocks";

describe("isProjectDuplicate", () => {
  it("should return true if the project name already exists (case insensitive)", () => {
    const result = isProjectDuplicate(mockProjects, "support");
    expect(result).toBe(true);
  });

  it("should return false if the project name does not exist", () => {
    const result = isProjectDuplicate(mockProjects, "Non-Existing Project");
    expect(result).toBe(false);
  });

  it("should return true if the project name matches exactly", () => {
    const result = isProjectDuplicate(mockProjects, "Support");
    expect(result).toBe(true);
  });

  it("should handle empty input project name and return false", () => {
    const result = isProjectDuplicate(mockProjects, "");
    expect(result).toBe(false);
  });

  it("should handle empty project list and return false", () => {
    const result = isProjectDuplicate([], "Support");
    expect(result).toBe(false);
  });
});
