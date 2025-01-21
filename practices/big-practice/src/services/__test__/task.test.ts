import { fetchTasks, updateTask, createTask } from '@/services/task';
import { apiRequest } from '@/services/apiRequest';
import { TaskData } from '@/types';
import { mockTasks } from '@/mocks';

jest.mock('@/services/apiRequest');

describe('Task Service', () => {
  describe('fetchTasks', () => {
    it('should fetch tasks successfully', async () => {
      (apiRequest as jest.Mock).mockResolvedValue(mockTasks);

      const result = await fetchTasks();

      expect(apiRequest).toHaveBeenCalledWith('GET', expect.any(String));
      expect(result).toEqual({
        data: mockTasks,
        error: null,
      });
    });

    it('should handle fetch tasks error', async () => {
      const error = new Error('Failed to fetch tasks');
      (apiRequest as jest.Mock).mockRejectedValue(error);

      const result = await fetchTasks();

      expect(apiRequest).toHaveBeenCalledWith('GET', expect.any(String));
      expect(result).toEqual({
        data: null,
        error,
      });
    });
  });

  describe('updateTask', () => {
    const taskToUpdate: TaskData = {
      id: '71e564f4-7c18-47f7-89f2-abe4b7ec2854',
      userId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
      projectId: 'f2d32cb6-12c7-4ae7-bb28-74f16d1d2cbb',
      taskName: 'Updated Task Name',
      startDate: '10 Aug 24',
      completedDate: '15 Nov 24',
      currency: 2000,
      status: true,
      projectName: 'Support',
      fullName: 'Joe Bloggs',
    };

    it('should update a task successfully', async () => {
      (apiRequest as jest.Mock).mockResolvedValue(taskToUpdate);

      const result = await updateTask(taskToUpdate.id, taskToUpdate);

      expect(apiRequest).toHaveBeenCalledWith(
        'PUT',
        expect.stringContaining(taskToUpdate.id),
        taskToUpdate
      );
      expect(result).toEqual({
        data: taskToUpdate,
        error: null,
      });
    });

    it('should handle update task error', async () => {
      const error = new Error('Failed to update task');
      (apiRequest as jest.Mock).mockRejectedValue(error);

      const result = await updateTask(taskToUpdate.id, taskToUpdate);

      expect(apiRequest).toHaveBeenCalledWith(
        'PUT',
        expect.stringContaining(taskToUpdate.id),
        taskToUpdate
      );
      expect(result).toEqual({
        data: null,
        error,
      });
    });
  });

  describe('createTask', () => {
    const newTask: TaskData = {
      id: 'new-task',
      userId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
      projectId: 'f2d32cb6-12c7-4ae7-bb28-74f16d1d2cbb',
      taskName: 'New Task',
      startDate: '20 Dec 24',
      completedDate: 'incomplete',
      currency: 1000,
      status: false,
      projectName: 'Support',
      fullName: 'Joe Bloggs',
    };

    it('should create a task successfully', async () => {
      (apiRequest as jest.Mock).mockResolvedValue(newTask);

      const result = await createTask(newTask);

      expect(apiRequest).toHaveBeenCalledWith('POST', expect.any(String), newTask);
      expect(result).toEqual({
        data: newTask,
        error: null,
      });
    });

    it('should handle create task error', async () => {
      const error = new Error('Failed to create task');
      (apiRequest as jest.Mock).mockRejectedValue(error);

      const result = await createTask(newTask);

      expect(apiRequest).toHaveBeenCalledWith('POST', expect.any(String), newTask);
      expect(result).toEqual({
        data: null,
        error,
      });
    });
  });
});
