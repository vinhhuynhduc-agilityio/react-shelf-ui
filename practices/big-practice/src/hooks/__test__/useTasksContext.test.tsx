import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { mockContextValue } from '@/mocks';
import { useTasksContext } from '@/hooks/useTasksContext';
import { TasksContext } from '@/context';

// Wrapper component to provide context value
const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <TasksContext.Provider value={mockContextValue}>
      {children}
    </TasksContext.Provider>
  );
};

describe('useTasksContext', () => {
  it('should throw an error if used outside of TasksContext provider', () => {
    const TestComponent = () => {
      useTasksContext();
      return null;
    };

    expect(() => render(<TestComponent />)).toThrow(
      'useTasksContext must be used within a TasksContext'
    );
  });

  it('should return the correct context value when used inside the provider', () => {
    const TestComponent = () => {
      const context = useTasksContext();
      return <div>{context.tasks[0].taskName}</div>;
    };

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    expect(screen.getByText('Build test')).toBeInTheDocument();
  });

  it('should handle a context with no tasks gracefully', () => {
    const emptyContext = { ...mockContextValue, tasks: [] };

    const WrapperWithEmptyContext = ({ children }: { children: ReactNode }) => (
      <TasksContext.Provider value={emptyContext}>{children}</TasksContext.Provider>
    );

    const TestComponent = () => {
      const context = useTasksContext();
      return <div>{context.tasks.length === 0 ? 'No tasks available' : 'Tasks found'}</div>;
    };

    render(
      <WrapperWithEmptyContext>
        <TestComponent />
      </WrapperWithEmptyContext>
    );

    expect(screen.getByText('No tasks available')).toBeInTheDocument();
  });
});
