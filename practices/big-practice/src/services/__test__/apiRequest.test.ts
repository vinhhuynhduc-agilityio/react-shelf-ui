import { mockUsers } from "@/mocks";
import { apiRequest } from "@/services";

// Mocking global fetch function
global.fetch = jest.fn();

describe('apiRequest', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockReset();
  });

  it('should make a GET request and return expected data', async () => {
    const mockResponse = { users: mockUsers };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const data = await apiRequest<null, { users: typeof mockUsers }>('GET', '/users');

    expect(fetch).toHaveBeenCalledWith('/users', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    expect(data).toEqual(mockResponse);
  });

  it('should throw an error when the network response is not ok', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Error' }),
    });

    await expect(apiRequest<null, { users: typeof mockUsers }>('GET', '/users')).rejects.toThrow(
      'Network response was not ok'
    );
  });

  it('should make a POST request with data and return expected response', async () => {
    const postData = { name: 'Joe Bloggs', email: 'joe@example.com' };
    const mockResponse = { success: true, user: postData };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const data = await apiRequest<{ name: string; email: string }, { success: boolean; user: typeof postData }>(
      'POST',
      '/users',
      postData
    );

    expect(fetch).toHaveBeenCalledWith('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });

    expect(data).toEqual(mockResponse);
  });
});
