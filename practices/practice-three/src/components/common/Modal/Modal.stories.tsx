import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Modal from ".";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A modal dialog component that displays content in a centered overlay. Features customizable title alignment, header height, close button control, and responsive width. Built with React Portal for proper layering.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      description: "Controls whether the modal is visible",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    title: {
      description: "Title text displayed in the modal header",
      control: "text",
      table: {
        type: { summary: "string" },
      },
    },
    titleAlign: {
      description: "Alignment of the title text",
      control: { type: "select" },
      options: ["left", "center", "right"],
      table: {
        type: { summary: '"left" | "center" | "right"' },
        defaultValue: { summary: "left" },
      },
    },
    onClose: {
      description: "Callback function triggered when close button is clicked",
      action: "closed",
      table: {
        type: { summary: "() => void" },
      },
    },
    children: {
      description: "Content to display inside the modal body",
      table: {
        type: { summary: "ReactNode" },
      },
      control: false,
    },
    className: {
      description: "Custom CSS classes for the modal container",
      control: "text",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "w-[364px]" },
      },
    },
    headerHeight: {
      description: "Height of the modal header in pixels",
      control: { type: "number" },
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "38" },
      },
    },
    hideCloseButton: {
      description: "Hides the close button and shows blue bottom border",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// ============================================
// Basic Modal Demo Component
// ============================================
const BasicDemo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full space-y-4">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
      >
        Open Modal
      </button>

      <Modal
        isOpen={isOpen}
        title="Basic Modal"
        onClose={() => setIsOpen(false)}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            This is a basic modal dialog with a title and close button.
          </p>
          <p className="text-sm text-gray-700">
            Click the X button in the header or outside the modal to close it.
          </p>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Close Modal
          </button>
        </div>
      </Modal>
    </div>
  );
};

export const Basic: Story = {
  render: () => <BasicDemo />,
  parameters: {
    docs: {
      description: {
        story: "Basic modal with default settings. Click the button to open.",
      },
    },
  },
};

// ============================================
// Title Alignment Demo Component
// ============================================
const TitleAlignmentDemo = () => {
  const [openModal, setOpenModal] = useState<
    "left" | "center" | "right" | null
  >(null);

  return (
    <div className="w-full space-y-4">
      <div className="bg-blue-50 p-3 rounded border border-blue-300">
        <p className="text-sm text-blue-900 font-medium">
          Click any button to see different title alignments
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setOpenModal("left")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          Left Align
        </button>

        <button
          onClick={() => setOpenModal("center")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          Center Align
        </button>

        <button
          onClick={() => setOpenModal("right")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          Right Align
        </button>
      </div>

      {/* Left Align Modal */}
      <Modal
        isOpen={openModal === "left"}
        title="Left Aligned Title"
        titleAlign="left"
        onClose={() => setOpenModal(null)}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            This modal has the title aligned to the left (default).
          </p>
          <button
            onClick={() => setOpenModal(null)}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Center Align Modal */}
      <Modal
        isOpen={openModal === "center"}
        title="Center Aligned Title"
        titleAlign="center"
        onClose={() => setOpenModal(null)}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            This modal has the title centered in the header.
          </p>
          <button
            onClick={() => setOpenModal(null)}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Right Align Modal */}
      <Modal
        isOpen={openModal === "right"}
        title="Right Aligned Title"
        titleAlign="right"
        onClose={() => setOpenModal(null)}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            This modal has the title aligned to the right.
          </p>
          <button
            onClick={() => setOpenModal(null)}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export const TitleAlignment: Story = {
  render: () => <TitleAlignmentDemo />,
  parameters: {
    decorators: [
      (Story: React.ComponentType) => (
        <div className="w-full bg-gray-100 flex items-start justify-center p-8 min-h-screen">
          <div className="w-full max-w-md">
            <Story />
          </div>
        </div>
      ),
    ],
    docs: {
      description: {
        story:
          "Modal with different title alignments: left, center, and right.",
      },
    },
  },
};

// ============================================
// Hide Close Button Demo Component
// ============================================
const HideCloseButtonDemo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full space-y-4">
      <div className="bg-yellow-50 p-3 rounded border border-yellow-300">
        <p className="text-sm text-yellow-900 font-medium">
          This modal has no close button - must use the action button or click
          outside
        </p>
      </div>

      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium"
      >
        Open Modal Without Close Button
      </button>

      <Modal
        isOpen={isOpen}
        title="Modal Without Close Button"
        onClose={() => setIsOpen(false)}
        hideCloseButton={true}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            This modal has no close button in the header. The header shows a
            blue bottom border instead.
          </p>
          <p className="text-sm text-gray-700">
            You can close it by clicking the button below or clicking outside
            the modal.
          </p>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium text-sm"
          >
            Close Modal
          </button>
        </div>
      </Modal>
    </div>
  );
};

