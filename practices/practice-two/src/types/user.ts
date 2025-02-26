export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  avatarUrl: string,
  shelf: {
    bookId: string;
    borrowedDate: string;
  }[];
  favourites: string[];
  recentReadings: string[];
  registerNumber: string;
  phoneNumber: string;
  bio: string;
};

export interface ShelfBooks {
  bookId: string;
  borrowedDate: string;
};
