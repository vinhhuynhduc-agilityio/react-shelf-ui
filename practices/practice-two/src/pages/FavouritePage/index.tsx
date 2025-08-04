import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

// stores
import {
  useFavouritesStore,
  usePendingFavouritesStore,
  useUserStore,
} from "@/stores";

// types
import { Book } from "@/types";

// components
import {
  ApiErrorNotice,
  IconButton,
  BookRowSkeleton,
  HeaderRow,
  ParagraphMessage,
  FavouriteBookList,
} from "@/components";
import { ArrowBackIcon } from "@/components/icons";

// hooks
import {
  useBooksQuery,
  useFetchFavourites,
  useGetMyShelf,
  useRemoveFavouriteItem,
} from "@/hooks";

// constants
import { QUERY_KEY_MY_FAVOURITE, ROUTE } from "@/constants";

// helpers
import { filterFavouritedBooks } from "@/helpers";

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
  } = useFetchFavourites(currentUser?.id || "");
  const { data: shelves } = useGetMyShelf(currentUser?.id || "");

  // states
  const [favouritesChanged, setFavouritesChanged] = useState(false);

  // store
  const { pendingFavouritesActions = [] } = usePendingFavouritesStore();
  const { favourites, setFavourites } = useFavouritesStore();

  // API hooks
  const { mutate: removeFavourite } = useRemoveFavouriteItem();

  // refs
  const favouritesChangedRef = useRef(favouritesChanged);
  const setFavouritesChangedRef = useRef(setFavouritesChanged);

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

  // Filter books by favourites
  const filteredBooks = filterFavouritedBooks(books, favourites);

  // Navigate to book preview page with book details and from route
  const handleCLickPreview = useCallback(
    (book: Book) =>
      navigate(`${ROUTE.BOOK_PREVIEW}/${book.id}`, {
        state: {
          book,
          from: ROUTE.FAVOURITE,
        },
      }),
    [navigate]
  );

  // Handle back navigation
  const handleClickBack = () => navigate(ROUTE.MY_SHELF);

  // Handle favorite click to remove from favourites
  const handleFavoriteClick = useCallback(
    (book: Book, favouriteId?: string) => {
      const removeItem = {
        bookId: book.id,
        id: favouriteId || "",
        userId: currentUser?.id || "",
      };
      const prevFavourites = favourites || [];
      setFavourites(prevFavourites.filter((fav) => fav.bookId !== book.id));

      // Remove from favourites
      removeFavourite(removeItem, {
        onSuccess: () => {
          setFavouritesChanged(true);
        },
        onError: () => {
          // Revert on error
          setFavourites(prevFavourites);
        },
      });
    },
    [
      currentUser,
      favourites,
      removeFavourite,
      setFavourites,
      setFavouritesChanged,
    ]
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
        <HeaderRow />

        {/* Main content */}
        <div className="space-y-4 mt-4">
          {(() => {
            if (isLoading || isFetchingFavourites) {
              return <BookRowSkeleton />;
            }

            if (isErrorBooks || isErrorFavourites) {
              return (
                <ApiErrorNotice
                  title="Failed to load favourites data"
                  errors={[
                    isErrorBooks ? errorBooks?.message : null,
                    isErrorFavourites ? errorFavourites?.message : null,
                  ]}
                />
              );
            }

            if (filteredBooks.length === 0) {
              return (
                <ParagraphMessage
                  text="No books found in your favourites."
                  className="text-xl font-semibold text-red-400 mt-9 ml-8"
                />
              );
            }

            return (
              <FavouriteBookList
                books={filteredBooks}
                favourites={favourites ?? []}
                shelves={shelves ?? []}
                pendingFavouritesActions={pendingFavouritesActions}
                onClickPreview={handleCLickPreview}
                onRemoveFavourite={handleFavoriteClick}
              />
            );
          })()}
        </div>
      </div>
    </>
  );
};

export default FavouritePage;
