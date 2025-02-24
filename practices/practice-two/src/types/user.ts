export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatarUrl: string,
  shelf: {
    bookId: string;
    borrowedDate: string;
  }[];
  favourites: string[];
  recentReadings: string[];
};

export interface ShelfBooks {
  bookId: string;
  borrowedDate: string;
};
