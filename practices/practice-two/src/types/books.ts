// types/book.ts
export interface Author {
  name: string;
  bio?: string;
}

export interface Book {
  id: string;
  title: string;
  author: Author;
  category: string;
  publishedYear: number;
  rating: number;
  imageUrl: string;
}
