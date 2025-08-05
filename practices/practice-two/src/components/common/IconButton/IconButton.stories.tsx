import { IconButton } from "@/components";
import {
  ReviewIcon,
  FilterDropdownIcon,
  ArrowBackIcon,
} from "@/components/icons";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  argTypes: {
    icon: {
      description:
        "React component used as the icon. Must be a valid ElementType.",
      control: false,
    },
    classNameIcon: {
      control: "text",
      description: "Custom class name for the icon element.",
    },
    filled: {
      control: "boolean",
      description: "Whether the icon should be filled (if supported).",
    },
    label: {
      control: "text",
      description: "Text label displayed beside or below the icon.",
    },
    iconPosition: {
      control: "radio",
      options: ["left", "right"],
      description: "Position of the icon when layout direction is `row`.",
      table: {
        type: { summary: '"left" | "right"' },
      },
    },
    direction: {
      control: "radio",
      options: ["row", "column"],
      description: "Layout direction of icon and label.",
      table: {
        type: { summary: '"row" | "column"' },
      },
    },
    ariaLabel: {
      control: "text",
      description: "ARIA label for screen readers.",
    },
    onClick: {
      action: "clicked",
      table: {
        type: {
          summary: "(event: React.MouseEvent<HTMLButtonElement>) => void",
          detail: "Standard React click handler for button element.",
        },
      },
      description: "Triggered when the button is clicked.",
    },
    disabled: {
      control: "boolean",
      description: "Disable the button.",
    },
    additionalClasses: {
      control: "text",
      description: "Custom class name for the button container.",
    },
    dataTestId: {
      control: "text",
      description: "Value for `data-testid` attribute (used in testing).",
    },
    type: {
      description: "Specifies the native HTML button type attribute.",
      table: {
        type: { summary: '"button" | "submit"' },
      },
      control: false,
    },
  },
  args: {
    filled: false,
    disabled: false,
    iconPosition: "left",
    direction: "row",
    ariaLabel: "icon button",
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center min-h-[100px]">
        {Story()}
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "A flexible icon button component that supports different icon positions, layout directions, and states.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const ReviewIconVertical: Story = {
  args: {
    icon: ReviewIcon,
    label: "Review",
    direction: "column",
  },
};

export const FilterIconRight: Story = {
  args: {
    icon: FilterDropdownIcon,
    label: "Filter",
    iconPosition: "right",
    classNameIcon: "ml-2",
  },
};

export const BackIconLeft: Story = {
  args: {
    icon: ArrowBackIcon,
    label: "Back",
    iconPosition: "left",
    classNameIcon: "mr-2",
  },
};

export const DisabledIcon: Story = {
  args: {
    icon: ReviewIcon,
    label: "Review",
    direction: "column",
    disabled: true,
  },
};
