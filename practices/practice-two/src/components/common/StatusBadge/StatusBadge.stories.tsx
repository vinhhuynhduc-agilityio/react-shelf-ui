import type { Meta, StoryObj } from "@storybook/react";
import StatusBadge from ".";

const meta: Meta<typeof StatusBadge> = {
	title: "Components/StatusBadge",
	component: StatusBadge,
	tags: ["autodocs"],
	parameters: {
		docs: {
			description: {
				component:
					"A badge indicating the status of a book, such as whether it's in the shelf or not. Useful for showing quick status indicators in book cards or lists.",
			},
		},
	},
	argTypes: {
		status: {
			control: { type: "select" },
			options: ["In-Shelf", "None"],
			description:
				"Status of the book. `'In-Shelf'` shows a green badge and `'None'` shows a gray badge.",
			table: {
				type: { summary: '"In-Shelf" | "None"' },
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

type Story = StoryObj<typeof StatusBadge>;

export const StatusInShelf: Story = {
	args: {
		status: "In-Shelf",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Displays the badge with green background, indicating the book is already in the shelf.",
			},
		},
	},
};

export const StatusNone: Story = {
	args: {
		status: "None",
	},
	parameters: {
		docs: {
			description: {
				story:
					"Displays the badge with gray background, indicating the book is not yet in the shelf.",
			},
		},
	},
};
