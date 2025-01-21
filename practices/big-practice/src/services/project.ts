import { API_BASE_URL } from "@/config";
import { API_ROUTES } from "@/constant";
import { apiRequest } from "@/services/apiRequest";
import { ProjectsData } from "@/types";

export const fetchProjects = async (): Promise<{ data: ProjectsData[] | null; error: Error | null }> => {
  try {
    const data = await apiRequest<ProjectsData[], ProjectsData[]>(
      'GET',
      `${API_BASE_URL}${API_ROUTES.PROJECTS}`
    );

    return {
      data,
      error: null
    };
  } catch (error) {

    console.error("Failed to fetch projects:", error);
    return {
      data: null,
      error: error as Error
    };
  }
};

export const createProject = async (payload: ProjectsData): Promise<{ data: ProjectsData | null; error: Error | null }> => {
  try {
    const data = await apiRequest<ProjectsData, ProjectsData>(
      'POST',
      `${API_BASE_URL}${API_ROUTES.PROJECTS}`,
      payload
    );

    return {
      data,
      error: null
    };
  } catch (error) {

    console.error("Failed to create projects:", error);
    return {
      data: null,
      error: error as Error
    };
  }
};
