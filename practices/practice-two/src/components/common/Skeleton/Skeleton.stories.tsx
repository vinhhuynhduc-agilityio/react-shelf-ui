import type { Meta, StoryObj } from "@storybook/react";
import Skeleton from "./index";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    width: {
      control: "number",
      description:
        "The width of the skeleton in pixels or string (e.g. '100%').",
    },
    height: {
      control: "number",
      description: "The height of the skeleton.",
    },
    borderRadius: {
      control: "number",
      description: "Border radius of the skeleton shape.",
    },
    variant: {
      control: "radio",
      options: ["block", "inline-block"],
      description: "Display variant of the skeleton (block or inline-block).",
      table: {
        type: { summary: '"block" | "inline-block"' },
      },
    },
    additionalClasses: {
      control: "text",
      description: "Additional Tailwind or custom classes.",
      table: {
        type: { summary: "string" },
      },
    },
    dataTestId: {
      control: "text",
      description: "Test ID for testing purposes.",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "A flexible loading skeleton component used to indicate loading UI blocks with shimmer animation.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const BlockSkeleton: Story = {
  name: "Block Skeleton",
  args: {
    width: 100,
    height: 20,
    borderRadius: 4,
    variant: "block",
    dataTestId: "skeleton",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Basic block-level skeleton, typically used for list items or larger UI elements.",
      },
    },
  },
};

export const InlineSkeleton: Story = {
  name: "Inline Skeleton",
  args: {
    width: 80,
    height: 18,
    borderRadius: 4,
    variant: "inline-block",
    dataTestId: "skeleton-inline",
  },
  parameters: {
    docs: {
      description: {
        story:
          "An inline-block skeleton useful for inline content like buttons or small text placeholders.",
      },
    },
  },
};

export const CustomClassSkeleton: Story = {
  name: "Skeleton with Custom Class",
  args: {
    width: 120,
    height: 40,
    borderRadius: 8,
    additionalClasses: "bg-blue-200",
    dataTestId: "skeleton-custom",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Skeleton with custom background using Tailwind utility classes.",
      },
    },
  },
};
