// hooks
import { Book, FavouriteItem, ShelfItem } from "@/types";

// components
import { BookRow } from "@/components/common";

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
  return (
    <>
      {books.map((book) => {
        const isInShelf = isBookInShelf(book.id, shelves ?? []);
        const isFavorite = favourites?.some((fav) => fav.bookId === book.id);
        const favouriteId = favourites?.find(
          (fav) => fav.bookId === book.id
        )?.id;
        const isDisabled = pendingFavouritesActions.includes(book.id);

        return (
          <BookRow
            key={book.id}
            book={book}
            isInShelf={isInShelf}
            isFavorite={!!isFavorite}
            onClickPreview={handleClickPreview}
            handleFavoriteClick={() =>
              handleFavoriteClick(book, !!isFavorite, favouriteId)
            }
            disabled={isDisabled}
          />
        );
      })}
    </>
  );
};

export default BookSearchList;
