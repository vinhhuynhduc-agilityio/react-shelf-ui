import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import SingleSelect from ".";

const meta: Meta<typeof SingleSelect> = {
  title: "Components/SingleSelect",
  component: SingleSelect,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A single-select dropdown component that allows users to select one option from a list. It displays the selected value with a chevron icon and supports keyboard interaction. The dropdown is positioned relative to the trigger element and closes when clicking outside.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    options: {
      description: "Array of available options to select from",
      table: {
        type: { summary: "string[]" },
      },
      control: false,
    },
    value: {
      description: "Currently selected value",
      table: {
        type: { summary: "string" },
      },
      control: false,
    },
    onChange: {
      action: "changed",
      description: "Callback function triggered when selection changes",
      table: {
        type: { summary: "(value: string) => void" },
      },
    },
    className: {
      control: "text",
      description: "Additional CSS classes for custom styling",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: '""' },
      },
    },
  },
  decorators: [
    (Story, context) => {
      const customClass = context.parameters.decoratorClass || "pb-20";

      return (
        <div className={`flex justify-center ${customClass}`}>
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SingleSelect>;

// Sample options data
const statusOptions = ["New", "Work", "Test", "Done"];

const priorityOptions = ["Low", "Medium", "High", "Critical"];

const categoryOptions = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Testing",
  "Documentation",
];

const simpleOptions = ["Option 1", "Option 2", "Option 3"];

// Single-Select Demo Component
interface SingleSelectDemoProps {
  options: string[];
  defaultValue: string;
  title: string;
  customClass?: string;
}

const SingleSelectDemo = ({
  options,
  defaultValue,
  title,
  customClass = "w-[300px]",
}: SingleSelectDemoProps) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className={`flex flex-col gap-3 ${customClass}`}>
      <label className="text-sm font-medium text-gray-700">{title}</label>
      <SingleSelect
        options={options}
        value={value}
        onChange={setValue}
        className="w-full z-50"
      />
      <p className="text-xs text-gray-600">Selected: {value}</p>
    </div>
  );
};

// Basic Single-Select
export const Basic: Story = {
  render: () => (
    <SingleSelectDemo
      options={statusOptions}
      defaultValue="New"
      title="Select Status"
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Basic single-select with status options. Shows the currently selected value with a chevron icon. Click to open the dropdown and select a different option.",
      },
    },
  },
};

// Status Selection
export const StatusSelection: Story = {
  render: () => (
    <SingleSelectDemo
      options={statusOptions}
      defaultValue="New"
      title="Task Status"
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Single-select for task status management. Commonly used in project management and kanban boards. The dropdown shows all available status options.",
      },
    },
  },
};

// Priority Selection
export const PrioritySelection: Story = {
  render: () => (
    <SingleSelectDemo
      options={priorityOptions}
      defaultValue="Medium"
      title="Priority Level"
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Single-select for priority levels. Shows options from Low to Critical. Useful for task and issue prioritization.",
      },
    },
  },
};

// Category Selection
export const CategorySelection: Story = {
  render: () => (
    <SingleSelectDemo
      options={categoryOptions}
      defaultValue="Frontend"
      title="Select Category"
      customClass="w-[400px]"
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Single-select with multiple category options. Demonstrates how the dropdown handles a longer list of options with scrollability.",
      },
    },
    decoratorClass: "pb-30",
  },
};

// Simple Options
export const SimpleOptions: Story = {
  render: () => (
    <SingleSelectDemo
      options={simpleOptions}
      defaultValue="Option 1"
      title="Simple Selection"
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Single-select with simple option labels. Demonstrates basic usage with minimal options.",
      },
    },
  },
};

// All States
const AllStatesDemo = () => {
  return (
    <div className="flex flex-col gap-12">
      <div className="w-96">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Task Status
        </h3>
        <SingleSelect options={statusOptions} value="New" onChange={() => {}} />
      </div>

      <div className="w-96">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Priority Level
        </h3>
        <SingleSelect
          options={priorityOptions}
          value="Medium"
          onChange={() => {}}
        />
      </div>

      <div className="w-96">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Category</h3>
        <SingleSelect
          options={categoryOptions}
          value="Frontend"
          onChange={() => {}}
        />
      </div>

      <div className="w-96">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Selected: Done
        </h3>
        <SingleSelect
          options={statusOptions}
          value="Done"
          onChange={() => {}}
        />
      </div>
    </div>
  );
};

export const AllStates: Story = {
  render: () => <AllStatesDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Complete overview of single-select component in different scenarios: task status, priority level, category selection, and with different values selected.",
      },
    },
  },
};

// With Custom Styling
const CustomStylingDemo = () => {
  const [value, setValue] = useState("New");

  return (
    <div className="flex flex-col gap-8">
      <div className="w-80">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Default Styling
        </label>
        <SingleSelect
          options={statusOptions}
          value={value}
          onChange={setValue}
        />
      </div>

      <div className="w-full max-w-md">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          With Custom Width
        </label>
        <SingleSelect
          options={statusOptions}
          value={value}
          onChange={setValue}
          className="w-full"
        />
      </div>

      <div className="w-96">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          With Many Options
        </label>
        <SingleSelect
          options={categoryOptions}
          value="Frontend"
          onChange={() => {}}
        />
      </div>
    </div>
  );
};

export const CustomStyling: Story = {
  render: () => <CustomStylingDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Single-select component with different styling options and custom className configurations.",
      },
    },
  },
};
