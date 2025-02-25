// types
import { Book } from "@/types";

// components
import { Button, HeartIcon, StatusBadge } from "@/components";

interface RowBookProps {
  book: Book;
  isInShelf: boolean;
  isFavorite: boolean;
  onClickPreview: (book: Book) => void;
  handleFavoriteClick: () => void;
};

const BookRow: React.FC<RowBookProps> = ({
  book,
  isInShelf,
  isFavorite,
  onClickPreview,
  handleFavoriteClick
}) => {
  return (
    <div className="grid xl:grid-cols-[340px_100px_130px_130px_60px_auto] lg:grid-cols-[300px_60px_80px_85px_20px_auto] md:grid-cols-[110px_80px_100px_100px_40px_auto] grid-cols-[95px_80px_30px_auto] gap-4 p-4 border border-gray-200 rounded-[10px] shadow-sm bg-white items-center sm:grid-cols-[95px_80px_90px_30px_auto]">
      <div className="flex items-center space-x-3">
        <div className="w-[75px] h-[99px] min-w-[75px] min-h-[99px] flex items-center justify-center">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="w-full h-full object-cover border border-gray-200 rounded-[6px]"
          />
        </div>
        <div className="hidden lg:flex flex-col">
          <p className="font-medium text-[16px] leading-[22px] max-w-[200px] overflow-hidden text-ellipsis line-clamp-2">
            {book.title}
          </p>
          <p className="text-gray-500 lg:text-[15px] text-[13px]">
            {book.author.name}, {book.publishedYear}
          </p>
        </div>
      </div>
      <div className="text-left lg:text-[15px] text-[13px] hidden md:block">{book.rating}/5</div>
      <div className="text-left lg:text-[15px] text-[13px] hidden sm:block">{book.category}</div>
      <div className="text-left">
        <StatusBadge status={isInShelf ? "In-Shelf" : "None"} />
      </div>
      <button
        className="hover:scale-110 transition-all"
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <HeartIcon filled={isFavorite} className="w-6 h-6" />
      </button>
      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => onClickPreview(book)}
        >
          Preview
        </Button>
      </div>
    </div>
  );
};

export default BookRow;
