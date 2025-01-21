import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Dashboard component with heading', () => {
  const { container } = render(<App />);

  const headingElement = screen.getByRole('heading', { name: 'Team Progress' });
  expect(headingElement).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});
