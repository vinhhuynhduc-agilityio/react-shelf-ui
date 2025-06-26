// stores
import { useUserStore } from "@/stores";

// types
import { Book, User } from "@/types";

// hooks
import { useUpdateUserBooks } from "@/hooks";

export const useHandleFavoriteClick = () => {
	const currentUser = useUserStore((state) => state.currentUser);

	const { mutate: updateUserBookData, isPending } = useUpdateUserBooks();

	const handleFavoriteClick = (book: Book) => {
		if (!currentUser) return;

		const updatedFavourites = currentUser.favourites.includes(book.id)
			? currentUser.favourites.filter((id) => id !== book.id)
			: [...currentUser.favourites, book.id];

		const userToUpdate: User = {
			...currentUser,
			favourites: updatedFavourites,
		};

		updateUserBookData(userToUpdate);
	};

	return {
		handleFavoriteClick,
		isPending,
	};
};
