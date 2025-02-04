import { useUserStore } from "@/stores/userStore";

const BookShelfHome = () => {
  const currentUser = useUserStore((state) => state.currentUser);

  return (
    <div>
      {currentUser ? (
        <h1>Welcome back, {currentUser.username}!</h1>
      ) : (
        <h1>Please login</h1>
      )}
    </div>
  );
};

export default BookShelfHome;
