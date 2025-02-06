// components
import Header from "@/components/Header";

const BookShelfHome = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-[#FA7C54] to-[#EC2C5A] p-4 sm:p-6 md:p-8">
      <div className="flex flex-col min-h-screen bg-[#F5F5F5] rounded-lg shadow-md">
        <Header />
        <main className="flex-grow p-6 sm:p-8 md:p-10">
        </main>
      </div>
    </div>
  );
};

export default BookShelfHome;
