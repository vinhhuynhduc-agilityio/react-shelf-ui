import { render, screen } from '@testing-library/react';
import { Avatar } from '.';

describe('Avatar Component', () => {
  it('renders the avatar with default props', () => {
    render(
      <Avatar
        src='default-avatar.png'
      />
    );

    const imgElement = screen.getByRole('img', { name: /avatar/i });
    expect(imgElement).toHaveAttribute('src', 'default-avatar.png');
    expect(imgElement).toHaveAttribute('alt', 'Avatar');
    expect(imgElement).toHaveClass('w-14 h-14');
    expect(imgElement).toHaveClass('rounded-full object-cover');
  });

  it('renders the avatar with a custom alt text', () => {
    render(
      <Avatar
        src='custom-avatar.png'
        alt='Custom Alt Text'
      />
    );

    const imgElement = screen.getByRole('img', { name: /custom alt text/i });
    expect(imgElement).toHaveAttribute('src', 'custom-avatar.png');
    expect(imgElement).toHaveAttribute('alt', 'Custom Alt Text');
  });

  it('applies the correct size classes', () => {
    render(
      <Avatar
        src="sized-avatar.png"
        size="medium"
      />
    );

    const imgElement = screen.getByRole('img', { name: /avatar/i });
    expect(imgElement).toHaveClass('w-14 h-14');
  });

  it('renders correctly with all props provided', () => {
    render(
      <Avatar
        src="all-props-avatar.png"
        alt="All Props Avatar"
        size="small"
      />
    );

    const imgElement = screen.getByRole('img', { name: /all props avatar/i });
    expect(imgElement).toHaveAttribute('src', 'all-props-avatar.png');
    expect(imgElement).toHaveAttribute('alt', 'All Props Avatar');
    expect(imgElement).toHaveClass('w-8 h-8');
  });
});
