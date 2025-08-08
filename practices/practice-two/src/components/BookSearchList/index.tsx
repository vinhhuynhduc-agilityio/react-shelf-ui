import { useCallback } from "react";

// hooks
import { Book, FavouriteItem, ShelfItem } from "@/types";

// components
import { BookRow } from "@/components/common";

// helpers
import { getBookStatus } from "@/helpers";

interface BookSearchListProps {
  books: Book[];
  shelves: ShelfItem[];
  favourites: FavouriteItem[];
  pendingFavouritesActions: string[];
  handleClickPreview: (book: Book) => void;
  handleFavoriteClick: (
    book: Book,
    isFavorite: boolean,
    favouriteId?: string
  ) => void;
  isBookInShelf: (bookId: string, shelf: ShelfItem[]) => boolean;
}

const BookSearchList: React.FC<BookSearchListProps> = ({
  books,
  shelves,
  favourites,
  pendingFavouritesActions,
  handleClickPreview,
  handleFavoriteClick,
  isBookInShelf,
}) => {
  const getFavoriteHandler = useCallback(
    (book: Book, isFavorite: boolean, favouriteId?: string) => () =>
      handleFavoriteClick(book, isFavorite, favouriteId),
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
            onClickPreview={handleClickPreview}
            handleFavoriteClick={getFavoriteHandler(
              book,
              !!isFavorite,
              favouriteId
            )}
            disabled={isDisabled}
          />
        );
      })}
    </>
  );
};

export default BookSearchList;
