import type { Meta, StoryObj } from "@storybook/react";
import Button from ".";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A reusable button component supporting various styles, sizes, and states. It handles disabled states, pending labels, and custom styling. Perfect for primary actions, secondary actions, and segment controls.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Button text content.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    variant: {
      control: "select",
      options: ["success", "primary", "segment"],
      description: "Visual style variant of the button.",
      table: {
        type: { summary: "success | primary | segment" },
        defaultValue: { summary: "primary" },
      },
    },
    disabled: {
      control: "boolean",
      description:
        "If true, disables the button and prevents user interaction.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    active: {
      control: "boolean",
      description:
        "Highlights the button as active. Primarily used with the segment variant.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
      description: "HTML button type attribute.",
      table: {
        type: { summary: "button | submit | reset" },
        defaultValue: { summary: "button" },
      },
    },
    onClick: {
      action: "clicked",
      description: "Callback function triggered when the button is clicked.",
      table: {
        type: { summary: "() => void" },
      },
    },
    className: {
      control: "text",
      description: "Additional CSS classes for custom styling.",
      table: {
        type: { summary: "string" },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Button>;

// Primary Variant
export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The default button style used for main actions. It has a teal background with white text and provides clear visual hierarchy.",
      },
    },
  },
};

export const PrimaryDisabled: Story = {
  args: {
    children: "Processing...",
    variant: "primary",
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled version of the primary button. The button is not clickable and displays a grayed-out appearance to indicate it's unavailable.",
      },
    },
  },
};

// Success Variant
export const Success: Story = {
  args: {
    children: "Success Button",
    variant: "success",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Alternative button style with a light blue background and teal text. Useful for secondary or success-related actions.",
      },
    },
  },
};

export const SuccessDisabled: Story = {
  args: {
    children: "Success Button",
    variant: "success",
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled version of the success button. Shows a grayed-out state to indicate the button cannot be interacted with.",
      },
    },
  },
};

// Segment Variant
export const Segment: Story = {
  args: {
    children: "Segment",
    variant: "segment",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Segment button used in toggle or tab-like interfaces. In the default state, it has a light background with dark text.",
      },
    },
  },
};

export const SegmentActive: Story = {
  args: {
    children: "Segment Active",
    variant: "segment",
    active: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Active state of the segment button. It displays with a teal background and white text to indicate it is currently selected.",
      },
    },
  },
};

export const SegmentDisabled: Story = {
  args: {
    children: "Segment",
    variant: "segment",
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled version of the segment button. It cannot be clicked and appears grayed out.",
      },
    },
  },
};

// Button Types
export const SubmitButton: Story = {
  args: {
    children: "Submit",
    type: "submit",
    variant: "primary",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Submit button type, typically used within forms to submit form data.",
      },
    },
  },
};

export const ResetButton: Story = {
  args: {
    children: "Reset",
    type: "reset",
    variant: "success",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Reset button type, typically used to clear form fields and reset form state.",
      },
    },
  },
};

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Button variant="primary">Primary</Button>
      <Button variant="success">Success</Button>
      <Button variant="segment">Segment</Button>
      <Button variant="segment" active>
        Segment Active
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Showcases all available button variants together for comparison and visual reference.",
      },
    },
  },
};

// Interactive States
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold mb-2">Primary</h3>
        <div className="flex gap-2">
          <Button variant="primary">Normal</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Success</h3>
        <div className="flex gap-2">
          <Button variant="success">Normal</Button>
          <Button variant="success" disabled>
            Disabled
          </Button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Segment</h3>
        <div className="flex gap-2">
          <Button variant="segment">Normal</Button>
          <Button variant="segment" active>
            Active
          </Button>
          <Button variant="segment" disabled>
            Disabled
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Complete overview of all button variants with their different states (normal, active, and disabled).",
      },
    },
  },
};
