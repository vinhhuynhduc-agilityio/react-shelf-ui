// stores
import { useToastStore, useUserStore } from "@/stores";

// types
import { Book, User } from "@/types";

// hooks
import { useUpdateUserBooks } from "@/hooks";

// constants
import { ERROR_MESSAGE } from "@/constants";

export const useHandleFavoriteClick = () => {
	const currentUser = useUserStore((state) => state.currentUser);
	const setUser = useUserStore((state) => state.setUser);
	const showToast = useToastStore((state) => state.showToast);

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
			onError: () => {
				showToast(ERROR_MESSAGE.DEFAULT, "error");
				setUser(prevUser);
			},
		});
	};

	return handleFavoriteClick;
};
