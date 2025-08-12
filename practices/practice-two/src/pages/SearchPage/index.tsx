import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";

// hooks
import {
  useAddFavouriteItem,
  useBooksQuery,
  useFetchAndStoreFavourites,
  useGetMyShelf,
  useRemoveFavouriteItem,
} from "@/hooks";

// stores
import {
  useFavouritesStore,
  usePendingFavouritesStore,
  useSearchStore,
  useUserStore,
} from "@/stores";

// types
import { Book, UserBook } from "@/types";

// helpers
import { filterBooks, isBookInShelf } from "@/helpers";

// components
import {
  ApiErrorNotice,
  BookRowSkeleton,
  BookSearchList,
  HeaderRow,
  ParagraphMessage,
} from "@/components";

// constants
import { QUERY_KEY_MY_FAVOURITE, ROUTE } from "@/constants";

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
  } = useFetchAndStoreFavourites(currentUser?.id || "");
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
  const { pendingFavouritesActions } = usePendingFavouritesStore();
  const { favourites, setFavourites } = useFavouritesStore();

  // refs
  const favouritesChangedRef = useRef(favouritesChanged);
  const setFavouritesChangedRef = useRef(setFavouritesChanged);

  // API hooks
  const { mutate: addFavourite } = useAddFavouriteItem();
  const { mutate: removeFavourite } = useRemoveFavouriteItem();

  useEffect(() => {
    favouritesChangedRef.current = favouritesChanged;
  }, [favouritesChanged]);

  useEffect(() => {
    setFavouritesChangedRef.current = setFavouritesChanged;

    return () => {
      // Invalidate the favourites query if there are changes
      // when the component unmounts or dependencies change
      if (favouritesChangedRef.current) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEY_MY_FAVOURITE(currentUser?.id || ""),
        });
        setFavouritesChangedRef.current(false);
      }
    };
  }, [setFavouritesChanged, queryClient, currentUser?.id]);

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
    isFavorite: boolean,
    favouriteId?: string
  ) => {
    const userId = currentUser?.id || "";
    const prevFavourites = favourites || [];

    const favouriteItem: UserBook = {
      id: favouriteId || uuidv4(),
      bookId: book.id,
      userId,
    };

    const updateOnError = () => setFavourites(prevFavourites);
    const updateOnSuccess = () => setFavouritesChanged(true);

    if (isFavorite) {
      // Remove
      const updated = prevFavourites.filter((fav) => fav.bookId !== book.id);
      setFavourites(updated);

      removeFavourite(favouriteItem, {
        onSuccess: updateOnSuccess,
        onError: updateOnError,
      });
    } else {
      // Add
      setFavourites([...prevFavourites, favouriteItem]);

      addFavourite(favouriteItem, {
        onSuccess: updateOnSuccess,
        onError: updateOnError,
      });
    }
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
      <ApiErrorNotice
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
    <BookSearchList
      books={filteredBooks}
      shelves={shelves ?? []}
      favourites={favourites ?? []}
      pendingFavouritesActions={pendingFavouritesActions}
      handleClickPreview={handleClickPreview}
      handleFavoriteClick={handleFavoriteClick}
      isBookInShelf={isBookInShelf}
    />
  );

  return (
    <div className="overflow-x-auto text-[#4D4D4D]">
      {/* Header */}
      <HeaderRow />

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
