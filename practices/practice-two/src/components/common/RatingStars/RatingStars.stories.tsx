import type { Meta, StoryObj } from "@storybook/react";
import RatingStars from ".";

const meta: Meta<typeof RatingStars> = {
	title: "Components/RatingStars",
	component: RatingStars,
	argTypes: {
		rating: {
			control: { type: "number", min: 0, max: 5, step: 0.5 },
			description: "The average rating value, supports half-stars (e.g., 4.5).",
		},
		maxStars: {
			control: { type: "number", min: 1, max: 10, step: 1 },
			description: "The maximum number of stars to display (default is 5).",
		},
	},
	args: {
		rating: 4.5,
		maxStars: 5,
	},
	parameters: {
		docs: {
			description: {
				component:
					"A component that displays a star-based rating using full, half, and empty stars. It also shows contextual stats like number of ratings, current readers, and completed reads.",
			},
		},
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

export const PerfectRating: Story = {
	args: {
		rating: 5,
		maxStars: 5,
	},
};

export const WithHalfStar: Story = {
	args: {
		rating: 2.5,
		maxStars: 5,
	},
};

export const CustomMaxStars: Story = {
	args: {
		rating: 4.2,
		maxStars: 7,
	},
};
