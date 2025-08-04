import type { Meta, StoryObj } from "@storybook/react";
import BookItem from ".";

const meta: Meta<typeof BookItem> = {
  title: "Components/BookItem",
  component: BookItem,
  parameters: {
    docs: {
      description: {
        component: `BookItem displays brief information about a book, including the cover image, title, author, published year, and rating. It is typically used in book lists or preview sections.`,
      },
    },
  },
  argTypes: {
    id: { description: "Unique identifier for the book", control: false },
    title: { description: "The book's title", control: "text" },
    authorAndYear: {
      description: "Name and year of the book's author",
      control: "text",
    },
    rating: {
      description: "Average rating of the book (0–5)",
      control: { type: "number", min: 0, max: 5, step: 0.1 },
    },
    imageUrl: { description: "URL of the book's cover image", control: false },
    category: { description: "Genre or category of the book", control: false },
    onClick: {
      action: "clicked",
      description: "Callback when the item is clicked",
    },
  },
  decorators: [
    // Optional: Center the component in the preview
    (Story) => (
      <div className="flex items-center justify-center p-8">{Story()}</div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BookItem>;

// Sample data for the default story
export const BasicBookItem: Story = {
  args: {
    id: "1",
    title: "The Great Gatsby",
    authorAndYear: "F. Scott Fitzgerald, 1925",
    rating: 4.5,
    imageUrl: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
    category: "Classic",
  },
};
