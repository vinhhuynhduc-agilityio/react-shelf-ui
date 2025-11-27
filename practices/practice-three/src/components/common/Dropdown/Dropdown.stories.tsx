import type { Meta, StoryObj } from "@storybook/react";
import { useState, useRef } from "react";
import Dropdown from ".";
import { DropdownOption } from "@/types";
import { fa } from "@/icons/fa";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A dropdown component that displays a list of selectable options. It uses a portal to render outside the DOM hierarchy and positions itself relative to a trigger button. Features keyboard support, click-outside detection, and responsive positioning.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    options: {
      description: "Array of dropdown options to display",
      table: {
        type: { summary: "DropdownOption[]" },
      },
      control: false,
    },
    isOpen: {
      description: "Controls whether the dropdown is visible",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    triggerRef: {
      description: "Ref to the trigger element that opens the dropdown",
      table: {
        type: { summary: "React.RefObject<HTMLElement>" },
      },
      control: false,
    },
    onSelect: {
      description: "Callback triggered when an option is selected",
      action: "selected",
      table: {
        type: { summary: "(option: DropdownOption) => void" },
      },
      control: false,
    },
    setIsOpen: {
      description: "Function to control dropdown open/close state",
      action: "toggled",
      table: {
        type: { summary: "(isOpen: boolean) => void" },
      },
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

// Mock options with FontAwesome icons
const menuOptions: DropdownOption[] = [
  { key: "edit", label: "Edit", icon: fa.faPencil },
  { key: "copy", label: "Copy", icon: fa.faCopy },
  { key: "delete", label: "Delete", icon: fa.faTrash },
  { key: "share", label: "Share", icon: fa.faShare },
];

const fileOptions: DropdownOption[] = [
  { key: "new", label: "New File", icon: fa.faFile },
  { key: "open", label: "Open File", icon: fa.faFolderOpen },
  { key: "save", label: "Save", icon: fa.faFloppyDisk },
  { key: "export", label: "Export", icon: fa.faDownload },
];

const userOptions: DropdownOption[] = [
  { key: "profile", label: "My Profile", icon: fa.faUser },
  { key: "settings", label: "Settings", icon: fa.faGear },
  { key: "notifications", label: "Notifications", icon: fa.faBell },
  { key: "logout", label: "Logout", icon: fa.faArrowRightFromBracket },
];

// Basic Dropdown Demo Component
const BasicDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    null
  );
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleSelect = (option: DropdownOption) => {
    setSelectedOption(option);
  };

  return (
    <div className="space-y-4">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
      >
        Menu ▼
      </button>

      <Dropdown
        options={menuOptions}
        isOpen={isOpen}
        triggerRef={triggerRef}
        onSelect={handleSelect}
        setIsOpen={setIsOpen}
      />

      {selectedOption && (
        <div className="p-3 bg-green-50 border border-green-300 rounded text-sm text-green-900 font-semibold">
          ✓ Selected:{" "}
          <span className="font-normal">{selectedOption.label}</span>
        </div>
      )}
    </div>
  );
};

export const Basic: Story = {
  render: () => <BasicDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Basic dropdown with menu options. Click the button to open/close the dropdown, then select an option.",
      },
    },
  },
};

// File Operations Demo Component
const FileOperationsDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    null
  );
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="space-y-4">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
      >
        File ▼
      </button>

      <Dropdown
        options={fileOptions}
        isOpen={isOpen}
        triggerRef={triggerRef}
        onSelect={(option) => setSelectedOption(option)}
        setIsOpen={setIsOpen}
      />

      {selectedOption && (
        <div className="p-3 bg-blue-50 border border-blue-300 rounded text-sm text-blue-900 font-semibold">
          ✓ Action: <span className="font-normal">{selectedOption.label}</span>
        </div>
      )}
    </div>
  );
};

export const FileOperations: Story = {
  render: () => <FileOperationsDemo />,
  parameters: {
    docs: {
      description: {
        story: "Dropdown with file operations. Common use case for file menus.",
      },
    },
  },
};

// User Menu Demo Component
const UserMenuDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    null
  );
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="space-y-4">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
      >
        User ▼
      </button>

      <Dropdown
        options={userOptions}
        isOpen={isOpen}
        triggerRef={triggerRef}
        onSelect={(option) => setSelectedOption(option)}
        setIsOpen={setIsOpen}
      />

      {selectedOption && (
        <div className="p-3 bg-purple-50 border border-purple-300 rounded text-sm text-purple-900 font-semibold">
          ✓ Selected:{" "}
          <span className="font-normal">{selectedOption.label}</span>
        </div>
      )}
    </div>
  );
};

export const UserMenu: Story = {
  render: () => <UserMenuDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Dropdown with user profile options. Typical use case for user menus in header/navbar.",
      },
    },
  },
};

// All Scenarios Demo
const AllScenariosDemo = () => {
  return (
    <div className="flex flex-col gap-12">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Menu</h3>
        <BasicDemo />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">File Operations</h3>
        <FileOperationsDemo />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">User Menu</h3>
        <UserMenuDemo />
      </div>
    </div>
  );
};

export const AllScenarios: Story = {
  render: () => <AllScenariosDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Complete overview of different dropdown scenarios: basic menu, file operations, and user profile menu.",
      },
    },
  },
};
