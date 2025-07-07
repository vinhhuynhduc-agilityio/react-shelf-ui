import { apiRequest } from '../apiRequest';

describe('apiRequest', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should make a fetch call with correct method, url, and data', async () => {
    const mockJson = jest.fn().mockResolvedValue({ result: 'ok' });
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: mockJson });
    const data = { foo: 'bar' };
    await apiRequest('POST', '/api/test', data);
    expect(global.fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }));
    expect(mockJson).toHaveBeenCalled();
  });

  it('should throw error if response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
    await expect(apiRequest('GET', '/api/fail')).rejects.toThrow('Network response was not ok');
  });

  it('should work without data (GET)', async () => {
    const mockJson = jest.fn().mockResolvedValue({ foo: 'bar' });
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: mockJson });
    await apiRequest('GET', '/api/test');
    expect(global.fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }));
    expect(mockJson).toHaveBeenCalled();
  });
});
