import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

// hooks
import {
  useBooksQuery,
  useGetAndStoreMyShelf,
  useRemoveShelfItem,
} from "@/hooks";

// stores
import { usePendingShelfStore, useUserStore } from "@/stores";

// components
import {
  ErrorAlert,
  Button,
  MyShelfBookCardSkeleton,
  MyShelfBookList,
  ParagraphMessage,
} from "@/components";

// constants
import { ROUTE } from "@/constants";

// helpers
import { filterBooksByShelves } from "@/helpers";

// types
import { ShelfItem } from "@/types";

// services
import { QUERY_KEY_MY_SHELF } from "@/services";

const MyShelfPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUser } = useUserStore();

  // state
  const [shelfChanged, setShelfChanged] = useState(false);
  const [shelf, setShelf] = useState<ShelfItem[]>([]);

  // Fetch books and shelves from the API
  const {
    data: books = [],
    isLoading,
    error: errorBooks,
    isError: isErrorBooks,
  } = useBooksQuery();

  const {
    isError: isErrorShelf,
    isFetching: isFetchingShelf,
    error: errorShelf,
  } = useGetAndStoreMyShelf(currentUser?.id || "", setShelf);

  // store
  const { pendingShelfActions } = usePendingShelfStore();

  // API hooks
  const { mutate: removeShelfItem } = useRemoveShelfItem();

  useEffect(() => {
    return () => {
      // Invalidate the shelf query if there are changes
      // when the component unmounts or dependencies change
      if (shelfChanged) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEY_MY_SHELF(currentUser?.id ?? ""),
        });
        setShelfChanged(false);
      }
    };
  }, [currentUser?.id, queryClient, setShelfChanged, shelfChanged]);

  const handleReturnBook = (shelfItem: ShelfItem) => {
    const prevShelf = shelf || [];
    setShelf(
      prevShelf.filter((item: ShelfItem) => item.bookId !== shelfItem.bookId)
    );
    setShelfChanged(true);

    // Remove the book from the shelf
    removeShelfItem(shelfItem, {
      onError: () => {
        // Revert on error
        setShelf(prevShelf);
      },
    });
  };

  const handleClickFavourite = useCallback(() => {
    navigate(ROUTE.FAVOURITE);
  }, [navigate]);

  // Filter books by user's shelf
  const borrowedBooks = filterBooksByShelves(books, shelf ?? []);

  const showSkeleton = isLoading || isFetchingShelf;
  const hasApiError = isErrorBooks || isErrorShelf;
  const showErrorBooks = !showSkeleton && hasApiError;
  const showNoBooksInShelf =
    !showSkeleton && !hasApiError && borrowedBooks.length === 0;
  const showMyShelfBookList =
    !showSkeleton && !hasApiError && borrowedBooks.length > 0;

  const renderSkeleton = () => {
    return Array.from({ length: 4 }).map((_, idx) => (
      <MyShelfBookCardSkeleton key={idx} />
    ));
  };

  const renderApiError = () => (
    <ErrorAlert
      title="Failed to load shelf data"
      errors={[
        isErrorBooks ? errorBooks?.message : null,
        isErrorShelf ? errorShelf?.message : null,
      ]}
    />
  );

  const renderNoBooksInShelf = () => (
    <ParagraphMessage
      text="No books in your shelf."
      className="text-xl font-semibold text-red-400 mt-6 text-center"
    />
  );

  const renderMyShelfBookList = () => (
    <MyShelfBookList
      books={borrowedBooks}
      shelf={shelf ?? []}
      pendingShelfActions={pendingShelfActions}
      onReturnBook={handleReturnBook}
    />
  );

  return (
    <div>
      <h1 className="sm:text-[25px] text-[23px] font-bold text-[#4D4D4D] mb-6 mt-4">
        Your <span className="text-[#EF8361]">Shelf</span>
      </h1>

      <div className="flex space-x-16 pb-2 mb-6">
        <Button
          variant="text"
          label="All Books"
          additionalClasses="font-medium text-[#4D4D4D] sm:text-[20px] text-[18px]"
        />
        <Button
          variant="text"
          label="Favourite"
          onClick={handleClickFavourite}
          additionalClasses="text-[#868686] hover:text-[#bfbebe] transition sm:text-[20px] text-[18px] font-medium"
        />
      </div>

      <div className="flex flex-wrap gap-10 justify-center">
        {showSkeleton && renderSkeleton()}
        {showErrorBooks && renderApiError()}
        {showNoBooksInShelf && renderNoBooksInShelf()}
        {showMyShelfBookList && renderMyShelfBookList()}
      </div>
    </div>
  );
};

export default MyShelfPage;
