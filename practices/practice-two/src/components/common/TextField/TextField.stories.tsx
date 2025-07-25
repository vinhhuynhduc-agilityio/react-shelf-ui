import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { TextField } from ".";
import { useState } from "react";

const meta: Meta<typeof TextField> = {
	title: "Components/TextField",
	component: TextField,
	tags: ["autodocs"],
	parameters: {
		docs: {
			description: {
				component:
					"A versatile text field component supporting input, password, and textarea types, integrated with React Hook Form. Includes options for vertical layout, password visibility toggle, and validation.",
			},
		},
	},
	argTypes: {
		name: {
			control: false,
			description:
				"The name of the field, used for form registration and identifying input.",
		},
		label: {
			control: "text",
			description: "Label displayed beside or above the input.",
		},
		type: {
			control: { type: "select" },
			options: ["text", "password", "textarea"],
			description: "Input type. Supports 'text', 'password', and 'textarea'.",
		},
		placeholder: {
			control: "text",
			description: "Placeholder text shown when input is empty.",
		},
		vertical: {
			control: "boolean",
			description:
				"Display the label above (vertical) or beside (horizontal) the input.",
		},
		error: {
			control: "text",
			description: "Error message displayed below the input.",
		},
		maxLength: {
			control: "number",
			description: "Maximum number of characters allowed.",
		},
		disabled: {
			control: "boolean",
			description: "Disables the input field if true.",
		},
		showPasswordToggle: {
			control: "boolean",
			description: "Enables toggle visibility button for password input.",
		},
		isPasswordVisible: {
			control: false,
			description:
				"Current visibility state of password field (controlled internally).",
		},
		togglePasswordVisibility: {
			control: false,
			description:
				"Function to toggle the password visibility (controlled internally).",
			table: {
				type: {
					summary: "(event: React.MouseEvent<HTMLButtonElement>) => void",
					detail: "Standard React click handler for button element.",
				},
			},
		},
		register: {
			control: false,
			description: "Function from React Hook Form to register input.",
		},
		additionalClasses: {
			control: "text",
			description: "Custom className to override container styles.",
		},
		labelWidth: {
			control: "text",
			description:
				"Width of the label in horizontal layout (e.g., 'w-30', 'w-32').",
		},
		withErrorMargin: {
			control: false,
			description:
				"Reserved for future use or custom layout error margin handling.",
		},
	},
	decorators: [
		(Story) => (
			<div className="flex items-center justify-center p-8">{Story()}</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof TextField>;

const Template = (args: React.ComponentProps<typeof TextField>) => {
	const { register } = useForm();
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	return (
		<div className="w-full max-w-md">
			<TextField
				{...args}
				register={register}
				isPasswordVisible={isPasswordVisible}
				togglePasswordVisibility={() => setIsPasswordVisible((v) => !v)}
				vertical
			/>
		</div>
	);
};

export const BasicTextInput: Story = {
	render: (args) => <Template {...args} />,
	args: {
		name: "username",
		label: "Username",
		placeholder: "Enter your username",
		type: "text",
	},
};

export const PasswordInputWithToggle: Story = {
	render: (args) => <Template {...args} />,
	args: {
		name: "password",
		label: "Password",
		placeholder: "Enter your password",
		type: "password",
		showPasswordToggle: true,
	},
};

export const TextareaWithMaxLength: Story = {
	render: (args) => <Template {...args} />,
	args: {
		name: "bio",
		label: "Bio",
		placeholder: "Tell us about yourself",
		type: "textarea",
		vertical: true,
		maxLength: 300,
	},
};

export const TextInputWithError: Story = {
	render: (args) => <Template {...args} />,
	args: {
		name: "email",
		label: "Email",
		placeholder: "Enter your email",
		type: "text",
		error: "Email is required",
	},
};