// ============================================
// Custom Width Demo Component
// ============================================
const CustomWidthDemo = () => {
  const [openModal, setOpenModal] = useState<
    "small" | "medium" | "large" | null
  >(null);

  return (
    <div className="w-full space-y-4">
      <div className="bg-blue-50 p-3 rounded border border-blue-300">
        <p className="text-sm text-blue-900 font-medium">
          Click buttons to see different modal widths
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setOpenModal("small")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          Small
        </button>

        <button
          onClick={() => setOpenModal("medium")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          Medium
        </button>

        <button
          onClick={() => setOpenModal("large")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          Large
        </button>
      </div>

      {/* Small Modal */}
      <Modal
        isOpen={openModal === "small"}
        title="Small Modal (300px)"
        className="w-[300px]"
        onClose={() => setOpenModal(null)}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            This is a small modal with custom width of 300px.
          </p>
          <button
            onClick={() => setOpenModal(null)}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Medium Modal */}
      <Modal
        isOpen={openModal === "medium"}
        title="Medium Modal (500px)"
        className="w-[500px]"
        onClose={() => setOpenModal(null)}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            This is a medium modal with custom width of 500px (default is
            364px).
          </p>
          <p className="text-sm text-gray-700">
            Perfect for forms and regular content.
          </p>
          <button
            onClick={() => setOpenModal(null)}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Large Modal */}
      <Modal
        isOpen={openModal === "large"}
        title="Large Modal (700px)"
        className="w-[700px]"
        onClose={() => setOpenModal(null)}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            This is a large modal with custom width of 700px.
          </p>
          <p className="text-sm text-gray-700">
            Suitable for displaying multiple columns or large content areas.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-100 rounded">
              <p className="text-xs font-semibold text-gray-700">Column 1</p>
            </div>
            <div className="p-3 bg-gray-100 rounded">
              <p className="text-xs font-semibold text-gray-700">Column 2</p>
            </div>
          </div>
          <button
            onClick={() => setOpenModal(null)}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export const CustomWidth: Story = {
  render: () => <CustomWidthDemo />,
  parameters: {
    decorators: [
      (Story: React.ComponentType) => (
        <div className="w-full bg-gray-100 flex items-start justify-center p-8 min-h-screen">
          <div className="w-full max-w-md">
            <Story />
          </div>
        </div>
      ),
    ],
    docs: {
      description: {
        story:
          "Modal with different custom widths: small (300px), medium (500px), and large (700px).",
      },
    },
  },
};

// ============================================
// Form Content Demo Component
// ============================================
const FormContentDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
    setIsOpen(false);
  };

  return (
    <div className="w-full space-y-4">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
      >
        Open Contact Form
      </button>

      <Modal
        isOpen={isOpen}
        title="Contact Form"
        className="w-[400px]"
        onClose={() => setIsOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="your@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Your message..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-sm"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export const FormContent: Story = {
  render: () => <FormContentDemo />,
  parameters: {
    decorators: [
      (Story: React.ComponentType) => (
        <div className="w-full bg-gray-100 flex items-start justify-center p-8 min-h-screen">
          <div className="w-full max-w-md">
            <Story />
          </div>
        </div>
      ),
    ],
    docs: {
      description: {
        story:
          "Modal with form content showing input fields and submit/cancel buttons.",
      },
    },
  },
};

// ============================================
// Rich Content Demo Component
// ============================================
const RichContentDemo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full space-y-4">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
      >
        Open Rich Content Modal
      </button>

      <Modal
        isOpen={isOpen}
        title="Feature Highlights"
        titleAlign="center"
        className="w-[500px]"
        onClose={() => setIsOpen(false)}
      >
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                ✨ Feature 1
              </h4>
              <p className="text-xs text-blue-800">
                Fully customizable modal with rich content support
              </p>
            </div>

            <div className="p-3 bg-green-50 rounded border border-green-200">
              <h4 className="text-sm font-semibold text-green-900 mb-1">
                🎯 Feature 2
              </h4>
              <p className="text-xs text-green-800">
                Multiple title alignment options for flexible layouts
              </p>
            </div>

            <div className="p-3 bg-purple-50 rounded border border-purple-200">
              <h4 className="text-sm font-semibold text-purple-900 mb-1">
                🚀 Feature 3
              </h4>
              <p className="text-xs text-purple-800">
                Built with React Portal for proper z-index handling
              </p>
            </div>

            <div className="p-3 bg-orange-50 rounded border border-orange-200">
              <h4 className="text-sm font-semibold text-orange-900 mb-1">
                ⚙️ Feature 4
              </h4>
              <p className="text-xs text-orange-800">
                Customizable header height and close button visibility
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export const RichContent: Story = {
  render: () => <RichContentDemo />,
  parameters: {
    decorators: [
      (Story: React.ComponentType) => (
        <div className="w-full bg-gray-100 flex items-start justify-center p-8 min-h-screen">
          <div className="w-full max-w-md">
            <Story />
          </div>
        </div>
      ),
    ],
    docs: {
      description: {
        story:
          "Modal with rich content including multiple colored sections and features list.",
      },
    },
  },
};
