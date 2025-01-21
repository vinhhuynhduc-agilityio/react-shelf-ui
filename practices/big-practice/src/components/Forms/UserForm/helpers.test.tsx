import { readFileAsBase64, emailValidation } from "./helpers";
import { render, screen } from '@testing-library/react';
import { TasksContext } from '@/context';
import { ReactNode } from 'react';
import { mockContextValue, mockUsers } from '@/mocks';

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <TasksContext.Provider value={mockContextValue}>
      {children}
    </TasksContext.Provider>
  );
};

describe('emailValidation', () => {
  it('should return true if email is a duplicate', () => {
    const TestComponent = () => {
      const { isEmailDuplicate } = emailValidation('john@example.com');
      return <div>{isEmailDuplicate('jane@example.com', mockUsers) ? 'Duplicate' : 'Unique'}</div>;
    };

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    expect(screen.getByText('Duplicate')).toBeInTheDocument();
  });

  it('should return false if email is not a duplicate', () => {
    const TestComponent = () => {
      const { isEmailDuplicate } = emailValidation('john@example.com');
      return <div>{isEmailDuplicate('john12345@example.com', mockUsers) ? 'Duplicate' : 'Unique'}</div>;
    };

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    expect(screen.getByText('Unique')).toBeInTheDocument();
  });

  it('should not flag the default email as a duplicate', () => {
    const TestComponent = () => {
      const { isEmailDuplicate } = emailValidation('john@example.com');
      return <div>{isEmailDuplicate('john@example.com', mockUsers) ? 'Duplicate' : 'Unique'}</div>;
    };

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    expect(screen.getByText('Unique')).toBeInTheDocument();
  });
});

describe('readFileAsBase64', () => {
  it('should read file as base64 string', (done) => {
    const file = new File(['Hello, World!'], 'hello.txt', { type: 'text/plain' });

    const onSuccess = (base64: string) => {
      try {
        expect(base64).toMatch(/^data:text\/plain;base64,/);
        done();
      } catch (error) {
        done(error);
      }
    };

    readFileAsBase64(file, onSuccess);
  });
});
