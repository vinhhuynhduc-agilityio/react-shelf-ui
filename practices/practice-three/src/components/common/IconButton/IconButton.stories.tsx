import type { Meta, StoryObj } from "@storybook/react";
import IconButton from ".";
import { fa } from "@/icons/fa";

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A small, icon-only button commonly used in tables, cards, or grid layouts. Supports both `onClick` and `onMouseDown` (required when used inside **react-grid-layout** due to event capturing issues). Uses FontAwesomeIcon for rendering SVG icons.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    icon: {
      description: "FontAwesome icon definition (e.g. fa.faPencil)",
      table: {
        type: { summary: "IconDefinition" },
      },
      control: false,
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
    iconStyles: {
      control: "text",
      description: "Custom Tailwind/CSS classes for the icon",
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
    icon: fa.faPencil,
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
    icon: fa.faTrash,
    ariaLabel: "Delete",
    iconStyles: "text-red-600 hover:text-red-700",
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
    icon: fa.faCopy,
    ariaLabel: "Copy",
    iconStyles: "text-blue-600 hover:text-blue-700",
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
    icon: fa.faX,
    ariaLabel: "Close",
    iconStyles: "text-gray-600 hover:text-gray-800",
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
    icon: fa.faPencil,
    ariaLabel: "Edit (disabled)",
    iconStyles: "text-gray-400",
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
    icon: fa.faEllipsisVertical,
    ariaLabel: "More actions",
    iconStyles: "text-gray-600",
    buttonStyles:
      "p-1 w-[26px] h-[26px] flex justify-center items-center rounded-full hover:bg-gray-200 transition-colors",
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
        icon={fa.faPencil}
        ariaLabel="Edit"
        iconStyles="text-gray-600 hover:text-blue-600"
        onClick={() => alert("Edit clicked")}
      />
      <IconButton
        icon={fa.faCopy}
        ariaLabel="Duplicate"
        iconStyles="text-gray-600 hover:text-green-600"
        onClick={() => alert("Duplicate clicked")}
      />
      <IconButton
        icon={fa.faTrash}
        ariaLabel="Delete"
        iconStyles="text-gray-600 hover:text-red-600"
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
        <IconButton icon={fa.faPencil} ariaLabel="Edit" />
        <span className="text-xs text-gray-600">Edit</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton
          icon={fa.faTrash}
          ariaLabel="Delete"
          iconStyles="text-red-600"
        />
        <span className="text-xs text-gray-600">Delete</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton
          icon={fa.faCopy}
          ariaLabel="Copy"
          iconStyles="text-blue-600"
        />
        <span className="text-xs text-gray-600">Copy</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton
          icon={fa.faX}
          ariaLabel="Close"
          iconStyles="text-gray-600"
        />
        <span className="text-xs text-gray-600">Close</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton
          icon={fa.faEllipsisVertical}
          ariaLabel="More"
          iconStyles="text-gray-600"
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
          <IconButton icon={fa.faPencil} ariaLabel="Edit" />
          <IconButton
            icon={fa.faTrash}
            ariaLabel="Delete"
            iconStyles="text-red-600"
          />
          <IconButton
            icon={fa.faCopy}
            ariaLabel="Copy"
            iconStyles="text-blue-600"
          />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-3">With Hover Background</h3>
        <div className="flex gap-3">
          <IconButton
            icon={fa.faPencil}
            ariaLabel="Edit"
            iconStyles="text-gray-600"
            buttonStyles="p-1 w-[26px] h-[26px] flex justify-center items-center rounded-full hover:bg-gray-200 transition-colors"
          />
          <IconButton
            icon={fa.faTrash}
            ariaLabel="Delete"
            iconStyles="text-red-600"
            buttonStyles="p-1 w-[26px] h-[26px] flex justify-center items-center rounded-full hover:bg-red-100 transition-colors"
          />
          <IconButton
            icon={fa.faCopy}
            ariaLabel="Copy"
            iconStyles="text-blue-600"
            buttonStyles="p-1 w-[26px] h-[26px] flex justify-center items-center rounded-full hover:bg-blue-100 transition-colors"
          />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-3">Disabled States</h3>
        <div className="flex gap-3">
          <IconButton
            icon={fa.faPencil}
            ariaLabel="Edit"
            iconStyles="text-gray-400"
            disabled
          />
          <IconButton
            icon={fa.faTrash}
            ariaLabel="Delete"
            iconStyles="text-gray-400"
            disabled
          />
          <IconButton
            icon={fa.faCopy}
            ariaLabel="Copy"
            iconStyles="text-gray-400"
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

// Size Variations
export const SizeVariations: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-semibold mb-3">Small (Default)</h3>
        <div className="flex gap-3">
          <IconButton icon={fa.faPencil} ariaLabel="Edit" />
          <IconButton icon={fa.faTrash} ariaLabel="Delete" />
          <IconButton icon={fa.faCopy} ariaLabel="Copy" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-3">Medium</h3>
        <div className="flex gap-3">
          <IconButton
            icon={fa.faPencil}
            ariaLabel="Edit"
            buttonStyles="p-2 w-[40px] h-[40px] flex justify-center items-center rounded-full"
            iconStyles="fa-lg"
          />
          <IconButton
            icon={fa.faTrash}
            ariaLabel="Delete"
            buttonStyles="p-2 w-[40px] h-[40px] flex justify-center items-center rounded-full"
            iconStyles="fa-lg"
          />
          <IconButton
            icon={fa.faCopy}
            ariaLabel="Copy"
            buttonStyles="p-2 w-[40px] h-[40px] flex justify-center items-center rounded-full"
            iconStyles="fa-lg"
          />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-3">Large</h3>
        <div className="flex gap-3">
          <IconButton
            icon={fa.faPencil}
            ariaLabel="Edit"
            buttonStyles="p-3 w-[52px] h-[52px] flex justify-center items-center rounded-full"
            iconStyles="fa-2x"
          />
          <IconButton
            icon={fa.faTrash}
            ariaLabel="Delete"
            buttonStyles="p-3 w-[52px] h-[52px] flex justify-center items-center rounded-full"
            iconStyles="fa-2x"
          />
          <IconButton
            icon={fa.faCopy}
            ariaLabel="Copy"
            buttonStyles="p-3 w-[52px] h-[52px] flex justify-center items-center rounded-full"
            iconStyles="fa-2x"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Icon button size variations: small (default), medium, and large",
      },
    },
  },
};
