import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

// stores
import {
  useBookStore,
  useFavouritesChangedStore,
  useFavouritesStore,
  usePendingFavouritesStore,
  useUserStore,
} from "@/stores";

// types
import { Book, FavouriteItem } from "@/types";

// helpers
import { isBookInShelf } from "@/helpers";

// components
import {
  ApiErrorNotice,
  IconButton,
  BookRow,
  BookRowSkeleton,
  HeaderRow,
} from "@/components";
import { ArrowBackIcon } from "@/components/icons";

// hooks
import {
  useFetchBooks,
  useFetchFavourites,
  useGetMyShelf,
  useRemoveFavouriteItem,
} from "@/hooks";

// constants
import { QUERY_KEY_MY_FAVOURITE, ROUTE } from "@/constants";

const FavouritePage: React.FC = () => {
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
  const { data: shelves } = useGetMyShelf(currentUser?.id || "");

  // store
  const books = useBookStore((state) => state.books);
  const pendingFavouritesActions = usePendingFavouritesStore(
    (state) => state.pendingFavouritesActions
  );
  const { favourites, setFavourites } = useFavouritesStore();
  const { favouritesChanged, setFavouritesChanged } =
    useFavouritesChangedStore();

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
  const filteredBooks = books.filter((book) => {
    return favourites?.some((favourite) => favourite.bookId === book.id);
  });

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
        <HeaderRow />

        {/* Main content */}
        <div className="space-y-4 mt-4">
          {isLoading || isFetchingFavourites ? (
            <BookRowSkeleton />
          ) : isErrorBooks || isErrorFavourites ? (
            <ApiErrorNotice
              title="Failed to load favourites data"
              errors={[
                isErrorBooks ? errorBooks?.message : null,
                isErrorFavourites ? errorFavourites?.message : null,
              ]}
            />
          ) : filteredBooks.length === 0 ? (
            <p className="text-xl font-semibold text-red-400 mt-9 ml-8">
              No books found in your favourites.
            </p>
          ) : (
            filteredBooks.map((book) => {
              const isInShelf = isBookInShelf(book.id, shelves ?? []);
              const favouriteObj = favourites?.find(
                (fav: FavouriteItem) => fav.bookId === book.id
              );
              const isFavorite = !!favouriteObj;
              const favouriteId = favouriteObj?.id;
              const isDisabled = pendingFavouritesActions.includes(book.id);

              return (
                <BookRow
                  key={book.id}
                  book={book}
                  isInShelf={isInShelf}
                  isFavorite={isFavorite}
                  onClickPreview={handleCLickPreview}
                  handleFavoriteClick={() =>
                    handleFavoriteClick(book, favouriteId)
                  }
                  disabled={isDisabled}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default FavouritePage;
