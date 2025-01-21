import { Avatar } from '@/components';
import type { Meta, StoryObj } from '@storybook/react';

// Metadata for story
const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A circular image component used to display a user\'s profile picture or an image in a visually distinct and accessible manner.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      description: 'The source URL for the image displayed in the avatar.',
      control: 'text',
    },
    alt: {
      description: 'Alternative text for the image, useful for screen readers.',
      control: 'text',
    },
    size: {
      description: 'CSS classes defining the size of the avatar, e.g., `w-10 h-10`.',
      control: 'text',
    },
    ariaLabel: {
      description: 'ARIA label for accessibility purposes.',
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

// Specific stories
export const Default: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=2',
    alt: 'Default Avatar',
    size: 'w-10 h-10',
    ariaLabel: '',
  },
};

export const Large: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=2',
    alt: 'Large Avatar',
    size: 'w-20 h-20',
    ariaLabel: '',
  },
};
