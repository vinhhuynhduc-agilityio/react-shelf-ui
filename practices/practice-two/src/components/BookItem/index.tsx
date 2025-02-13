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

interface BookItemProps {
  book: Book;
}

const BookItem: React.FC<BookItemProps> = ({ book }) => {
  return (
    <div className="w-full bg-white p-3 rounded-lg shadow-sm">
      <img
        src={book.imageUrl}
        alt={book.title}
        className="w-full h-[200px] object-cover rounded-lg"
      />
      <h3 className="text-sm sm:text-base font-medium mt-2 truncate text-gray-600">{book.title}</h3>
      <p className="text-xs sm:text-sm text-gray-500">{book.author.name}, {book.publishedYear}</p>
      <p className="text-xs sm:text-sm font-semibold text-gray-600">⭐ {book.rating}/5</p>
    </div>
  );
};

export default BookItem;
