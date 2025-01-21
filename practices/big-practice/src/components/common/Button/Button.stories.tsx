import { Button } from '@/components/common/Button';
import type { Meta, StoryObj } from '@storybook/react';

// Metadata for story
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile button component that can be used for various actions. Supports accessibility via ARIA labels.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      description: 'The text displayed inside the button.',
      control: 'text',
    },
    onClick: {
      description: 'Optional click handler for the button.',
      action: 'clicked',
    },
    type: {
      description: 'The type of the button (`button`, `submit`, `reset`).',
      control: {
        type: 'select',
        options: ['button', 'submit', 'reset'],
      },
    },
    variant: {
      description: 'The styling variant of the button (`primary`, `secondary`, `default`).',
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'default'],
      },
    },
    disabled: {
      description: 'Whether the button is disabled.',
      control: 'boolean',
    },
    ariaLabel: {
      description: 'ARIA label for accessibility purposes.',
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

// Specific stories
export const Default: Story = {
  args: {
    label: 'Default Button',
    variant: 'default',
    disabled: false,
  },
};

export const Primary: Story = {
  args: {
    label: 'Primary Button',
    variant: 'primary',
    disabled: false,
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Button',
    variant: 'secondary',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
    variant: 'default',
    disabled: true,
  },
};

export const WithAriaLabel: Story = {
  args: {
    label: 'Button with Aria Label',
    variant: 'primary',
    ariaLabel: 'This is an aria-label for the button.',
    disabled: false,
  },
};
