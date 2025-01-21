import { useRowSelection } from '@/hooks/useRowSelection';
import { renderHook, act } from '@testing-library/react';

describe('useRowSelection', () => {
  it('should initialize with null values', () => {
    const { result } = renderHook(() => useRowSelection());

    // Assert initial state
    expect(result.current.selectedUserId).toBeNull();
    expect(result.current.sourceComponent).toBeNull();
  });

  it('should update selectedUserId and sourceComponent when handleRowSelected is called', () => {
    const { result } = renderHook(() => useRowSelection());

    // Act by calling handleRowSelected with specific values
    act(() => {
      result.current.handleRowSelected('user-123', 'table-1');
    });

    // Assert that the state has been updated
    expect(result.current.selectedUserId).toBe('user-123');
    expect(result.current.sourceComponent).toBe('table-1');
  });

  it('should update selectedUserId and sourceComponent independently', () => {
    const { result } = renderHook(() => useRowSelection());

    // Act by calling handleRowSelected with different values
    act(() => {
      result.current.handleRowSelected('user-456', 'table-2');
    });

    // Assert that the state is updated correctly
    expect(result.current.selectedUserId).toBe('user-456');
    expect(result.current.sourceComponent).toBe('table-2');

    // Call again with different values
    act(() => {
      result.current.handleRowSelected('user-789', 'table-3');
    });

    // Assert that the state is updated correctly
    expect(result.current.selectedUserId).toBe('user-789');
    expect(result.current.sourceComponent).toBe('table-3');
  });

  it('should allow selectedUserId to be null when handleRowSelected is called with null userId', () => {
    const { result } = renderHook(() => useRowSelection());

    // Act by calling handleRowSelected with null userId
    act(() => {
      result.current.handleRowSelected(null, 'table-1');
    });

    // Assert that selectedUserId is null and sourceComponent is set correctly
    expect(result.current.selectedUserId).toBeNull();
    expect(result.current.sourceComponent).toBe('table-1');
  });
});
