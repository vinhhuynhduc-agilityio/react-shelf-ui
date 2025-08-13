import type { Meta, StoryObj } from "@storybook/react";
import Badge from ".";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A badge indicating the status of a book, such as whether it's in the shelf or not. Useful for showing quick status indicators in book cards or lists.",
      },
    },
  },
  argTypes: {
    label: {
      control: { type: "text" },
      description: "Text displayed inside the badge.",
      table: {
        type: { summary: "string" },
      },
    },
    className: {
      control: false,
      description: "Custom class for styling the badge.",
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

type Story = StoryObj<typeof Badge>;

export const StatusInShelf: Story = {
  args: {
    label: "In-Shelf",
    className: "bg-green-100 text-green-700",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Displays the badge with green background, indicating the book is already in the shelf.",
      },
    },
  },
};

export const StatusNone: Story = {
  args: {
    label: "None",
    className: "bg-gray-100 text-gray-700",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Displays the badge with gray background, indicating the book is not yet in the shelf.",
      },
    },
  },
};
