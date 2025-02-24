import { User } from "@/types";

const getBorrowedDate = (bookId: string, currentUser: User) => {
  return currentUser?.shelf?.find(
    shelfBook => shelfBook.bookId === bookId
  )?.borrowedDate || "Unknown";
};

export { getBorrowedDate };
