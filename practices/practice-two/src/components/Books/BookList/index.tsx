import { useCallback } from "react";

// hooks
import { Book, UserBook, ShelfItem } from "@/types";

// components
import { BookRow } from "@/components";

// helpers
import { getBookStatus, isBookInShelf } from "@/helpers";

interface BookListProps {
  books: Book[];
  favourites: UserBook[];
  shelves: ShelfItem[];
  pendingFavouritesActions: string[];
  onClickPreview: (book: Book) => void;
  handleFavoriteClick: (
    book: Book,
    favouriteId: string,
    isFavorite?: boolean
  ) => void;
}

const BookList: React.FC<BookListProps> = ({
  books,
  shelves,
  favourites,
  pendingFavouritesActions,
  onClickPreview,
  handleFavoriteClick,
}) => {
  const getFavoriteHandler = useCallback(
    (book: Book, favouriteId: string, isFavorite?: boolean) => () =>
      handleFavoriteClick(book, favouriteId, isFavorite),
    [handleFavoriteClick]
  );

  return (
    <>
      {books.map((book) => {
        const { isInShelf, isFavorite, favouriteId, isDisabled } =
          getBookStatus(
            book.id,
            shelves,
            favourites,
            pendingFavouritesActions,
            isBookInShelf
          );

        return (
          <BookRow
            key={book.id}
            book={book}
            isInShelf={isInShelf}
            isFavorite={!!isFavorite}
            onClickPreview={onClickPreview}
            handleFavoriteClick={getFavoriteHandler(
              book,
              favouriteId ?? "",
              !!isFavorite
            )}
            disabled={isDisabled}
          />
        );
      })}
    </>
  );
};

export default BookList;
