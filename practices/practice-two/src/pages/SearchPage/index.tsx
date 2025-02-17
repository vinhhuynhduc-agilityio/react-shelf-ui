// hooks
import { useFetchBooks } from '@/hooks/useFetchBooks';

// stores
import { useUserStore } from '@/stores/userStore';
import { useBookStore } from '@/stores/bookStore';

// components
import HeartIcon from '@/components/HeartIcon';
import StatusBadge from '@/components/StatusBadge';
import Button from '@/components/Button';

const SearchPage: React.FC = () => {
  const { isLoading, isError, error } = useFetchBooks();
  const books = useBookStore(state => state.books);
  const currentUser = useUserStore(state => state.currentUser);

  if (isLoading && books.length === 0) return <p>Loading books...</p>;
  if (isError) return <p className="text-red-500">Error loading books: {error?.message}</p>;
  if (!books.length) return <p className="text-gray-600">No books available.</p>;

  return (
    <div className="overflow-x-auto text-[#4D4D4D]">
      {/* Header */}
      <div className="grid xl:grid-cols-[340px_100px_130px_130px_60px_auto]  lg:grid-cols-[300px_60px_80px_85px_20px_auto] md:grid-cols-[110px_80px_100px_100px_40px_auto] sm:grid-cols-[95px_80px_90px_30px_auto] grid-cols-[95px_80px_30px_auto] gap-4 pb-2 border-gray-300 p-4">
        <div className="font-medium text-left">Title</div>
        <div className="font-medium text-left hidden md:block">Ratings</div>
        <div className="font-medium text-left hidden sm:block">Category</div>
        <div className="font-medium text-left">Status</div>
        <div className="font-medium text-center"></div>
        <div className="font-medium text-center"></div>
      </div>

      {/* Rows */}
      <div className="space-y-4 mt-4">
        {books.map((book) => {
          const isInShelf = currentUser?.shelf.some((s) => s.bookId === book.id);
          const isFavorite = currentUser?.favourites?.includes(book.id) ?? false;

          return (
            <div
              key={book.id}
              className="grid xl:grid-cols-[340px_100px_130px_130px_60px_auto] lg:grid-cols-[300px_60px_80px_85px_20px_auto] md:grid-cols-[110px_80px_100px_100px_40px_auto] grid-cols-[95px_80px_30px_auto] gap-4 p-4 border border-gray-200 rounded-[10px] shadow-sm bg-white items-center sm:grid-cols-[95px_80px_90px_30px_auto]"
            >
              <div className="flex items-center space-x-3">
                <div className="w-[75px] h-[99px] min-w-[75px] min-h-[99px] flex items-center justify-center">
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover border border-gray-200 rounded-[6px]"
                  />
                </div>
                <div className="hidden lg:flex flex-col">
                  <p className="font-medium text-[16px] leading-[22px] truncate max-w-[200px]">
                    {book.title}
                  </p>
                  <p className=" text-gray-500 lg:text-[15px] text-[13px]">
                    {book.author.name}, {book.publishedYear}
                  </p>
                </div>
              </div>
              <div className="text-left lg:text-[15px] text-[13px] hidden md:block">{book.rating}/5</div>
              <div className="text-left lg:text-[15px] text-[13px] hidden sm:block">{book.category}</div>
              <div className="text-left">
                <StatusBadge status={isInShelf ? 'In-Shelf' : 'None'} />
              </div>
              <div className="text-center">
                <HeartIcon filled={isFavorite} className="w-6 h-6" />
              </div>
              <div className="text-center">
                <Button variant="outline">Preview</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchPage;
