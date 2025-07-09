import type { Meta, StoryObj } from "@storybook/react";
import StatusBadge from ".";

const meta: Meta<typeof StatusBadge> = {
	title: "Components/StatusBadge",
	component: StatusBadge,
	tags: ["autodocs"],
	argTypes: {
		status: {
			control: { type: "select" },
			options: ["In-Shelf", "None"],
		},
	},
	decorators: [
		(Story) => (
			<div className="flex items-center justify-center p-8">{Story()}</div>
		),
	],
};
export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const InShelf: Story = {
	args: {
		status: "In-Shelf",
	},
};

export const None: Story = {
	args: {
		status: "None",
	},
};
