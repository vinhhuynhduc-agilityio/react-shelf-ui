import type { Meta, StoryObj } from "@storybook/react";
import ActionIcon from ".";
import { ReviewIcon, NotesIcon, ShareIcon } from "@/components/icons";

const meta: Meta<typeof ActionIcon> = {
	title: "Components/ActionIcon",
	component: ActionIcon,
	tags: ["autodocs"],
	argTypes: {
		icon: { control: false },
		label: { control: "text" },
	},
};
export default meta;
type Story = StoryObj<typeof ActionIcon>;

export const Review: Story = {
	args: {
		icon: <ReviewIcon />,
		label: "Review",
	},
};

export const Notes: Story = {
	args: {
		icon: <NotesIcon />,
		label: "Notes",
	},
};

export const Share: Story = {
	args: {
		icon: <ShareIcon />,
		label: "Share",
	},
};
