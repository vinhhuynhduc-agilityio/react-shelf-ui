import type { Meta, StoryObj } from "@storybook/react";
import React, { useState, useRef } from "react";
import ContextMenu from ".";
import { ContextMenuOption } from "@/types";
import { fa } from "@/icons/fa";

const meta: Meta<typeof ContextMenu> = {
  title: "Components/ContextMenu",
  component: ContextMenu,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A context menu component that displays a list of options at a specific position (x, y). It supports icons, danger actions (red color), and automatically closes when clicking outside. Uses React Portal to render the menu at the document body level.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    visible: {
      control: "boolean",
      description: "Controls the visibility of the context menu",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    x: {
      control: "number",
      description:
        "Horizontal position (left) in pixels - viewport coordinates",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "0" },
      },
    },
    y: {
      control: "number",
      description: "Vertical position (top) in pixels - viewport coordinates",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "0" },
      },
    },
    options: {
      description:
        "Array of context menu options with labels, icons, and actions",
      table: {
        type: { summary: "ContextMenuOption[]" },
      },
      control: false,
    },
    onClose: {
      action: "closed",
      description:
        "Callback function triggered when the menu should close (click outside or item selection)",
      table: {
        type: { summary: "() => void" },
      },
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

// Sample context menu options
const basicOptions: ContextMenuOption[] = [
  {
    label: "Edit",
    icon: fa.faPencil,
    onClick: () => alert("Edit clicked"),
  },
  {
    label: "Copy",
    icon: fa.faCopy,
    onClick: () => alert("Copy clicked"),
  },
  {
    label: "Delete",
    icon: fa.faTrash,
    onClick: () => alert("Delete clicked"),
    danger: true,
  },
];

const fileOptions: ContextMenuOption[] = [
  {
    label: "Open",
    icon: fa.faFolderOpen,
    onClick: () => alert("Open clicked"),
  },
  {
    label: "Rename",
    icon: fa.faPencil,
    onClick: () => alert("Rename clicked"),
  },
  {
    label: "Download",
    icon: fa.faDownload,
    onClick: () => alert("Download clicked"),
  },
  {
    label: "Delete",
    icon: fa.faTrash,
    onClick: () => alert("Delete clicked"),
    danger: true,
  },
];

const shareOptions: ContextMenuOption[] = [
  {
    label: "Share",
    icon: fa.faShare,
    onClick: () => alert("Share clicked"),
  },
  {
    label: "Make Public",
    icon: fa.faGlobe,
    onClick: () => alert("Make Public clicked"),
  },
  {
    label: "View Permissions",
    icon: fa.faLock,
    onClick: () => alert("View Permissions clicked"),
  },
];

// Context Menu Demo Component
interface ContextMenuDemoProps {
  options: ContextMenuOption[];
  title: string;
}

const ContextMenuDemo = ({ options, title }: ContextMenuDemoProps) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    // Use clientX, clientY for fixed positioning (viewport coordinates)
    setPosition({
      x: e.clientX,
      y: e.clientY,
    });
    setVisible(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-600">{title}</p>
      <div
        ref={containerRef}
        onContextMenu={handleContextMenu}
        style={{ position: "relative", height: 120 }}
        className="w-80 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-context-menu"
      >
        <p className="text-center text-gray-600 text-sm">Right-click here</p>
        <ContextMenu
          visible={visible}
          x={position.x}
          y={position.y}
          options={options}
          onClose={() => setVisible(false)}
        />
      </div>
    </div>
  );
};

// Basic Context Menu
export const Basic: Story = {
  render: () => (
    <ContextMenuDemo options={basicOptions} title="Basic Options" />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Basic context menu with edit, copy, and delete options. Delete option is marked as danger with red color.",
      },
    },
  },
};

// File Operations
export const FileOperations: Story = {
  render: () => (
    <ContextMenuDemo options={fileOptions} title="File Operations" />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Context menu for file operations including open, rename, download, and delete actions.",
      },
    },
  },
};

