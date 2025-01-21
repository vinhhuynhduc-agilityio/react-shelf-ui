import { render, screen } from '@testing-library/react';
import { Footer } from '.';

describe('Footer Component', () => {
  // Helper function to render the Footer component
  const renderFooter = (props = { content: 'Footer content' }) => {
    return render(<Footer {...props} />);
  };

  it('matches snapshot for default state', () => {
    const { container } = renderFooter();
    expect(container).toMatchSnapshot();
  });

  it('should render the footer element', () => {
    renderFooter(); // Render the Footer component

    // Find the footer element in the DOM
    const footerElement = screen.getByRole('contentinfo');

    // Assert that the footer element is in the document
    expect(footerElement).toBeInTheDocument();
  });

  it('should have the correct class names for background and height', () => {
    renderFooter();

    // Get the footer element
    const footerElement = screen.getByRole('contentinfo');

    // Assert that the footer has the correct class names
    expect(footerElement).toHaveClass('bg-gradient-to-r');
    expect(footerElement).toHaveClass('from-gray-800');
    expect(footerElement).toHaveClass('via-blue-900');
    expect(footerElement).toHaveClass('to-gray-900');
    expect(footerElement).toHaveClass('h-16');
  });
});
