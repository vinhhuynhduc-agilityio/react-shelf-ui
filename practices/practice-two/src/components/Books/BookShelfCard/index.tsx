import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// types
import { Book } from "@/types";

// components
import { BookItem, Button, ParagraphMessage } from "@/components";

// constants
import { ROUTE } from "@/constants";

interface BookCardProps {
  book: Book;
  borrowedDate: string;
  onReturn: (bookId: string) => void;
  disabled?: boolean;
}

const BookShelfCard = memo(
  ({ book, borrowedDate, onReturn, disabled = false }: BookCardProps) => {
    const navigate = useNavigate();

    const handleBookClick = useCallback(
      (bookId: string) => {
        navigate(`${ROUTE.BOOK_PREVIEW}/${bookId}`, {
          state: { from: ROUTE.MY_SHELF },
        });
      },
      [navigate]
    );

    const handleReturn = useCallback(() => {
      onReturn(book.id);
    }, [onReturn, book.id]);

    return (
      <div className="flex items-center bg-white rounded-lg shadow-md p-4 w-[308px] h-[260px]">
        <div className="w-3/5">
          <BookItem {...book} onClick={handleBookClick} />
        </div>
        <div className="w-2/5 flex flex-col justify-between items-center h-full ml-2">
          <div>
            <ParagraphMessage
              text="Borrowed on"
              className="md:text-[15px] text-[13px] text-[#4D4D4D]"
            />
            <ParagraphMessage
              text={borrowedDate}
              className="text-[10px] font-semibold text-[#747373]"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleReturn}
            disabled={disabled}
            label="Return"
          />
        </div>
      </div>
    );
  }
);

export default BookShelfCard;
