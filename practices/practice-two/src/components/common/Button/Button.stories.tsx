import type { Meta, StoryObj } from "@storybook/react";
import Button from ".";

const meta: Meta<typeof Button> = {
	title: "Components/Button",
	component: Button,
	tags: ["autodocs"],
	argTypes: {
		children: { control: "text" },
		variant: {
			control: { type: "select" },
			options: ["primary", "outline", "text"],
		},
		disabled: { control: "boolean" },
		className: { control: "text" },
		type: {
			control: { type: "select" },
			options: ["button", "submit"],
		},
		onClick: { action: "clicked" },
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

export const Primary: Story = {
	args: {
		children: "Primary Button",
		variant: "primary",
		disabled: false,
	},
};

export const Disabled: Story = {
	args: {
		children: "Disabled Button",
		variant: "primary",
		disabled: true,
	},
};

export const Outline: Story = {
	args: {
		children: "Outline",
		variant: "outline",
		disabled: false,
	},
};

export const Text: Story = {
	args: {
		children: "Text Button",
		variant: "text",
		disabled: false,
	},
};
