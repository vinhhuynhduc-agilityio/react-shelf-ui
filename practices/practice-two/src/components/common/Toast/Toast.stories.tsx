import type { Meta, StoryObj } from "@storybook/react";
import { FC, SVGProps, useEffect, useState } from "react";
import {
	CheckCircleIcon,
	XCircleIcon,
	InformationCircleIcon,
	ExclamationTriangleIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";

type ToastVariant = "success" | "error" | "info" | "warning";

interface ToastLocalProps {
	message: string;
	variant?: ToastVariant;
	duration?: number;
	onClose?: () => void;
}
interface VariantConfig {
	style: string;
	Icon: FC<SVGProps<SVGSVGElement>>;
}

const variantConfig: Record<ToastVariant, VariantConfig> = {
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

const ToastDemo: FC<ToastLocalProps> = ({
	message,
	variant = "info",
	duration = 3000,
	onClose,
}) => {
	const [visible, setVisible] = useState(true);

	const { style, Icon } = variantConfig[variant];

	useEffect(() => {
		if (!visible) return;
		const timer = setTimeout(() => {
			setVisible(false);
			onClose?.();
		}, duration);
		return () => clearTimeout(timer);
	}, [visible, duration, onClose]);

	if (!visible) return null;

	return (
		<div className="fixed bottom-24 right-12 sm:right-24 z-50 animate-slide-in">
			<div
				className={`flex items-center p-4 rounded-lg shadow-lg max-w-md ${style}`}
			>
				<Icon className="w-6 h-6 mr-2" />
				<div className="flex-1">
					<p className="text-sm">{message}</p>
				</div>
				<button
					className="ml-4 text-current hover:text-opacity-80"
					onClick={() => {
						setVisible(false);
						onClose?.();
					}}
				>
					<XMarkIcon className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
};

const meta: Meta<typeof ToastDemo> = {
	title: "Components/Toast",
	component: ToastDemo,
	tags: ["autodocs"],
	parameters: {
		docs: {
			description: {
				component:
					"A small notification component (toast) that shows messages for different statuses like success, error, info, and warning. It automatically hides after a configurable duration.",
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
		},
		onClose: {
			control: false,
			description: "Callback function triggered when the toast closes.",
			table: {
				type: { summary: "() => void" },
				defaultValue: { summary: "undefined" },
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
type Story = StoryObj<typeof ToastDemo>;

const ToastDemoButton = ({
	variant,
	message,
	duration,
}: {
	variant: ToastVariant;
	message: string;
	duration?: number;
}) => {
	const [show, setShow] = useState(false);

	return (
		<div>
			<button
				className="mb-2 px-5 py-2 border border-gray-300 rounded-md bg-blue-600 text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2"
				onClick={() => setShow(true)}
			>
				Show {variant.charAt(0).toUpperCase() + variant.slice(1)} Toast
			</button>
			{show && (
				<ToastDemo
					message={message}
					variant={variant}
					duration={duration}
					onClose={() => setShow(false)}
				/>
			)}
		</div>
	);
};

export const Success: Story = {
	render: () => (
		<ToastDemoButton
			variant="success"
			message="This is a success toast!"
			duration={3000}
		/>
	),
};

export const Error: Story = {
	render: () => (
		<ToastDemoButton
			variant="error"
			message="This is an error toast!"
			duration={3000}
		/>
	),
};

export const Info: Story = {
	render: () => (
		<ToastDemoButton
			variant="info"
			message="This is an info toast!"
			duration={3000}
		/>
	),
};

export const Warning: Story = {
	render: () => (
		<ToastDemoButton
			variant="warning"
			message="This is a warning toast!"
			duration={3000}
		/>
	),
};
