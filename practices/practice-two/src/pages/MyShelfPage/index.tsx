import { useNavigate } from "react-router-dom";

// hooks
import { useFetchBooks, useUpdateUserBooks } from "@/hooks";

// stores
import { useBookStore, useUserStore } from "@/stores";

// components
import { MyShelfBookCard } from "@/components";

// helpers
import { getBorrowedDate } from "./helpers";

// types
import { User } from "@/types";

const MyShelfPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading, isError, error } = useFetchBooks();

  // store
  const books = useBookStore(state => state.books);
  const currentUser = useUserStore(state => state.currentUser);
  const setUser = useUserStore(state => state.setUser);

  const mutation = useUpdateUserBooks();

  if (isLoading && books.length === 0) return <p>Loading books...</p>;
  if (isError) return <p className="text-red-500">Error loading books: {error?.message}</p>;
  if (!books.length) return <p className="text-gray-600">No books available.</p>;

  const filteredBooks = books.filter(book =>
    currentUser?.shelf?.some(shelfBook => shelfBook.bookId === book.id)
  );

  const handleReturnBook = (bookId: string) => {
    if (!currentUser) return;

    const updatedShelf = currentUser.shelf.filter(shelfBook => shelfBook.bookId !== bookId);
    const updatedUser = { ...currentUser, shelf: updatedShelf } as User;
    setUser(updatedUser);
    mutation.mutate(updatedUser, {
      onError: (error) => {
        console.error("Failed to return book:", error);
      },
    });
  };

  return (
    <div className="">
      <h1 className="sm:text-[25px] text-[23px] font-bold text-[#4D4D4D] mb-6 mt-4">
        Your <span className="text-[#EF8361]">Shelf</span>
      </h1>
      <div className="flex space-x-16 pb-2 mb-6">
        <button className="font-medium text-[#4D4D4D] sm:text-[20px] text-[18px]">
          All Books
        </button>
        <button
          className="text-[#868686] hover:text-[#bfbebe] transition sm:text-[20px] text-[18px] font-medium"
          onClick={() => navigate("/favourite")}
        >
          Favourite
        </button>
      </div>
      <div className="flex flex-wrap gap-10 justify-center">
        {filteredBooks.length === 0 ? (
          <p className="text-xl font-semibold text-red-400">No books in your shelf.</p>
        ) : (
          filteredBooks.map((book) => (
            <div key={book.id} className="">
              <MyShelfBookCard
                book={book}
                borrowedDate={getBorrowedDate(book.id, currentUser as User)}
                onReturn={handleReturnBook}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyShelfPage;
