import { CheckMark } from '@/components';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CheckMark> = {
  title: 'Components/CheckMark',
  component: CheckMark,
  parameters: {
    layout: 'centered', // Center the component in the preview area
    docs: {
      description: {
        component:
          'CheckMark component shows either a check or a clock icon based on the boolean value passed as `value`. It updates the displayed icon when the `value` changes. Supports disabling click interactions with `isDisabled`.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      description: 'Boolean value to determine which icon to display. `true` shows a check icon, `false` shows a clock icon.',
      control: 'boolean',
    },
    onStatusValueChange: {
      description: 'Callback function to handle status value changes when the icon is clicked.',
      action: 'clicked',
    },
    isDisabled: {
      description: 'Disables the click interactions and applies disabled styles when set to true.',
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CheckMark>;

// Story for complete status (check icon)
export const Complete: Story = {
  args: {
    value: true,
    isDisabled: false,
  },
};

// Story for incomplete status (clock icon)
export const Incomplete: Story = {
  args: {
    value: false,
    isDisabled: false,
  },
};

// Story for disabled state with complete status (check icon)
export const DisabledComplete: Story = {
  args: {
    value: true,
    isDisabled: true,
  },
};

// Story for disabled state with incomplete status (clock icon)
export const DisabledIncomplete: Story = {
  args: {
    value: false,
    isDisabled: true,
  },
};
