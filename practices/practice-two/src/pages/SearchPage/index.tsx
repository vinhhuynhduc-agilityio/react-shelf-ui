import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";

// hooks
import {
  useAddFavouriteItem,
  useBooksQuery,
  useGetAndStoreFavourites,
  useGetMyShelf,
  useRemoveFavouriteItem,
} from "@/hooks";

// stores
import { useFavouritesStore, useSearchStore, useUserStore } from "@/stores";

// types
import { Book, UserBook } from "@/types";

// helpers
import { filterBooks } from "@/helpers";

// components
import {
  ErrorAlert,
  BookRowSkeleton,
  BookList,
  BookListHeader,
  ParagraphMessage,
} from "@/components";

// constants
import { ROUTE } from "@/constants";

// services
import { QUERY_KEY_MY_FAVOURITE } from "@/services";

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUser } = useUserStore();

  // Fetch data from the API;
  const {
    data: books = [],
    isLoading,
    isError: isErrorBooks,
    error: errorBooks,
  } = useBooksQuery();

  const {
    isError: isErrorFavourites,
    isFetching: isFetchingFavourites,
    error: errorFavourites,
  } = useGetAndStoreFavourites(currentUser?.id || "");

  const {
    data: shelves,
    isFetching: isFetchingShelf,
    isError: isErrorShelf,
    error: errorShelf,
  } = useGetMyShelf(currentUser?.id || "");

  // states
  const [favouritesChanged, setFavouritesChanged] = useState(false);

  // stores
  const { searchTerm, selectedFilter } = useSearchStore();
  const { favourites, setFavourites, pendingFavouritesActions } =
    useFavouritesStore();

  // API hooks
  const { mutate: addFavourite } = useAddFavouriteItem();
  const { mutate: removeFavourite } = useRemoveFavouriteItem();

  useEffect(() => {
    return () => {
      // Invalidate the favourites query if there are changes
      // when the component unmounts or dependencies change
      if (favouritesChanged) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEY_MY_FAVOURITE(currentUser?.id || ""),
        });
        setFavouritesChanged(false);
      }
    };
  }, [setFavouritesChanged, queryClient, currentUser?.id, favouritesChanged]);

  // Filter books based on search term and selected filter
  const filteredBooks = filterBooks(books, searchTerm, selectedFilter);

  // Navigate to book preview page with book details and from route
  const handleClickPreview = useCallback(
    (book: Book) =>
      navigate(`${ROUTE.BOOK_PREVIEW}/${book.id}`, {
        state: { from: ROUTE.SEARCH },
      }),
    [navigate]
  );

  // Handle favorite click to add/remove from favourites
  const handleFavoriteClick = (
    book: Book,
    favouriteId: string,
    isFavorite?: boolean
  ) => {
    const userId = currentUser?.id || "";
    const prevFavourites = favourites || [];

    const favouriteItem: UserBook = {
      id: favouriteId || uuidv4(),
      bookId: book.id,
      userId,
    };

    const updateOnError = () => setFavourites(prevFavourites);

    // Remove favourite
    if (isFavorite) {
      const updated = prevFavourites.filter((fav) => fav.bookId !== book.id);
      setFavourites(updated);
      setFavouritesChanged(true);

      removeFavourite(favouriteItem, {
        onError: updateOnError,
      });

      return;
    }

    // Add favourite
    setFavourites([...prevFavourites, favouriteItem]);
    setFavouritesChanged(true);

    addFavourite(favouriteItem, {
      onError: updateOnError,
    });
  };

  const hasApiError = isErrorBooks || isErrorFavourites || isErrorShelf;
  const showSkeleton = isLoading || isFetchingFavourites || isFetchingShelf;
  const hasFilteredData = filteredBooks.length > 0;
  const hasOriginalData = books.length > 0;
  const showErrorBook = !showSkeleton && hasApiError;
  const showNoBooksAvailable =
    !hasOriginalData && !showSkeleton && !hasApiError;
  const showNoBooksFound =
    !showSkeleton && !hasFilteredData && !hasApiError && hasOriginalData;
  const showBookSearchList =
    !showSkeleton && !hasApiError && hasFilteredData && hasOriginalData;

  const renderApiError = () => {
    const apiErrorMessages = [
      isErrorBooks ? errorBooks?.message : null,
      isErrorFavourites ? errorFavourites?.message : null,
      isErrorShelf ? errorShelf?.message : null,
    ];

    return (
      <ErrorAlert
        title="Failed to load search data"
        errors={apiErrorMessages}
      />
    );
  };

  const renderSkeleton = () => <BookRowSkeleton />;

  const renderNoBooksAvailable = () => (
    <ParagraphMessage text="No books available." className="text-gray-600" />
  );

  const renderNoBooksFound = () => (
    <ParagraphMessage
      text="No books found."
      className="text-xl font-semibold text-red-400 mt-9 ml-8"
    />
  );

  const renderBookSearchList = () => (
    <BookList
      books={filteredBooks}
      shelves={shelves ?? []}
      favourites={favourites ?? []}
      pendingFavouritesActions={pendingFavouritesActions}
      onClickPreview={handleClickPreview}
      handleFavoriteClick={handleFavoriteClick}
    />
  );

  return (
    <div className="overflow-x-auto text-[#4D4D4D]">
      {/* Header */}
      <BookListHeader />

      {/* Rows */}
      <div className="space-y-4 mt-4">
        {showSkeleton && renderSkeleton()}
        {showErrorBook && renderApiError()}
        {showNoBooksAvailable && renderNoBooksAvailable()}
        {showNoBooksFound && renderNoBooksFound()}
        {showBookSearchList && renderBookSearchList()}
      </div>
    </div>
  );
};

export default SearchPage;
