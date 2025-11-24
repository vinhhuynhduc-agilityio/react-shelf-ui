import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import StatusBar from ".";

const meta: Meta<typeof StatusBar> = {
  title: "Components/StatusBar",
  component: StatusBar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A status bar component that displays success or error messages at the bottom of the screen. Messages automatically disappear after 2 seconds. Includes appropriate icons and color coding for different message types.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    message: {
      description: "The message text to display. Set to null to hide the bar",
      table: {
        type: { summary: "string | null" },
        defaultValue: { summary: "null" },
      },
      control: false,
    },
    type: {
      description: "Type of message - success or error",
      control: { type: "radio" },
      options: ["success", "error"],
      table: {
        type: { summary: '"success" | "error"' },
      },
    },
    onClear: {
      description:
        "Callback function triggered when the message should be cleared",
      action: "cleared",
      table: {
        type: { summary: "() => void" },
      },
      control: false,
    },
  },
  decorators: [
    (Story) => {
      return (
        <div className="flex flex-col w-full bg-white">
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4">
            <Story />
          </div>
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof StatusBar>;

// Success Message
const SuccessDemo = () => {
  const [message, setMessage] = useState<string | null>(null);

  const handleShowSuccess = () => {
    setMessage("File uploaded successfully");
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <button
        onClick={handleShowSuccess}
        className="px-5 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors shadow-sm"
      >
        Show Success Toast
      </button>
      <div className="w-full bg-gray-100 min-h-[100px] flex items-end rounded border border-gray-300">
        <StatusBar
          message={message}
          type="success"
          onClear={() => setMessage(null)}
        />
      </div>
    </div>
  );
};

export const Success: Story = {
  render: () => <SuccessDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Success toast notification. Click the button to show a success message that auto-hides after 2 seconds.",
      },
    },
  },
};

// Error Message
const ErrorDemo = () => {
  const [message, setMessage] = useState<string | null>(null);

  const handleShowError = () => {
    setMessage("Failed to upload file");
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <button
        onClick={handleShowError}
        className="px-5 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors shadow-sm"
      >
        Show Error Toast
      </button>
      <div className="w-full bg-gray-100 min-h-[100px] flex items-end rounded border border-gray-300">
        <StatusBar
          message={message}
          type="error"
          onClear={() => setMessage(null)}
        />
      </div>
    </div>
  );
};

export const Error: Story = {
  render: () => <ErrorDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Error toast notification. Click the button to show an error message that auto-hides after 2 seconds.",
      },
    },
  },
};

// Interactive Demo - Multiple Scenarios
const InteractiveDemo = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"success" | "error">("success");

  const scenarios = [
    {
      label: "Operation Success",
      type: "success" as const,
      message: "Operation completed successfully!",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      label: "Operation Error",
      type: "error" as const,
      message: "Something went wrong. Please try again.",
      color: "bg-red-600 hover:bg-red-700",
    },
    {
      label: "File Upload Success",
      type: "success" as const,
      message: "File uploaded successfully",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      label: "File Upload Error",
      type: "error" as const,
      message: "Failed to upload file. Max size is 10MB.",
      color: "bg-red-600 hover:bg-red-700",
    },
    {
      label: "Delete Success",
      type: "success" as const,
      message: "Item deleted successfully",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      label: "Delete Error",
      type: "error" as const,
      message: "Failed to delete item. Try again later.",
      color: "bg-red-600 hover:bg-red-700",
    },
  ];

  const handleShowToast = (
    toastType: "success" | "error",
    toastMessage: string
  ) => {
    setType(toastType);
    setMessage(toastMessage);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl">
      <h3 className="text-lg font-semibold text-gray-900">
        StatusBar Interactive Demo
      </h3>

      <div className="grid grid-cols-2 gap-3 w-full">
        {scenarios.map((scenario) => (
          <button
            key={scenario.label}
            onClick={() => handleShowToast(scenario.type, scenario.message)}
            className={`px-3 py-2 text-white text-sm font-medium rounded-md transition-colors shadow-sm ${scenario.color}`}
          >
            {scenario.label}
          </button>
        ))}
      </div>

      <div className="p-4 bg-gray-50 rounded border-2 border-gray-300 w-full">
        <p className="text-sm text-gray-900 mb-2 font-semibold">
          Current Message:{" "}
          <span className="text-gray-700 font-normal">
            {message || "None (hidden)"}
          </span>
        </p>
        <p className="text-sm text-gray-900 font-semibold">
          Type:{" "}
          <span
            className={
              type === "success"
                ? "text-green-700 font-bold"
                : "text-red-700 font-bold"
            }
          >
            {type}
          </span>
        </p>
      </div>

      <div className="w-full bg-gray-100 min-h-[100px] flex items-end rounded border-2 border-gray-300 relative">
        <StatusBar
          message={message}
          type={type}
          onClear={() => setMessage(null)}
        />
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
          "Interactive demo with multiple scenarios. Click any button to trigger the corresponding toast notification. Messages auto-hide after 2 seconds.",
      },
    },
  },
};

