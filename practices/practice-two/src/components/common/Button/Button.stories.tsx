import type { Meta, StoryObj } from "@storybook/react";
import Button from ".";

const meta: Meta<typeof Button> = {
	title: "Components/Button",
	component: Button,
	parameters: {
		docs: {
			description: {
				component:
					"A reusable button component supporting various styles: `primary`, `outline`, `text`, and `auth`. It handles disabled states, pending labels, and custom click events.",
			},
		},
	},
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["primary", "outline", "text", "auth"],
			description: "Visual style of the button",
			table: {
				type: { summary: '"primary" | "outline" | "text" | "auth"' },
			},
		},
		disabled: {
			control: "boolean",
			description: "If true, disables the button",
			table: {
				type: { summary: "boolean" },
			},
		},
		type: {
			control: { type: "select" },
			options: ["button", "submit"],
			description: "HTML type of the button",
			table: {
				type: { summary: '"button" | "submit"' },
			},
		},
		additionalClasses: {
			control: "text",
			description: "Additional CSS classes",
			table: {
				type: { summary: "string" },
			},
		},
		label: {
			control: "text",
			description: "Button text",
		},
		onClick: {
			action: "clicked",
			description: "Button click handler",
			table: {
				type: {
					summary: "(event: React.MouseEvent<HTMLButtonElement>) => void",
					detail: "Standard React click handler for button element.",
				},
			},
		},
	},
	decorators: [
		(Story) => (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: 32,
				}}
			>
				{Story()}
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof Button>;

// Primary
export const PrimaryButton: Story = {
	args: {
		variant: "primary",
		label: "Primary Button",
		disabled: false,
	},
	parameters: {
		docs: {
			description: {
				story:
					"The default button style, used for main actions. It has an orange background and white text.",
			},
		},
	},
};

// Disabled
export const DisabledPrimary: Story = {
	args: {
		variant: "primary",
		label: "Processing...",
		pendingLabel: "Please wait...",
		disabled: true,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Disabled version of the primary button. When disabled, it shows the `pendingLabel` if provided.",
			},
		},
	},
};

// Auth
export const AuthButton: Story = {
	args: {
		variant: "auth",
		label: "Login",
		disabled: false,
	},
	parameters: {
		docs: {
			description: {
				story:
					"Button style used in authentication flows, such as login or signup. Designed with specific background and hover states.",
			},
		},
	},
};

// Outline
export const OutlineButton: Story = {
	args: {
		variant: "outline",
		label: "Preview",
		disabled: false,
		additionalClasses:
			"text-[12px] w-[70px] h-[25px] md:w-[85px] md:h-[30px] lg:w-[90px] lg:h-[35px] md:text-[14px]",
	},
	parameters: {
		docs: {
			description: {
				story:
					"An outlined button with colored border and text. Good for secondary or less prominent actions.",
			},
		},
	},
};

// Text
export const TextButton: Story = {
	args: {
		variant: "text",
		label: "Text Button",
		disabled: false,
	},
	parameters: {
		docs: {
			description: {
				story:
					"A minimal button without background or border. Ideal for inline or subtle actions.",
			},
		},
	},
};
