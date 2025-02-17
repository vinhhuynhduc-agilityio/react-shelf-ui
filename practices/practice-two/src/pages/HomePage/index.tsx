// hooks
import { useFetchBooks } from "@/hooks/useFetchBooks";

// stores
import { useUserStore } from "@/stores/userStore";
import { useBookStore } from "@/stores/bookStore";

// components
import { TodayQuote } from "@/components";
import BookList from "@/components/BookList";

// types
import { Book } from "@/types/books";

const HomePage: React.FC = () => {
  const { isLoading, isError, error } = useFetchBooks();

  const books = useBookStore((state) => state.books);
  const currentUser = useUserStore((state) => state.currentUser);

  if (isLoading && books.length === 0) {
    return <p>Loading books...</p>;
  }

  if (isError) {
    return <p className="text-red-500">Error loading books: {error?.message}</p>;
  }

  if (!books.length) {
    return <p className="text-gray-600">No books available.</p>;
  }

  const recommendedBooks = books.slice(0, 8);
  const recentReadings: Book[] = books
    .filter(book => currentUser?.recentReadings?.includes(book.id))
    .slice(0, 8);

  return (
    <div>
      <TodayQuote />
      <h1 className="mb-4 mt-10 text-[35px] font-semibold text-gray-600">Good Morning</h1>
      <BookList title="Recommended for You" books={recommendedBooks} />
      {recentReadings.length > 0 ? (
        <BookList title="Recent Readings" books={recentReadings} />
      ) : (
        <p className="mt-4 text-gray-600">You have no recent readings yet. Start reading to see them here!</p>
      )}
    </div>
  );
};

export default HomePage;
