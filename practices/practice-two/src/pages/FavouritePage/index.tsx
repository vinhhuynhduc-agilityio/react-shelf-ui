import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

// stores
import { useFavouritesStore, useUserStore } from "@/stores";

// types
import { Book } from "@/types";

// components
import {
  ErrorAlert,
  IconButton,
  BookRowSkeleton,
  BookListHeader,
  ParagraphMessage,
  BookList,
} from "@/components";
import { ArrowBackIcon } from "@/components/icons";

// hooks
import {
  useBooksQuery,
  useGetFavourites,
  useGetMyShelf,
  useRemoveFavouriteItem,
} from "@/hooks";

// constants
import { ROUTE } from "@/constants";

// helpers
import { filterFavouritedBooks } from "@/helpers";

// services
import { QUERY_KEY_MY_FAVOURITE } from "@/services";

const FavouritePage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUser } = useUserStore();

  // Fetch data from the API
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
  } = useGetFavourites(currentUser?.id || "");
  const { data: shelves } = useGetMyShelf(currentUser?.id || "");

  // states
  const [favouritesChanged, setFavouritesChanged] = useState(false);

  // store
  const { favourites, setFavourites, pendingFavouritesActions } =
    useFavouritesStore();

  // API hooks
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

  // Filter books by favourites
  const filteredBooks = filterFavouritedBooks(books, favourites);

  // Navigate to book preview page with book details and from route
  const handleCLickPreview = (book: Book) =>
    navigate(`${ROUTE.BOOK_PREVIEW}/${book.id}`, {
      state: {
        book,
        from: ROUTE.FAVOURITE,
      },
    });

  // Handle back navigation
  const handleClickBack = () => navigate(ROUTE.MY_SHELF);

  // Handle favorite click to remove from favourites
  const handleFavoriteClick = (book: Book, favouriteId?: string) => {
    const removeItem = {
      bookId: book.id,
      id: favouriteId || "",
      userId: currentUser?.id || "",
    };
    const prevFavourites = favourites || [];
    setFavourites(prevFavourites.filter((fav) => fav.bookId !== book.id));
    setFavouritesChanged(true);

    // Remove from favourites
    removeFavourite(removeItem, {
      onError: () => {
        // Revert on error
        setFavourites(prevFavourites);
      },
    });
  };

  const showSkeleton = isLoading || isFetchingFavourites;
  const hasApiError = isErrorBooks || isErrorFavourites;
  const hasFilteredData = filteredBooks.length > 0;
  const showErrorBook = !showSkeleton && hasApiError;
  const showNoBooksFound = !showSkeleton && !hasFilteredData && !hasApiError;
  const showFavouritesBookList =
    !showSkeleton && !hasApiError && hasFilteredData;

  const renderSkeleton = () => <BookRowSkeleton />;

  const renderApiError = () => (
    <ErrorAlert
      title="Failed to load favourites data"
      errors={[
        isErrorBooks ? errorBooks?.message : null,
        isErrorFavourites ? errorFavourites?.message : null,
      ]}
    />
  );

  const renderNoBooksFound = () => (
    <ParagraphMessage
      text="No books found in your favourites."
      className="text-xl font-semibold text-red-400 mt-9 ml-8"
    />
  );

  const renderFavouritesBookList = () => (
    <BookList
      books={filteredBooks}
      favourites={favourites ?? []}
      shelves={shelves ?? []}
      pendingFavouritesActions={pendingFavouritesActions}
      onClickPreview={handleCLickPreview}
      handleFavoriteClick={handleFavoriteClick}
    />
  );

  return (
    <>
      <IconButton
        icon={ArrowBackIcon}
        label="Back"
        iconPosition="left"
        onClick={handleClickBack}
        additionalClasses="flex items-center text-gray-600 hover:text-gray-800 transition-all mb-4"
        classNameIcon="mr-[9px]"
      />
      <h1 className="md:text-[25px] text-[20px] font-semibold text-[#4D4D4D] mb-6">
        Your Favourite
      </h1>

      <div className="overflow-x-auto text-[#4D4D4D]">
        {/* Header */}
        <BookListHeader />

        {/* Main content */}
        <div className="space-y-4 mt-4">
          {showSkeleton && renderSkeleton()}
          {showErrorBook && renderApiError()}
          {showNoBooksFound && renderNoBooksFound()}
          {showFavouritesBookList && renderFavouritesBookList()}
        </div>
      </div>
    </>
  );
};

export default FavouritePage;
