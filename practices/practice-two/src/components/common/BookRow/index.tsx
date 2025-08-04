import { memo, useCallback } from "react";

// types
import { Book } from "@/types";

// components
import {
  Button,
  StatusBadge,
  FavouriteIcon,
  ParagraphMessage,
} from "@/components";

interface RowBookProps {
  book: Book;
  isInShelf: boolean;
  isFavorite: boolean;
  disabled?: boolean;
  favouriteId?: string;
  onClickPreview: (book: Book) => void;
  handleFavoriteClick: (book: Book, favouriteId?: string) => void;
}

const BookRow: React.FC<RowBookProps> = memo(
  ({
    book,
    isInShelf,
    isFavorite,
    disabled = false,
    favouriteId,
    onClickPreview,
    handleFavoriteClick,
  }) => {
    const handlePreviewClick = useCallback(() => {
      onClickPreview(book);
    }, [onClickPreview, book]);

    const onClickFavorite = useCallback(() => {
      handleFavoriteClick(book, favouriteId);
    }, [handleFavoriteClick, book, favouriteId]);

    return (
      <div className="grid xl:grid-cols-[340px_100px_130px_130px_60px_auto] lg:grid-cols-[280px_60px_80px_85px_20px_auto] md:grid-cols-[110px_80px_100px_88px_28px_auto] grid-cols-[95px_80px_30px_auto] gap-4 p-4 border border-gray-200 rounded-[10px] shadow-sm bg-white items-center sm:grid-cols-[95px_80px_90px_30px_auto]">
        <div className="flex items-center space-x-3">
          {/* Book Image */}
          <div className="w-[75px] h-[99px] min-w-[75px] min-h-[99px] flex items-center justify-center">
            <img
              src={book.imageUrl}
              alt={book.title}
              className="w-full h-full object-cover border border-gray-200 rounded-[6px]"
            />
          </div>
          {/* Book Details */}
          <div className="hidden lg:flex flex-col">
            <ParagraphMessage
              text={book.title}
              className="font-medium text-[16px] leading-[22px] max-w-[200px] overflow-hidden text-ellipsis line-clamp-2"
            />
            <ParagraphMessage
              text={`${book.author.name}, ${book.publishedYear}`}
              className="text-gray-500 lg:text-[15px] text-[13px]"
            />
          </div>
        </div>
        {/* rating */}
        <div className="text-left lg:text-[15px] text-[13px] hidden md:block">
          {book.rating}/5
        </div>
        {/* category */}
        <div className="text-left lg:text-[15px] text-[13px] hidden sm:block">
          {book.category}
        </div>
        {/* status */}
        <div className="text-left">
          <StatusBadge status={isInShelf ? "In-Shelf" : "None"} />
        </div>
        <button
          className="hover:scale-110 transition-all"
          onClick={onClickFavorite}
          aria-label="Toggle favorite"
          disabled={disabled}
        >
          <FavouriteIcon
            filled={isFavorite}
            className="lg:w-[20px] lg:h-[18px] w-[17px] h-[15px]"
          />
        </button>
        <div className="text-center">
          <Button
            variant="outline"
            onClick={handlePreviewClick}
            label="Preview"
            additionalClasses="text-[12px] w-[70px] h-[25px] md:w-[85px] md:h-[30px] lg:w-[90px] lg:h-[35px] md:text-[14px]"
          />
        </div>
      </div>
    );
  }
);
export default BookRow;
