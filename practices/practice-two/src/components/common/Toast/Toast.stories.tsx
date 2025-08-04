import type { Meta, StoryObj } from "@storybook/react";
import { v4 as uuidv4 } from "uuid";
import { FC, SVGProps, useEffect, useState } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Toast variant type
type ToastVariant = "success" | "error" | "info" | "warning";

// Toast item type for demo
interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastDemoProps {
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

// Variant config for style and icon
const variantConfig: Record<
  ToastVariant,
  { style: string; Icon: FC<SVGProps<SVGSVGElement>> }
> = {
  success: {
    style: "bg-green-100 text-green-800",
    Icon: CheckCircleIcon,
  },
  error: {
    style: "bg-red-100 text-red-800",
    Icon: XCircleIcon,
  },
  info: {
    style: "bg-blue-100 text-blue-800",
    Icon: InformationCircleIcon,
  },
  warning: {
    style: "bg-yellow-100 text-yellow-800",
    Icon: ExclamationTriangleIcon,
  },
};

// ToastDemo renders the toast UI and manages a local toast queue (max 2)
const ToastDemo: FC<{
  toasts: ToastItem[];
  setToasts: React.Dispatch<React.SetStateAction<ToastItem[]>>;
  duration: number;
}> = ({ toasts, setToasts, duration }) => {
  // Auto-remove the oldest toast after duration
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [toasts, duration, setToasts]);

  return (
    <div className="fixed bottom-24 right-12 sm:right-24 z-50 space-y-2">
      {toasts.map(({ id, message, variant }) => {
        const { style, Icon } = variantConfig[variant];
        return (
          <div
            key={id}
            className={`flex items-center p-4 rounded-lg shadow-lg max-w-md animate-slide-in ${style}`}
          >
            <Icon className="w-6 h-6 mr-2" />
            <div className="flex-1">
              <p className="text-sm">{message}</p>
            </div>
            <button
              onClick={() =>
                setToasts((prev) => prev.filter((t) => t.id !== id))
              }
              className="ml-4 text-current hover:text-opacity-80"
              aria-label="Close toast"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

// Toast manages the toast queue and triggers ToastDemo
const Toast: FC<ToastDemoProps> = ({
  message,
  variant = "info",
  duration = 3000,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Show a new toast, keeping only the latest 2
  const handleShowToast = () => {
    const id = uuidv4();
    setToasts((prev) => {
      const newToasts = [...prev, { id, message, variant }];
      return newToasts.length > 2 ? newToasts.slice(-2) : newToasts;
    });
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className="mb-2 px-5 py-2 border border-gray-300 rounded-md bg-blue-600 text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2"
        onClick={handleShowToast}
      >
        Show {variant.charAt(0).toUpperCase() + variant.slice(1)} Toast
      </button>
      <ToastDemo toasts={toasts} setToasts={setToasts} duration={duration} />
    </div>
  );
};

// Storybook meta configuration
const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A button-triggered toast notification component that shows messages for different statuses like success, error, info, and warning. It supports a maximum of 2 toasts displayed at once and auto-hides after a configurable duration.",
      },
    },
  },
  argTypes: {
    message: {
      control: "text",
      description: "The text content shown inside the toast.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "''" },
      },
    },
    variant: {
      control: { type: "select" },
      options: ["success", "error", "info", "warning"],
      description:
        "The visual style of the toast, affecting background color and icon.",
      table: {
        type: { summary: `"success" | "error" | "info" | "warning"` },
        defaultValue: { summary: '"info"' },
      },
    },
    duration: {
      control: "number",
      description:
        "Time in milliseconds before the toast automatically disappears.",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "3000" },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex justify-center min-h-[300px]">{Story()}</div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = {
  args: {
    message: "This is a success toast!",
    variant: "success",
    duration: 3000,
  },
  parameters: {
    docs: {
      source: {
        code: `
import { useToastStore } from "@/stores";

const Demo = () => {
  const { showToast } = useToastStore();

  return (
    <>
      <button onClick={() => showToast("This is a success toast!", "success")}>Show Toast</button>
      <Toast />
    </>
  );
};
        `.trim(),
      },
    },
  },
};

export const Error: Story = {
  args: {
    message: "This is an error toast!",
    variant: "error",
    duration: 3000,
  },
  parameters: {
    docs: {
      source: {
        code: `
import { useToastStore } from "@/stores";

const Demo = () => {
  const { showToast } = useToastStore();

  return (
    <>
      <button onClick={() => showToast("This is an error toast!", "error")}>Show Toast</button>
      <Toast />
    </>
  );
};
        `.trim(),
      },
    },
  },
};

export const Info: Story = {
  args: {
    message: "This is an info toast!",
    variant: "info",
    duration: 3000,
  },
  parameters: {
    docs: {
      source: {
        code: `
import { useToastStore } from "@/stores";

const Demo = () => {
  const { showToast } = useToastStore();

  return (
    <>
      <button onClick={() => showToast("This is an info toast!", "info")}>Show Toast</button>
      <Toast />
    </>
  );
};
        `.trim(),
      },
    },
  },
};

export const Warning: Story = {
  args: {
    message: "This is a warning toast!",
    variant: "warning",
    duration: 3000,
  },
  parameters: {
    docs: {
      source: {
        code: `
import { useToastStore } from "@/stores";

const Demo = () => {
  const { showToast } = useToastStore();

  return (
    <>
      <button onClick={() => showToast("This is a warning toast!", "warning")}>Show Toast</button>
      <Toast />
    </>
  );
};
        `.trim(),
      },
    },
  },
};
