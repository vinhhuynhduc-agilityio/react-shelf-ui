// types
import { Book, UserBook, ShelfItem } from "@/types";

// components
import { BookRow } from "@/components";

// helpers
import { isBookInShelf } from "@/helpers";

interface FavouriteBookListProps {
  books: Book[];
  favourites: UserBook[];
  shelves: ShelfItem[];
  pendingFavouritesActions: string[];
  onClickPreview: (book: Book) => void;
  onRemoveFavourite: (book: Book, favouriteId?: string) => void;
}

const FavouriteBookList: React.FC<FavouriteBookListProps> = ({
  books,
  favourites,
  shelves,
  pendingFavouritesActions,
  onClickPreview,
  onRemoveFavourite,
}) => {
  return (
    <>
      {books.map((book) => {
        const isInShelf = isBookInShelf(book.id, shelves ?? []);
        const favouriteObj = favourites.find((fav) => fav.bookId === book.id);
        const isFavorite = !!favouriteObj;
        const favouriteId = favouriteObj?.id;
        const isDisabled = pendingFavouritesActions.includes(book.id);

        return (
          <BookRow
            key={book.id}
            book={book}
            isInShelf={isInShelf}
            isFavorite={isFavorite}
            favouriteId={favouriteId}
            onClickPreview={onClickPreview}
            handleFavoriteClick={onRemoveFavourite}
            disabled={isDisabled}
          />
        );
      })}
    </>
  );
};

export default FavouriteBookList;
