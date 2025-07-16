import type { Meta, StoryObj } from "@storybook/react";
import IconButton from ".";

const meta: Meta<typeof IconButton> = {
	title: "Components/IconButton",
	component: IconButton,
	tags: ["autodocs"],
	argTypes: {
		title: { control: "text" },
		disabled: { control: "boolean" },
		onClick: { action: "clicked" },
	},
	decorators: [
		(Story) => (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				{Story()}
			</div>
		),
	],
};
export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
	args: {
		title: "Back to results",
		disabled: false,
	},
};

export const Disabled: Story = {
	args: {
		title: "Back to results",
		disabled: true,
	},
};
