import { render } from '@testing-library/react';
import { Spinner } from '.';

describe('Spinner Component', () => {
  it('should match the snapshot', () => {
    const { container } = render(<Spinner />);
    expect(container).toMatchSnapshot();
  });

  it('should render without crashing', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should render the spinner correctly', () => {
    const { container } = render(<Spinner />);

    // Check if the spinner div is rendered
    const spinnerDiv = container.querySelector('div');
    expect(spinnerDiv).toBeInTheDocument();

    // Check if the spinner div has the correct classes
    expect(spinnerDiv).toHaveClass(
      'flex items-center justify-center w-full h-full'
    );

    // Check for the inner spinning element
    const spinnerInner = container.querySelector(
      '.w-12.h-12.border-4.border-gray-300.border-t-blue-500.rounded-full.animate-spin'
    );
    expect(spinnerInner).toBeInTheDocument();
  });
});
