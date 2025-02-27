// stores
import { useUserStore } from '@/stores';

// types
import { Book, User } from '@/types';

// hooks
import { useUpdateUserBooks } from '@/hooks';

export const useHandleFavoriteClick = () => {
  const currentUser = useUserStore(state => state.currentUser);
  const setUser = useUserStore(state => state.setUser);

  const mutation = useUpdateUserBooks();

  const handleFavoriteClick = (book: Book) => {
    if (!currentUser) return;

    const prevUser = { ...currentUser };
    const updatedFavourites = currentUser.favourites.includes(book.id)
      ? currentUser.favourites.filter((id) => id !== book.id)
      : [...currentUser.favourites, book.id];

    const updatedUser: User = { ...currentUser, favourites: updatedFavourites };
    setUser(updatedUser);

    mutation.mutate(updatedUser, {
      onError: (error) => {
        console.error("Failed to update favourites:", error);
        setUser(prevUser);
      },
    });
  };

  return handleFavoriteClick;
};
