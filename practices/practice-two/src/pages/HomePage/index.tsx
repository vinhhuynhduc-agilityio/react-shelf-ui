// hooks
import { useBooksQuery, useGetMyShelf } from "@/hooks";

// stores
import { useUserStore } from "@/stores";

// components
import { BookHomeListWithBoundary, TodayQuote } from "@/components";

// types
import { Book } from "@/types/books";

// helpers
import { filterBooksByShelves } from "@/helpers";

const HomePage: React.FC = () => {
  const { currentUser } = useUserStore();

  // Fetch books and shelves from the API
  const {
    data: books,
    isLoading: isLoadingBooks,
    isError,
    error,
  } = useBooksQuery();
  const { data: shelf, isLoading: isLoadingShelf } = useGetMyShelf(
    currentUser?.id || ""
  );

  const recommendedBooks = (books ?? []).slice(0, 8);

  // Simulated recent readings display; no update feature yet.
  const recentReadings: Book[] = filterBooksByShelves(books ?? [], shelf ?? []);

  const isLoadingRecent = isLoadingShelf || isLoadingBooks;

  return (
    <div>
      <TodayQuote />
      <h1 className="mb-4 mt-10 text-[35px] font-semibold text-gray-600">
        Good Morning
      </h1>
      <BookHomeListWithBoundary
        title="Recommended for You"
        books={recommendedBooks}
        isLoading={isLoadingBooks}
        isError={isError}
        errorMessage={error?.message}
      />
      <BookHomeListWithBoundary
        title="Recent Readings"
        books={recentReadings}
        isLoading={isLoadingRecent}
        isError={isError}
        errorMessage={error?.message}
      />
    </div>
  );
};

export default HomePage;
