import { Footer } from '@/components';
import type { Meta, StoryObj } from '@storybook/react';

// Story metadata for the Footer component
const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Footer component with customizable background color.',
      },
    },
  },
  argTypes: {
    content: {
      description: 'The content displayed inside the footer',
      control: 'text',
    },
    backgroundColor: {
      description: 'Custom background color for the footer',
      control: 'text',
      defaultValue: 'bg-gradient-to-r from-gray-800 via-blue-900 to-gray-900', // Default background
    },
  },
};

export default meta;

type Story = StoryObj<typeof Footer>;

// Default story for the Footer component
export const CustomGradientBackground: Story = {
  args: {
    content: 'This is the footer content',
    backgroundColor: 'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600', // Custom background for this story
  },
};

// Story with default background color
export const DefaultBackground: Story = {
  args: {
    content: 'Footer with default background',
  },
};
