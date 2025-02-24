
// components
import { BookItem } from "@/components";

// types
import { Book } from "@/types";

interface BookListProps {
  books: Book[];
  title: string;
};

const BookHomeList: React.FC<BookListProps> = ({ books, title }) => {
  return (
    <div className="mb-6 w-full">
      <h2 className="text-[22px] sm:text-[24px] md:text-[25px]  text-gray-500 mb-4 font-normal">
        {title}
      </h2>
      <div className="w-full md:overflow-x-auto sm:overflow-x-auto md:whitespace-nowrap">
        <div className="grid grid-cols-2 gap-y-4 md:flex md:space-x-4 sm:flex sm:space-x-4">
          {books.map((book) => (
            <div key={book.id} className="flex-shrink-0 w-[180px]">
              <BookItem book={book} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookHomeList;
