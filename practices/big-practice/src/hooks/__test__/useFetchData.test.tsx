import { renderHook, waitFor } from '@testing-library/react';
import { useFetchData } from '@/hooks/useFetchData';
import { fetchUsers } from '@/services/user';
import { fetchTasks } from '@/services/task';
import { fetchProjects } from '@/services/project';
import { mockUsers, mockTasks, mockProjects } from '@/mocks';

jest.mock('@/services/user', () => ({
  fetchUsers: jest.fn(),
}));
jest.mock('@/services/task', () => ({
  fetchTasks: jest.fn(),
}));
jest.mock('@/services/project', () => ({
  fetchProjects: jest.fn(),
}));

const mockFetchUsers = fetchUsers as jest.Mock;
const mockFetchTasks = fetchTasks as jest.Mock;
const mockFetchProjects = fetchProjects as jest.Mock;

describe('useFetchData Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch users, tasks, and projects successfully', async () => {
    mockFetchUsers.mockResolvedValue({ data: mockUsers, error: null });
    mockFetchTasks.mockResolvedValue({ data: mockTasks, error: null });
    mockFetchProjects.mockResolvedValue({ data: mockProjects, error: null });

    const { result } = renderHook(() => useFetchData());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchUsers).toHaveBeenCalledTimes(1);
    expect(mockFetchTasks).toHaveBeenCalledTimes(1);
    expect(mockFetchProjects).toHaveBeenCalledTimes(1);

    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.projects).toEqual(mockProjects);
  });

  test('should handle errors when fetchUsers fails', async () => {
    mockFetchUsers.mockResolvedValue({ data: null, error: new Error('Fetch users error') });
    mockFetchTasks.mockResolvedValue({ data: mockTasks, error: null });
    mockFetchProjects.mockResolvedValue({ data: mockProjects, error: null });

    const { result } = renderHook(() => useFetchData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchUsers).toHaveBeenCalledTimes(1);
    expect(result.current.users).toEqual([]);

    expect(mockFetchTasks).toHaveBeenCalledTimes(1);
    expect(mockFetchProjects).toHaveBeenCalledTimes(1);
    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.projects).toEqual(mockProjects);
  });
});
