export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  shelf: {
    bookId: string;
    borrowedDate: string;
    returnDate: string | null;
  }[];
  favourites: string[];
  recentReadings: string[];
}
