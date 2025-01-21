import { fetchUsers, updateUser, createUser } from '@/services/user';
import { apiRequest } from '@/services/apiRequest';
import { UserData } from '@/types';
import { mockUsers } from '@/mocks';

jest.mock('@/services/apiRequest');

describe('User Service', () => {
  describe('fetchUsers', () => {
    it('should fetch users successfully', async () => {
      (apiRequest as jest.Mock).mockResolvedValue(mockUsers);

      const result = await fetchUsers();

      expect(apiRequest).toHaveBeenCalledWith('GET', expect.any(String));
      expect(result).toEqual({
        data: mockUsers,
        error: null,
      });
    });

    it('should handle fetch users error', async () => {
      const error = new Error('Failed to fetch users');
      (apiRequest as jest.Mock).mockRejectedValue(error);

      const result = await fetchUsers();

      expect(apiRequest).toHaveBeenCalledWith('GET', expect.any(String));
      expect(result).toEqual({
        data: null,
        error,
      });
    });
  });

  describe('updateUser', () => {
    const userToUpdate: UserData = {
      id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
      fullName: 'Updated Joe Bloggs',
      email: 'updatedjoe@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      earnings: '$12500',
      registered: 'May 21, 2020 17:02:06',
      lastUpdated: 'Dec 19, 2024',
    };

    it('should update a user successfully', async () => {
      (apiRequest as jest.Mock).mockResolvedValue(userToUpdate);

      const result = await updateUser(userToUpdate.id, userToUpdate);

      expect(apiRequest).toHaveBeenCalledWith(
        'PUT',
        expect.stringContaining(userToUpdate.id),
        userToUpdate
      );
      expect(result).toEqual({
        data: userToUpdate,
        error: null,
      });
    });

    it('should handle update user error', async () => {
      const error = new Error('Failed to update user');
      (apiRequest as jest.Mock).mockRejectedValue(error);

      const result = await updateUser(userToUpdate.id, userToUpdate);

      expect(apiRequest).toHaveBeenCalledWith(
        'PUT',
        expect.stringContaining(userToUpdate.id),
        userToUpdate
      );
      expect(result).toEqual({
        data: null,
        error,
      });
    });
  });

  describe('createUser', () => {
    const newUser: UserData = {
      id: 'new-user',
      fullName: 'New User',
      email: 'newuser@example.com',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      earnings: '$0',
      registered: 'Dec 19, 2024',
      lastUpdated: 'Dec 19, 2024',
    };

    it('should create a user successfully', async () => {
      (apiRequest as jest.Mock).mockResolvedValue(newUser);

      const result = await createUser(newUser);

      expect(apiRequest).toHaveBeenCalledWith('POST', expect.any(String), newUser);
      expect(result).toEqual({
        data: newUser,
        error: null,
      });
    });

    it('should handle create user error', async () => {
      const error = new Error('Failed to create user');
      (apiRequest as jest.Mock).mockRejectedValue(error);

      const result = await createUser(newUser);

      expect(apiRequest).toHaveBeenCalledWith('POST', expect.any(String), newUser);
      expect(result).toEqual({
        data: null,
        error,
      });
    });
  });
});
