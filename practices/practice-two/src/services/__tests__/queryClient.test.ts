import { queryClient } from '../queryClient';
import { QueryClient } from '@tanstack/react-query';

describe('queryClient', () => {
  it('should be an instance of QueryClient', () => {
    expect(queryClient).toBeInstanceOf(QueryClient);
  });

  it('should have correct defaultOptions', () => {
    expect(queryClient.getDefaultOptions().queries?.staleTime).toBe(1000 * 60);
  });
});
