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
    <div className="w-[174px] flex-shrink-0 bg-white p-4 rounded-lg shadow-sm">
      <img
        src={book.imageUrl}
        alt={book.title}
        className="w-full h-[200px] object-cover rounded-lg"
      />
      <h3 className="text-sm font-medium mt-2 truncate">{book.title}</h3>
      <p className="text-xs text-gray-500">{book.author.name}, {book.publishedYear}</p>
      <p className="text-xs font-semibold">⭐ {book.rating}/5</p>
    </div>
  );
};

export default BookItem;
