import { Link } from "react-router-dom";

// constants
import { menuItems } from "@/constants";

const MenuSidebar = () => {
  return (
    <aside className="bg-[#F5F5F5] h-screen w-16 md:w-48 px-2 md:px-6 pt-12 md:pt-24 flex flex-col shadow-lg transition-all duration-300">
      {/* Logo */}
      <div className="flex justify-center mb-16">
        <img
          src="https://i.ibb.co/0Yx3BN3/Book-Shelf.png"
          alt="Book Shelf Logo"
          className="w-[80px] md:w-[120px] h-auto"
        />
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col gap-3 md:gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className="flex w-full items-center justify-center md:justify-start text-gray-700 hover:text-black px-2 py-2 md:py-3 rounded-md hover:bg-gray-200 transition"
          >
            {item.icon}
            <span className="text-base font-medium hidden md:block ml-2">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default MenuSidebar;
