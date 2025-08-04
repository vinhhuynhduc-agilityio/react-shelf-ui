import type { Meta, StoryObj } from "@storybook/react";
import BookRow from ".";

const meta: Meta<typeof BookRow> = {
  title: "Components/BookRow",
  component: BookRow,
  parameters: {
    docs: {
      description: {
        component: `BookRow is a row-style book display component used in lists or table views. It presents book cover, title, author, rating, category, shelf status, and includes actions like marking favorite or previewing details.`,
      },
    },
  },
  argTypes: {
    book: {
      control: false,
      description:
        "Book object including id, title, author, published year, rating, image URL, and category.",
    },
    isInShelf: {
      control: "boolean",
      description: "Marks whether the book is already in the user's shelf.",
    },
    isFavorite: {
      control: "boolean",
      description: "Marks whether the book is marked as favorite by the user.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the favorite button and preview button when true.",
      table: {
        type: { summary: "boolean" },
      },
    },
    onClickPreview: {
      action: "preview",
      description: "Callback triggered when the Preview button is clicked.",
      table: {
        type: {
          summary: "(event: React.MouseEvent<HTMLButtonElement>) => void",
          detail: "Standard React click handler for button element.",
        },
      },
    },
    handleFavoriteClick: {
      action: "favorite",
      description: "Callback triggered when the Favorite icon is clicked.",
      table: {
        type: {
          summary: "(event: React.MouseEvent<HTMLButtonElement>) => void",
          detail: "Standard React click handler for button element.",
        },
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
          padding: "1rem",
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
  authorAndYear: "F. Scott Fitzgerald, 1925",
  authorBio:
    "Francis Scott Key Fitzgerald was an American novelist, essayist, screenwriter, and short-story writer, widely regarded as one of the greatest American writers of the 20th century.",
  rating: 4.5,
  imageUrl: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
  category: "Classic",
};

export const BasicBookRow: Story = {
  args: {
    book: sampleBook,
    isInShelf: false,
    isFavorite: false,
    disabled: false,
  },
};

export const BookRowInShelf: Story = {
  name: "Book Row – In Shelf & Favorited",
  args: {
    book: sampleBook,
    isInShelf: true,
    isFavorite: true,
    disabled: false,
  },
};

export const DisabledBookRow: Story = {
  name: "Book Row – Favorited but Not in Shelf",
  args: {
    book: sampleBook,
    isInShelf: false,
    isFavorite: true,
    disabled: true,
  },
};
