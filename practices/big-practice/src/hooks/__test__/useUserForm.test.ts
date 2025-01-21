import { renderHook } from '@testing-library/react';
import { UserData } from '@/types';
import { mockUsers } from '@/mocks';
import { useUserForm } from '@/hooks/useUserForm';

describe('useUserForm', () => {
  it('returns an object with register, handleSubmit, and errors properties', () => {
    const defaultValues: UserData = mockUsers[0];
    const { result } = renderHook(() => useUserForm(defaultValues));
    expect(result.current).toHaveProperty('register');
    expect(result.current).toHaveProperty('handleSubmit');
    expect(result.current).toHaveProperty('errors');
  });

  it('register is a function', () => {
    const defaultValues: UserData = mockUsers[0];
    const { result } = renderHook(() => useUserForm(defaultValues));
    expect(typeof result.current.register).toBe('function');
  });

  it('handleSubmit is a function', () => {
    const defaultValues: UserData = mockUsers[0];
    const { result } = renderHook(() => useUserForm(defaultValues));
    expect(typeof result.current.handleSubmit).toBe('function');
  });

  it('errors is an object', () => {
    const defaultValues: UserData = mockUsers[0];
    const { result } = renderHook(() => useUserForm(defaultValues));
    expect(typeof result.current.errors).toBe('object');
  });
});
