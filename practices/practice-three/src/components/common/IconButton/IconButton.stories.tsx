import type { Meta, StoryObj } from "@storybook/react";
import IconButton from ".";

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A small, icon-only button commonly used in tables, cards, or grid layouts. Supports both `onClick` and `onMouseDown` (required when used inside **react-grid-layout** due to event capturing issues). Uses Font Awesome `<i>` tags for icons.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    iconStyles: {
      control: "text",
      description:
        "Font Awesome icon classes (e.g. 'fas fa-edit', 'fas fa-trash-alt')",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "''" },
      },
    },
    ariaLabel: {
      control: "text",
      description:
        "Accessible label for screen readers and keyboard users (highly recommended)",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "''" },
      },
    },
    buttonStyles: {
      control: "text",
      description: "Custom Tailwind/CSS classes for the button container",
      table: {
        type: { summary: "string" },
        defaultValue: {
          summary:
            "'p-1 w-[26px] h-[26px] flex justify-center items-center rounded-full'",
        },
      },
    },
    disabled: {
      control: "boolean",
      description: "If true, disables the button and prevents user interaction",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    onClick: {
      action: "clicked",
      description:
        "Click event handler. Works normally outside react-grid-layout contexts",
      table: {
        type: { summary: "(e: React.MouseEvent) => void" },
      },
    },
    onMouseDown: {
      action: "mouseDown",
      description:
        "Mouse down event handler. Preferred in react-grid-layout contexts to avoid event capture issues",
      table: {
        type: { summary: "(e: React.MouseEvent) => void" },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-8 min-h-[200px] bg-gray-50">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof IconButton>;

// Basic Icons
export const Edit: Story = {
  args: {
    iconStyles: "fas fa-edit",
    ariaLabel: "Edit",
  },
  parameters: {
    docs: {
      description: {
        story: "Edit icon button — used to modify or edit content",
      },
    },
  },
};

export const Delete: Story = {
  args: {
    iconStyles: "fas fa-trash-alt text-red-600 hover:text-red-700",
    ariaLabel: "Delete",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Delete icon button with red color — signals a destructive action like removing items",
      },
    },
  },
};

export const Copy: Story = {
  args: {
    iconStyles: "fas fa-copy text-blue-600 hover:text-blue-700",
    ariaLabel: "Copy",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Copy icon button with blue color — used to duplicate or copy content",
      },
    },
  },
};

export const Close: Story = {
  args: {
    iconStyles: "fas fa-times text-gray-600 hover:text-gray-800",
    ariaLabel: "Close",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Close icon button — used to dismiss dialogs, panels, or notifications",
      },
    },
  },
};

// Disabled State
export const Disabled: Story = {
  args: {
    iconStyles: "fas fa-edit text-gray-400",
    ariaLabel: "Edit (disabled)",
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled state of the icon button. The button is not clickable and shows visual indication of being unavailable",
      },
    },
  },
};

// Custom Styling
export const WithHoverBackground: Story = {
  args: {
    iconStyles: "fas fa-ellipsis-v text-gray-600",
    buttonStyles:
      "p-1 w-[26px] h-[26px] flex justify-center items-center rounded-full hover:bg-gray-200 transition-colors",
    ariaLabel: "More actions",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Icon button with custom hover background effect — provides visual feedback when user hovers over the button",
      },
    },
  },
};

// Table Actions Pattern
export const TableActions: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <IconButton
        iconStyles="fas fa-edit text-gray-600 hover:text-blue-600"
        ariaLabel="Edit"
        onClick={() => alert("Edit clicked")}
      />
      <IconButton
        iconStyles="fas fa-copy text-gray-600 hover:text-green-600"
        ariaLabel="Duplicate"
        onClick={() => alert("Duplicate clicked")}
      />
      <IconButton
        iconStyles="fas fa-trash-alt text-gray-600 hover:text-red-600"
        ariaLabel="Delete"
        onMouseDown={() => alert("Delete (mouse down)")}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Common pattern: group of icon buttons used in table rows or cards for row-level actions",
      },
    },
  },
};

// All Common Actions Showcase
export const AllCommonActions: Story = {
  render: () => (
    <div className="flex gap-6 flex-wrap">
      <div className="flex flex-col items-center gap-2">
        <IconButton iconStyles="fas fa-edit" ariaLabel="Edit" />
        <span className="text-xs text-gray-600">Edit</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton
          iconStyles="fas fa-trash-alt text-red-600"
          ariaLabel="Delete"
        />
        <span className="text-xs text-gray-600">Delete</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton iconStyles="fas fa-copy text-blue-600" ariaLabel="Copy" />
        <span className="text-xs text-gray-600">Copy</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton iconStyles="fas fa-times text-gray-600" ariaLabel="Close" />
        <span className="text-xs text-gray-600">Close</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton
          iconStyles="fas fa-ellipsis-v text-gray-600"
          ariaLabel="More"
        />
        <span className="text-xs text-gray-600">More</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Showcase of all common icon button actions together for visual reference",
      },
    },
  },
};

// Interactive Demo - All States
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-semibold mb-3">Normal States</h3>
        <div className="flex gap-3">
          <IconButton iconStyles="fas fa-edit" ariaLabel="Edit" />
          <IconButton
            iconStyles="fas fa-trash-alt text-red-600"
            ariaLabel="Delete"
          />
          <IconButton iconStyles="fas fa-copy text-blue-600" ariaLabel="Copy" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-3">With Hover Background</h3>
        <div className="flex gap-3">
          <IconButton
            iconStyles="fas fa-edit text-gray-600"
            buttonStyles="p-1 w-[26px] h-[26px] flex justify-center items-center rounded-full hover:bg-gray-200 transition-colors"
            ariaLabel="Edit"
          />
          <IconButton
            iconStyles="fas fa-trash-alt text-red-600"
            buttonStyles="p-1 w-[26px] h-[26px] flex justify-center items-center rounded-full hover:bg-red-100 transition-colors"
            ariaLabel="Delete"
          />
          <IconButton
            iconStyles="fas fa-copy text-blue-600"
            buttonStyles="p-1 w-[26px] h-[26px] flex justify-center items-center rounded-full hover:bg-blue-100 transition-colors"
            ariaLabel="Copy"
          />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-3">Disabled States</h3>
        <div className="flex gap-3">
          <IconButton
            iconStyles="fas fa-edit text-gray-400"
            ariaLabel="Edit"
            disabled
          />
          <IconButton
            iconStyles="fas fa-trash-alt text-gray-400"
            ariaLabel="Delete"
            disabled
          />
          <IconButton
            iconStyles="fas fa-copy text-gray-400"
            ariaLabel="Copy"
            disabled
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Complete overview of all icon button states: normal, hover effects, and disabled",
      },
    },
  },
};
