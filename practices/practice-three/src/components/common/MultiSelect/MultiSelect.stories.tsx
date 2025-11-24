import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import MultiSelect from ".";

const meta: Meta<typeof MultiSelect> = {
  title: "Components/MultiSelect",
  component: MultiSelect,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A multi-select dropdown component that allows users to select multiple options from a list. Selected items are displayed as tags with remove buttons. Supports filtering through a list of options and closes when clicking outside.",
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
    selected: {
      description: "Array of currently selected options",
      table: {
        type: { summary: "string[]" },
        defaultValue: { summary: "[]" },
      },
      control: false,
    },
    onChange: {
      action: "changed",
      description: "Callback function triggered when selection changes",
      table: {
        type: { summary: "(selected: string[]) => void" },
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
type Story = StoryObj<typeof MultiSelect>;

// Sample options data
const basicOptions = ["webix", "jet", "easy"];

const extendedOptions = [
  "webix",
  "jet",
  "easy",
  "react",
  "vue",
  "angular",
  "svelte",
  "typescript",
];

const tagOptions = [
  "frontend",
  "backend",
  "database",
  "devops",
  "testing",
  "documentation",
  "bug-fix",
  "feature",
];

// Multi-Select Demo Component
interface MultiSelectDemoProps {
  options: string[];
  defaultSelected?: string[];
  title: string;
  customClass?: string;
}

const MultiSelectDemo = ({
  options,
  defaultSelected = [],
  title,
  customClass = "w-[300px]",
}: MultiSelectDemoProps) => {
  const [selected, setSelected] = useState(defaultSelected);

  return (
    <div className={`flex flex-col gap-3 ${customClass}`}>
      <label className="text-sm font-medium text-gray-700">{title}</label>
      <MultiSelect
        options={options}
        selected={selected}
        onChange={setSelected}
        className="w-full z-50"
      />
      <p className="text-xs text-gray-600">
        Selected: {selected.length > 0 ? selected.join(", ") : "None"}
      </p>
    </div>
  );
};

// Basic Multi-Select
export const Basic: Story = {
  render: () => (
    <MultiSelectDemo
      options={basicOptions}
      defaultSelected={["webix"]}
      title="Select Tags"
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Basic multi-select with three options. One option is pre-selected. Click to open the dropdown and select/deselect options.",
      },
    },
  },
};

// Empty State
export const Empty: Story = {
  render: () => <MultiSelectDemo options={basicOptions} title="Select Tags" />,
  parameters: {
    docs: {
      description: {
        story:
          "Multi-select with no pre-selected options. The input field is empty and ready for selection.",
      },
    },
  },
};

// Multiple Selections
export const MultipleSelections: Story = {
  render: () => (
    <MultiSelectDemo
      options={basicOptions}
      defaultSelected={["webix", "jet", "easy"]}
      title="Select Tags"
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Multi-select with all available options selected. Shows how multiple tags are displayed and how the input expands to fit them.",
      },
    },
  },
};

// Extended Options
export const ExtendedOptions: Story = {
  render: () => (
    <MultiSelectDemo
      options={extendedOptions}
      defaultSelected={["react", "typescript"]}
      title="Select Technologies"
      customClass="w-[600px]"
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Multi-select with a longer list of options. The dropdown shows all available technologies with a scrollable list.",
      },
    },
    decoratorClass: "pb-30",
  },
};

// Tag Categories
export const TagCategories: Story = {
  render: () => (
    <MultiSelectDemo
      options={tagOptions}
      defaultSelected={["bug-fix", "feature"]}
      title="Issue Tags"
      customClass="w-[750px]"
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Multi-select with various tag categories for issue management and filtering.",
      },
    },
    decoratorClass: "pb-30",
  },
};

// Many Tags Selected
export const ManyTagsSelected: Story = {
  render: () => (
    <MultiSelectDemo
      options={extendedOptions}
      defaultSelected={["react", "vue", "angular", "svelte", "typescript"]}
      title="Select Frameworks"
      customClass="w-[750px]"
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Multi-select with many tags selected. Shows how the input field expands vertically to accommodate multiple tags while maintaining readability.",
      },
    },
    decoratorClass: "pb-30",
  },
};

// Interactive Demo
const InteractiveDemo = () => {
  const [selected, setSelected] = useState(["webix", "jet"]);

  const handleRemoveTag = (tag: string) => {
    setSelected(selected.filter((s) => s !== tag));
  };

  const handleClearAll = () => {
    setSelected([]);
  };

  return (
    <div className="flex flex-col gap-6 w-[750px]">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-3">
          Tags Management
        </label>
        <MultiSelect
          options={extendedOptions}
          selected={selected}
          onChange={setSelected}
          className="w-full"
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Selected ({selected.length})
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {selected.length > 0 ? (
            selected.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  ✕
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">No tags selected</span>
          )}
        </div>
        <button
          onClick={handleClearAll}
          disabled={selected.length === 0}
          className="w-full px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demo showing multi-select with tag management features. Display shows selected items with remove buttons and a clear all action.",
      },
    },
  },
};

// With Custom Styling
const CustomStylingDemo = () => {
  const [selected, setSelected] = useState(["webix", "jet"]);

  return (
    <div className="flex flex-col gap-8">
      <div className="w-80">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Default Styling
        </label>
        <MultiSelect
          options={basicOptions}
          selected={selected}
          onChange={setSelected}
        />
      </div>

      <div className="w-full max-w-md">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          With Custom Width
        </label>
        <MultiSelect
          options={basicOptions}
          selected={selected}
          onChange={setSelected}
          className="w-full"
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
          "Multi-select component with different styling options and custom className configurations.",
      },
    },
  },
};
