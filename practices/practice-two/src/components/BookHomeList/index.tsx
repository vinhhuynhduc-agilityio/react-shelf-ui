import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// components
import {
  ApiErrorNotice,
  BookItem,
  ParagraphMessage,
  Skeleton,
} from "@/components";

// constants
import { ERROR_MESSAGE, ROUTE } from "@/constants";

// types
import { Book } from "@/types";

interface BookListProps {
  books: Book[];
  title: string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  skeletonCount?: number;
}

const BookHomeList: React.FC<BookListProps> = ({
  books,
  title,
  isLoading = false,
  isError = false,
  errorMessage = ERROR_MESSAGE.DEFAULT,
  skeletonCount = 4,
}) => {
  const navigate = useNavigate();

  const handleBookClick = useCallback(
    (bookId: string) => {
      navigate(`${ROUTE.BOOK_PREVIEW}/${bookId}`, {
        state: { from: ROUTE.HOME },
      });
    },
    [navigate]
  );

  return (
    <div className="mb-6 w-full">
      <h2 className="text-[22px] sm:text-[24px] md:text-[25px] text-gray-500 mb-4 font-normal">
        {title}
      </h2>

      <div className="w-full md:overflow-x-auto sm:overflow-x-auto md:whitespace-nowrap">
        <div className="grid grid-cols-2 gap-y-4 md:flex md:space-x-4 sm:flex sm:space-x-4">
          {(() => {
            if (isError) {
              return (
                <ApiErrorNotice
                  title="Failed to load books data"
                  errors={[errorMessage]}
                />
              );
            }

            if (isLoading) {
              return Array.from({ length: skeletonCount }).map((_, idx) => (
                <div key={idx} className="flex-shrink-0">
                  <Skeleton
                    width={160}
                    height={260}
                    borderRadius={16}
                    additionalClasses="p-4"
                  />
                </div>
              ));
            }

            if (books.length === 0) {
              return (
                <ParagraphMessage
                  text="No books available."
                  className="mt-4 text-gray-600 col-span-full"
                />
              );
            }

            return books.map((book) => (
              <div key={book.id} className="flex-shrink-0">
                <BookItem {...book} onClick={handleBookClick} />
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
};

export default BookHomeList;
