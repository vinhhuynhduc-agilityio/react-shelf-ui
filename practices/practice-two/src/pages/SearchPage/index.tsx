import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";

// hooks
import {
  useAddFavouriteItem,
  useFetchBooks,
  useFetchFavourites,
  useGetMyShelf,
  useRemoveFavouriteItem,
} from "@/hooks";

// stores
import {
  useBookStore,
  useFavouritesStore,
  useSearchFilterStore,
  usePendingFavouritesStore,
  useSearchStore,
  useUserStore,
  useFavouritesChangedStore,
} from "@/stores";

// types
import { Book, FavouriteItem } from "@/types";

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
  const currentUser = useUserStore((state) => state.currentUser);

  // Fetch data from the API
  const {
    isLoading,
    isError: isErrorBooks,
    error: errorBooks,
  } = useFetchBooks();
  const {
    isError: isErrorFavourites,
    isFetching: isFetchingFavourites,
    error: errorFavourites,
  } = useFetchFavourites(currentUser?.id || "");
  const {
    data: shelves,
    isFetching: isFetchingShelf,
    isError: isErrorShelf,
    error: errorShelf,
  } = useGetMyShelf(currentUser?.id || "");

  const books = useBookStore((state) => state.books);
  const searchFromSidebar = useSearchStore((state) => state.searchFromSidebar);
  const searchTerm = useSearchStore((state) => state.searchTerm);
  const selectedFilter = useSearchFilterStore((state) => state.selectedFilter);
  const pendingFavouritesActions = usePendingFavouritesStore(
    (state) => state.pendingFavouritesActions
  );
  const setFavourites = useFavouritesStore((state) => state.setFavourites);
  const favourites = useFavouritesStore((state) => state.favourites);
  const favouritesChanged = useFavouritesChangedStore(
    (s) => s.favouritesChanged
  );
  const setFavouritesChanged = useFavouritesChangedStore(
    (s) => s.setFavouritesChanged
  );

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
  const filteredBooks = filterBooks(
    books,
    searchTerm,
    selectedFilter,
    searchFromSidebar
  );

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

    const favouriteItem: FavouriteItem = {
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

  return (
    <div className="overflow-x-auto text-[#4D4D4D]">
      {/* Header */}
      <HeaderRow />

      {/* Rows */}
      <div className="space-y-4 mt-4">
        {(() => {
          if (isLoading || isFetchingFavourites || isFetchingShelf) {
            return <BookRowSkeleton />;
          }

          if (isErrorBooks || isErrorFavourites || isErrorShelf) {
            return (
              <ApiErrorNotice
                title="Failed to load search data"
                errors={[
                  isErrorBooks ? errorBooks?.message : null,
                  isErrorFavourites ? errorFavourites?.message : null,
                  isErrorShelf ? errorShelf?.message : null,
                ]}
              />
            );
          }

          if (books.length === 0) {
            return (
              <ParagraphMessage
                text="No books available."
                className="text-gray-600"
              />
            );
          }

          if (filteredBooks.length === 0) {
            return (
              <ParagraphMessage
                text="No books found."
                className="text-xl font-semibold text-red-400 mt-9 ml-8"
              />
            );
          }

          return (
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
        })()}
      </div>
    </div>
  );
};

export default SearchPage;