// File Upload Scenarios
const FileUploadDemo = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"success" | "error">("success");

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-900">
        File Upload Scenarios
      </h3>

      <div className="space-y-4 w-full">
        <div className="p-4 bg-white border-2 border-gray-300 rounded">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Upload Single File
          </h4>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setType("success");
                setMessage("File uploaded successfully");
              }}
              className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
            >
              Success
            </button>
            <button
              onClick={() => {
                setType("error");
                setMessage("Failed to upload file");
              }}
              className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
            >
              Error
            </button>
          </div>
        </div>

        <div className="p-4 bg-white border-2 border-gray-300 rounded">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Upload Multiple Files
          </h4>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setType("success");
                setMessage("5 files uploaded successfully");
              }}
              className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
            >
              Success
            </button>
            <button
              onClick={() => {
                setType("error");
                setMessage("Failed to upload 2 out of 5 files");
              }}
              className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
            >
              Partial Error
            </button>
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-100 min-h-[100px] flex items-end rounded border-2 border-gray-300">
        <StatusBar
          message={message}
          type={type}
          onClear={() => setMessage(null)}
        />
      </div>
    </div>
  );
};

export const FileUploadScenarios: Story = {
  render: () => <FileUploadDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "File upload scenarios with buttons to trigger success or error toasts for single and multiple file uploads.",
      },
    },
  },
};

// All States Overview
const AllStatesDemo = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"success" | "error">("success");

  const messages = [
    { type: "success" as const, text: "Changes saved successfully" },
    { type: "error" as const, text: "Network error. Please try again." },
    { type: "success" as const, text: "Profile updated successfully" },
    {
      type: "error" as const,
      text: "Invalid input. Please check your entries.",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
      <h3 className="text-lg font-semibold text-gray-900">
        All States Overview
      </h3>

      <div className="space-y-3 w-full">
        {messages.map((msg, idx) => (
          <button
            key={idx}
            onClick={() => {
              setType(msg.type);
              setMessage(msg.text);
            }}
            className={`w-full p-3 text-left rounded-md border-2 font-semibold transition-all ${
              msg.type === "success"
                ? "border-green-500 bg-green-50 text-green-900 hover:border-green-600 hover:bg-green-100"
                : "border-red-500 bg-red-50 text-red-900 hover:border-red-600 hover:bg-red-100"
            }`}
          >
            <span className="text-sm">
              {msg.type === "success" ? "✓" : "✕"} {msg.text}
            </span>
          </button>
        ))}
      </div>

      <div className="w-full bg-gray-100 min-h-[100px] flex items-end rounded border-2 border-gray-300">
        <StatusBar
          message={message}
          type={type}
          onClear={() => setMessage(null)}
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
          "Overview of all StatusBar states. Click any button to see the corresponding toast notification. Messages auto-hide after 2 seconds.",
      },
    },
  },
};
