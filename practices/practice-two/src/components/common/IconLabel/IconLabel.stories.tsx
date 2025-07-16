import type { Meta, StoryObj } from "@storybook/react";
import IconLabel from ".";
import { ReviewIcon, NotesIcon, ShareIcon } from "@/components/icons";

const meta: Meta<typeof IconLabel> = {
	title: "Components/IconLabel",
	component: IconLabel,
	tags: ["autodocs"],
	argTypes: {
		icon: { control: false },
		label: { control: "text" },
	},
};
export default meta;
type Story = StoryObj<typeof IconLabel>;

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
