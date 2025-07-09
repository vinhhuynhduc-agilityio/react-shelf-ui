import type { Meta, StoryObj } from "@storybook/react";
import RatingStars from ".";

const meta: Meta<typeof RatingStars> = {
	title: "Components/RatingStars",
	component: RatingStars,
	tags: ["autodocs"],
	argTypes: {
		rating: { control: { type: "number", min: 0, max: 5, step: 0.5 } },
		maxStars: { control: { type: "number", min: 1, max: 10, step: 1 } },
	},
	decorators: [
		(Story) => (
			<div className="flex items-center justify-center p-8">{Story()}</div>
		),
	],
};
export default meta;
type Story = StoryObj<typeof RatingStars>;

export const Default: Story = {
	args: {
		rating: 4.5,
		maxStars: 5,
	},
};

export const ThreeStars: Story = {
	args: {
		rating: 3,
		maxStars: 5,
	},
};
