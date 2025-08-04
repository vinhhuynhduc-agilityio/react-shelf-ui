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

export interface RecentReading {
  bookId: string;
  userId: string;
  id: string;
}

export interface ShelfItem {
  id: string;
  bookId: string;
  userId: string;
  borrowedDate: string;
}

export interface FavouriteItem {
  id: string;
  bookId: string;
  userId: string;
}
