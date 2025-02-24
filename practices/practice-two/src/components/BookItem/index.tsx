import { Book } from "@/types";

interface BookItemProps {
  book: Book;
};

const BookItem: React.FC<BookItemProps> = ({ book }) => {
  const { title, author, publishedYear, rating, imageUrl } = book;

  return (
    <div className="w-full bg-white p-3 rounded-lg shadow-sm h-[260px]">
      <img
        src={imageUrl}
        alt={title}
        className="w-[123px] h-[170px] object-cover rounded-lg"
      />
      <h3 className="text-sm sm:text-base font-medium mt-2 truncate text-[#4D4D4D]">{title}</h3>
      <p className="text-xs sm:text-sm text-[#4D4D4D] overflow-ellipsis whitespace-nowrap overflow-hidden">
        {author.name}, {publishedYear}</p>
      <p className="text-[12px] sm:text-[14px] text-[#4D4D4D]">{rating}<span className="text-[#A7A7A7]">/5</span></p>
    </div>
  );
};

export default BookItem;
