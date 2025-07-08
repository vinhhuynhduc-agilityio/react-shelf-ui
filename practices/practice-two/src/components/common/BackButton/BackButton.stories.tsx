import type { Meta, StoryObj } from "@storybook/react";
import BackButton from ".";

const meta: Meta<typeof BackButton> = {
	title: "Components/BackButton",
	component: BackButton,
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
type Story = StoryObj<typeof BackButton>;

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
