import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Breadcrumb from ".";
import { BreadcrumbItem } from "@/types";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A breadcrumb navigation component that displays the current location within a hierarchical structure. Allows users to navigate back to parent folders or sections. Each breadcrumb item (except the current one) is clickable for quick navigation.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    path: {
      description: "Array of breadcrumb items representing the navigation path",
      control: false,
      table: {
        type: { summary: "BreadcrumbItem[]" },
      },
    },
    currentFolderId: {
      control: false,
      description:
        "ID of the current folder/location. The last item with this ID will not be clickable",
      table: {
        type: { summary: "string" },
      },
    },
    onNavigate: {
      action: "navigated",
      description:
        "Callback function triggered when a breadcrumb item is clicked",
      table: {
        type: { summary: "(folderId: string) => void" },
      },
    },
    breadcrumbStyles: {
      control: "text",
      description:
        "Custom Tailwind/CSS classes for styling the breadcrumb container",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "''" },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-8 bg-gray-50 min-h-[200px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

// Sample data
const simplePath: BreadcrumbItem[] = [
  { id: "1", name: "Home" },
  { id: "2", name: "Documents" },
  { id: "3", name: "Projects" },
];

const deepPath: BreadcrumbItem[] = [
  { id: "1", name: "Home" },
  { id: "2", name: "Documents" },
  { id: "3", name: "Work" },
  { id: "4", name: "Projects" },
  { id: "5", name: "React" },
  { id: "6", name: "Components" },
];

const singlePath: BreadcrumbItem[] = [{ id: "1", name: "Home" }];

// Interactive Demo Component
const InteractiveDemoComponent = () => {
  const [currentId, setCurrentId] = useState("3");

  const navigationData: Record<string, BreadcrumbItem[]> = {
    "1": [{ id: "1", name: "Home" }],
    "2": [
      { id: "1", name: "Home" },
      { id: "2", name: "Documents" },
    ],
    "3": [
      { id: "1", name: "Home" },
      { id: "2", name: "Documents" },
      { id: "3", name: "Projects" },
    ],
    "4": [
      { id: "1", name: "Home" },
      { id: "2", name: "Documents" },
      { id: "3", name: "Projects" },
      { id: "4", name: "React App" },
    ],
  };

  const handleNavigate = (folderId: string) => {
    setCurrentId(folderId);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold mb-4">
          Current Location: {currentId}
        </h3>
        <Breadcrumb
          path={navigationData[currentId] || navigationData["1"]}
          currentFolderId={currentId}
          onNavigate={handleNavigate}
        />
      </div>
      <div className="text-xs text-gray-600 text-center">
        Click on any breadcrumb item to navigate
      </div>
    </div>
  );
};

// Basic Breadcrumb
export const Simple: Story = {
  args: {
    path: simplePath,
    currentFolderId: "3",
    onNavigate: (id: string) => alert(`Navigated to folder: ${id}`),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Simple breadcrumb with 3 levels. The last item (Projects) is the current location and is not clickable.",
      },
    },
  },
};

// Deep Navigation
export const DeepNavigation: Story = {
  args: {
    path: deepPath,
    currentFolderId: "6",
    onNavigate: (id: string) => alert(`Navigated to folder: ${id}`),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Breadcrumb with multiple levels showing a deep folder structure. Useful for displaying complex navigation paths.",
      },
    },
  },
};

// Single Level (Home)
export const SingleLevel: Story = {
  args: {
    path: singlePath,
    currentFolderId: "1",
    onNavigate: (id: string) => alert(`Navigated to folder: ${id}`),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Breadcrumb at root level (Home). Shows only the current location when there's no parent navigation available.",
      },
    },
  },
};

// Custom Styling
export const WithCustomStyling: Story = {
  args: {
    path: simplePath,
    currentFolderId: "3",
    breadcrumbStyles:
      "bg-white p-4 rounded-lg border border-gray-200 shadow-sm",
    onNavigate: (id: string) => alert(`Navigated to folder: ${id}`),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Breadcrumb with custom styling including background, padding, border, and shadow effects.",
      },
    },
  },
};

// Long Folder Names
export const LongFolderNames: Story = {
  args: {
    path: [
      { id: "1", name: "Home" },
      { id: "2", name: "Development Documents" },
      { id: "3", name: "Web Application Projects" },
      { id: "4", name: "React Advanced Training" },
    ],
    currentFolderId: "4",
    onNavigate: (id: string) => alert(`Navigated to folder: ${id}`),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Breadcrumb with longer folder names. The component handles text overflow gracefully with whitespace-nowrap.",
      },
    },
  },
};

// Interactive Demo
export const InteractiveDemo: Story = {
  render: () => <InteractiveDemoComponent />,
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demo showing breadcrumb navigation in action. Click on any breadcrumb item to simulate folder navigation.",
      },
    },
  },
};

// All States
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-semibold mb-3">Simple Path (3 levels)</h3>
        <Breadcrumb
          path={simplePath}
          currentFolderId="3"
          onNavigate={() => {}}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-3">Deep Path (6 levels)</h3>
        <Breadcrumb path={deepPath} currentFolderId="6" onNavigate={() => {}} />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-3">Root Level</h3>
        <Breadcrumb
          path={singlePath}
          currentFolderId="1"
          onNavigate={() => {}}
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-3">With Custom Styling</h3>
        <Breadcrumb
          path={simplePath}
          currentFolderId="3"
          breadcrumbStyles="bg-white p-4 rounded-lg border border-gray-200"
          onNavigate={() => {}}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Complete overview of breadcrumb component in different scenarios: simple paths, deep navigation, root level, and custom styling.",
      },
    },
  },
};
