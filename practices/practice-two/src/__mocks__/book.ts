import { Book, FavouriteItem, ShelfItem } from "@/types";

export const MOCK_BOOKS: Book[] = [
  {
    id: "11",
    title: "Don't Make Me Think",
    authorAndYear: "Steve Krug, 2000",
    authorBio:
      "Steve Krug is a usability consultant who has more than 30 years of experience as a user advocate for companies like Apple, Netscape, AOL, Lexus, and others. Based in part on the success of his first book, Don't Make Me Think, he has become a highly sought-after speaker on usability design.",
    category: "Computer Science",
    rating: 4.5,
    imageUrl:
      "https://i.postimg.cc/qvgQxTNW/4aa430788b3938ca7d778a99fe0ff1587c81c67e.jpg",
  },
  {
    id: "21",
    title: "The Design of Everyday Things",
    authorAndYear: "Don Norman, 1988",
    authorBio:
      "Don Norman is a usability consultant who has more than 30 years of experience as a user advocate for companies like Apple, Netscape, AOL, Lexus, and others. Based in part on the success of his first book, The Design of Everyday Things, he has become a highly sought-after speaker on usability design.",
    category: "Computer Science",
    rating: 4.5,
    imageUrl:
      "https://i.postimg.cc/Mp16pvwY/cc2b60105e5d1b5aeba05608803badb375872868.jpg",
  },
];

export const MOCK_SHELVES: ShelfItem[] = [
  {
    id: "31400004-4d46-48a9-bd6b-b96acb651725",
    bookId: "11",
    borrowedDate: "01 Jul 2025 12:22 PM",
    userId: "64cd240a-faf4-45b1-be5d-ec63ee9be41c",
  },
  {
    id: "9655627c-4470-4fd8-bd3d-e5a07a0be9e5",
    bookId: "21",
    borrowedDate: "02 Jul 2025 05:02 PM",
    userId: "8460d470-9e08-425b-8764-b76f643b63e3",
  },
];

export const MOCK_FAVOURITES: FavouriteItem[] = [
  {
    id: "favourite-1",
    bookId: "11",
    userId: "1bf703cf-9d05-40ea-b069-16c592570f8c", // matches MOCK_USER.id
  },
  {
    id: "favourite-2",
    bookId: "21",
    userId: "1bf703cf-9d05-40ea-b069-16c592570f8c",
  },
];
