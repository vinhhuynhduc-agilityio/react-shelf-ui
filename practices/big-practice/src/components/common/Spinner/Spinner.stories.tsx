import { Spinner } from '@/components/common';
import type { Meta, StoryObj } from '@storybook/react';

// Metadata cho story
const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A loading spinner component that can be customized with different border colors.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    borderColor: {
      description: 'Sets the color of the top border of the spinner. Options are `primary` (blue) and `secondary` (red).',
      control: 'text',
      defaultValue: 'primary',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Spinner>;

export const Primary: Story = {
  args: {
    borderColor: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    borderColor: 'secondary',
  },
};
