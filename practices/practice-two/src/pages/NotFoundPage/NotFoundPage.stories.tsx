import NotFoundPage from "@/pages/NotFoundPage";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof NotFoundPage> = {
	title: "Pages/NotFoundPage",
	component: NotFoundPage,
	parameters: {
		layout: "centered",
	},
};

export default meta;

type Story = StoryObj<typeof NotFoundPage>;

export const Default: Story = {
	args: {},
};
