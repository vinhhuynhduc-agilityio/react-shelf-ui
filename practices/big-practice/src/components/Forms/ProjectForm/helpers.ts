import { ProjectsData } from "@/types";

/**
 * Checks if a project name already exists in the project list.
 *
 * @param projects - Array of existing projects
 * @param name - New project name to check
 * @returns True if the project name already exists, otherwise false
 */
export const isProjectDuplicate = (projects: ProjectsData[], name: string): boolean => {
  return projects.some(
    project => project.projectName.toUpperCase() === name.toUpperCase()
  );
};
