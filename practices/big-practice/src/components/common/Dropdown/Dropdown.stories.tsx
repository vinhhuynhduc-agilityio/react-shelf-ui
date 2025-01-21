import { Dropdown } from '@/components/common';
import type { Meta, StoryObj } from '@storybook/react';

// Metadata for story
const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A dropdown component that allows users to select an option from a list.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story: React.FC) => (
      <div
        style={{
          position: 'relative',
          width: '210px',
          height: '140px',
        }}
      >
        <Story />
      </div>
    )
  ],
  argTypes: {
    options: {
      description: 'The list of options to display in the dropdown',
      control: 'object',
    },
    placeholder: {
      description: 'Placeholder text displayed when no option is selected',
      control: 'text',
    },
    onSelect: {
      description: 'Callback function triggered when a user selects an option',
      action: 'selected',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

// Specific stories
export const Default: Story = {
  args: {
    options: [
      { id: '1', value: 'Option 1' },
      { id: '2', value: 'Option 2' },
      { id: '3', value: 'Option 3' },
    ],
    placeholder: 'Select an option...',
  },
};

export const WithNoOptions: Story = {
  args: {
    options: [],
    placeholder: 'No options available',
  },
};

export const WithCustomPlaceholder: Story = {
  args: {
    options: [
      { id: '1', value: 'Custom Option 1' },
      { id: '2', value: 'Custom Option 2' },
    ],
    placeholder: 'Choose your favorite option...',
  },
};
