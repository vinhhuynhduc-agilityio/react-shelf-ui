import { useCallback } from "react";

// components
import { BookShelfCard } from "@/components";

// types
import { ShelfItem, Book } from "@/types";

interface BookShelfListProps {
  books: Book[];
  shelf: ShelfItem[];
  pendingShelfActions: string[];
  onReturnBook: (shelfItem: ShelfItem) => void;
}

const BookShelfList: React.FC<BookShelfListProps> = ({
  books,
  shelf,
  pendingShelfActions,
  onReturnBook,
}) => {
  const handleReturn = useCallback(
    (bookId: string) => {
      const shelfItem = shelf.find((item) => item.bookId === bookId);
      if (shelfItem) onReturnBook(shelfItem);
    },
    [shelf, onReturnBook]
  );

  return (
    <>
      {books.map((book) => {
        const disabled = pendingShelfActions.includes(book.id);
        const shelfItem = shelf.find((item) => item.bookId === book.id);

        return (
          <div key={book.id}>
            <BookShelfCard
              book={book}
              borrowedDate={shelfItem?.borrowedDate ?? ""}
              onReturn={handleReturn}
              disabled={disabled}
            />
          </div>
        );
      })}
    </>
  );
};

export default BookShelfList;
