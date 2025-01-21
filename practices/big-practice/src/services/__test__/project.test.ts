import { fetchProjects, createProject } from '@/services/project';
import { apiRequest } from '@/services/apiRequest';
import { mockProjects } from '@/mocks';
import { ProjectsData } from '@/types';

jest.mock('@/services/apiRequest');

describe('Project Service', () => {
  describe('fetchProjects', () => {
    it('should return projects data on success', async () => {
      (apiRequest as jest.Mock).mockResolvedValue(mockProjects);

      const result = await fetchProjects();

      expect(apiRequest).toHaveBeenCalledWith('GET', expect.any(String));
      expect(result).toEqual({
        data: mockProjects,
        error: null,
      });
    });

    it('should return an error on failure', async () => {
      const error = new Error('Failed to fetch projects');
      (apiRequest as jest.Mock).mockRejectedValue(error);

      const result = await fetchProjects();

      expect(apiRequest).toHaveBeenCalledWith('GET', expect.any(String));
      expect(result).toEqual({
        data: null,
        error,
      });
    });
  });

  describe('createProject', () => {
    const newProject: ProjectsData = {
      id: 'new-project',
      projectName: 'New Project',
    };

    it('should create a project successfully', async () => {
      (apiRequest as jest.Mock).mockResolvedValue(newProject);

      const result = await createProject(newProject);

      expect(apiRequest).toHaveBeenCalledWith('POST', expect.any(String), newProject);
      expect(result).toEqual({
        data: newProject,
        error: null,
      });
    });

    it('should return an error when project creation fails', async () => {
      const error = new Error('Failed to create project');
      (apiRequest as jest.Mock).mockRejectedValue(error);

      const result = await createProject(newProject);

      expect(apiRequest).toHaveBeenCalledWith('POST', expect.any(String), newProject);
      expect(result).toEqual({
        data: null,
        error,
      });
    });
  });
});
