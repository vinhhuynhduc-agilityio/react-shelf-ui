import type { Meta, StoryObj } from "@storybook/react";
import IconButton from "./index";

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "IconButton is a small, accessible button that displays a font‑awesome icon via CSS classes (e.g. `fa-solid fa-minus`). Use `buttonStyles` and `iconStyles` to adjust sizing and color. Provide an `ariaLabel` for accessibility.",
      },
    },
  },
  argTypes: {
    icon: {
      control: "text",
      description: "Font Awesome icon class string, e.g. 'fa-solid fa-minus'.",
      table: { type: { summary: "string" }, defaultValue: { summary: "''" } },
    },
    ariaLabel: {
      control: false,
      description: "Accessible label for the button.",
      table: { type: { summary: "string" }, defaultValue: { summary: "''" } },
    },
    buttonStyles: {
      control: false,
      description: "Tailwind/CSS classes applied to the button wrapper.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "''" },
      },
    },
    iconStyles: {
      control: false,
      description: "Tailwind/CSS classes applied to the icon element.",
      table: { type: { summary: "string" }, defaultValue: { summary: "''" } },
    },
    onClick: {
      action: "clicked",
      description: "Click handler invoked when user activates the button.",
      table: {
        type: {
          summary: "(event: React.MouseEvent<HTMLButtonElement>) => void",
          detail: "Standard React click handler for button element.",
        },
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof IconButton>;

export const Minus: Story = {
  args: {
    icon: "fa-solid fa-minus",
    ariaLabel: "Minimize",
    onClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Minimize icon variant — used to minimize windows or panels.",
      },
    },
  },
};

export const Square: Story = {
  args: {
    icon: "fa-regular fa-square",
    ariaLabel: "Maximize",
    onClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "Maximize icon variant — used to expand windows to full size.",
      },
    },
  },
};

export const WindowRestore: Story = {
  args: {
    icon: "fa-regular fa-window-restore",
    ariaLabel: "Restore",
    onClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Restore icon variant — used to restore windows from maximized state.",
      },
    },
  },
};

export const Close: Story = {
  args: {
    icon: "fa-solid fa-xmark",
    ariaLabel: "Close",
    onClick: () => {},
    iconStyles: "rounded-full text-red-600",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Close icon variant — styled to indicate destructive/close action.",
      },
    },
  },
};
