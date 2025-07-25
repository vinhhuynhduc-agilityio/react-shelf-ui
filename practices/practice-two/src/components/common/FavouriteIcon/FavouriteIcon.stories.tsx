import type { Meta, StoryObj } from "@storybook/react";
import { FavouriteIcon } from "./index";

const meta: Meta<typeof FavouriteIcon> = {
	title: "Components/FavouriteIcon",
	component: FavouriteIcon,
	argTypes: {
		filled: {
			control: "boolean",
			description: "Set to true to fill the favourite with red color",
		},
		width: {
			control: { type: "number", min: 10, max: 100 },
			description: "Width of the SVG icon in pixels",
		},
		height: {
			control: { type: "number", min: 10, max: 100 },
			description: "Height of the SVG icon in pixels",
		},
		className: {
			control: "text",
			description: "Additional CSS classes for the icon",
			table: {
				type: { summary: "string" },
			},
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
					"A favourite icon that can be either filled or outlined. Useful for like/favorite features.",
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

type Story = StoryObj<typeof FavouriteIcon>;

/** Unfilled (default) Favourite icon */
export const UnfilledFavourite: Story = {};

/** Filled red Favourite icon */
export const FilledFavourite: Story = {
	args: {
		filled: true,
	},
};

/** Larger sized Favourite icon */
export const LargeFavourite: Story = {
	args: {
		width: 40,
		height: 36,
	},
};

export const CustomClassFavourite: Story = {
	args: {
		className: "lg:w-[50px] lg:h-[25px] w-[17px] h-[15px] hover:scale-110",
		filled: true,
	},
};