// Share Options
export const ShareOptions: Story = {
  render: () => (
    <ContextMenuDemo options={shareOptions} title="Share Options" />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Context menu for sharing operations with permissions management options.",
      },
    },
  },
};

// Hidden State
const HiddenStateDemo = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-600">Hidden State</p>
      <div
        style={{ position: "relative", height: 120 }}
        className="w-80 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center bg-gray-50"
      >
        <p className="text-center text-gray-600 text-sm">
          Context menu is hidden
        </p>
        <ContextMenu
          visible={visible}
          x={0}
          y={0}
          options={basicOptions}
          onClose={() => setVisible(false)}
        />
      </div>
    </div>
  );
};

export const Hidden: Story = {
  render: () => <HiddenStateDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Context menu in hidden state. Set visible to false to hide the menu.",
      },
    },
  },
};

// Single Option
const SingleOptionDemo = () => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({
      x: e.clientX,
      y: e.clientY,
    });
    setVisible(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-600">Single Action</p>
      <div
        onContextMenu={handleContextMenu}
        style={{ position: "relative", height: 120 }}
        className="w-80 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-context-menu"
      >
        <p className="text-center text-gray-600 text-sm">Right-click here</p>
        <ContextMenu
          visible={visible}
          x={position.x}
          y={position.y}
          options={[
            {
              label: "Delete",
              icon: fa.faTrash,
              onClick: () => alert("Delete clicked"),
              danger: true,
            },
          ]}
          onClose={() => setVisible(false)}
        />
      </div>
    </div>
  );
};

export const SingleOption: Story = {
  render: () => <SingleOptionDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Context menu with a single option. Useful for simple, focused actions.",
      },
    },
  },
};

// Many Options
const ManyOptionsDemo = () => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({
      x: e.clientX,
      y: e.clientY,
    });
    setVisible(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-600">Many Options</p>
      <div
        onContextMenu={handleContextMenu}
        style={{ position: "relative", height: 120 }}
        className="w-80 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-context-menu"
      >
        <p className="text-center text-gray-600 text-sm">Right-click here</p>
        <ContextMenu
          visible={visible}
          x={position.x}
          y={position.y}
          options={[
            {
              label: "Open",
              icon: fa.faFolderOpen,
              onClick: () => alert("Open"),
            },
            {
              label: "Edit",
              icon: fa.faPencil,
              onClick: () => alert("Edit"),
            },
            {
              label: "Copy",
              icon: fa.faCopy,
              onClick: () => alert("Copy"),
            },
            {
              label: "Paste",
              icon: fa.faPaste,
              onClick: () => alert("Paste"),
            },
            {
              label: "Cut",
              icon: fa.faCut,
              onClick: () => alert("Cut"),
            },
            {
              label: "Duplicate",
              icon: fa.faClone,
              onClick: () => alert("Duplicate"),
            },
            {
              label: "Download",
              icon: fa.faDownload,
              onClick: () => alert("Download"),
            },
            {
              label: "Share",
              icon: fa.faShare,
              onClick: () => alert("Share"),
            },
            {
              label: "Delete",
              icon: fa.faTrash,
              onClick: () => alert("Delete"),
              danger: true,
            },
          ]}
          onClose={() => setVisible(false)}
        />
      </div>
    </div>
  );
};

export const ManyOptions: Story = {
  render: () => <ManyOptionsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Context menu with many options. Shows how the menu displays with multiple items.",
      },
    },
  },
};

// All Scenarios
const AllScenariosDemo = () => {
  return (
    <div className="flex flex-col gap-12">
      <ContextMenuDemo options={basicOptions} title="Basic Options" />
      <ContextMenuDemo options={fileOptions} title="File Operations" />
      <ContextMenuDemo options={shareOptions} title="Share Options" />
    </div>
  );
};

export const AllScenarios: Story = {
  render: () => <AllScenariosDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Complete overview of different context menu scenarios: basic options, file operations, and sharing.",
      },
    },
  },
};
