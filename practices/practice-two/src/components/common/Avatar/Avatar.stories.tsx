import type { Meta, StoryObj } from "@storybook/react";
import Avatar from ".";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Displays a user avatar with optional size and image source. Falls back to a default avatar if none is provided.",
      },
    },
  },
  argTypes: {
    src: {
      description:
        "The image URL for the avatar. Defaults to a fallback avatar if not provided.",
      control: false,
      table: {
        type: { summary: "string" },
      },
    },
    alt: {
      description: "Alternative text for the image.",
      control: false,
      table: {
        type: { summary: "string" },
      },
    },
    size: {
      description: "Controls the avatar size.",
      control: { type: "select" },
      options: ["small", "medium", "large"],
      table: {
        type: { summary: '"small" | "medium" | "large"' },
      },
    },
    additionalClasses: {
      description: "Optional additional CSS classes for the avatar container.",
      control: false,
      table: {
        type: { summary: "string" },
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {Story()}
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const BasicAvatar: Story = {
  args: {},
};

export const Small: Story = {
  args: { size: "small" },
};

export const Large: Story = {
  args: { size: "large" },
};

export const WithCustomImage: Story = {
  args: {
    src: "https://randomuser.me/api/portraits/men/32.jpg",
    alt: "Custom User",
    size: "medium",
  },
};
