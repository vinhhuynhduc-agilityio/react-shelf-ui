import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundary } from '@/components';

beforeAll(() => {
  console.error = jest.fn();
});

describe('ErrorBoundary', () => {
  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Test Child</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should display fallback UI when an error occurs', () => {
    const ProblemComponent = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ProblemComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong in this card.')).toBeInTheDocument();
  });

  it('should call componentDidCatch and log the error', () => {
    const ProblemComponent = () => {
      throw new Error('Test error');
    };

    const spyError = jest.spyOn(console, 'error').mockImplementation(() => { });

    render(
      <ErrorBoundary>
        <ProblemComponent />
      </ErrorBoundary>
    );

    // Check if console.error was called
    expect(spyError).toHaveBeenCalledWith('Error caught in ErrorBoundary:', expect.any(Error), expect.any(Object));

    spyError.mockRestore();
  });
});
