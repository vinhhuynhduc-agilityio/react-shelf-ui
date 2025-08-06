import type { Meta, StoryObj } from "@storybook/react";
import Dropdown from ".";
import { useRef, useState } from "react";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
  parameters: {
    docs: {
      description: {
        component:
          "`Dropdown` is a pop-up menu component used to display a list of selectable options. It is positioned relative to a trigger element (like a button), and can be aligned to the left or right.",
      },
    },
  },
  argTypes: {
    options: {
      description: "Array of options to be displayed in the dropdown",
      control: false,
    },
    isOpen: {
      description: "Boolean flag to control dropdown visibility",
      control: false,
      table: {
        type: { summary: "boolean" },
      },
    },
    setIsOpen: {
      description: "Function to update the `isOpen` state",
      control: false,
      table: {
        type: {
          summary: "(open: boolean) => void",
          detail: "Used to toggle dropdown visibility.",
        },
      },
    },
    triggerRef: {
      description:
        "Ref to the element that triggers the dropdown. Used to calculate dropdown position.",
      control: false,
    },
    align: {
      description: "Dropdown alignment relative to trigger (`left` or `right`)",
      control: { type: "radio" },
      options: ["left", "right"],
      table: {
        type: { summary: '"left" | "right"' },
      },
    },
    onSelect: {
      description: "Callback function called when an option is selected",
      action: "selected",
      table: {
        type: {
          summary: "(option: DropdownOption) => void",
          detail: "Called with the selected option when an option is clicked.",
        },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-8">{Story()}</div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Dropdown>;

const options = [
  { key: "1", label: "Option 1" },
  { key: "2", label: "Option 2" },
  { key: "3", label: "Option 3" },
];

import type { DropdownOption } from "@/types";

interface DropdownDemoProps {
  align?: "left" | "right";
  onSelect?: (option: DropdownOption) => void;
}

const DropdownDemo = (props: DropdownDemoProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (!isOpen) {
      requestAnimationFrame(() => setIsOpen(true));
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div style={{ position: "relative", height: 120 }}>
      <button
        ref={triggerRef}
        onClick={handleToggle}
        className="mb-2 px-5 py-2 border border-gray-300 rounded-md bg-blue-600 text-white font-medium shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2"
      >
        Toggle Dropdown
      </button>
      <Dropdown
        options={options}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        triggerRef={triggerRef}
        align={props.align}
        onSelect={props.onSelect || (() => {})}
      />
    </div>
  );
};

export const BasicDropdown: Story = {
  render: () => <DropdownDemo />,
  parameters: {
    docs: {
      source: {
        code: `<Dropdown
  options={[
    { key: "1", label: "Option 1" },
    { key: "2", label: "Option 2" },
    { key: "3", label: "Option 3" }
  ]}
  isOpen={true}
  setIsOpen={setIsOpen}
  triggerRef={triggerRef}
  align="left"
  onSelect={(option) => handleSelect(option)}
/>`,
      },
    },
  },
};

export const DropdownRightAlignedToButton: Story = {
  render: () => <DropdownDemo align="right" />,
  parameters: {
    docs: {
      source: {
        code: `<Dropdown
  options={[
    { key: "1", label: "Option 1" },
    { key: "2", label: "Option 2" },
    { key: "3", label: "Option 3" }
  ]}
  isOpen={true}
  setIsOpen={setIsOpen}
  triggerRef={triggerRef}
  align="right"
  onSelect={(option) => handleSelect(option)}
/>`,
      },
    },
  },
};
