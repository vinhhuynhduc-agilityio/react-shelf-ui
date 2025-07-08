import type { Meta, StoryObj } from "@storybook/react";
import AuthButton from ".";

const meta: Meta<typeof AuthButton> = {
	title: "Components/AuthButton",
	component: AuthButton,
	tags: ["autodocs"],
	argTypes: {
		disabled: { control: "boolean" },
		label: { control: "text" },
		pendingLabel: { control: "text" },
		className: { control: "text" },
	},
	decorators: [
		(Story) => (
			<div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 w-[320px] h-[90%] sm:w-[500px] sm:h-[80%] md:w-[565px] md:h-[70%] flex flex-col overflow-auto">
				{Story()}
			</div>
		),
	],
};
export default meta;
type Story = StoryObj<typeof AuthButton>;

export const SignInEnabled: Story = {
	args: {
		disabled: false,
		label: "Sign In",
		pendingLabel: "Signing In...",
	},
};

export const SignInDisabled: Story = {
	args: {
		disabled: true,
		label: "Sign In",
		pendingLabel: "Signing In...",
	},
};

export const SignUpEnabled: Story = {
	args: {
		disabled: false,
		label: "Register",
		pendingLabel: "Registering...",
		className: "mt-2",
	},
};

export const SignUpDisabled: Story = {
	args: {
		disabled: true,
		label: "Register",
		pendingLabel: "Registering...",
		className: "mt-2",
	},
};
