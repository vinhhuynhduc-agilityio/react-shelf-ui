import { useNavigate } from 'react-router-dom';

// hooks
import { useFetchBooks } from '@/hooks/useFetchBooks';

// stores
import { useBookStore, useFilterStore, useSearchStore, useUserStore } from '@/stores';

// types
import { Book } from '@/types';

// helpers
import { isBookInShelf } from '@/helpers';

// components
import { BookRow, HeaderRow } from '@/components';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading, isError, error } = useFetchBooks();
  const books = useBookStore(state => state.books);
  const currentUser = useUserStore(state => state.currentUser);
  const searchFromSidebar = useSearchStore(state => state.searchFromSidebar);
  const searchTerm = useSearchStore(state => state.searchTerm);
  const selectedFilter = useFilterStore(state => state.selectedFilter);

  const filteredBooks = searchFromSidebar
    ? books
    : books.filter((book) => {
      const filterValue = selectedFilter === 'Title'
        ? book.title
        : selectedFilter === 'Author'
          ? book.author.name
          : selectedFilter === 'Subjects'
            ? book.category
            : '';

      return filterValue && filterValue.toLowerCase().includes(searchTerm.toLowerCase());
    });

  if (isLoading && books.length === 0) return <p>Loading books...</p>;
  if (isError) return <p className="text-red-500">Error loading books: {error?.message}</p>;
  if (!books.length) return <p className="text-gray-600">No books available.</p>;

  const handleCLickPreview = (book: Book) => navigate(`/book-preview/${book.id}`, {
    state: {
      book,
      from: "/search"
    }
  });

  return (
    <div className="overflow-x-auto text-[#4D4D4D]">
      {/* Header */}
      <HeaderRow />

      {/* Rows */}
      <div className="space-y-4 mt-4">
        {filteredBooks.length === 0 ? (
          <p className="text-xl font-semibold text-red-400 mt-9 ml-8">No books found.</p>
        ) : (
          filteredBooks.map((book) => {
            const isInShelf = isBookInShelf(book.id, currentUser?.shelf ?? [])
            const isFavorite = currentUser?.favourites?.includes(book.id) ?? false;

            return (
              <BookRow
                key={book.id}
                book={book}
                isInShelf={isInShelf}
                isFavorite={isFavorite}
                onClickPreview={handleCLickPreview}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default SearchPage;
