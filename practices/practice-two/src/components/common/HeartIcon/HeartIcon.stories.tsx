import type { Meta, StoryObj } from "@storybook/react";
import { HeartIcon } from "./index";

const meta: Meta<typeof HeartIcon> = {
	title: "Components/HeartIcon",
	component: HeartIcon,
	argTypes: {
		filled: {
			control: "boolean",
			description: "Set to true to fill the heart with red color",
		},
		width: {
			control: { type: "number", min: 10, max: 100 },
			description: "Width of the SVG icon in pixels",
		},
		height: {
			control: { type: "number", min: 10, max: 100 },
			description: "Height of the SVG icon in pixels",
		},
		style: {
			control: false,
			description: "Additional inline styles for the SVG element",
		},
	},
	args: {
		filled: false,
		width: 20,
		height: 18,
	},
	parameters: {
		docs: {
			description: {
				component:
					"A heart icon that can be either filled or outlined. Useful for like/favorite features.",
			},
		},
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

type Story = StoryObj<typeof HeartIcon>;

/** Unfilled (default) heart icon */
export const UnfilledHeart: Story = {};

/** Filled red heart icon */
export const FilledHeart: Story = {
	args: {
		filled: true,
	},
};

/** Larger sized heart icon */
export const LargeHeart: Story = {
	args: {
		width: 40,
		height: 36,
	},
};
