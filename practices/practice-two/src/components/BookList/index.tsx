import BookItem from '@/components/BookItem';
import React from 'react';

interface Book {
  id: string;
  title: string;
  author: {
    name: string;
  };
  publishedYear: number;
  rating: number;
  imageUrl: string;
}

interface BookListProps {
  books: Book[];
  title: string;
}

const BookList: React.FC<BookListProps> = ({ books, title }) => {
  return (
    <div className="mb-6">
      <h2 className="text-[25px] font-semibold text-gray-700 mb-4">{title}</h2>
      <div className="flex overflow-x-auto space-x-4">
        {books.map((book) => (
          <BookItem key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BookList;
