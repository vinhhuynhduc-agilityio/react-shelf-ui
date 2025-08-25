// components
import { BookHomeList, ErrorBoundary, ParagraphMessage } from "@/components";

// types
import { Book } from "@/types";

interface BookHomeListWithBoundaryProps {
  books: Book[];
  title: string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  skeletonCount?: number;
}

const BookHomeListWithBoundary: React.FC<BookHomeListWithBoundaryProps> = ({
  title,
  ...restProps
}) => {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center p-4 bg-red-100 border border-red-400 text-red-800 rounded-lg shadow-md">
          <ParagraphMessage
            text={`Error loading ${title.toLowerCase()}.`}
            className="font-semibold text-lg"
          />
        </div>
      }
    >
      <BookHomeList title={title} {...restProps} />
    </ErrorBoundary>
  );
};

export default BookHomeListWithBoundary;
