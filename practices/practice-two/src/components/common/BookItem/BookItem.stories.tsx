import type { Meta, StoryObj } from "@storybook/react";
import BookItem from ".";

const meta: Meta<typeof BookItem> = {
	title: "Components/BookItem",
	component: BookItem,
	parameters: {
		docs: {
			description: {
				component: `BookItem displays brief information about a book, including title, author, year, rating, and cover image. It is used in lists or preview sections.`,
			},
		},
	},
	argTypes: {
		book: {
			description:
				"The book data object to display, including title, author, publication year, image, category, and rating.",
			control: false,
		},
	},
	decorators: [
		(Story) => (
			<div className="flex items-center justify-center p-8">{Story()}</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof BookItem>;

const sampleBook = {
	id: "1",
	title: "The Great Gatsby",
	author: { name: "F. Scott Fitzgerald" },
	publishedYear: 1925,
	rating: 4.5,
	imageUrl: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
	category: "Classic",
};

export const BasicBookItem: Story = {
	args: {
		book: sampleBook,
	},
};
