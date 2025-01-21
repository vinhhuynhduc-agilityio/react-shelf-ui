import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '@/components/common';

describe('Button component', () => {
  it('matches snapshot for default state', () => {
    const { container } = render(
      <Button
        label="Click me"
        onClick={() => { }} />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders the correct label', () => {
    render(
      <Button
        label="Submit"
        onClick={() => { }} />
    );
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('renders with the correct type', () => {
    const { container } = render(
      <Button
        label="Reset"
        type="reset"
        onClick={() => { }} />
    );
    const button = container.querySelector('button');
    expect(button).toHaveAttribute('type', 'reset');
  });

  it('calls the onClick handler when clicked', () => {
    const onClickMock = jest.fn();
    render(
      <Button
        label="Click me"
        onClick={onClickMock} />
    );

    const button = screen.getByText('Click me');
    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('applies correct class for default variant', () => {
    const { container } = render(
      <Button
        label="Default"
        onClick={() => { }} />
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('rounded-md px-4 py-2 mr-7 bg-[#F4F5F9] text-[#1CA1C1] font-medium hover:bg-slate-300');
  });

  it('applies correct class for primary variant', () => {
    const { container } = render(
      <Button
        label="Primary"
        variant="primary"
        onClick={() => { }} />
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-slate-200 text-blue-600 font-bold');
  });

  it('applies correct class for secondary variant', () => {
    const { container } = render(
      <Button
        label="Secondary"
        variant="secondary"
        onClick={() => { }} />
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-slate-200 text-pink-600 font-bold');
  });

  it('does not call onClick when button is disabled', () => {
    const onClickMock = jest.fn();
    render(
      <Button
        label="Disabled"
        onClick={onClickMock}
        disabled />
    );

    const button = screen.getByText('Disabled');
    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalledTimes(0);
  });

  it('applies aria-label if provided', () => {
    render(
      <Button
        label="Accessible Button"
        ariaLabel="Submit Form"
        onClick={() => { }} />
    );
    const button = screen.getByLabelText('Submit Form');
    expect(button).toBeInTheDocument();
  });
});
