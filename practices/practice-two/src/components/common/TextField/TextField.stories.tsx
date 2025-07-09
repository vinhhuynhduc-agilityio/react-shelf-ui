import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { TextField } from ".";
import { useState } from "react";

const meta: Meta<typeof TextField> = {
	title: "Components/TextField",
	component: TextField,
	tags: ["autodocs"],
	argTypes: {
		type: {
			control: { type: "select" },
			options: ["text", "password", "textarea"],
		},
		vertical: { control: "boolean" },
		disabled: { control: "boolean" },
		label: { control: "text" },
		placeholder: { control: "text" },
		error: { control: "text" },
		maxLength: { control: "number" },
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

export const Default: Story = {
	render: (args) => <Template {...args} />,
	args: {
		name: "username",
		label: "Username",
		placeholder: "Enter your username",
		type: "text",
	},
};

export const Password: Story = {
	render: (args) => <Template {...args} />,
	args: {
		name: "password",
		label: "Password",
		placeholder: "Enter your password",
		type: "password",
		showPasswordToggle: true,
	},
};

export const Textarea: Story = {
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

export const WithError: Story = {
	render: (args) => <Template {...args} />,
	args: {
		name: "email",
		label: "Email",
		placeholder: "Enter your email",
		type: "text",
		error: "Email is required",
	},
};
