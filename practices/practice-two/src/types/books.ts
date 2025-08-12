export interface Book {
  id: string;
  title: string;
  authorAndYear: string;
  authorBio: string;
  category: string;
  rating: number;
  imageUrl: string;
  status?: boolean;
  isFavorite?: boolean;
}

export interface UserBook {
  id: string;
  bookId: string;
  userId: string;
}

export interface ShelfItem extends UserBook {
  borrowedDate?: string;
}
