import type { Meta, StoryObj } from "@storybook/react";
import ErrorAlert from "./index";

const meta: Meta<typeof ErrorAlert> = {
  title: "Components/ErrorAlert",
  component: ErrorAlert,
  parameters: {
    docs: {
      description: {
        component: `Displays API error messages with an icon. Filters out invalid entries and renders nothing if there are no errors.`,
      },
    },
  },
  argTypes: {
    title: {
      description: "Optional main error title shown above the error list.",
      control: { type: "text" },
    },
    errors: {
      description:
        "An array of error messages. Null or undefined values will be ignored.",
      control: false,
    },
    additionalClasses: {
      description: "Optional additional CSS class for the outer container.",
      control: false,
      table: {
        type: { summary: "string" },
      },
    },
    centerScreen: {
      description:
        "If true, centers the component both vertically and horizontally within a minimum height of 300px.",
      control: { type: "boolean" },
      table: {
        type: { summary: "boolean" },
      },
    },
  },
  args: {
    errors: ["Something went wrong!", "Network error"],
    title: "Error",
    centerScreen: false,
  },
};

export default meta;

type Story = StoryObj<typeof ErrorAlert>;

export const BasicUsage: Story = {
  name: "Basic usage",
};

export const WithCustomTitle: Story = {
  name: "With title",
  args: {
    title: "API Error",
    errors: ["Failed to fetch data"],
  },
};

export const CenteredErrorNotice: Story = {
  name: "Centered notice",
  args: {
    centerScreen: true,
    errors: ["Critical error occurred"],
  },
};
