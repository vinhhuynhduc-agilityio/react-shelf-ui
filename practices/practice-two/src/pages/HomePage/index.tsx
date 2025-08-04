// hooks
import { useBooksQuery, useGetMyShelf } from "@/hooks";

// stores
import { useUserStore } from "@/stores";

// components
import {
  BookHomeList,
  ErrorBoundary,
  ParagraphMessage,
  TodayQuote,
} from "@/components";

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
      <ErrorBoundary
        fallback={
          <div className="flex items-center justify-center p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg shadow-md">
            <ParagraphMessage
              text="Error loading recommended books."
              className="font-semibold text-lg"
            />
          </div>
        }
      >
        <BookHomeList
          isLoading={isLoadingBooks}
          isError={isError}
          errorMessage={error?.message}
          title="Recommended for You"
          books={recommendedBooks}
        />
      </ErrorBoundary>
      <ErrorBoundary
        fallback={
          <div className="flex items-center justify-center p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg shadow-md">
            <ParagraphMessage
              text="Error loading recent readings."
              className="font-semibold text-lg"
            />
          </div>
        }
      >
        <BookHomeList
          isLoading={isLoadingRecent}
          isError={isError}
          errorMessage={error?.message}
          title="Recent Readings"
          books={recentReadings}
        />
      </ErrorBoundary>
    </div>
  );
};

export default HomePage;
