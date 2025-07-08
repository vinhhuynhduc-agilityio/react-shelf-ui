import type { Meta, StoryObj } from "@storybook/react";
import BookRow from ".";

const meta: Meta<typeof BookRow> = {
	title: "Components/BookRow",
	component: BookRow,
	tags: ["autodocs"],
	argTypes: {
		book: { control: false },
		isInShelf: { control: "boolean" },
		isFavorite: { control: "boolean" },
		disabled: { control: "boolean" },
		onClickPreview: { action: "preview" },
		handleFavoriteClick: { action: "favorite" },
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
type Story = StoryObj<typeof BookRow>;

const sampleBook = {
	id: "1",
	title: "The Great Gatsby",
	author: { name: "F. Scott Fitzgerald" },
	publishedYear: 1925,
	rating: 4.5,
	imageUrl: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
	category: "Classic",
};

export const Default: Story = {
	args: {
		book: sampleBook,
		isInShelf: false,
		isFavorite: false,
		disabled: false,
	},
};

export const InShelfFavorite: Story = {
	args: {
		book: sampleBook,
		isInShelf: true,
		isFavorite: true,
		disabled: false,
	},
};

export const Disabled: Story = {
	args: {
		book: sampleBook,
		isInShelf: false,
		isFavorite: false,
		disabled: true,
	},
};
