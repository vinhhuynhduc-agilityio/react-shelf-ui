import type { Meta, StoryObj } from "@storybook/react";
import Avatar from ".";

const meta: Meta<typeof Avatar> = {
	title: "Components/Avatar",
	component: Avatar,
	tags: ["autodocs"],
	argTypes: {
		src: { control: "text" },
		alt: { control: "text" },
		size: {
			control: { type: "select" },
			options: ["small", "medium", "large"],
		},
		className: { control: "text" },
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
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
	args: {},
};

export const Small: Story = {
	args: { size: "small" },
};

export const Large: Story = {
	args: { size: "large" },
};

export const WithCustomImage: Story = {
	args: {
		src: "https://randomuser.me/api/portraits/men/32.jpg",
		alt: "Custom User",
		size: "medium",
	},
};
